import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'yaml';

export function loadConfig() {
  const configPath = path.join(process.cwd(), '.ai', 'config.yaml');
  
  if (!fs.existsSync(configPath)) {
    return null;
  }

  const configContent = fs.readFileSync(configPath, 'utf8');
  return yaml.parse(configContent);
}
