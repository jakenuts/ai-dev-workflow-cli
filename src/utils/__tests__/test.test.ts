import { jest } from '@jest/globals';
import { runTests, loadTestConfig, runTest } from '../test';
import * as childProcess from 'child_process';
import * as fs from 'fs';
import path from 'path';
import type { ProjectConfig } from '../config';
import type { AIContext } from '../context';

// Mock dependencies
jest.mock('child_process');
jest.mock('fs');
jest.mock('../context');

// Create mock implementation for getProjectConfig
const mockGetProjectConfig = jest.fn<() => Promise<ProjectConfig>>();
mockGetProjectConfig.mockResolvedValue({
  project: {
    name: 'test-project',
    type: 'test',
    description: 'Test Project'
  },
  name: 'test',
  development_workflow: {},
  test: { command: 'jest' }
});

// Mock config module
jest.mock('../config', () => ({
  getProjectConfig: mockGetProjectConfig
}));

jest.mock('../yaml', () => ({
  loadYamlFile: jest.fn().mockImplementation((_, defaultConfig) => Promise.resolve(defaultConfig))
}));

// Mock chalk
jest.mock('chalk', () => ({
  yellow: jest.fn((str) => `[yellow]${str}[/yellow]`),
  green: jest.fn((str) => `[green]${str}[/green]`),
  red: jest.fn((str) => `[red]${str}[/red]`),
  gray: jest.fn((str) => `[gray]${str}[/gray]`)
}));

describe('Test Utilities', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('runTests', () => {
    it('should run tests with default options', async () => {
      const mockSpawnSync = jest.spyOn(childProcess, 'spawnSync').mockReturnValue({
        status: 0,
        stdout: Buffer.from(''),
        stderr: Buffer.from(''),
        pid: 123,
        output: [],
        signal: null
      });

      await runTests({});

      expect(mockSpawnSync).toHaveBeenCalledWith(
        'jest',
        [],
        expect.objectContaining({
          stdio: 'inherit',
          shell: true
        })
      );
    });

    it('should add correct args based on options', async () => {
      const mockSpawnSync = jest.spyOn(childProcess, 'spawnSync').mockReturnValue({
        status: 0,
        stdout: Buffer.from(''),
        stderr: Buffer.from(''),
        pid: 123,
        output: [],
        signal: null
      });

      await runTests({
        files: 'test.ts',
        update: true,
        watch: true,
        coverage: true,
        analyze: true
      });

      expect(mockSpawnSync).toHaveBeenCalledWith(
        'jest',
        expect.arrayContaining([
          'test.ts',
          '--updateSnapshot',
          '--watch',
          '--coverage',
          '--coverageDirectory=.ai/coverage',
          '--json',
          '--outputFile=.ai/test-results.json'
        ]),
        expect.any(Object)
      );
    });

    it('should throw error when tests fail', async () => {
      jest.spyOn(childProcess, 'spawnSync').mockReturnValue({
        status: 1,
        stdout: Buffer.from(''),
        stderr: Buffer.from(''),
        pid: 123,
        output: [],
        signal: null
      });

      await expect(runTests({})).rejects.toThrow('Tests failed with exit code 1');
    });

    it('should analyze test results when requested', async () => {
      const mockSpawnSync = jest.spyOn(childProcess, 'spawnSync').mockReturnValue({
        status: 0,
        stdout: Buffer.from(''),
        stderr: Buffer.from(''),
        pid: 123,
        output: [],
        signal: null
      });

      const mockResults = {
        suites: 5,
        tests: 10,
        failures: 0,
        duration: 1000,
        coverage: {
          statements: { pct: 90 },
          branches: { pct: 85 },
          functions: { pct: 95 },
          lines: { pct: 92 }
        }
      };

      jest.spyOn(fs, 'existsSync').mockReturnValue(true);
      jest.spyOn(fs, 'readFileSync').mockReturnValue(JSON.stringify(mockResults));

      await runTests({ analyze: true });

      expect(mockSpawnSync).toHaveBeenCalledWith(
        'jest',
        expect.arrayContaining(['--json', '--outputFile=.ai/test-results.json']),
        expect.any(Object)
      );
    });

    it('should handle missing test results file', async () => {
      const mockSpawnSync = jest.spyOn(childProcess, 'spawnSync').mockReturnValue({
        status: 0,
        stdout: Buffer.from(''),
        stderr: Buffer.from(''),
        pid: 123,
        output: [],
        signal: null
      });

      jest.spyOn(fs, 'existsSync').mockReturnValue(false);

      await runTests({ analyze: true });

      expect(mockSpawnSync).toHaveBeenCalledWith(
        'jest',
        expect.arrayContaining(['--json', '--outputFile=.ai/test-results.json']),
        expect.any(Object)
      );
    });

    it('should handle slow test performance', async () => {
      const mockSpawnSync = jest.spyOn(childProcess, 'spawnSync').mockReturnValue({
        status: 0,
        stdout: Buffer.from(''),
        stderr: Buffer.from(''),
        pid: 123,
        output: [],
        signal: null
      });

      const mockResults = {
        suites: 5,
        tests: 10,
        failures: 0,
        duration: 6000,
        coverage: {
          statements: { pct: 90 },
          branches: { pct: 85 },
          functions: { pct: 95 },
          lines: { pct: 92 }
        }
      };

      jest.spyOn(fs, 'existsSync').mockReturnValue(true);
      jest.spyOn(fs, 'readFileSync').mockReturnValue(JSON.stringify(mockResults));

      await runTests({ analyze: true });

      expect(mockSpawnSync).toHaveBeenCalledWith(
        'jest',
        expect.arrayContaining(['--json', '--outputFile=.ai/test-results.json']),
        expect.any(Object)
      );
    });
  });

  describe('loadTestConfig', () => {
    it('should return default config when file does not exist', async () => {
      const config = await loadTestConfig('test/path');

      expect(config).toEqual({
        name: 'Default Test Suite',
        tests: []
      });
    });
  });

  describe('runTest', () => {
    it('should run test steps and return true', async () => {
      const mockTest = {
        name: 'Test Suite',
        description: 'Test Description',
        steps: [
          {
            name: 'Step 1',
            command: 'test command'
          }
        ]
      };

      const consoleSpy = jest.spyOn(console, 'log');
      const result = await runTest(mockTest);

      expect(result).toBe(true);
      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Test Suite'));
      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Step 1'));
      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('test command'));
    });

    it('should handle test steps without commands', async () => {
      const mockTest = {
        name: 'Test Suite',
        description: 'Test Description',
        steps: [
          {
            name: 'Step 1'
          }
        ]
      };

      const result = await runTest(mockTest);

      expect(result).toBe(true);
    });
  });
});
