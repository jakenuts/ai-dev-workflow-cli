# AI Development Workflow Templates

This directory contains configuration templates for different development workflow needs.

## Template Types

### 1. Master Template (`config.master.yaml`)
- Complete reference of all possible configurations
- Use as documentation and source for advanced features
- Contains detailed explanations and examples

### 2. Starter Template (`config.starter.yaml`)
- Minimal setup to get started quickly
- Essential features for individual development
- Clear path to extend with more features

### 3. Example Configurations
Located in `examples/` directory:

#### Team Projects (`examples/team/`)
- Team collaboration features
- Shared context management
- Knowledge sharing workflows

#### Enterprise (`examples/enterprise/`)
- Full compliance features
- Advanced retention policies
- Audit trail capabilities

#### ML Projects (`examples/ml-project/`)
- ML-specific workflows
- Model versioning
- Training context preservation

## How to Use

1. **Getting Started**
   ```bash
   # For new projects, start with the starter template
   cp templates/config.starter.yaml .ai/config.yaml
   ```

2. **Adding Features**
   - Copy needed sections from `config.master.yaml`
   - Or use example configurations as reference
   - Follow inline documentation for setup

3. **Customizing**
   - Each template is fully customizable
   - Remove unused features
   - Add your own workflows

## Template Selection Guide

Choose your template based on your needs:

| If You Need... | Use This Template |
|----------------|-------------------|
| Quick start | `config.starter.yaml` |
| Team features | `examples/team/config.yaml` |
| Enterprise compliance | `examples/enterprise/config.yaml` |
| ML project setup | `examples/ml-project/config.yaml` |
| Full reference | `config.master.yaml` |

## Extending Templates

1. Start with `config.starter.yaml`
2. Identify needed features
3. Copy relevant sections from `config.master.yaml`
4. Follow the inline documentation
5. Test your configuration

## Best Practices

1. Start Simple
   - Begin with starter template
   - Add complexity as needed

2. Progressive Enhancement
   - Add features incrementally
   - Test each addition

3. Documentation
   - Comment your customizations
   - Keep track of added features

4. Version Control
   - Commit your config changes
   - Document major changes

## Need Help?

- Check `config.master.yaml` for full documentation
- See example configurations for common setups
- Refer to main project documentation for detailed guides
