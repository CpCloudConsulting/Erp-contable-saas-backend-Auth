data "archive_file" "lambda" {
  type        = "zip"

  source_file = "${var.backend_path}/dist/handler.js"
  output_path = "${path.module}/build/beautysuite-api.zip"
}

resource "aws_iam_role" "lambda" {
  name = "${var.function_name}-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"

    Statement = [
      {
        Effect = "Allow"

        Principal = {
          Service = "lambda.amazonaws.com"
        }

        Action = "sts:AssumeRole"
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "lambda_logs" {
  role       = aws_iam_role.lambda.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

resource "aws_iam_role_policy_attachment" "lambda_vpc" {
  role = aws_iam_role.lambda.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaVPCAccessExecutionRole"
}

resource "aws_iam_role_policy" "secretsmanager" {
  name = "${var.function_name}-secretsmanager"

  role = aws_iam_role.lambda.id

  policy = jsonencode({
    Version = "2012-10-17"

    Statement = [
      {
        Effect = "Allow"

        Action = [
          "secretsmanager:GetSecretValue"
        ]

        Resource = [
          var.db_secret_arn,
          var.jwt_secret_arn
        ]
      }
    ]
  })
}

resource "aws_lambda_function" "this" {
  function_name = var.function_name

  role = aws_iam_role.lambda.arn

  runtime = "nodejs22.x"

  handler = "handler.handler"

  filename = data.archive_file.lambda.output_path

  source_code_hash = data.archive_file.lambda.output_base64sha256

  timeout     = 30
  memory_size = 512

  vpc_config {
    subnet_ids         = var.subnet_ids
    security_group_ids = var.security_group_ids
  }

  environment {
    variables = {
      NODE_ENV = "production"

      DB_HOST       = var.db_host
      DB_PORT       = tostring(var.db_port)
      DB_NAME       = var.db_name
      DB_USER       = var.db_user
      DB_SECRET_ARN = var.db_secret_arn
      JWT_SECRET_ARN = var.jwt_secret_arn
      DB_SSL = "true"
      JWT_EXPIRES_IN        = "15m"
      JWT_EXPIRES_IN_REFRESH = "7d"
    }
  }

  depends_on = [
  aws_iam_role_policy_attachment.lambda_logs,
  aws_iam_role_policy_attachment.lambda_vpc,
  aws_iam_role_policy.secretsmanager
]
}