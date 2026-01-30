#!/usr/bin/env python3
"""
White Label Configuration Generator
Generates configuration files for different brand deployments
"""

import json
import os
from datetime import datetime

# Brand configurations for different deployments
BRAND_CONFIGURATIONS = {
    'default': {
        'app_name': 'CareerPath Pro',
        'app_full_name': 'CareerPath Professional Assessment',
        'company_name': 'CareerTech Solutions',
        'support_email': 'support@careertech.example.com',
        'website': 'https://careertech.example.com',
        'description': 'Advanced Career Assessment & Guidance Platform',
        'tagline': 'AI-Powered Career Intelligence Platform',
        'colors': {
            'primary': '#3b82f6',
            'secondary': '#10b981',
            'accent': '#f59e0b'
        }
    },
    'enterprise': {
        'app_name': 'Enterprise CareerPath',
        'app_full_name': 'Enterprise Career Assessment Platform',
        'company_name': 'Enterprise Solutions Inc',
        'support_email': 'enterprise@careertech.example.com',
        'website': 'https://enterprise.careertech.example.com',
        'description': 'Enterprise-Grade Career Assessment Platform',
        'tagline': 'Corporate Career Development Solutions',
        'colors': {
            'primary': '#1e40af',
            'secondary': '#047857',
            'accent': '#d97706'
        }
    },
    'education': {
        'app_name': 'EduCareer Pro',
        'app_full_name': 'Educational Career Assessment Platform',
        'company_name': 'Education Technology Solutions',
        'support_email': 'edu@careertech.example.com',
        'website': 'https://edu.careertech.example.com',
        'description': 'Educational Career Assessment Platform',
        'tagline': 'Student Career Development Platform',
        'colors': {
            'primary': '#7c3aed',
            'secondary': '#059669',
            'accent': '#0891b2'
        }
    },
    'government': {
        'app_name': 'GovCareer Pro',
        'app_full_name': 'Government Career Assessment Platform',
        'company_name': 'Public Sector Solutions',
        'support_email': 'gov@careertech.example.com',
        'website': 'https://gov.careertech.example.com',
        'description': 'Government Career Assessment Platform',
        'tagline': 'Public Sector Career Development',
        'colors': {
            'primary': '#1e3a8a',
            'secondary': '#14532d',
            'accent': '#6b7280'
        }
    },
    'healthcare': {
        'app_name': 'HealthCareer Pro',
        'app_full_name': 'Healthcare Career Assessment Platform',
        'company_name': 'HealthTech Solutions',
        'support_email': 'health@careertech.example.com',
        'website': 'https://health.careertech.example.com',
        'description': 'Healthcare Career Assessment Platform',
        'tagline': 'Healthcare Professional Career Development',
        'colors': {
            'primary': '#dc2626',
            'secondary': '#059669',
            'accent': '#7c2d12'
        }
    },
    'tech': {
        'app_name': 'TechCareer Pro',
        'app_full_name': 'Technology Career Assessment Platform',
        'company_name': 'TechCareer Solutions',
        'support_email': 'tech@careertech.example.com',
        'website': 'https://tech.careertech.example.com',
        'description': 'Technology Career Assessment Platform',
        'tagline': 'Tech Industry Career Development',
        'colors': {
            'primary': '#6366f1',
            'secondary': '#10b981',
            'accent': '#f59e0b'
        }
    }
}

