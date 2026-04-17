output "lambda_arn" {
  value = aws_lambda_function.authentication.arn
}

output "lambda_invoke_arn" {
  value = aws_lambda_function.authentication.invoke_arn
}