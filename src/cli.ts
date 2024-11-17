#!/usr/bin/env node
import { Command } from 'commander';
import { init } from './commands/init.js';
import { guide } from './commands/guide.js';
import { explore } from './commands/explore.js';
import { status } from './commands/status.js';
import { ReviewCommand } from './commands/review.js';
import { CodeCommand } from './commands/code.js';
import { createWorkflowCommand } from './commands/workflow.js';
import { createFollowCommand } from './commands/follow.js';
import { 
  syncConfigWithTemplate, 
  restoreTemplateConfig,
  validateConfig,
  viewConfig,
  editConfig 
} from './utils/config.js';
import { loadAIContext } from './utils/context.js';
import pkg from '../package.json' assert { type: 'json' };

const program = new Command();

program
  .name('ai-dev')
  .description('AI-guided development workflow')
  .version(pkg.version);

program
  .command('init')
  .description('Initialize AI development workflow')
  .option('-t, --type <type>', 'Project type')
  .action(init);

program
  .command('story')
  .description('Create or modify a user story with AI guidance')
  .command('create')
  .description('Create a new user story')
  .option('-t, --title <title>', 'Story title')
  .option('-d, --description <desc>', 'Story description')
  .action((options) => guide('story', 'create', options));

program
  .command('implement')
  .description('Get AI guidance for implementation')
  .argument('<type>', 'Implementation type (feature, bugfix, refactor)')
  .option('-s, --story <id>', 'Associated story ID')
  .option('-t, --test', 'Include test implementation', false)
  .action(guide);

program
  .command('review')
  .description('Get AI code review and suggestions')
  .option('-f, --files <glob>', 'Files to review (default: staged files)')
  .option('-t, --type <type>', 'Review type (security, performance, style)')
  .action(guide);

CodeCommand.register(program);

program
  .command('explore')
  .description('Explore and understand codebase with AI')
  .option('-p, --path <path>', 'Path to explore')
  .option('-d, --depth <depth>', 'Exploration depth')
  .action(explore);

program
  .command('status')
  .description('Show AI development workflow status')
  .option('--full', 'Show detailed status')
  .action(status);

program
  .command('workflow')
  .description('Manage AI development workflow')
  .action(createWorkflowCommand());

program
  .command('follow')
  .description('Execute a task with AI guidance')
  .action(createFollowCommand());

program
  .command('context')
  .description('Load AI workflow context and guidelines')
  .option('-v, --verbose', 'Show loaded context details')
  .action(async (options) => {
    try {
      await loadAIContext(options.verbose);
    } catch (error: any) {
      console.error('Error loading AI context:', error.message);
      process.exit(1);
    }
  });

// Config command group
const configCmd = program
  .command('config')
  .description('Manage AI workflow configuration');

configCmd
  .command('sync')
  .description('Sync project config with template updates')
  .action(async () => {
    try {
      await syncConfigWithTemplate();
    } catch (error: any) {
      console.error('Error syncing config:', error.message);
      process.exit(1);
    }
  });

configCmd
  .command('restore')
  .description('Restore template config from backup')
  .option('-b, --backup <path>', 'Specific backup file to restore from')
  .action(async (options) => {
    try {
      await restoreTemplateConfig(options.backup);
    } catch (error: any) {
      console.error('Error restoring config:', error.message);
      process.exit(1);
    }
  });

configCmd
  .command('validate')
  .description('Validate current config against schema')
  .option('--fix', 'Automatically fix common issues')
  .action(async (options) => {
    try {
      await validateConfig(options.fix);
    } catch (error: any) {
      console.error('Error validating config:', error.message);
      process.exit(1);
    }
  });

configCmd
  .command('view')
  .description('View current config')
  .option('-t, --template', 'View template config instead of project config')
  .option('--json', 'Output in JSON format')
  .action(async (options) => {
    try {
      await viewConfig(options);
    } catch (error: any) {
      console.error('Error viewing config:', error.message);
      process.exit(1);
    }
  });

configCmd
  .command('edit')
  .description('Edit config in default editor')
  .option('-t, --template', 'Edit template config instead of project config')
  .action(async (options) => {
    try {
      await editConfig(options.template);
    } catch (error: any) {
      console.error('Error editing config:', error.message);
      process.exit(1);
    }
  });

program.parse();
