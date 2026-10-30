
data "aws_route53_zone" "public" {
  name         = "beautysuite.com.co."
  private_zone = false
}

resource "aws_acm_certificate" "api" {
  domain_name       = "api.beautysuite.com.co"
  validation_method = "DNS"

  lifecycle {
    create_before_destroy = true
  }

  tags = {
    Name        = "beautysuite-dev-api"
    Environment = "dev"
    Project     = "BeautySuite"
  }
}

resource "aws_route53_record" "api_certificate_validation" {
  for_each = {
    for option in aws_acm_certificate.api.domain_validation_options :
    option.domain_name => {
      name   = option.resource_record_name
      record = option.resource_record_value
      type   = option.resource_record_type
    }
  }

  zone_id = data.aws_route53_zone.public.zone_id
  name    = each.value.name
  type    = each.value.type
  ttl     = 60
  records = [each.value.record]

  allow_overwrite = true
}

resource "aws_acm_certificate_validation" "api" {
  certificate_arn = aws_acm_certificate.api.arn

  validation_record_fqdns = [
    for record in aws_route53_record.api_certificate_validation :
    record.fqdn
  ]

  timeouts {
    create = "30m"
  }
}

resource "aws_apigatewayv2_domain_name" "api" {
  domain_name = "api.beautysuite.com.co"

  domain_name_configuration {
    certificate_arn = aws_acm_certificate_validation.api.certificate_arn
    endpoint_type   = "REGIONAL"
    security_policy = "TLS_1_2"
  }

  tags = {
    Name        = "beautysuite-dev-api-domain"
    Environment = "dev"
    Project     = "BeautySuite"
  }
}

resource "aws_apigatewayv2_api_mapping" "api" {
  api_id      = module.api_beautysuite.api_id
  domain_name = aws_apigatewayv2_domain_name.api.domain_name
  stage       = "$default"
}

resource "aws_route53_record" "api_alias" {
  zone_id = data.aws_route53_zone.public.zone_id
  name    = "api.beautysuite.com.co"
  type    = "A"

  alias {
    name                   = aws_apigatewayv2_domain_name.api.domain_name_configuration[0].target_domain_name
    zone_id                = aws_apigatewayv2_domain_name.api.domain_name_configuration[0].hosted_zone_id
    evaluate_target_health = false
  }
}
