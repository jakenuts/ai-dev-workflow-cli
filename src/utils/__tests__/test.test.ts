import { jest } from '@jest/globals';
import type { MockedFunction } from 'jest-mock';
import { runTests, loadTestConfig, runTest } from '../test.js';
import type { TestConfig, TestOptions } from '../test.js';
import * as configModule from '../config.js';
import * as yamlModule from '../yaml.js';
import type { YAMLContent } from '../../types/yaml.js';

jest.mock('../config.js');
jest.mock('../yaml.js');

const mockedLoadYamlFile = yamlModule.loadYamlFile as MockedFunction<typeof yamlModule.loadYamlFile>;
const mockedGetProjectConfig = configModule.getProjectConfig as MockedFunction<typeof configModule.getProjectConfig>;

describe('Test Utilities', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('runTests', () => {
    it('should run tests with default options', async () => {
      const mockConfig = {
        test: {
          command: 'jest'
        }
      };

      mockedGetProjectConfig.mockResolvedValue(mockConfig as any);

      await runTests();
    });

    it('should handle missing config', async () => {
      mockedGetProjectConfig.mockResolvedValue(null);

      await expect(runTests()).rejects.toThrow('Project configuration not found');
    });

    it('should handle test options', async () => {
      const mockConfig = {
        test: {
          command: 'jest'
        }
      };

      mockedGetProjectConfig.mockResolvedValue(mockConfig as any);

      const options: TestOptions = {
        files: 'test.ts',
        update: true,
        watch: true,
        coverage: true,
        analyze: true
      };

      await runTests(options);
    });
  });

  describe('loadTestConfig', () => {
    it('should load test configuration', async () => {
      const mockConfig: TestConfig = {
        name: 'Test Suite',
        tests: []
      };

      mockedLoadYamlFile.mockImplementation(<T extends YAMLContent>(path: string, defaultConfig: T | null = null) => 
        Promise.resolve(defaultConfig as T)
      );

      const result = await loadTestConfig('test.yaml');
      expect(result).toBeDefined();
      expect(result.name).toBe('Default Test Suite');
    });
  });

  describe('runTest', () => {
    it('should run a test', async () => {
      const test = {
        name: 'Test Case',
        description: 'Test Description',
        steps: [
          {
            name: 'Step 1',
            command: 'test command'
          }
        ]
      };

      const result = await runTest(test);
      expect(result).toBe(true);
    });

    it('should run a test without description', async () => {
      const test = {
        name: 'Test Case',
        steps: [
          {
            name: 'Step 1'
          }
        ]
      };

      const result = await runTest(test);
      expect(result).toBe(true);
    });
  });
});
