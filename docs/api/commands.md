# CLI Commands

## Core Commands

### `init`
Initialize AI-guided workflow in a project.

```bash
ai-dev init [options]
```

Options:
- `--force`: Override existing configuration
- `--minimal`: Create minimal configuration

### `story`
Manage user stories and features with AI-powered analysis.

```bash
ai-dev story <command> [options]
```

Commands:
- `create`: Create a new user story with AI analysis
  - `--title`: Story title
  - `--description`: Story description
- `list`: List all stories
- `show`: Show story details
- `update`: Update story status

The story command leverages AI to provide:
- Business value assessment
- Technical impact analysis
- Risk assessment
- Timeline estimation
- Task breakdown
- Test scenario generation

### `implement`
Get AI guidance for implementation.

```bash
ai-dev implement <feature> [options]
```

Options:
- `--story`: Link to a specific story
- `--test`: Include test implementation

### `review`
Get AI-powered code review and suggestions.

```bash
ai-dev review [options]
```

Options:
- `--files <glob>`: Files to review (default: staged files)
- `--type <type>`: Review type (security, performance, style, all)
- `--checklist`: Use checklist for review
- `--autofix`: Automatically fix simple issues

### `checklist`
Manage development checklists.

```bash
ai-dev checklist <command> [options]
```

Commands:
- `create`: Create a new checklist
- `list`: List all checklists
- `show`: Show checklist details
- `update`: Update checklist status

## Configuration

### `config`
Manage AI workflow configuration.

```bash
ai-dev config <command> [options]
```

Commands:
- `set`: Set a configuration value
- `get`: Get a configuration value
- `list`: List all configuration

## Project Structure

The AI Dev Workflow CLI creates the following structure in your project:

```
.ai/
  ├── config.yaml       # Configuration file
  ├── templates/        # Story and checklist templates
  │   ├── story.md
  │   └── checklist.md
  └── stories/         # Generated user stories
```

## Environment Variables

- `AI_DEV_CONFIG`: Path to config file (default: `.ai/config.yaml`)
- `AI_DEV_DEBUG`: Enable debug logging
- `AI_DEV_TEMPLATE_DIR`: Custom template directory

## Usage Examples

1. Initialize in a new project:
```bash
ai-dev init
```

2. Create a new feature story:
```bash
ai-dev story create
```

3. Get implementation guidance:
```bash
ai-dev implement feature-name
```

4. Review changes:
```bash
ai-dev review --pr 123
```
