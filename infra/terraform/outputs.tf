output "backend_public_ip" {
  description = "Elastic IP address attached to the backend EC2 instance."
  value       = aws_eip.backend.public_ip
}

output "backend_http_url" {
  description = "HTTP URL for the backend before adding a domain and TLS."
  value       = "http://${aws_eip.backend.public_ip}"
}

output "backend_health_url" {
  description = "Health-check URL for backend smoke tests."
  value       = "http://${aws_eip.backend.public_ip}/health"
}

output "backend_api_gateway_url" {
  description = "HTTPS API Gateway URL that proxies to the backend EC2 server."
  value       = aws_apigatewayv2_stage.backend.invoke_url
}

output "amplify_app_id" {
  description = "AWS Amplify app id."
  value       = aws_amplify_app.frontend.id
}

output "amplify_default_domain" {
  description = "Default Amplify domain."
  value       = aws_amplify_app.frontend.default_domain
}
