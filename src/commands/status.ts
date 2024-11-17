import { Command } from 'commander';
import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'yaml';
import { loadConfig } from '../utils/config';

export class StatusCommand {
  static register(program: Command): void {
    program
      .command('status')
      .description('Show project status, configuration, and next steps')
      .option('-f, --full', 'Show full project status including TODO items')
      .action(async (options) => {
        await StatusCommand.handleStatus(options);
      });
  }

  private static async handleStatus(options: any): Promise<void> {
    console.log('🔍 AI Dev Workflow Status\n');

    // Load and display config
    const config = loadConfig();
    console.log('Project Configuration:');
    console.log(`- Name: ${config.project.name}`);
    console.log(`- Type: ${config.project.type}`);
    console.log(`- Description: ${config.project.description}`);
    console.log();

    // Load and display current context
    const context = await StatusCommand.getCurrentContext();
    console.log('Current Context:');
    console.log(`- Active Branch: ${context.branch}`);
    console.log(`- Last Commit: ${context.lastCommit}`);
    console.log(`- Modified Files: ${context.modifiedFiles.length}`);
    console.log();

    // Show next steps from TODO
    const todos = await StatusCommand.getNextTodos();
    console.log('Next Steps:');
    todos.forEach((todo, index) => {
      if (index < 3) console.log(`${index + 1}. ${todo}`);
    });
    console.log();

    if (options.full) {
      // Show full TODO list
      const todoContent = await StatusCommand.getFullTodo();
      console.log('Full TODO List:');
      console.log(todoContent);
    }

    // Show helpful commands
    console.log('Helpful Commands:');
    console.log('- ai-dev story create    # Create new story');
    console.log('- ai-dev implement       # Get implementation guidance');
    console.log('- ai-dev review          # Review code changes');
    console.log('- ai-dev status --full   # Show full status');
    console.log();

    console.log('💡 Tip: Run "ai-dev status --full" to see the complete TODO list');
  }

  private static async getCurrentContext(): Promise<any> {
    try {
      const { execSync } = require('child_process');
      const branch = execSync('git branch --show-current', { encoding: 'utf8' }).trim();
      const lastCommit = execSync('git log -1 --oneline', { encoding: 'utf8' }).trim();
      const modifiedFiles = execSync('git status --porcelain', { encoding: 'utf8' })
        .split('\n')
        .filter(Boolean);

      return { branch, lastCommit, modifiedFiles };
    } catch (error) {
      return { branch: 'N/A', lastCommit: 'N/A', modifiedFiles: [] };
    }
  }

  private static async getNextTodos(): Promise<string[]> {
    try {
      const todoPath = path.join(process.cwd(), 'TODO.md');
      if (!fs.existsSync(todoPath)) return [];

      const content = fs.readFileSync(todoPath, 'utf8');
      const nextUpSection = content.split('## Next Up 🎯')[1]?.split('##')[0] || '';
      
      return nextUpSection
        .split('\n')
        .filter(line => line.includes('[ ]'))
        .map(line => line.replace(/^.*\[ \]/, '').trim())
        .filter(Boolean);
    } catch (error) {
      return [];
    }
  }

  private static async getFullTodo(): Promise<string> {
    try {
      const todoPath = path.join(process.cwd(), 'TODO.md');
      return fs.existsSync(todoPath) ? fs.readFileSync(todoPath, 'utf8') : 'No TODO.md found';
    } catch (error) {
      return 'Error reading TODO.md';
    }
  }
}
