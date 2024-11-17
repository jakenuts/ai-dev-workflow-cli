#!/usr/bin/env node
import { Command } from 'commander';
import { init } from './commands/init';
import { guide } from './commands/guide';
import { explore } from './commands/explore';
import { ChecklistCommand } from './commands/checklist';
import { ReviewCommand } from './commands/review';
import { version } from '../package.json';

const program = new Command();

program
  .name('ai-dev')
  .description('AI-guided development workflow tool')
  .version(version);

program
  .command('init')
  .description('Initialize AI workflow in current directory')
  .option('-t, --type <type>', 'Project type (webapp, library, cli)')
  .option('-f, --force', 'Force initialization even if already initialized')
  .action(init);

program
  .command('story')
  .description('Create or modify a user story with AI guidance')
  .argument('<action>', 'Action to perform (create, modify, complete)')
  .option('-t, --title <title>', 'Story title')
  .option('-d, --description <desc>', 'Story description')
  .action(guide);

program
  .command('implement')
  .description('Get AI guidance for implementing features')
  .argument('<type>', 'Implementation type (feature, bugfix, refactor)')
  .option('-s, --story <id>', 'Associated story ID')
  .option('-t, --test', 'Include test implementation guidance')
  .action(guide);

program
  .command('review')
  .description('Get AI code review and suggestions')
  .option('-f, --files <glob>', 'Files to review (default: staged files)')
  .option('-t, --type <type>', 'Review type (security, performance, style)')
  .action(guide);

program
  .command('explore')
  .description('Explore project files and get AI insights')
  .option('-p, --pattern <pattern>', 'Search pattern (e.g., "src/*.ts")')
  .option('-d, --depth <n>', 'Exploration depth')
  .action(explore);

// Register commands
ChecklistCommand.register(program);
ReviewCommand.register(program);

program.parse();
