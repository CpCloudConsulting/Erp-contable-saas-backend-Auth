terraform {
  required_version = ">= 1.14.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 6.0"
    }

    archive = {
      source = "hashicorp/archive"
    }
  }
}

provider "aws" {
  region  = var.aws_region
  profile = "aws-cp"
}

data "aws_secretsmanager_secret" "jwt" {
  name = "beautysuite/dev/jwt"
}

module "vpc" {
  source = "../../modules/vpc"

  environment = "dev"
  vpc_cidr    = "10.0.0.0/16"
}

module "rds_beautysuite" {
  source = "../../modules/rds"

  environment = "dev"

  vpc_id = module.vpc.vpc_id

  subnet_ids = module.vpc.rds_subnet_ids

  security_group_id = module.vpc.rds_security_group_id

  db_name     = "beautysuite"
  db_username = "beautysuite_admin"

  db_instance_class = "db.t3.micro"
  allocated_storage = 20
  engine_version    = "17"
}

module "lambda_beautysuite" {
  source = "../../modules/lambda"

  function_name = "beautysuite-api"
  backend_path  = "../../../Authentication"

  subnet_ids = module.vpc.lambda_subnet_ids

  security_group_ids = [
    module.vpc.lambda_security_group_id
  ]

  db_host = module.rds_beautysuite.db_endpoint
  db_port = module.rds_beautysuite.db_port
  db_name = module.rds_beautysuite.db_name
  db_user = module.rds_beautysuite.db_username

  db_secret_arn  = module.rds_beautysuite.master_user_secret_arn
  jwt_secret_arn = data.aws_secretsmanager_secret.jwt.arn
}

module "api_beautysuite" {
  source               = "../../modules/apigateway"
  api_name             = "beautysuite-api"
  lambda_arn           = module.lambda_beautysuite.lambda_arn
  lambda_function_name = module.lambda_beautysuite.lambda_function_name
}

module "db_admin_ssm" {
  source = "../../modules/db-admin-ssm"

  project_name = "beautysuite"
  environment  = "dev"
  aws_region   = var.aws_region

  # VPC
  vpc_id = module.vpc.vpc_id

  # EC2 administrativa en la primera subnet privada
  # utilizada actualmente por Lambda
  subnet_id = module.vpc.lambda_subnet_ids[0]

  # VPC Interface Endpoints en las dos subnets privadas
  endpoint_subnet_ids = module.vpc.lambda_subnet_ids

  # Security Group del RDS
  rds_security_group_id = module.vpc.rds_security_group_id

  # Secret administrado automáticamente por RDS
  rds_secret_arn = module.rds_beautysuite.master_user_secret_arn

  # Instancia económica
  instance_type = "t3.micro"

  root_volume_size = 8

  tags = {
    Purpose = "Temporary DB administration"
  }
}

module "certificate" {
  source = "../../modules/certificate"

  domain_name = "*.beautysuite.com"
  environment = "dev"
}