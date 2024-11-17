# AI Dev Workflow CLI

<div align="center">

[![GitHub license](https://img.shields.io/github/license/carmelyne/ai-dev-workflow-cli)](https://github.com/carmelyne/ai-dev-workflow-cli/blob/main/LICENSE)
[![npm version](https://img.shields.io/npm/v/ai-dev-workflow-cli)](https://www.npmjs.com/package/ai-dev-workflow-cli)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/carmelyne/ai-dev-workflow-cli/blob/main/CONTRIBUTING.md)

</div>

Transform your development workflow with AI-powered guidance. This framework-agnostic CLI tool seamlessly integrates AI assistance into your development process, helping you write better code, faster.

> 🚀 Built with [Codeium's Windsurf](https://codeium.com/windsurf), the world's first agentic IDE that enables true AI-human collaboration.

## ✨ Highlights

- 🧠 **AI Development Framework** - A structured way for anyone to develop their work alongside AI, maintaining context through tenets and tracking
- 🎯 **Universal AI Workflow** - Transform any creative or analytical process into a clear AI-assisted workflow with guiding tenets
- 🔄 **AI-Human Collaboration** - Track progress and maintain shared context between human and AI through structured files and stages
- 📝 **Adaptive Interface** - Commands like `story`, `explore`, and `review` create a consistent interface between you and AI for any type of work
- ⚡ **Continuous Context** - Keep your AI assistant aligned with your goals and progress through the `context` command

> 💡 While this framework is designed for any AI-assisted workflow, we're starting with software development as our first template. The principles of structured collaboration and context management proven in development can be applied to any creative or analytical process.

## 📚 Documentation

**[View the full documentation](https://carmelyne.github.io/ai-dev-workflow-cli)** for:
- Detailed guides and tutorials
- Best practices and patterns
- Command reference
- Configuration options
- Advanced features

## 🚀 Quick Start

### Installation

```bash
# Using npm
npm install -g ai-dev-workflow-cli

# Or using npx (no installation required)
npx ai-dev-workflow-cli init
```

### Basic Usage

```bash
# Initialize AI workflow in your project
ai-dev init

# Create a new feature with AI guidance
ai-dev story create

# Get implementation guidance
ai-dev implement feature-name

# AI-assisted code review
ai-dev review
```

## 🛠 Key Features

### AI-Guided Workflows

The CLI provides intelligent guidance at every step:
- User story creation and refinement
- Implementation strategy and patterns
- Code review and best practices
- Documentation assistance

### Smart Templates

Automatically generate and adapt:
- User story templates
- PR templates
- Documentation templates
- Code patterns

### Project Type Support

Specialized patterns for:
- Web Applications
- Libraries/Packages
- CLI Tools
- APIs
- And more...

## ⚙️ Configuration

The tool maintains its configuration in the `.ai` directory:

```
.ai/
├── config.yaml     # Core configuration
├── patterns/       # Reusable patterns
└── templates/      # Story/PR templates
```

Configuration options include:
- AI provider settings
- Custom templates
- Project-specific patterns
- Team preferences

## 🧑‍💻 Development

```bash
# Install dependencies
npm install

# Run in development mode
npm run dev

# Build for production
npm run build

# Run tests
npm test
```

## 🤝 Contributing

Contributions are welcome! See our [Contributing Guide](CONTRIBUTING.md) for details on:
- Setting up the development environment
- Coding standards
- Submitting pull requests
- Feature requests and bug reports

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<div align="center">
Made with ❤️ by a Human + Windsurf + Claude + ChatGPT
<br/>
<sub>(A real-world example of human-AI collaboration!)</sub>
</div>
