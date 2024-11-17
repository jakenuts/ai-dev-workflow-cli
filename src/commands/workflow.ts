import { Command } from 'commander';
import { loadConfig } from '../utils/config';
import { prompt } from 'inquirer';
import chalk from 'chalk';
import { createWorkflowModuleCommands } from './workflow/modules';

export function createWorkflowCommand() {
  const command = new Command('workflow');
  
  // Add module management commands
  command.addCommand(createWorkflowModuleCommands());
  
  // Original workflow following command
  command
    .command('follow')
    .description('Follow a defined workflow process')
    .argument('[type]', 'Workflow type (basic or advanced)')
    .action(async (type?: string) => {
      try {
        // If no type provided, run interactive mode
        if (!type) {
          return await runInteractiveMode();
        }

        // If type provided, display workflow for AI to follow
        const config = await loadConfig();
        const workflow = config.development_workflow[type];
        
        if (!workflow) {
          console.error(chalk.red(`Workflow type '${type}' not found. Available types: basic, advanced`));
          return;
        }

        console.log(chalk.blue(`\n📋 ${type} workflow: ${workflow.description}\n`));
        console.log(chalk.yellow('This workflow is for AI guidance. The AI will follow these steps:\n'));

        // Display steps for AI to follow
        for (const [stepKey, step] of Object.entries(workflow.steps)) {
          const stepNumber = stepKey.split('_')[0];
          console.log(chalk.yellow(`Step ${stepNumber}: ${step.description}`));
          
          if (step.command) {
            console.log(chalk.cyan(`  Command template: ${step.command}`));
          }
          if (step.guidelines) {
            console.log(chalk.cyan('  Guidelines:'));
            step.guidelines.forEach((guideline: string) => {
              console.log(chalk.cyan(`    • ${guideline}`));
            });
          }
          if (step.files) {
            console.log(chalk.cyan('  Files:'));
            step.files.forEach((file: string) => {
              console.log(chalk.cyan(`    • ${file}`));
            });
          }
          console.log(); // Empty line between steps
        }

        console.log(chalk.green('\nWorkflow loaded. The AI will now follow these steps.\n'));
      } catch (error) {
        console.error(chalk.red('Error loading workflow:'), error);
      }
    });

  return command;
}

// Interactive mode for when users run 'ai-dev workflow' without args
async function runInteractiveMode() {
  try {
    const config = await loadConfig();
    const { type } = await prompt({
      type: 'list',
      name: 'type',
      message: 'Select workflow type:',
      choices: Object.keys(config.development_workflow)
    });

    const workflow = config.development_workflow[type];
    console.log(chalk.blue(`\n📋 Starting ${type} workflow: ${workflow.description}\n`));

    // Go through each step interactively
    for (const [stepKey, step] of Object.entries(workflow.steps)) {
      const stepNumber = stepKey.split('_')[0];
      console.log(chalk.yellow(`\nStep ${stepNumber}: ${step.description}`));

      if (step.command) {
        const { execute } = await prompt({
          type: 'input',
          name: 'execute',
          message: `Enter values for command: ${step.command}\n(Press Enter to skip)`,
        });

        if (execute) {
          const command = step.command.replace(/\${(\w+)}/g, (_, key) => {
            return execute[key] || `\${${key}}`;
          });
          console.log(chalk.green(`Executing: ${command}`));
          // TODO: Execute command
        }
      }

      if (step.guidelines) {
        console.log(chalk.cyan('\nGuidelines:'));
        step.guidelines.forEach((guideline: string) => {
          console.log(chalk.cyan(`• ${guideline}`));
        });
      }

      if (step.files) {
        console.log(chalk.cyan('\nFiles to consider:'));
        step.files.forEach((file: string) => {
          console.log(chalk.cyan(`• ${file}`));
        });
      }

      if (step.steps) {
        console.log(chalk.cyan('\nRequired steps:'));
        step.steps.forEach((substep: string) => {
          console.log(chalk.cyan(`• ${substep}`));
        });
      }

      const { completed } = await prompt({
        type: 'confirm',
        name: 'completed',
        message: 'Have you completed this step?',
        default: false,
      });

      if (!completed) {
        console.log(chalk.yellow('\nWorkflow paused. Complete this step before continuing.'));
        break;
      }
    }

    console.log(chalk.green('\n✨ Workflow completed successfully!\n'));
  } catch (error) {
    console.error(chalk.red('Error in interactive mode:'), error);
  }
}
