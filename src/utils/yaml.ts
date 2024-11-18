import { readFile, writeFile, mkdir } from 'fs/promises';
import { dirname } from 'path';
import yaml from 'js-yaml';

export async function loadYamlFile(filePath: string, defaultContent: any = null): Promise<any> {
  try {
    const content = await readFile(filePath, 'utf8');
    return yaml.load(content) || defaultContent;
  } catch (error: any) {
    if (error.code === 'ENOENT' && defaultContent !== null) {
      await saveYamlFile(filePath, defaultContent);
      return defaultContent;
    }
    throw error;
  }
}

export async function saveYamlFile(filePath: string, content: any): Promise<void> {
  const yamlContent = yaml.dump(content, {
    indent: 2,
    lineWidth: -1,
    noRefs: true,
    sortKeys: true
  });

  await mkdir(dirname(filePath), { recursive: true });
  await writeFile(filePath, yamlContent, 'utf8');
}

export function mergeYamlFiles(base: any, overlay: any): any {
  if (!base || typeof base !== 'object') return overlay;
  if (!overlay || typeof overlay !== 'object') return base;

  const merged = { ...base };

  for (const [key, value] of Object.entries(overlay)) {
    if (value === null || value === undefined) {
      delete merged[key];
    } else if (Array.isArray(value)) {
      merged[key] = Array.isArray(merged[key])
        ? [...merged[key], ...value]
        : [...value];
    } else if (typeof value === 'object') {
      merged[key] = mergeYamlFiles(merged[key], value);
    } else {
      merged[key] = value;
    }
  }

  return merged;
}
