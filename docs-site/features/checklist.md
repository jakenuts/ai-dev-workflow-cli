# Smart Checklists

AI-driven checklists that adapt to your workflow and ensure consistency across your development process.

## Overview

Smart Checklists are more than just to-do lists. They're living documents that:
- Track development progress
- Ensure documentation stays updated
- Manage version control
- Verify deployment status
- Guide your development process

## Getting Started

### Create a New Checklist

```bash
ai-dev checklist create "user-authentication"
```

This creates a checklist at `.ai/checklists/user-authentication.md` with:
- Pre-filled development steps
- Current timestamp
- Initial status
- Progress tracking

### View Your Checklists

```bash
# List all active checklists
ai-dev checklist list

# View a specific checklist
ai-dev checklist show "user-authentication"
```

### Update Progress

```bash
# Update status
ai-dev checklist update "user-authentication" --status "In Progress"

# Add notes
ai-dev checklist update "user-authentication" --notes "Added OAuth integration"
```

## Checklist Structure

```markdown
# Development Checklist: User Authentication

## Pre-Development
- [ ] Create user story
- [ ] Define acceptance criteria
- [ ] Plan implementation approach

## Documentation
- [ ] Update API docs
- [ ] Add usage examples
- [ ] Update README

## Implementation
- [ ] Write tests
- [ ] Implement feature
- [ ] Handle errors

## Version Management
- [ ] Update version numbers
- [ ] Update changelog

## Status
Started: 2024-01-20T10:00:00Z
Last Updated: 2024-01-20T15:30:00Z
Status: In Progress
```

## Automatic Updates

The checklist automatically updates when you:

1. **Start Development**
   ```bash
   ai-dev feature start "user-authentication"
   # ✓ Creates feature branch
   # ✓ Generates checklist
   # ✓ Sets up documentation
   ```

2. **Update Documentation**
   ```bash
   ai-dev docs update
   # ✓ Updates relevant checklist items
   # ✓ Verifies GitHub Pages deployment
   ```

3. **Create Pull Request**
   ```bash
   ai-dev pr create
   # ✓ Verifies checklist completion
   # ✓ Updates status
   ```

## Configuration

Customize checklist behavior in `.ai/config.yaml`:

```yaml
templates:
  checklist:
    path: ".ai/templates/checklist.md"
    variables:
      - "feature_name"
      - "coverage_target"
      - "status"
    defaults:
      coverage_target: 80
      status: "In Progress"
```

## Integration with AI Workflow

The checklist integrates with other AI-driven features:

1. **Story Creation**
   - Automatically adds user story details
   - Links acceptance criteria
   - Tracks story progress

2. **Documentation**
   - Verifies documentation updates
   - Checks GitHub Pages deployment
   - Ensures README consistency

3. **Version Management**
   - Tracks version bumps
   - Updates changelog
   - Verifies consistency

4. **Pull Requests**
   - Ensures all items are checked
   - Validates test coverage
   - Verifies documentation

## Best Practices

1. **Start with Documentation**
   - Create user story first
   - Plan implementation approach
   - Document API changes early

2. **Regular Updates**
   - Update status frequently
   - Add implementation notes
   - Track blockers and decisions

3. **Use for Consistency**
   - Follow the checklist order
   - Don't skip steps
   - Keep documentation in sync

## Common Patterns

### Feature Development

```bash
# 1. Start feature
ai-dev feature start "user-auth"

# 2. Update docs
ai-dev docs update

# 3. Check progress
ai-dev checklist show "user-auth"

# 4. Complete feature
ai-dev checklist update "user-auth" --status "Ready for Review"
```

### Bug Fixes

```bash
# 1. Create bug fix checklist
ai-dev checklist create "fix-login" --type bugfix

# 2. Track progress
ai-dev checklist update "fix-login" --notes "Identified root cause"

# 3. Verify fix
ai-dev checklist show "fix-login"
```

## Troubleshooting

### Checklist Not Updating?

```bash
# Refresh checklist status
ai-dev checklist refresh "feature-name"

# Force update
ai-dev checklist update "feature-name" --force
```

### Missing Items?

```bash
# Regenerate checklist
ai-dev checklist create "feature-name" --regenerate

# Keep existing progress
ai-dev checklist merge "feature-name"
```

### Status Mismatch?

```bash
# Verify all systems
ai-dev checklist verify "feature-name"

# Show detailed status
ai-dev checklist status "feature-name" --verbose
```

## Next Steps

- [Configure Checklist Templates](../configuration/templates.md)
- [Customize Workflow](../guides/workflow-customization.md)
- [Advanced AI Integration](../features/ai-assistance.md)
