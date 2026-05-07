# Redbus AWS Deployment

Target flow:

- Frontend: AWS Amplify
- Backend: EC2 + Nginx + PM2 + Node.js
- Database: MongoDB Atlas
- CI/CD: Jenkins
- Infrastructure: Terraform
- Server configuration: Ansible

## Required Jenkins Credentials

Create these credentials in Jenkins:

- `github-amplify-token`: Secret text. GitHub token that Amplify can use to read the repo.
- `aws-access-key-id`: Secret text. AWS access key for Terraform and Amplify deploy.
- `aws-secret-access-key`: Secret text. AWS secret key for Terraform and Amplify deploy.
- `redbus-ec2-ssh-key`: SSH private key. Pair this with the public key passed to Terraform.
- `redbus-ec2-public-key`: Secret text. The matching public key content for Terraform.
- `redbus-database-uri`: Secret text. MongoDB Atlas URI.
- `redbus-database-password`: Secret text. MongoDB Atlas password.
- `redbus-stripe-secret-key`: Secret text. Stripe secret key.

Jenkins also needs AWS credentials through the AWS CLI environment, an IAM role, or Jenkins credentials binding.

Generate the EC2 key pair locally:

```bash
ssh-keygen -t rsa -b 4096 -f ~/.ssh/redbus -C "redbus-ec2"
```

Store `~/.ssh/redbus` as `redbus-ec2-ssh-key` and `~/.ssh/redbus.pub` as `redbus-ec2-public-key`.

## Terraform

Copy the example variables file and fill the non-secret values:

```bash
cd infra/terraform
cp terraform.tfvars.example terraform.tfvars
```

Do not commit `terraform.tfvars`.

Run locally:

```bash
terraform init
terraform plan
terraform apply
```

Or create a Jenkins Pipeline job using `jenkins/Jenkinsfile.infra`.

Use `jenkins/Jenkinsfile.destroy` as a separate job for cleanup after practice.

## Backend Deploy

After Terraform creates EC2, use the `backend_public_ip` output as `BACKEND_HOST` in the backend Jenkins job.

If you have a domain, create a DNS `A` record like:

```text
api.example.com -> backend_public_ip
```

Then run `jenkins/Jenkinsfile.backend` with:

- `BACKEND_HOST`: EC2 public IP
- `BACKEND_DOMAIN`: `api.example.com`
- `CERTBOT_EMAIL`: your email

If no domain is set, the API runs on plain HTTP by EC2 IP. Amplify production should use HTTPS to avoid browser mixed-content blocking.

## Frontend Deploy

Use `jenkins/Jenkinsfile.frontend` with:

- `AMPLIFY_APP_ID`: Terraform output `amplify_app_id`
- `AMPLIFY_BRANCH`: usually `main`
- `BACKEND_URL`: `https://api.example.com`

The React app already reads `REACT_APP_BACKEND_URL`, so Amplify builds point at the EC2 backend.

## MongoDB Atlas

Atlas must allow the EC2 public IP:

1. MongoDB Atlas > Network Access
2. Add the EC2 Elastic IP as `/32`
3. Confirm the database user has read/write access
