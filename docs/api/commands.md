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
Manage user stories and features.

```bash
ai-dev story <command>
```

Commands:
- `create`: Create a new user story
- `list`: List all stories
- `show`: Show story details

### `implement`
Get AI guidance for implementation.

```bash
ai-dev implement <feature>
```

### `review`
Get AI assistance for code review.

```bash
ai-dev review [options]
```

Options:
- `--pr`: Review a specific pull request
- `--files`: Review specific files

## Configuration

### `config`
Manage AI workflow configuration.

```bash
ai-dev config <command>
```

Commands:
- `show`: Display current configuration
- `set`: Update configuration values
- `reset`: Reset to default configuration

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
