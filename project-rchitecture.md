# AWS Cloud Architecture for Multi-Server System

## System Overview

This document describes the AWS cloud architecture for a system composed of three main parts:

1. React client (React + Redux + TypeScript) with RTL and Hebrew language support
2. Server 1: .NET Core with Entity Framework and Microsoft SQL Server
3. Server 2: Node.js with Express and Elasticsearch

## Client Tier

### React + Redux + TypeScript SPA
- **Amazon S3**
  - Hosts static website files
  - Versioning enabled for easy rollbacks
  - Configured for website hosting with proper error documents
  - Object lifecycle management for cost optimization

- **Amazon CloudFront**
  - CDN for global content distribution
  - Edge locations to reduce latency
  - SSL/TLS certificate for HTTPS
  - Cache behaviors optimized for React SPA
  - Special configuration for RTL content and Hebrew character encoding
  - CORS configuration to allow API calls to both servers

## Server Tier 1 (.NET Core)

### Application Hosting
- **AWS Elastic Beanstalk**
  - Windows Server platform with .NET Core runtime
  - Auto-scaling group spanning multiple Availability Zones
  - Load-balanced environment with health checks
  - Application deployment with zero-downtime updates
  - Environment variables for configuration management

### Database
- **Amazon RDS for SQL Server**
  - Multi-AZ deployment for high availability
  - Automated backups with 7-day retention period
  - Point-in-time recovery capability
  - Performance Insights for monitoring query performance
  - Appropriate instance size based on workload requirements
  - Storage auto-scaling enabled

### Data Access
- **Entity Framework Core**
  - Code-first approach for database migrations
  - Connection strings stored in AWS Systems Manager Parameter Store
  - Query optimization for performance

## Server Tier 2 (Node.js + Elasticsearch)

### Application Hosting
- **Amazon ECS with Fargate**
  - Containerized Node.js application
  - Task definitions with appropriate memory and CPU allocations
  - Service auto-scaling based on CPU utilization and request count
  - Rolling deployments for zero downtime
  - Container insights enabled for monitoring

### Search Engine
- **Amazon Elasticsearch Service**
  - Dedicated master nodes for cluster stability
  - Data nodes distributed across multiple AZs
  - Automated snapshots to S3 for backup
  - Fine-grained access control
  - Domain endpoint with HTTPS
  - Appropriate instance types based on indexing and query workload
  - UltraWarm storage for less frequently accessed indices

## Shared Infrastructure

### Networking
- **Amazon VPC**
  - CIDR block: 10.0.0.0/16
  - Public subnets (10.0.1.0/24, 10.0.2.0/24) in different AZs for load balancers
  - Private subnets (10.0.3.0/24, 10.0.4.0/24) for application servers
  - Private subnets (10.0.5.0/24, 10.0.6.0/24) for databases
  - NAT Gateways for private subnet internet access
  - VPC Flow Logs for network monitoring
  - VPC Endpoints for AWS services access

### Load Balancing
- **AWS Application Load Balancer**
  - Separate ALBs for each server tier
  - SSL/TLS termination
  - Path-based routing
  - HTTP to HTTPS redirection
  - Web ACLs for security
  - Access logs enabled and stored in S3

### Security
- **AWS WAF**
  - Protection against common web exploits
  - Rate-based rules to prevent DDoS attacks
  - IP-based restrictions for administrative access
  - Custom rules for application-specific security requirements

- **Amazon Cognito**
  - User pools for authentication
  - Identity pools for authorized access to AWS resources
  - Multi-factor authentication for sensitive operations
  - Integration with social identity providers if needed
  - JWT token validation

- **AWS Certificate Manager**
  - SSL/TLS certificates for secure communications
  - Auto-renewal of certificates

- **AWS Secrets Manager**
  - Storage for database credentials and API keys
  - Automatic rotation of secrets

### Monitoring and Operations
- **Amazon CloudWatch**
  - Custom dashboards for each system component
  - Alarms for critical metrics
  - Log aggregation and analysis
  - Anomaly detection for proactive monitoring

- **AWS X-Ray**
  - Distributed tracing across both server tiers
  - Service map visualization
  - Performance bottleneck identification

- **AWS Systems Manager**
  - Parameter Store for configuration management
  - Session Manager for secure instance access
  - State Manager for consistent configurations
  - Patch Manager for OS updates

### CI/CD Pipeline
- **AWS CodePipeline**
  - Separate pipelines for client and each server
  - Source stage connected to code repository
  - Build stage using AWS CodeBuild
  - Test stage for automated testing
  - Deploy stage for automated deployment
  - Approval gates for production deployments

- **AWS CodeBuild**
  - Build environments for React, .NET Core, and Node.js
  - Cache optimization for faster builds
  - Integration with testing frameworks

- **AWS CodeDeploy**
  - Deployment strategies (Blue/Green for client, Rolling for servers)
  - Deployment configurations with health checks
  - Rollback capabilities

### DNS Management
- **Amazon Route 53**
  - Domain registration and DNS management
  - Health checks for failover routing
  - Geolocation routing for optimized user experience
  - Alias records for AWS resources

## Cost Optimization

- **AWS Cost Explorer**
  - Resource tagging strategy
  - Budget alerts
  - Right-sizing recommendations
  - Reserved Instances for predictable workloads

- **Auto Scaling**
  - Scale in/out based on actual demand
  - Scheduled scaling for predictable workloads

## Disaster Recovery

- **Backup Strategy**
  - S3 for client files
  - RDS automated backups
  - Elasticsearch snapshots
  - AWS Backup for centralized management

- **Recovery Strategy**
  - RPO (Recovery Point Objective): 1 hour
  - RTO (Recovery Time Objective): 4 hours
  - Multi-region capabilities for critical components