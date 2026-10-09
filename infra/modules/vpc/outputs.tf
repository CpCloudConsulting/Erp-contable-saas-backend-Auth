output "vpc_id" {
  description = "BeautySuite VPC ID"
  value       = aws_vpc.this.id
}

output "vpc_cidr" {
  description = "BeautySuite VPC CIDR"
  value       = aws_vpc.this.cidr_block
}

output "lambda_subnet_ids" {
  description = "Private subnet IDs for Lambda"
  value = [
    aws_subnet.lambda_a.id,
    aws_subnet.lambda_b.id
  ]
}

output "rds_subnet_ids" {
  description = "Private subnet IDs for RDS"
  value = [
    aws_subnet.rds_a.id,
    aws_subnet.rds_b.id
  ]
}

output "lambda_security_group_id" {
  description = "Lambda security group ID"
  value       = aws_security_group.lambda.id
}

output "rds_security_group_id" {
  description = "RDS security group ID"
  value       = aws_security_group.rds.id
}