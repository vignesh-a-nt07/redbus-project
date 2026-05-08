terraform {
  backend "s3" {
    bucket         = "vicky-redbus-terraform-state-bucket"
    key            = "redbus/prod/terraform.tfstate"
    region         = "us-east-1"
    dynamodb_table = "vicky-redbus-terraform-lock-table"
    encrypt        = true
  }
}

