output "certificate_arn" {
  description = "ARN del certificado ACM"
  value       = aws_acm_certificate.this.arn
}

output "domain_validation_options" {
  description = "Registros DNS necesarios para validar el certificado"
  value       = aws_acm_certificate.this.domain_validation_options
}