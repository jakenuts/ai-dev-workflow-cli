# AI-Assisted Development Workflow Guide

This guide outlines the standardized workflow for AI-assisted development using the `ai-dev` CLI tool. Following these guidelines ensures consistent, high-quality development practices across your team.

## Table of Contents
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Configuration Management](#configuration-management)
- [Context-Aware Development](#context-aware-development)
- [Git Workflow Integration](#git-workflow-integration)
- [Workflow Status](#workflow-status)
- [Best Practices](#best-practices)
- [Troubleshooting](#troubleshooting)

## Getting Started

### Installation
```bash
npm install -g ai-dev-workflow-cli
```

### Project Initialization
```bash
# Initialize AI workflow in your project
ai-dev init

# This creates:
# - .ai/config.yaml: Core workflow configuration
# - .ai/patterns/: Reusable code patterns
# - .ai/templates/: Story and PR templates
```

## Development Workflow

### 1. Load AI Context
Before starting any development task, always load the AI context:
```bash
# Load AI workflow context
ai-dev context

# View detailed context information
ai-dev context -v
```

This ensures the AI assistant:
- Reads your project configuration
- Understands workflow requirements
- Follows established patterns
- Makes informed decisions

### 2. Create Feature Story
```bash
# Create a new story
ai-dev story create

# This generates:
# - Story template with AI analysis
# - Acceptance criteria
# - Technical requirements
# - Implementation plan
```

### 3. Start Implementation
```bash
# Create feature branch
git checkout -b feature/your-feature-name

# Get AI implementation guidance
ai-dev implement feature --story .ai/stories/your-feature.md
```

### 4. Configuration Management
The `ai-dev config` command group manages workflow configuration:

```bash
# View current config
ai-dev config view

# View template config
ai-dev config view -t

# Edit project config
ai-dev config edit

# Edit template config (requires confirmation)
ai-dev config edit -t

# Sync project config with template
ai-dev config sync

# Restore template from backup
ai-dev config restore

# Validate config
ai-dev config validate
```

Safety measures:
- Automatic backups before changes
- Confirmation prompts for destructive actions
- Schema validation
- Project-specific settings preservation

### 5. Review and Testing
```bash
# Get AI code review with analysis
ai-dev code review

# Run tests with AI analysis
ai-dev code test
```

### 6. Documentation
```bash
# Update documentation
ai-dev docs update

# Validate documentation
ai-dev docs validate
```

## Git Workflow Integration

The AI workflow integrates with git:

1. Branch Types:
   - `feature/*`: New features
   - `bugfix/*`: Bug fixes
   - `hotfix/*`: Production fixes
   - `docs/*`: Documentation updates

2. Branch Protection:
   - `main`: Protected, requires review
   - `develop`: Integration branch
   - Feature branches: Created from `develop`

3. Commit Guidelines:
   - Clear, descriptive messages
   - Reference story/ticket numbers
   - Follow conventional commits

## Workflow Status

The `ai-dev status` command provides comprehensive insights into your AI-assisted development workflow:

### Basic Status
```bash
# Show basic workflow status
ai-dev status

# Show detailed status information
ai-dev status --full
```

This displays:
- Current story progress and blockers
- Git status and changes
- Code quality metrics
- Team collaboration status
- Configuration sync status
- AI-suggested next steps

### Progress Tracking
```bash
# Show detailed progress report
ai-dev status progress

# View sprint progress
ai-dev status progress --sprint

# Show timeline view
ai-dev status progress --timeline

# Display progress charts
ai-dev status progress --chart
```

### Blockers and Issues
```bash
# Show current blockers
ai-dev status blockers

# Show all blockers including resolved
ai-dev status blockers --all

# Filter blockers by type
ai-dev status blockers --type story
ai-dev status blockers --type review
ai-dev status blockers --type test
```

### Dependency Health
```bash
# Check dependency status
ai-dev status dependencies

# Show outdated packages
ai-dev status dependencies --outdated

# Check security vulnerabilities
ai-dev status dependencies --security

# Review license compliance
ai-dev status dependencies --licenses
```

### Technical Metrics
When using `--full` flag, additional metrics are shown:
- Technical debt analysis
- Build and test performance
- API response times
- Sprint progress and story status
- Detailed team collaboration metrics

## Best Practices

1. Always load context before starting work:
   ```bash
   ai-dev context
   ```

2. Follow the workflow steps in order:
   - Create story
   - Load context
   - Create branch
   - Implement
   - Review
   - Document

3. Keep configuration in sync:
   - Regular `ai-dev config sync`
   - Validate changes
   - Review diffs carefully

4. Document as you go:
   - Update guides for new features
   - Keep examples current
   - Add troubleshooting tips

## Troubleshooting

### Common Issues

1. Context Loading Failed
   ```
   Error: No AI workflow config found
   Solution: Run "ai-dev init" first
   ```

2. Config Sync Conflicts
   ```
   Error: Config validation failed
   Solution: Review and fix schema violations
   ```

3. Branch Protection
   ```
   Error: Cannot push to protected branch
   Solution: Create feature branch first
   ```

### Getting Help
```bash
# Get command help
ai-dev help [command]

# Show workflow status
ai-dev status

# Get detailed status
ai-dev status --full
```

## Contributing

1. Fork the repository
2. Create feature branch
3. Follow AI workflow
4. Submit PR with story reference

## License
MIT License - See LICENSE file for details
