import { join } from 'path';
import { loadYamlFile, saveYamlFile } from './yaml';
import { loadConfig, ProjectConfig } from './config';
import chalk from 'chalk';

export interface AIContext {
  config: ProjectConfig | null;
  workflow: {
    currentStep?: string;
    history: {
      step: string;
      timestamp: string;
      status: 'completed' | 'failed' | 'skipped';
      notes?: string;
    }[];
  };
  memory: {
    [key: string]: any;
  };
}

const CONTEXT_PATH = join(process.cwd(), '.ai', 'context.yaml');

export async function loadAIContext(): Promise<AIContext> {
  const config = await loadConfig();
  const defaultContext: AIContext = {
    config,
    workflow: {
      history: []
    },
    memory: {}
  };

  return loadYamlFile(CONTEXT_PATH, defaultContext);
}

export async function saveAIContext(context: AIContext): Promise<void> {
  await saveYamlFile(CONTEXT_PATH, context);
}

export async function updateAIContext(updates: Partial<AIContext>): Promise<void> {
  const context = await loadAIContext();
  const updatedContext = { ...context, ...updates };
  await saveAIContext(updatedContext);
}

export async function clearAIContext(): Promise<void> {
  const config = await loadConfig();
  const newContext: AIContext = {
    config,
    workflow: {
      history: []
    },
    memory: {}
  };
  await saveAIContext(newContext);
}

export async function addWorkflowStep(
  step: string,
  status: 'completed' | 'failed' | 'skipped',
  notes?: string
): Promise<void> {
  const context = await loadAIContext();
  context.workflow.history.push({
    step,
    timestamp: new Date().toISOString(),
    status,
    notes
  });
  context.workflow.currentStep = step;
  await saveAIContext(context);
}

export async function getWorkflowHistory(): Promise<AIContext['workflow']['history']> {
  const context = await loadAIContext();
  return context.workflow.history;
}

export async function getCurrentStep(): Promise<string | undefined> {
  const context = await loadAIContext();
  return context.workflow.currentStep;
}

export function formatWorkflowHistory(history: AIContext['workflow']['history']): string {
  if (history.length === 0) {
    return chalk.yellow('No workflow steps recorded yet.');
  }

  return history.map(entry => {
    const timestamp = new Date(entry.timestamp).toLocaleString();
    const status = entry.status === 'completed' 
      ? chalk.green('✓') 
      : entry.status === 'failed'
        ? chalk.red('✗') 
        : chalk.yellow('⚠');

    let line = `${status} ${entry.step} (${timestamp})`;
    if (entry.notes) {
      line += `\n   ${chalk.gray(entry.notes)}`;
    }
    return line;
  }).join('\n');
}