def generate_brand_config(brand_name, output_dir='configs'):
    """Generate brand configuration files"""
    
    if brand_name not in BRAND_CONFIGURATIONS:
        print(f"❌ Brand '{brand_name}' not found. Available brands:")
        for brand in BRAND_CONFIGURATIONS.keys():
            print(f"  - {brand}")
        return
    
    config = BRAND_CONFIGURATIONS[brand_name]
    
    # Create output directory
    os.makedirs(output_dir, exist_ok=True)
    
    # Generate TypeScript config
    ts_config = f"""/**
 * Brand Configuration for {config['app_name']}
 * Generated on {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
 */

export const BRAND_CONFIG = {{
  appName: '{config['app_name']}',
  appFullName: '{config['app_full_name']}',
  companyName: '{config['company_name']}',
  supportEmail: '{config['support_email']}',
  website: '{config['website']}',
  description: '{config['description']}',
  tagline: '{config['tagline']}',
  
  colors: {{
    primary: '{config['colors']['primary']}',
    secondary: '{config['colors']['secondary']}',
    accent: '{config['colors']['accent']}'
  }},
  
  // URLs
  baseUrl: process.env.NEXTAUTH_URL || 'http://localhost:3000',
  apiBaseUrl: process.env.NEXTAUTH_URL || 'http://localhost:3000',
  
  // Social Media
  socialLinks: {{
    twitter: 'https://twitter.com/{config['company_name'].lower().replace(' ', '')}',
    linkedin: 'https://linkedin.com/company/{config['company_name'].lower().replace(' ', '')}',
    github: 'https://github.com/{config['company_name'].lower().replace(' ', '')}',
    facebook: 'https://facebook.com/{config['company_name'].lower().replace(' ', '')}'
  }},
  
  // Features
  features: {{
    resumeAnalysis: true,
    jobDescriptionExtraction: true,
    careerGuidance: true,
    atsAnalysis: true,
    skillAssessment: true,
    roadmapGeneration: true,
    aiIntegration: true,
    bulkProcessing: true
  }},
  
  // Legal
  legal: {{
    privacyPolicyUrl: '/privacy',
    termsOfServiceUrl: '/terms',
    cookiePolicyUrl: '/cookies'
  }},
  
  // Development
  development: {{
    debugMode: process.env.NODE_ENV === 'development',
    logLevel: process.env.LOG_LEVEL || 'info'
  }}
}}

export default BRAND_CONFIG
"""
    
    # Generate environment variables
    env_vars = f"""# Environment Variables for {config['app_name']}
# Generated on {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}

# Application
NEXT_PUBLIC_APP_NAME="{config['app_name']}"
NEXT_PUBLIC_APP_FULL_NAME="{config['app_full_name']}"
NEXT_PUBLIC_COMPANY_NAME="{config['company_name']}"
NEXT_PUBLIC_SUPPORT_EMAIL="{config['support_email']}"
NEXT_PUBLIC_WEBSITE="{config['website']}"
NEXT_PUBLIC_DESCRIPTION="{config['description']}"
NEXT_PUBLIC_TAGLINE="{config['tagline']}"

# Brand Colors
NEXT_PUBLIC_PRIMARY_COLOR="{config['colors']['primary']}"
NEXT_PUBLIC_SECONDARY_COLOR="{config['colors']['secondary']}"
NEXT_PUBLIC_ACCENT_COLOR="{config['colors']['accent']}"

# URLs
NEXTAUTH_URL="{config['website']}"
NEXTAUTH_SECRET="{config['app_name'].lower().replace(' ', '')}-secret-key"

# Database
MONGODB_URI="mongodb://localhost:27017/{config['app_name'].lower().replace(' ', '')}"

# AI Services (optional)
# GEMINI_API_KEY="your-gemini-api-key"
# OPENAI_API_KEY="your-openai-api-key"
# DEEPSEEK_API_KEY="your-deepseek-api-key"

# Brand Configuration
BRAND_VARIANT="{brand_name}"
"""
    
    # Generate package.json updates
    package_updates = {{
        'name': config['app_name'].lower().replace(' ', '-'),
        'description': config['description'],
        'author': config['company_name'],
        'homepage': config['website'],
        'keywords': [
            'career',
            'assessment',
            'guidance',
            'ai',
            'resume',
            'job',
            'development'
        ]
    }}
    
    # Write files
    with open(f'{output_dir}/brand-config.ts', 'w') as f:
        f.write(ts_config)
    
    with open(f'{output_dir}/.env.example', 'w') as f:
        f.write(env_vars)
    
    with open(f'{output_dir}/package-updates.json', 'w') as f:
        json.dump(package_updates, f, indent=2)
    
    print(f"✅ Generated brand configuration for '{brand_name}'")
    print(f"   📁 Config files saved to: {output_dir}/")
    print(f"   🎨 App Name: {config['app_name']}")
    print(f"   🏢 Company: {config['company_name']}")
    print(f"   📧 Support: {config['support_email']}")
    
    return config

