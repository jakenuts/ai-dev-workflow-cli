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

### `help`
Get help and documentation.

```bash
# General help
ai-dev help

# Command-specific help
ai-dev help <command>

# Browse documentation
ai-dev docs

# Search documentation
ai-dev docs search "query"
```

## Configuration Commands

### `config`
Manage AI workflow configuration.

```bash
ai-dev config <command>
```

Commands:
- `show`: Display current configuration
- `set`: Update configuration values
- `reset`: Reset to default configuration
