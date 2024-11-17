import { Command } from 'commander';
import fs from 'fs';
import path from 'path';
import yaml from 'yaml';
import chalk from 'chalk';
import { prompt } from 'inquirer';

interface WorkflowModule {
  name: string;
  description: string;
  tags: string[];
  dependencies: string[];
  configuration: any;
}

export function createWorkflowModuleCommands() {
  const command = new Command('workflow');

  // List available workflow modules
  command
    .command('list')
    .description('List available workflow modules')
    .option('-t, --tag <tag>', 'Filter by tag')
    .option('-d, --details', 'Show detailed information')
    .action(async (options) => {
      try {
        const modules = await listWorkflowModules(options.tag);
        displayModules(modules, options.details);
      } catch (error) {
        console.error(chalk.red('Error listing workflows:'), error);
      }
    });

  // Show workflow module details
  command
    .command('show <module>')
    .description('Show details of a workflow module')
    .action(async (moduleName) => {
      try {
        const moduleDetails = await getModuleDetails(moduleName);
        displayModuleDetails(moduleDetails);
      } catch (error) {
        console.error(chalk.red('Error showing workflow:'), error);
      }
    });

  // Compose workflow modules
  command
    .command('compose')
    .description('Compose workflow modules into config')
    .option('-i, --interactive', 'Interactive module selection')
    .option('-o, --output <file>', 'Output file', 'config.yaml')
    .argument('[modules...]', 'List of modules to compose')
    .action(async (modules, options) => {
      try {
        const selectedModules = options.interactive
          ? await selectModulesInteractively()
          : modules;

        const config = await composeWorkflow(selectedModules);
        await saveComposedWorkflow(config, options.output);
      } catch (error) {
        console.error(chalk.red('Error composing workflow:'), error);
      }
    });

  return command;
}

async function listWorkflowModules(tag?: string): Promise<WorkflowModule[]> {
  const workflowsDir = path.join(process.cwd(), 'templates/workflows');
  const modules: WorkflowModule[] = [];

  // Recursively find all .yaml files
  function findYamlFiles(dir: string) {
    const files = fs.readdirSync(dir);
    
    for (const file of files) {
      const fullPath = path.join(dir, file);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        findYamlFiles(fullPath);
      } else if (file.endsWith('.yaml')) {
        const content = fs.readFileSync(fullPath, 'utf8');
        const module = yaml.parse(content);
        
        // Only include if it matches tag filter
        if (!tag || module.tags?.includes(tag)) {
          modules.push({
            name: path.relative(workflowsDir, fullPath).replace('.yaml', ''),
            ...module
          });
        }
      }
    }
  }

  findYamlFiles(workflowsDir);
  return modules;
}

async function getModuleDetails(moduleName: string): Promise<WorkflowModule> {
  const modulePath = path.join(process.cwd(), 'templates/workflows', `${moduleName}.yaml`);
  
  if (!fs.existsSync(modulePath)) {
    throw new Error(`Module '${moduleName}' not found`);
  }

  const content = fs.readFileSync(modulePath, 'utf8');
  return {
    name: moduleName,
    ...yaml.parse(content)
  };
}

function displayModules(modules: WorkflowModule[], detailed: boolean) {
  console.log(chalk.blue('\n📦 Available Workflow Modules\n'));

  modules.forEach(module => {
    console.log(chalk.yellow(`${module.name}`));
    console.log(chalk.gray(`  ${module.description}`));

    if (detailed) {
      if (module.tags) {
        console.log(chalk.cyan('  Tags:'), module.tags.join(', '));
      }
      if (module.dependencies) {
        console.log(chalk.cyan('  Dependencies:'), module.dependencies.join(', '));
      }
      console.log();
    }
  });
}

function displayModuleDetails(module: WorkflowModule) {
  console.log(chalk.blue(`\n📦 ${module.name}\n`));
  console.log(chalk.white(module.description));
  
  if (module.tags) {
    console.log(chalk.cyan('\nTags:'));
    module.tags.forEach(tag => console.log(`  • ${tag}`));
  }

  if (module.dependencies) {
    console.log(chalk.cyan('\nDependencies:'));
    module.dependencies.forEach(dep => console.log(`  • ${dep}`));
  }

  console.log(chalk.cyan('\nConfiguration:'));
  console.log(yaml.stringify(module.configuration));
}

async function selectModulesInteractively(): Promise<string[]> {
  const modules = await listWorkflowModules();
  
  const { selected } = await prompt({
    type: 'checkbox',
    name: 'selected',
    message: 'Select workflow modules to include:',
    choices: modules.map(m => ({
      name: `${m.name} - ${m.description}`,
      value: m.name,
      checked: m.tags?.includes('core')
    }))
  });

  return selected;
}

async function composeWorkflow(moduleNames: string[]): Promise<any> {
  const config: any = {
    workflows: {
      include: moduleNames
    }
  };

  // Load and merge each module's configuration
  for (const moduleName of moduleNames) {
    const module = await getModuleDetails(moduleName);
    Object.assign(config, module.configuration);
  }

  return config;
}

async function saveComposedWorkflow(config: any, outputFile: string) {
  const outputPath = path.join(process.cwd(), outputFile);
  fs.writeFileSync(outputPath, yaml.stringify(config));
  console.log(chalk.green(`\n✨ Workflow configuration saved to ${outputFile}\n`));
}
