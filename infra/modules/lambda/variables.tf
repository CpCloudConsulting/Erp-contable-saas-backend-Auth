variable "function_name" {
  description = "Lambda function name"
  type        = string
}

variable "backend_path" {
  description = "Path to the backend application"
  type        = string
}

variable "subnet_ids" {
  description = "Private subnet IDs for Lambda"
  type        = list(string)
}

variable "security_group_ids" {
  description = "Security groups for Lambda"
  type        = list(string)
}

variable "db_host" {
  description = "PostgreSQL RDS endpoint"
  type        = string
}

variable "db_port" {
  description = "PostgreSQL port"
  type        = number
}

variable "db_name" {
  description = "PostgreSQL database name"
  type        = string
}

variable "db_user" {
  description = "PostgreSQL username"
  type        = string
}

variable "db_secret_arn" {
  description = "ARN of the RDS managed secret"
  type        = string
}

variable "jwt_secret_arn" {
  description = "ARN of the JWT secret in AWS Secrets Manager"
  type        = string
}