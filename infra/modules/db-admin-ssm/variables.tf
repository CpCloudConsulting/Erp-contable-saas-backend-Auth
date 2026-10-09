variable "project_name" {
  description = "Nombre del proyecto"
  type        = string
}

variable "environment" {
  description = "Ambiente"
  type        = string
}

variable "vpc_id" {
  description = "ID de la VPC"
  type        = string
}

variable "subnet_id" {
  description = "Subnet privada para la instancia administrativa"
  type        = string
}

variable "endpoint_subnet_ids" {
  description = "Subnets privadas donde se crearán los VPC Interface Endpoints"
  type        = list(string)
}

variable "rds_security_group_id" {
  description = "Security Group del RDS PostgreSQL"
  type        = string
}

variable "rds_secret_arn" {
  description = "ARN del secreto administrado por RDS en Secrets Manager"
  type        = string
}

variable "instance_type" {
  description = "Tipo de instancia EC2"
  type        = string
  default     = "t3.micro"
}

variable "root_volume_size" {
  description = "Tamaño del volumen raíz en GB"
  type        = number
  default     = 8
}

variable "tags" {
  description = "Tags adicionales"
  type        = map(string)
  default     = {}
}