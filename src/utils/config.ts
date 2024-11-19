import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { parse, stringify } from 'yaml';

export interface ProjectConfig {
  project: {
    name: string;
    type: string;
    description: string;
  };
  name: string;
  development_workflow: Record<string, unknown>;
  test?: {
    command: string;
  };
}

/**
 * Load the project configuration from the .ai/config.yaml file
 * @returns The project configuration or null if not found
 */
export async function loadConfig(): Promise<ProjectConfig | null> {
  const configPath = join('.ai', 'config.yaml');
  if (!existsSync(configPath)) {
    return null;
  }

  try {
    const content = readFileSync(configPath, 'utf8');
    return parse(content);
  } catch (error) {
    return null;
  }
}

/**
 * Get the project configuration
 * @returns The project configuration or null if not found
 */
export async function getProjectConfig(): Promise<ProjectConfig | null> {
  return loadConfig();
}

/**
 * Sync the project configuration with a template
 * @param templatePath Path to the template file
 */
export async function syncConfigWithTemplate(templatePath: string): Promise<void> {
  if (!existsSync(templatePath)) {
    throw new Error(`Template not found: ${templatePath}`);
  }

  try {
    const content = readFileSync(templatePath, 'utf8');
    const template = parse(content);

    const configDir = dirname(join('.ai', 'config.yaml'));
    mkdirSync(configDir, { recursive: true });

    writeFileSync(
      join('.ai', 'config.yaml'),
      stringify(template),
      'utf8'
    );
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Failed to sync config with template');
  }
}
