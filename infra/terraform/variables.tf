variable "aws_region" {
  description = "AWS region for all resources."
  type        = string
  default     = "us-east-1"
}

variable "project_name" {
  description = "Name prefix used for AWS resources."
  type        = string
  default     = "redbus"
}

variable "environment" {
  description = "Deployment environment name."
  type        = string
  default     = "prod"
}

variable "vpc_cidr" {
  description = "CIDR block for the VPC."
  type        = string
  default     = "10.40.0.0/16"
}

variable "public_subnet_cidr" {
  description = "CIDR block for the public subnet hosting the backend EC2 instance."
  type        = string
  default     = "10.40.1.0/24"
}

variable "ssh_public_key" {
  description = "SSH public key content Terraform imports into EC2."
  type        = string
  sensitive   = true
}

variable "ssh_allowed_cidr" {
  description = "CIDR allowed to SSH into the backend EC2 instance. Use your public IP /32."
  type        = string
}

variable "instance_type" {
  description = "EC2 instance type for the backend server."
  type        = string
  default     = "t3.micro"
}

variable "root_volume_size" {
  description = "Root EBS volume size in GB."
  type        = number
  default     = 20
}

variable "github_repository" {
  description = "GitHub repository in owner/name form for AWS Amplify, for example myuser/redbus-project."
  type        = string
}

variable "github_oauth_token" {
  description = "GitHub token used by AWS Amplify to connect to the repository."
  type        = string
  sensitive   = true
}

variable "amplify_branch" {
  description = "Git branch Amplify deploys."
  type        = string
  default     = "main"
}

variable "backend_url" {
  description = "Optional custom HTTPS backend URL injected into the React build. Leave empty to use API Gateway."
  type        = string
  default     = ""
}
