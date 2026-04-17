
terraform {
  required_version = ">= 1.5"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }

    archive = {
      source = "hashicorp/archive"
    }
    
  }
}

provider "aws" {
  region     = var.region
}


module "lambda_auth" {
  source = "./modules/lambda"

  COGNITO_CLIENT_ID = var.COGNITO_CLIENT_ID
  COGNITO_USER_POOL_ID = var.COGNITO_USER_POOL_ID

  region = var.region
}

module "cognito" {
  source = "./modules/cognito"
}

module "api_auth" {
  source = "./modules/apigateway"

  lambda_arn = module.lambda_auth.lambda_arn
}