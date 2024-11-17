# Beginning Your AI-Guided Journey

Welcome aboard! Let's get you set up with your new AI development companion. Don't worry – it's as easy as having a chat with a friendly colleague.

## Before We Begin

You'll need:
- Node.js (version 14 or newer) - your AI companion's language of choice
- Git - because every good journey needs checkpoints

## Meeting Your AI Companion

### The Global Handshake
```bash
npm install -g ai-dev-workflow-cli
```
This introduces your AI companion to your development environment. They'll be available whenever you need them.

### The Project-Specific Introduction
```bash
npm install --save-dev ai-dev-workflow-cli
```
Perfect for when you want your AI companion to be project-specific.

### The Quick Hello
```bash
npx ai-dev-workflow-cli init
```
Can't wait? This lets you try out your AI companion right away.

## Your First Adventure

### 1. The Initial Setup
```bash
ai-dev init
```
Your AI companion will create their workspace (the `.ai` directory) where they'll keep:
- Their notes (configuration)
- Their templates
- The documentation trail

### 2. Creating Your First Story
```bash
ai-dev story create
```
Let your AI companion guide you through:
- Crafting the perfect feature description
- Setting clear acceptance criteria
- Planning the technical approach

### 3. The Development Dance
```bash
ai-dev implement feature-name
```
Watch as your AI companion:
- Sets up your feature branch
- Prepares documentation
- Guides your implementation

### 4. The Final Review
```bash
ai-dev review
```
Your AI companion helps ensure:
- Code quality
- Documentation completeness
- PR readiness

## Customizing Your Experience

Your `.ai/config.yaml` is like your AI companion's personality settings:
```yaml
project:
  name: "your-amazing-project"
  type: "web-app"
  description: "The next big thing"

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

## What's Next?

1. 🎯 Check out the [CLI Commands](commands.md) - your AI companion's vocabulary
2. 🏗️ Explore the [Architecture](architecture.md) - peek behind the curtain
3. 🎨 Make it yours - customize your workflow

## Need a Hand?

Remember, your AI companion is always just a command away:
```bash
ai-dev help
```

Ready to start building something amazing together? Let's go! 🚀
