# AI Development Workflow Modules

## Overview
This directory contains modular workflow components that can be combined to create your ideal development workflow. Think of them as LEGO® blocks for your development process.

## Directory Structure
```
workflows/
├── context/          # Context management workflows
│   ├── preservation.yaml    # Basic context preservation
│   ├── sharing.yaml        # Team context sharing
│   └── ml-enhanced.yaml    # ML-powered context management
├── task/            # Task management workflows
│   ├── basic.yaml          # Simple task tracking
│   ├── advanced.yaml       # Advanced task management
│   └── team.yaml          # Team task coordination
├── team/            # Team collaboration workflows
├── code/            # Code management workflows
└── ml/              # Machine learning workflows
```

## How to Use

### 1. Browse Available Modules
Each workflow module has:
- Clear description
- Required dependencies
- Configuration options
- Tags for easy search

### 2. Select Your Modules
Choose modules based on your needs:
```bash
ai workflow list        # List available workflows
ai workflow show task/basic.yaml  # View details
ai workflow deps task/advanced.yaml  # Check dependencies
```

### 3. Compose Your Config
```bash
# Automatically combine selected workflows
ai workflow compose \
  context/preservation.yaml \
  task/basic.yaml \
  > config.yaml

# Or manually include in your config:
workflows:
  include:
    - context/preservation
    - task/basic
```

## Module Guidelines

### 1. Single Responsibility
Each module should:
- Do one thing well
- Have clear boundaries
- Be independently useful

### 2. Dependencies
- Clearly state dependencies
- Version requirements if any
- Optional enhancements

### 3. Configuration
- Use clear naming
- Provide defaults
- Document options

### 4. Integration
- Define integration points
- List required commands
- Specify event hooks

## Example Combinations

### Solo Developer
```yaml
workflows:
  include:
    - context/preservation
    - task/basic
    - code/review
```

### Team Development
```yaml
workflows:
  include:
    - context/sharing
    - task/team
    - team/collaboration
    - code/review
```

### ML Project
```yaml
workflows:
  include:
    - context/ml-enhanced
    - task/advanced
    - ml/experiment-tracking
    - code/review
```

## Creating New Modules

1. Use the template:
   ```yaml
   # Module name
   # Tags: #tag1 #tag2
   # Dependencies: module1, module2

   workflow_name:
     description: "Clear description"
     # ... configuration
   ```

2. Follow guidelines:
   - Clear documentation
   - Minimal dependencies
   - Sensible defaults
   - Progressive complexity

3. Test compatibility:
   ```bash
   ai workflow test my-workflow.yaml
   ```

## Best Practices

1. Start Small
   - Begin with basic modules
   - Add complexity as needed
   - Test combinations

2. Version Control
   - Track your config
   - Document changes
   - Share with team

3. Customize
   - Adapt to your needs
   - Override defaults
   - Create local modules
