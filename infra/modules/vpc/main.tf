data "aws_availability_zones" "available" {
  state = "available"
}

resource "aws_vpc" "this" {
  cidr_block           = var.vpc_cidr
  enable_dns_support   = true
  enable_dns_hostnames = true

  tags = {
    Name        = "beautysuite-${var.environment}-vpc"
    Environment = var.environment
    Project     = "BeautySuite"
  }
}

# ---------------------------------------------------------
# Lambda subnets
# ---------------------------------------------------------

resource "aws_subnet" "lambda_a" {
  vpc_id                  = aws_vpc.this.id
  cidr_block              = "10.0.1.0/24"
  availability_zone       = data.aws_availability_zones.available.names[0]
  map_public_ip_on_launch = false

  tags = {
    Name        = "beautysuite-${var.environment}-lambda-a"
    Environment = var.environment
    Project     = "BeautySuite"
    Tier        = "private"
  }
}

resource "aws_subnet" "lambda_b" {
  vpc_id                  = aws_vpc.this.id
  cidr_block              = "10.0.2.0/24"
  availability_zone       = data.aws_availability_zones.available.names[1]
  map_public_ip_on_launch = false

  tags = {
    Name        = "beautysuite-${var.environment}-lambda-b"
    Environment = var.environment
    Project     = "BeautySuite"
    Tier        = "private"
  }
}

# ---------------------------------------------------------
# RDS subnets
# ---------------------------------------------------------

resource "aws_subnet" "rds_a" {
  vpc_id                  = aws_vpc.this.id
  cidr_block              = "10.0.11.0/24"
  availability_zone       = data.aws_availability_zones.available.names[0]
  map_public_ip_on_launch = false

  tags = {
    Name        = "beautysuite-${var.environment}-rds-a"
    Environment = var.environment
    Project     = "BeautySuite"
    Tier        = "database"
  }
}

resource "aws_subnet" "rds_b" {
  vpc_id                  = aws_vpc.this.id
  cidr_block              = "10.0.12.0/24"
  availability_zone       = data.aws_availability_zones.available.names[1]
  map_public_ip_on_launch = false

  tags = {
    Name        = "beautysuite-${var.environment}-rds-b"
    Environment = var.environment
    Project     = "BeautySuite"
    Tier        = "database"
  }
}

# ---------------------------------------------------------
# Route tables
# ---------------------------------------------------------

resource "aws_route_table" "private" {
  vpc_id = aws_vpc.this.id

  tags = {
    Name        = "beautysuite-${var.environment}-private"
    Environment = var.environment
    Project     = "BeautySuite"
  }
}

resource "aws_route_table_association" "lambda_a" {
  subnet_id      = aws_subnet.lambda_a.id
  route_table_id = aws_route_table.private.id
}

resource "aws_route_table_association" "lambda_b" {
  subnet_id      = aws_subnet.lambda_b.id
  route_table_id = aws_route_table.private.id
}

resource "aws_route_table_association" "rds_a" {
  subnet_id      = aws_subnet.rds_a.id
  route_table_id = aws_route_table.private.id
}

resource "aws_route_table_association" "rds_b" {
  subnet_id      = aws_subnet.rds_b.id
  route_table_id = aws_route_table.private.id
}

# ---------------------------------------------------------
# Lambda Security Group
# ---------------------------------------------------------

resource "aws_security_group" "lambda" {
  name        = "beautysuite-${var.environment}-lambda-sg"
  description = "Security group for BeautySuite Lambda"
  vpc_id      = aws_vpc.this.id

  egress {
    description = "Allow outbound traffic"
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name        = "beautysuite-${var.environment}-lambda-sg"
    Environment = var.environment
    Project     = "BeautySuite"
  }
}

# ---------------------------------------------------------
# RDS Security Group
# ---------------------------------------------------------

resource "aws_security_group" "rds" {
  name        = "beautysuite-${var.environment}-rds-sg"
  description = "Security group for BeautySuite PostgreSQL"
  vpc_id      = aws_vpc.this.id

  egress {
    description = "Allow outbound traffic"
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name        = "beautysuite-${var.environment}-rds-sg"
    Environment = var.environment
    Project     = "BeautySuite"
  }
}

resource "aws_vpc_security_group_ingress_rule" "rds_from_lambda" {
  security_group_id = aws_security_group.rds.id

  referenced_security_group_id = aws_security_group.lambda.id

  from_port = 5432
  to_port   = 5432

  ip_protocol = "tcp"

  description = "PostgreSQL from Lambda"
}

resource "aws_security_group" "vpce" {
  name        = "beautysuite-${var.environment}-vpce-sg"
  description = "Security group for VPC interface endpoints"
  vpc_id      = aws_vpc.this.id

  ingress {
    description     = "HTTPS from Lambda"
    from_port       = 443
    to_port         = 443
    protocol        = "tcp"
    security_groups = [aws_security_group.lambda.id]
  }

  egress {
    description = "Allow outbound traffic"
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name        = "beautysuite-${var.environment}-vpce-sg"
    Environment = var.environment
    Project     = "BeautySuite"
  }
}

data "aws_region" "current" {}

resource "aws_vpc_endpoint" "secretsmanager" {
  vpc_id = aws_vpc.this.id

  service_name = "com.amazonaws.${data.aws_region.current.region}.secretsmanager"

  vpc_endpoint_type = "Interface"

  subnet_ids = [
    aws_subnet.lambda_a.id,
    aws_subnet.lambda_b.id
  ]

  security_group_ids = [
    aws_security_group.vpce.id
  ]

  private_dns_enabled = true

  tags = {
    Name        = "beautysuite-${var.environment}-secretsmanager-endpoint"
    Environment = var.environment
    Project     = "BeautySuite"
  }
}