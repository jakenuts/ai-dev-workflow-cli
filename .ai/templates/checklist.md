# Development Checklist

## Pre-Development
- [ ] Create user story using Gherkin format
  - [ ] Define user type
  - [ ] Specify desired action
  - [ ] Clarify business value
  - [ ] Add acceptance criteria

## Branch Management
- [ ] Create feature branch: `${branch_type}/${feature_name}`
- [ ] Verify branch is up to date with main

## Documentation
- [ ] Update technical documentation
  - [ ] Add feature description
  - [ ] Document API changes
  - [ ] Update examples
- [ ] Update storytelling documentation
  - [ ] Add user-focused scenarios
  - [ ] Include clear examples
  - [ ] Use conversational tone
- [ ] Verify GitHub Pages build
  - [ ] Test local Jekyll build
  - [ ] Check workflow status
  - [ ] Verify deployed changes

## Implementation
- [ ] Follow TypeScript best practices
  - [ ] Use strict typing
  - [ ] Design interfaces first
  - [ ] Implement dependency injection
- [ ] Write tests first
  - [ ] Unit tests (${coverage_target}% coverage)
  - [ ] Integration tests
  - [ ] E2E tests
- [ ] Handle errors gracefully
- [ ] Update CLI documentation
  - [ ] Command help text
  - [ ] Usage examples
  - [ ] Error messages

## Version Management
- [ ] Determine version bump type:
  - [ ] Major: Breaking changes?
  - [ ] Minor: New features?
  - [ ] Patch: Bug fixes?
- [ ] Update version numbers:
  - [ ] package.json
  - [ ] package-lock.json
  - [ ] src/version.ts

## Pull Request
- [ ] Create PR using template
- [ ] Fill out all sections:
  - [ ] Changes description
  - [ ] Testing notes
  - [ ] Documentation updates
- [ ] Request reviews
- [ ] Address feedback

## Final Verification
- [ ] All tests passing
- [ ] Documentation complete
- [ ] Version numbers consistent
- [ ] PR template complete
- [ ] GitHub Pages deployed

## Post-Merge
- [ ] Delete feature branch
- [ ] Verify production deployment
- [ ] Update project board
- [ ] Notify stakeholders

## Notes
${notes}

## Status
Started: ${start_date}
Last Updated: ${last_updated}
Status: ${status}
