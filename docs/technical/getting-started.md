# Getting Started

## Prerequisites
- Node.js >= 14
- Git

## Installation

### Global Installation
```bash
npm install -g ai-dev-workflow-cli
```

### Project-specific Installation
```bash
npm install --save-dev ai-dev-workflow-cli
```

### Direct Usage with npx
```bash
npx ai-dev-workflow-cli init
```

## Quick Start

1. **Initialize the Workflow**
   ```bash
   ai-dev init
   ```
   This creates the `.ai` directory with:
   - Configuration file
   - Templates
   - Documentation structure

2. **Create Your First Story**
   ```bash
   ai-dev story create
   ```
   Follow the interactive prompts to:
   - Define the feature
   - Set acceptance criteria
   - Add technical notes

3. **Start Development**
   ```bash
   ai-dev implement feature-name
   ```
   The CLI will:
   - Create a feature branch
   - Set up documentation
   - Guide implementation

4. **Review and Submit**
   ```bash
   ai-dev review
   ```
   Get AI assistance for:
   - Code review
   - Documentation review
   - PR preparation

## Configuration

The `.ai/config.yaml` file controls:
- Project settings
- Workflow steps
- Development patterns
- Templates

Example configuration:
```yaml
project:
  name: "your-project"
  type: "web-app"
  description: "Project description"

development_workflow:
  feature_development:
    steps:
      - user_story
      - branch_creation
      - documentation
      - implementation
      - testing
      - pr_creation
```

## Next Steps
1. Review the [CLI Commands](../api/commands.md)
2. Explore the [Architecture](./architecture.md)
3. Customize your workflow
