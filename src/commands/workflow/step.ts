import { Command } from 'commander';

export function createWorkflowStep(): Command {
  const command = new Command('step');
  
  command
    .description('Create a new workflow step')
    .argument('<name>', 'Step name')
    .option('-t, --type <type>', 'Step type', 'task')
    .option('-d, --description <desc>', 'Step description')
    .action(async (name: string, options) => {
      // TODO: Implement step creation
      console.log(`Creating step ${name} of type ${options.type}`);
    });

  return command;
}
