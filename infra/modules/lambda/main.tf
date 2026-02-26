
data "archive_file" "lambda_zip" {
  type        = "zip"
  source_dir  = "${path.root}/../Authentication/dist"
  output_path = "${path.module}/authentication.zip"
}

resource "aws_lambda_function" "authentication" {
  function_name = "beauty-saas-authentication"
  handler       = "main.handler"
  runtime       = "nodejs20.x"
  
  filename         = data.archive_file.lambda_zip.output_path
  source_code_hash = data.archive_file.lambda_zip.output_base64sha256
  
  role          = aws_iam_role.lambda_exec.arn

  environment {
  variables = {
    COGNITO_CLIENT_ID = var.cognito_client_id
  }
}
}

resource "aws_iam_role" "lambda_exec" {
  name = "beauty_lambda_exec"

  assume_role_policy = jsonencode({
    Version = "2012-10-17",
    Statement = [{
      Action = "sts:AssumeRole",
      Effect = "Allow",
      Principal = {
        Service = "lambda.amazonaws.com"
      }
    }]
  })
}

resource "aws_apigatewayv2_api" "http_api" {
  name          = "beauty-api-autentication"
  protocol_type = "HTTP"
}

resource "aws_iam_role_policy_attachment" "lambda_basic" {
  role       = aws_iam_role.lambda_exec.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

resource "aws_apigatewayv2_integration" "lambda_integration" {
  api_id                 = aws_apigatewayv2_api.http_api.id
  integration_type       = "AWS_PROXY"
  integration_uri        = aws_lambda_function.authentication.invoke_arn
  payload_format_version = "2.0"
}

resource "aws_apigatewayv2_route" "auth_route" {
  api_id    = aws_apigatewayv2_api.http_api.id
  route_key = "POST /auth"
  target    = "integrations/${aws_apigatewayv2_integration.lambda_integration.id}"
}

resource "aws_lambda_permission" "api_permission" {
  statement_id  = "AllowAPIGatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.authentication.function_name
  principal     = "apigateway.amazonaws.com"
}

resource "aws_apigatewayv2_stage" "default" {
  api_id      = aws_apigatewayv2_api.http_api.id
  name        = "$default"
  auto_deploy = true
}

