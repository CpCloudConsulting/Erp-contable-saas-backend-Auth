terraform {
  backend "s3" {
    bucket = "erp-terraform-contable-state"
    key    = "auth/terraform.tfstate"
    region = "us-east-1"
  }
}