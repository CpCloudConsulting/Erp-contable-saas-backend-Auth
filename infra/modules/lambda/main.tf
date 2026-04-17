
data "archive_file" "lambda_zip" {
  type        = "zip"
  source_dir  = "${path.root}/../Authentication/dist"
  output_path = "${path.module}/authentication.zip"
}

resource "aws_lambda_function" "authentication" {
  function_name = "erp-contable-saas-authentication"
  handler       = "handler.handler"
  runtime       = "nodejs20.x"
  
  filename         = data.archive_file.lambda_zip.output_path
  source_code_hash = data.archive_file.lambda_zip.output_base64sha256
  
  role          = aws_iam_role.lambda_exec.arn

  environment {
  variables = {
    COGNITO_CLIENT_ID = var.COGNITO_CLIENT_ID
    COGNITO_USER_POOL_ID = var.COGNITO_USER_POOL_ID
  }
}
}

resource "aws_iam_role" "lambda_exec" {
  name = "erp-contable-saas_lambda_exec"

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

resource "aws_iam_role_policy_attachment" "lambda_basic" {
  role       = aws_iam_role.lambda_exec.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

resource "aws_iam_role_policy" "cognito_policy" {
  name = "cognito-access"
  role = aws_iam_role.lambda_exec.id

  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Effect = "Allow",
        Action = [
                  "cognito-idp:AdminCreateUser",
                  "cognito-idp:AdminSetUserPassword",
                  "cognito-idp:AdminGetUser",
                  "cognito-idp:InitiateAuth",
                  "cognito-idp:AdminInitiateAuth"
                ],
        Resource = "arn:aws:cognito-idp:${var.region}:${data.aws_caller_identity.current.account_id}:userpool/${var.COGNITO_USER_POOL_ID}"
      }
    ]
  })
}

data "aws_caller_identity" "current" {}