
data "aws_ssm_parameter" "amazon_linux_2023" {
  name = "/aws/service/ami-amazon-linux-latest/al2023-ami-kernel-default-x86_64"
}

locals {
  name = "${var.project_name}-${var.environment}-db-admin"

  common_tags = merge(
    {
      Project     = var.project_name
      Environment = var.environment
      ManagedBy   = "Terraform"
      Purpose     = "Temporary PostgreSQL administrative access"
    },
    var.tags
  )

  vpc_endpoint_services = [
    "ssm",
    "ssmmessages",
    "ec2messages",
  ]
}

# =========================================================
# SECURITY GROUP - DB ADMIN
# =========================================================

resource "aws_security_group" "db_admin" {
  name        = "${local.name}-sg"
  description = "Temporary PostgreSQL administrative access through SSM"
  vpc_id      = var.vpc_id

  # No inbound rules.
  #
  # Session Manager does not require SSH.
  # PostgreSQL access is outbound.

  egress {
    description = "Allow outbound traffic"

    from_port = 0
    to_port   = 0

    protocol = "-1"

    cidr_blocks = [
      "0.0.0.0/0"
    ]
  }

  tags = merge(
    local.common_tags,
    {
      Name = "${local.name}-sg"
    }
  )
}

# =========================================================
# RDS SECURITY GROUP
# Allow temporary DB Admin EC2 -> RDS PostgreSQL
# =========================================================

resource "aws_vpc_security_group_ingress_rule" "rds_from_db_admin" {
  security_group_id = var.rds_security_group_id

  referenced_security_group_id = aws_security_group.db_admin.id

  from_port = 5432
  to_port   = 5432

  ip_protocol = "tcp"

  description = "Temporary PostgreSQL access from SSM DB admin instance"
}

# =========================================================
# SECURITY GROUP - VPC ENDPOINTS
# =========================================================

resource "aws_security_group" "vpc_endpoints" {
  name        = "${local.name}-endpoints-sg"
  description = "Security Group for SSM and Secrets Manager VPC endpoints"
  vpc_id      = var.vpc_id

  ingress {
    description = "HTTPS from DB admin instance"

    from_port = 443
    to_port   = 443

    protocol = "tcp"

    security_groups = [
      aws_security_group.db_admin.id
    ]
  }

  egress {
    description = "Allow outbound traffic"

    from_port = 0
    to_port   = 0

    protocol = "-1"

    cidr_blocks = [
      "0.0.0.0/0"
    ]
  }

  tags = merge(
    local.common_tags,
    {
      Name = "${local.name}-endpoints-sg"
    }
  )
}

# =========================================================
# VPC INTERFACE ENDPOINTS
# =========================================================

resource "aws_vpc_endpoint" "interface" {
  for_each = toset(local.vpc_endpoint_services)

  vpc_id = var.vpc_id

  service_name = "com.amazonaws.${var.aws_region}.${each.key}"

  vpc_endpoint_type = "Interface"

  subnet_ids = var.endpoint_subnet_ids

  security_group_ids = [
    aws_security_group.vpc_endpoints.id
  ]

  private_dns_enabled = true

  tags = merge(
    local.common_tags,
    {
      Name    = "${local.name}-${each.key}-endpoint"
      Service = each.key
    }
  )
}

# =========================================================
# IAM ROLE
# =========================================================

resource "aws_iam_role" "db_admin" {
  name = "${local.name}-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"

    Statement = [
      {
        Effect = "Allow"

        Principal = {
          Service = "ec2.amazonaws.com"
        }

        Action = "sts:AssumeRole"
      }
    ]
  })

  tags = local.common_tags
}

# =========================================================
# SSM
# =========================================================

resource "aws_iam_role_policy_attachment" "ssm" {
  role = aws_iam_role.db_admin.name

  policy_arn = "arn:aws:iam::aws:policy/AmazonSSMManagedInstanceCore"
}

# =========================================================
# SECRETS MANAGER
# Only the RDS master secret
# =========================================================

resource "aws_iam_role_policy" "rds_secret" {
  name = "${local.name}-rds-secret"

  role = aws_iam_role.db_admin.id

  policy = jsonencode({
    Version = "2012-10-17"

    Statement = [
      {
        Sid    = "ReadRdsMasterSecret"
        Effect = "Allow"

        Action = [
          "secretsmanager:GetSecretValue"
        ]

        Resource = var.rds_secret_arn
      }
    ]
  })
}

# =========================================================
# INSTANCE PROFILE
# =========================================================

resource "aws_iam_instance_profile" "db_admin" {
  name = "${local.name}-profile"

  role = aws_iam_role.db_admin.name

  tags = local.common_tags
}

# =========================================================
# EC2
# =========================================================

resource "aws_instance" "db_admin" {
  ami = "ami-0d27e0fb3bac4d724"

  instance_type = var.instance_type

  subnet_id = var.subnet_id

  vpc_security_group_ids = [
    aws_security_group.db_admin.id
  ]

  iam_instance_profile = aws_iam_instance_profile.db_admin.name

  associate_public_ip_address = false

  user_data = file("${path.module}/user_data.sh")

  user_data_replace_on_change = true

  metadata_options {
    http_endpoint               = "enabled"
    http_tokens                 = "required"
    http_put_response_hop_limit = 2
    instance_metadata_tags      = "enabled"
  }

  root_block_device {
    volume_type = "gp3"

    volume_size = var.root_volume_size

    encrypted = true

    delete_on_termination = true
  }

  tags = merge(
    local.common_tags,
    {
      Name = local.name
    }
  )
}