def update_existing_files(brand_name, project_root='.'):
    """Update existing files with brand configuration"""
    
    if brand_name not in BRAND_CONFIGURATIONS:
        print(f"❌ Brand '{brand_name}' not found.")
        return
    
    config = BRAND_CONFIGURATIONS[brand_name]
    
    # Update package.json
    package_json_path = os.path.join(project_root, 'package.json')
    if os.path.exists(package_json_path):
        with open(package_json_path, 'r') as f:
            package_data = json.load(f)
        
        package_data['name'] = config['app_name'].lower().replace(' ', '-')
        package_data['description'] = config['description']
        package_data['author'] = config['company_name']
        package_data['homepage'] = config['website']
        
        with open(package_json_path, 'w') as f:
            json.dump(package_data, f, indent=2)
        
        print(f"✅ Updated package.json")
    
    # Update README.md
    readme_path = os.path.join(project_root, 'README.md')
    if os.path.exists(readme_path):
        with open(readme_path, 'r') as f:
            readme_content = f.read()
        
        # Replace brand references
        readme_content = readme_content.replace('Glixtron', config['app_name'])
        readme_content = readme_content.replace('glixtron', config['app_name'].lower())
        
        with open(readme_path, 'w') as f:
            f.write(readme_content)
        
        print(f"✅ Updated README.md")
    
    # Generate brand-specific scripts
    scripts_dir = os.path.join(project_root, 'scripts')
    os.makedirs(scripts_dir, exist_ok=True)
    
    deploy_script = f"""#!/bin/bash
# Deployment Script for {config['app_name']}
# Generated on {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}

echo "🚀 Deploying {config['app_name']}..."

# Build the application
npm run build

# Deploy to production
npm run deploy

echo "✅ {config['app_name']} deployed successfully!"
"""
    
    with open(f'{scripts_dir}/deploy-{brand_name}.sh', 'w') as f:
        f.write(deploy_script)
    
    os.chmod(f'{scripts_dir}/deploy-{brand_name}.sh', 0o755)
    print(f"✅ Created deployment script: scripts/deploy-{brand_name}.sh")

