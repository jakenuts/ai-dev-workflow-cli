# AI Dev Workflow CLI Architecture

## Overview
The AI Dev Workflow CLI is designed to be a framework-agnostic tool that provides AI-guided development workflows. It focuses on process and patterns rather than implementation details, making it compatible with any existing development setup.

## Core Principles
1. **Framework Agnostic**: Works with any tech stack or framework
2. **Non-Intrusive**: Adds structure without modifying existing code
3. **Process Focused**: Emphasizes workflow and patterns over implementation
4. **AI-Guided**: Leverages AI for development guidance while maintaining human control

## Directory Structure
```
.ai/                    # AI workflow configuration
├── config.yaml         # Main configuration file
├── patterns/          # Reusable development patterns
└── templates/         # Story/PR templates

docs/                   # Documentation
├── api/               # CLI command documentation
├── stories/           # User stories and features
└── technical/         # Technical documentation

src/                    # Source code
└── version.ts         # Version information
```

## Configuration
The `.ai/config.yaml` file is the heart of the workflow, defining:
- Project information
- Development workflow steps
- Version control rules
- Release processes
- Development patterns

## Workflow Integration
The tool integrates with existing development workflows by:
1. Adding structured documentation
2. Providing templates for consistency
3. Guiding development steps
4. Supporting version control best practices

## Design Decisions
1. **No Framework-Specific Features**
   - Keeps maintenance simple
   - Avoids framework-specific complexity
   - Lets teams own their technical decisions

2. **Minimal Dependencies**
   - Reduces maintenance burden
   - Simplifies installation
   - Increases reliability

3. **Configuration Over Convention**
   - Teams can customize workflows
   - Supports different project types
   - Maintains flexibility
