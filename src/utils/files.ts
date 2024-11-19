import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));


export function copyTemplate(type: string, projectType: string, targetDir: string) {
  const templateDir = path.join(__dirname, '../../templates', type, projectType);
  const targetTypeDir = path.join(targetDir, type);

  if (fs.existsSync(templateDir)) {
    copyDir(templateDir, targetTypeDir);
  }
}

function copyDir(src: string, dest: string) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}
