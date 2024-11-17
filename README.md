# AI Dev Workflow

A framework-agnostic tool that provides AI-guided development workflows and patterns. Works with your preferred AI assistant to streamline the development process.

> 🚀 This project was developed using [Codeium's Windsurf](https://codeium.com/windsurf), the world's first agentic IDE that enables true AI-human collaboration.

## Features

- 🤖 AI-guided development workflows
- 📝 Standardized user story templates
- 🔄 Consistent development patterns
- 🔍 Project-type specific guidance
- 📋 Automated PR templates

## Installation

```bash
npm install -g ai-dev-workflow
```

Or use directly with npx:
```bash
npx ai-dev-workflow init
```

## Usage

1. Initialize in your project:
```bash
ai-dev init
```

2. Get AI guidance for a new feature:
```bash
ai-dev story create
```

3. Start implementing with AI guidance:
```bash
ai-dev implement feature
```

4. Get AI review guidance:
```bash
ai-dev review
```

## Configuration

The tool creates a `.ai` directory with:

```
.ai/
├── config.yaml          # Core AI guidance configuration
├── patterns/           # Reusable patterns
└── templates/          # Story/PR templates
```

### Project Types

Supports any project type with specialized patterns for:
- Web Applications
- Libraries
- CLI Tools

### Workflow Steps

1. User Story Creation
2. Branch Creation
3. Documentation First
4. Implementation
5. Testing
6. PR Creation

## Development

```bash
# Install dependencies
npm install

# Run in development
npm run dev

# Build
npm run build

# Test
npm test
```

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT
