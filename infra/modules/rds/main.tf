
resource "aws_db_instance" "postgres" {
  identifier         = "beauty-saas-db"
  engine             = "postgres"
  instance_class     = "db.t4g.micro"
  allocated_storage  = 20
  username           = "postgres"
  password           = "postgres123"
  skip_final_snapshot = true
}
