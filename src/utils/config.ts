import fs from 'fs';
import path from 'path';
import yaml from 'yaml';

interface WorkflowStep {
  type: string;
  status: string;
  title: string;
  description?: string;
  command?: string;
  args?: string[];
  guidelines?: string[];
  files?: string[];
  steps?: string[];
}

interface WorkflowConfig {
  description: string;
  steps: Record<string, WorkflowStep>;
}

export interface ProjectConfig {
  project: {
    name: string;
    type: string;
    description: string;
  };
  name: string;
  description?: string;
  version?: string;
  development_workflow: {
    [key: string]: WorkflowConfig;
  };
  test?: {
    command?: string;
  };
}

export async function loadConfig(): Promise<ProjectConfig | null> {
  const configPath = path.join(process.cwd(), '.ai', 'config.yaml');
  
  if (!fs.existsSync(configPath)) {
    return null;
  }

  const configContent = fs.readFileSync(configPath, 'utf8');
  return yaml.parse(configContent);
}

export async function getProjectConfig(): Promise<ProjectConfig | null> {
  return loadConfig();
}

export async function syncConfigWithTemplate(templatePath: string): Promise<void> {
  const configPath = path.join(process.cwd(), '.ai', 'config.yaml');
  
  if (!fs.existsSync(templatePath)) {
    throw new Error(`Template not found: ${templatePath}`);
  }

  const templateContent = fs.readFileSync(templatePath, 'utf8');
  const template = yaml.parse(templateContent);

  if (!fs.existsSync(path.dirname(configPath))) {
    fs.mkdirSync(path.dirname(configPath), { recursive: true });
  }

  fs.writeFileSync(configPath, yaml.stringify(template));
}
