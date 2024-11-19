import { jest } from '@jest/globals';
import * as fs from 'fs/promises';
import * as yaml from 'js-yaml';
import { loadYamlFile, saveYamlFile, mergeYamlFiles } from '../yaml';

// Mock fs/promises
jest.mock('fs/promises');
const mockedFs = jest.mocked(fs);

// Mock js-yaml
jest.mock('js-yaml');
const mockedYaml = jest.mocked(yaml);

describe('YAML Utilities', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('loadYamlFile', () => {
    it('should load and parse yaml file', async () => {
      const mockContent = 'key: value';
      const mockParsed = { key: 'value' };
      
      mockedFs.readFile.mockResolvedValue(mockContent);
      mockedYaml.load.mockReturnValue(mockParsed);

      const result = await loadYamlFile('test.yaml');
      
      expect(result).toEqual(mockParsed);
      expect(mockedFs.readFile).toHaveBeenCalledWith('test.yaml', 'utf8');
      expect(mockedYaml.load).toHaveBeenCalledWith(mockContent);
    });

    it('should return default content if file does not exist', async () => {
      const defaultContent = { default: true };
      const error = new Error('ENOENT');
      (error as NodeJS.ErrnoException).code = 'ENOENT';
      
      mockedFs.readFile.mockRejectedValue(error);

      const result = await loadYamlFile('test.yaml', defaultContent);
      
      expect(result).toEqual(defaultContent);
      expect(mockedFs.writeFile).toHaveBeenCalled();
    });

    it('should throw error for other file system errors', async () => {
      mockedFs.readFile.mockRejectedValue(new Error('Other error'));

      await expect(loadYamlFile('test.yaml')).rejects.toThrow('Other error');
    });

    it('should return default content if yaml content is null', async () => {
      const defaultContent = { default: true };
      
      mockedFs.readFile.mockResolvedValue('');
      mockedYaml.load.mockReturnValue(null);

      const result = await loadYamlFile('test.yaml', defaultContent);
      
      expect(result).toEqual(defaultContent);
    });
  });

  describe('saveYamlFile', () => {
    it('should save content as yaml', async () => {
      const content = { key: 'value' };
      const yamlString = 'key: value\n';
      
      mockedYaml.dump.mockReturnValue(yamlString);

      await saveYamlFile('test.yaml', content);
      
      expect(mockedFs.mkdir).toHaveBeenCalled();
      expect(mockedYaml.dump).toHaveBeenCalledWith(content, {
        indent: 2,
        lineWidth: -1,
        noRefs: true,
        sortKeys: true
      });
      expect(mockedFs.writeFile).toHaveBeenCalledWith('test.yaml', yamlString, 'utf8');
    });

    it('should create directory if it does not exist', async () => {
      const content = { key: 'value' };
      const yamlString = 'key: value\n';
      
      mockedYaml.dump.mockReturnValue(yamlString);

      await saveYamlFile('dir/test.yaml', content);
      
      expect(mockedFs.mkdir).toHaveBeenCalledWith('dir', { recursive: true });
    });
  });

  describe('mergeYamlFiles', () => {
    it('should merge two objects', () => {
      const base = { a: 1, b: 2 };
      const overlay = { b: 3, c: 4 };
      
      const result = mergeYamlFiles(base, overlay);
      
      expect(result).toEqual({ a: 1, b: 3, c: 4 });
    });

    it('should handle null or undefined values', () => {
      const base = { a: 1, b: 2 };
      const overlay = { b: null, c: undefined };
      
      const result = mergeYamlFiles(base, overlay);
      
      expect(result).toEqual({ a: 1 });
    });

    it('should merge arrays', () => {
      const base = { arr: [1, 2] };
      const overlay = { arr: [3, 4] };
      
      const result = mergeYamlFiles(base, overlay);
      
      expect(result).toEqual({ arr: [1, 2, 3, 4] });
    });

    it('should handle nested objects', () => {
      const base = { nested: { a: 1, b: 2 } };
      const overlay = { nested: { b: 3, c: 4 } };
      
      const result = mergeYamlFiles(base, overlay);
      
      expect(result).toEqual({ nested: { a: 1, b: 3, c: 4 } });
    });

    it('should return overlay if base is not an object', () => {
      const base = null;
      const overlay = { a: 1 };
      
      const result = mergeYamlFiles(base, overlay);
      
      expect(result).toEqual(overlay);
    });

    it('should return base if overlay is not an object', () => {
      const base = { a: 1 };
      const overlay = null;
      
      const result = mergeYamlFiles(base, overlay);
      
      expect(result).toEqual(base);
    });
  });
});
