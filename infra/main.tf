
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


module "lambda" {
  source = "./modules/lambda"

  cognito_client_id = var.cognito_client_id
  region = var.region
}

module "rds" {
  source = "./modules/rds"
}

module "cognito" {
  source = "./modules/cognito"
}