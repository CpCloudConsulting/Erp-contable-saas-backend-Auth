output "lambda_arn" {
  description = "ARN of the BeautySuite Lambda"
  value       = aws_lambda_function.this.arn
}

output "lambda_function_name" {
  description = "Name of the BeautySuite Lambda"
  value       = aws_lambda_function.this.function_name
}