def create_brand_customization_guide():
    """Create a guide for brand customization"""
    
    guide = """# Brand Customization Guide

## Overview
This guide explains how to customize the Career Assessment Platform for different brands and deployments.

## Supported Brands

### Default (CareerPath Pro)
- **Target**: General use, startups, small businesses
- **Features**: All core features
- **Support**: Standard support

### Enterprise
- **Target**: Large corporations, enterprise clients
- **Features**: All core features + enterprise integrations
- **Support**: Priority support, dedicated account manager

### Education
- **Target**: Educational institutions, universities
- **Features**: All core features + student tracking
- **Support**: Educational support, training resources

### Government
- **Target**: Government agencies, public sector
- **Features**: All core features + compliance features
- **Support**: Government compliance support

### Healthcare
- **Target**: Healthcare organizations, medical institutions
- **Features**: All core features + healthcare-specific features
- **Support**: Healthcare industry support

### Tech
- **Target**: Technology companies, IT departments
- **Features**: All core features + tech-specific features
- **Support**: Technical support, developer resources

## Customization Steps

### 1. Generate Brand Configuration
```bash
python scripts/white-label-config.py generate <brand-name>
```

### 2. Update Environment Variables
```bash
cp configs/.env.example .env.local
# Edit the file with your specific values
```

### 3. Update Package Configuration
```bash
python scripts/white-label-config.py update <brand-name>
```

### 4. Customize Colors and Styling
Edit the brand configuration file to customize:
- Primary, secondary, and accent colors
- Company information
- Support details
- Social media links

### 5. Update Content
Update the following files with brand-specific content:
- Landing page copy
- About us section
- Support information
- Legal documents

## Brand Configuration Options

### Required Fields
- `app_name`: Short application name
- `app_full_name`: Full application name
- `company_name`: Company name
- `support_email`: Support email address
- `website`: Company website

### Optional Fields
- `description`: Application description
- `tagline`: Application tagline
- `colors`: Brand colors (primary, secondary, accent)
- `social_links`: Social media profiles

### Color Customization
Use hex color codes for brand colors:
- `primary`: Main brand color
- `secondary`: Secondary brand color
- `accent`: Accent color for highlights

## Deployment Considerations

### Environment Variables
Set the following environment variables for your brand:
- `NEXT_PUBLIC_APP_NAME`
- `NEXT_PUBLIC_COMPANY_NAME`
- `NEXT_PUBLIC_SUPPORT_EMAIL`
- `NEXT_PUBLIC_WEBSITE`
- `BRAND_VARIANT`

### Domain Configuration
Update the following for your domain:
- `NEXTAUTH_URL`
- `NEXTAUTH_SECRET`
- Website URLs in brand config

### Legal Requirements
Update legal documents with your brand:
- Privacy Policy
- Terms of Service
- Cookie Policy
- Support information

## Support

For brand customization support:
1. Check this guide for common issues
2. Review generated configuration files
3. Test all brand references
4. Verify legal compliance

## Examples

### Creating a New Brand
```bash
# Generate configuration for "MyCareer Pro"
python scripts/white-label-config.py generate mycareer

# This creates:
# - configs/brand-config.ts
# - configs/.env.example
# - configs/package-updates.json
```

### Updating an Existing Brand
```bash
# Update files for "enterprise" brand
python scripts/white-label-config.py update enterprise
```

### Custom Colors
```typescript
// In configs/brand-config.ts
colors: {
  primary: '#your-primary-color',
  secondary: '#your-secondary-color',
  accent: '#your-accent-color'
}
```
"""
    
    with open('BRAND_CUSTOMIZATION_GUIDE.md', 'w') as f:
        f.write(guide)
    
    print("✅ Created brand customization guide: BRAND_CUSTOMIZATION_GUIDE.md")

def main():
    """Main execution function"""
    print("🎨 White Label Configuration Generator")
    print("="*50)
    
    print("\nAvailable actions:")
    print("1. Generate brand configuration")
    print("2. Update existing files")
    print("3. List available brands")
    print("4. Create customization guide")
    print("5. Generate all brands")
    
    choice = input("\nEnter choice (1-5): ").strip()
    
    if choice == "1":
        print("\nAvailable brands:")
        for brand in BRAND_CONFIGURATIONS.keys():
            print(f"  - {brand}")
        
        brand_name = input("\nEnter brand name: ").strip().lower()
        output_dir = input("Output directory (default: configs): ").strip() or "configs"
        
        generate_brand_config(brand_name, output_dir)
    
    elif choice == "2":
        print("\nAvailable brands:")
        for brand in BRAND_CONFIGURATIONS.keys():
            print(f"  - {brand}")
        
        brand_name = input("\nEnter brand name: ").strip().lower()
        update_existing_files(brand_name)
    
    elif choice == "3":
        print("\nAvailable brands:")
        for brand, config in BRAND_CONFIGURATIONS.items():
            print(f"  - {brand}: {config['app_name']}")
            print(f"    Company: {config['company_name']}")
            print(f"    Email: {config['support_email']}")
    
    elif choice == "4":
        create_brand_customization_guide()
    
    elif choice == "5":
        print("\nGenerating configurations for all brands...")
        for brand in BRAND_CONFIGURATIONS.keys():
            generate_brand_config(brand, f"configs/{brand}")
    
    else:
        print("❌ Invalid choice!")

if __name__ == "__main__":
    main()
