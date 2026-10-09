output "api_endpoint" {
  description = "BeautySuite API Gateway endpoint"
  value       = aws_apigatewayv2_api.this.api_endpoint
}