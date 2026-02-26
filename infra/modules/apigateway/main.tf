
resource "aws_apigatewayv2_api" "http_api" {
  name          = "erp-contable-api-autentication"
  protocol_type = "HTTP"
}

