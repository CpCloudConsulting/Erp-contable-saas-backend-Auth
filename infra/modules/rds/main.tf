resource "aws_db_subnet_group" "this" {
  name = "beautysuite-${var.environment}-db-subnet"

  subnet_ids = var.subnet_ids

  tags = {
    Name        = "beautysuite-${var.environment}-db-subnet"
    Environment = var.environment
    Project     = "BeautySuite"
  }
}

resource "aws_db_instance" "this" {
  identifier = "beautysuite-${var.environment}-postgres"

  engine         = "postgres"
  engine_version = var.engine_version

  instance_class        = var.db_instance_class
  allocated_storage     = var.allocated_storage
  storage_type          = "gp3"
  storage_encrypted     = true
  max_allocated_storage = 100

  db_name  = var.db_name
  username = var.db_username

  manage_master_user_password = true

  db_subnet_group_name = aws_db_subnet_group.this.name
  vpc_security_group_ids = [
    var.security_group_id
  ]

  publicly_accessible = false

  multi_az = false

  backup_retention_period = 1

  deletion_protection = false
  skip_final_snapshot = true

  auto_minor_version_upgrade = true

  copy_tags_to_snapshot = true

  tags = {
    Name        = "beautysuite-${var.environment}-postgres"
    Environment = var.environment
    Project     = "BeautySuite"
  }
}