output "api_endpoint" {
  description = "BeautySuite API Gateway endpoint"
  value       = aws_apigatewayv2_api.this.api_endpoint
}

output "api_id" {
  description = "ID de BeautySuite HTTP API"
  value       = aws_apigatewayv2_api.this.id
}