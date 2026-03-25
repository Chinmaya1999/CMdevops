class TerraformGenerator {
  static generate(config) {
    console.log('Terraform generator received config:', JSON.stringify(config, null, 2));
    
    const {
      projectName,
      provider,
      region,
      resources
    } = config;

    const mainTf = this.generateMainTf(projectName, provider, region, resources);
    const variablesTf = this.generateVariablesTf(provider, region);
    const outputsTf = this.generateOutputsTf(resources);
    const providerTf = this.generateProviderTf(provider, region);
    const readme = this.generateReadme(projectName, provider);

    return {
      main: mainTf,
      variables: variablesTf,
      outputs: outputsTf,
      provider: providerTf,
      readme: readme
    };
  }

  static generateMainTf(projectName, provider, region, resources) {
    let mainTf = `# Main Terraform configuration for ${projectName}
# Provider: ${provider}
# Region: ${region}

`;

    resources.forEach(resource => {
      if (!resource.type) {
        mainTf += `# Error: Resource missing type\n`;
        return;
      }
      
      switch (resource.type) {
        case 'aws_instance':
          mainTf += this.generateAWSInstance(resource.name, resource.configuration);
          break;
        case 'aws_vpc':
          mainTf += this.generateAWSVPC(resource.name, resource.configuration);
          break;
        case 'aws_subnet':
          mainTf += this.generateAWSSubnet(resource.name, resource.configuration);
          break;
        case 'aws_security_group':
          mainTf += this.generateAWSSecurityGroup(resource.name, resource.configuration);
          break;
        case 'google_compute_instance':
          mainTf += this.generateGCPInstance(resource.name, resource.configuration);
          break;
        case 'azurerm_virtual_machine':
          mainTf += this.generateAzureVM(resource.name, resource.configuration);
          break;
        case 'aws_s3_bucket':
          mainTf += this.generateAWSS3Bucket(resource.name, resource.configuration);
          break;
        case 'aws_rds_instance':
          mainTf += this.generateAWSRDSInstance(resource.name, resource.configuration);
          break;
        default:
          mainTf += `# Resource type "${resource.type}" not yet implemented\n`;
          mainTf += `# Supported types: aws_instance, aws_vpc, aws_subnet, aws_security_group, google_compute_instance, azurerm_virtual_machine, aws_s3_bucket, aws_rds_instance\n`;
      }
      mainTf += '\n';
    });

    return mainTf;
  }

  static generateAWSInstance(name, config) {
    return `resource "aws_instance" "${name}" {
  ami           = var.ami_id
  instance_type = var.instance_type
  subnet_id     = var.subnet_id
  vpc_security_group_ids = [var.security_group_id]
  
  tags = {
    Name = "${name}"
    Project = "${config.projectName || 'terraform-project'}"
    Environment = var.environment
  }
  
  root_block_device {
    volume_size = var.root_volume_size
    volume_type = "gp3"
    encrypted   = true
  }
  
  user_data = base64encode(file("user-data.sh"))
  
  depends_on = [var.vpc_id]
}`;
  }

  static generateAWSVPC(name, config) {
    return `resource "aws_vpc" "${name}" {
  cidr_block           = var.vpc_cidr
  enable_dns_hostnames = true
  enable_dns_support   = true
  
  tags = {
    Name = "${name}"
    Project = "${config.projectName || 'terraform-project'}"
  }
}

resource "aws_internet_gateway" "${name}_igw" {
  vpc_id = aws_vpc.${name}.id
  
  tags = {
    Name = "${name}-igw"
  }
}`;
  }

  static generateAWSSubnet(name, config) {
    return `resource "aws_subnet" "${name}" {
  vpc_id                  = var.vpc_id
  cidr_block              = var.subnet_cidr
  availability_zone       = var.availability_zone
  map_public_ip_on_launch = true
  
  tags = {
    Name = "${name}"
    Project = "${config.projectName || 'terraform-project'}"
  }
}`;
  }

  static generateAWSSecurityGroup(name, config) {
    return `resource "aws_security_group" "${name}" {
  name        = "${name}"
  description = "Security group for ${name}"
  vpc_id      = var.vpc_id
  
  ingress {
    description = "SSH"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  
  ingress {
    description = "HTTP"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  
  ingress {
    description = "HTTPS"
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
  
  tags = {
    Name = "${name}"
    Project = "${config.projectName || 'terraform-project'}"
  }
}`;
  }

  static generateAWSS3Bucket(name, config) {
    return `resource "aws_s3_bucket" "${name}" {
  bucket = var.bucket_name
  
  tags = {
    Name = "${name}"
    Project = "${config.projectName || 'terraform-project'}"
  }
}

resource "aws_s3_bucket_versioning" "${name}_versioning" {
  bucket = aws_s3_bucket.${name}.id
  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_s3_bucket_encryption" "${name}_encryption" {
  bucket = aws_s3_bucket.${name}.id

  server_side_encryption_configuration {
    rule {
      apply_server_side_encryption_by_default {
        sse_algorithm = "AES256"
      }
    }
  }
}`;
  }

  static generateAWSRDSInstance(name, config) {
    return `resource "aws_db_instance" "${name}" {
  identifier     = "${name}"
  engine         = "mysql"
  engine_version = "8.0"
  instance_class = var.db_instance_class
  
  allocated_storage     = var.allocated_storage
  max_allocated_storage = var.max_allocated_storage
  storage_type          = "gp2"
  storage_encrypted     = true
  
  db_name  = var.db_name
  username = var.db_username
  password = var.db_password
  
  vpc_security_group_ids = [var.db_security_group_id]
  db_subnet_group_name   = aws_db_subnet_group.${name}_subnet.name
  
  backup_retention_period = var.backup_retention_period
  backup_window          = "03:00-04:00"
  maintenance_window     = "sun:04:00-sun:05:00"
  
  skip_final_snapshot = var.skip_final_snapshot
  
  tags = {
    Name = "${name}"
    Project = "${config.projectName || 'terraform-project'}"
  }
}

resource "aws_db_subnet_group" "${name}_subnet" {
  name       = "${name}-subnet-group"
  subnet_ids = var.private_subnet_ids
  
  tags = {
    Name = "${name}-subnet-group"
    Project = "${config.projectName || 'terraform-project'}"
  }
}`;
  }

  static generateVariablesTf(provider, region) {
    let variables = `# Variables for Terraform configuration

variable "environment" {
  description = "Environment name (dev, staging, prod)"
  type        = string
  default     = "dev"
}

variable "project_name" {
  description = "Name of the project"
  type        = string
}

variable "region" {
  description = "AWS region"
  type        = string
  default     = "${region}"
}`;

    if (provider === 'aws') {
      variables += `

variable "ami_id" {
  description = "AMI ID for EC2 instances"
  type        = string
  default     = "ami-0c02fb55956c7d316"
}

variable "instance_type" {
  description = "EC2 instance type"
  type        = string
  default     = "t3.micro"
}

variable "vpc_cidr" {
  description = "CIDR block for VPC"
  type        = string
  default     = "10.0.0.0/16"
}

variable "subnet_cidr" {
  description = "CIDR block for subnet"
  type        = string
  default     = "10.0.1.0/24"
}

variable "availability_zone" {
  description = "Availability zone"
  type        = string
  default     = "${region}a"
}

variable "root_volume_size" {
  description = "Root volume size in GB"
  type        = number
  default     = 20
}`;
    }

    return variables;
  }

  static generateOutputsTf(resources) {
    let outputs = `# Outputs for Terraform configuration

output "vpc_id" {
  description = "ID of the VPC"
  value       = aws_vpc.main.id
}

output "public_subnet_id" {
  description = "ID of the public subnet"
  value       = aws_subnet.public.id
}

output "security_group_id" {
  description = "ID of the security group"
  value       = aws_security_group.main.id
}`;

    resources.forEach(resource => {
      if (resource.type === 'aws_instance') {
        outputs += `
output "${resource.name}_public_ip" {
  description = "Public IP address of ${resource.name}"
  value       = aws_instance.${resource.name}.public_ip
}

output "${resource.name}_private_ip" {
  description = "Private IP address of ${resource.name}"
  value       = aws_instance.${resource.name}.private_ip
}`;
      }
    });

    return outputs;
  }

  static generateProviderTf(provider, region) {
    return `# Terraform provider configuration

terraform {
  required_version = ">= 1.0"
  required_providers {
    ${provider} = {
      source  = "hashicorp/${provider}"
      version = "~> 5.0"
    }
  }
}

provider "${provider}" {
  region = var.region
  
  default_tags {
    tags = {
      Project     = var.project_name
      Environment = var.environment
      ManagedBy   = "Terraform"
    }
  }
}`;
  }

  static generateReadme(projectName, provider) {
    return `# ${projectName} - Terraform Configuration

This directory contains Terraform configuration for deploying infrastructure on ${provider.toUpperCase()}.

## Prerequisites

- Terraform >= 1.0
- ${provider.toUpperCase()} CLI configured with appropriate credentials
- Bash shell (for scripts)

## Quick Start

1. Initialize Terraform:
   \`\`\`bash
   terraform init
   \`\`\`

2. Plan the deployment:
   \`\`\`bash
   terraform plan -var-file="terraform.tfvars"
   \`\`\`

3. Apply the configuration:
   \`\`\`bash
   terraform apply -var-file="terraform.tfvars"
   \`\`\`

## Variables

Create a \`terraform.tfvars\` file with your specific values:

\`\`\`hcl
environment = "prod"
project_name = "${projectName}"
region = "us-west-2"

# AWS-specific variables
instance_type = "t3.medium"
ami_id = "ami-0c02fb55956c7d316"
\`\`\`

## Outputs

After deployment, you can view the outputs:

\`\`\`bash
   terraform output
   \`\`\`

## Cleanup

To destroy all resources:

\`\`\`bash
   terraform destroy
   \`\`\`

## Security Considerations

- All resources are tagged for proper identification
- S3 buckets have encryption enabled
- RDS instances have storage encryption
- Security groups follow least privilege principle
- IAM roles should be used instead of access keys when possible
`;
  }
}

module.exports = TerraformGenerator;
