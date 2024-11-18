import { Command } from 'commander';
import { syncConfigWithTemplate } from '../utils/config.js';
import chalk from 'chalk';

export function createSyncCommand() {
  const command = new Command('sync');
  
  command
    .description('Sync project configuration with template updates')
    .option('-f, --force', 'Force sync without confirmation')
    .option('-b, --backup', 'Create backup before syncing')
    .option('-t, --template <path>', 'Path to template file', '.ai/template.yaml')
    .action(async (options) => {
      try {
        console.log(chalk.blue('🔄 Syncing project configuration with template...'));
        await syncConfigWithTemplate(options.template);
      } catch (error: any) {
        console.error(chalk.red('Error syncing configuration:'), error.message);
        process.exit(1);
      }
    });

  return command;
}
