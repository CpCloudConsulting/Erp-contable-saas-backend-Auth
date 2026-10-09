output "instance_id" {
  description = "EC2 instance ID"
  value       = aws_instance.db_admin.id
}

output "private_ip" {
  description = "Private IP address"
  value       = aws_instance.db_admin.private_ip
}

output "security_group_id" {
  description = "Security Group ID"
  value       = aws_security_group.db_admin.id
}

output "iam_role_name" {
  description = "IAM role name"
  value       = aws_iam_role.db_admin.name
}

output "instance_profile_name" {
  description = "IAM instance profile"
  value       = aws_iam_instance_profile.db_admin.name
}

output "rds_secret_arn" {
  description = "RDS master secret ARN"
  value       = var.rds_secret_arn
}

output "ssm_command" {
  description = "AWS CLI command to connect through SSM"
  value       = "aws ssm start-session --target ${aws_instance.db_admin.id}"
}

variable "aws_region" {
  description = "Región AWS donde se crean los recursos"
  type        = string
}