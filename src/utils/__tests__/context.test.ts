import { jest } from '@jest/globals';
import * as yaml from '../yaml';
import * as config from '../config';
import {
  loadAIContext,
  saveAIContext,
  updateAIContext,
  clearAIContext,
  addWorkflowStep,
  getWorkflowHistory,
  getCurrentStep,
  formatWorkflowHistory,
  AIContext
} from '../context';

// Mock dependencies
jest.mock('../yaml');
jest.mock('../config');
jest.mock('chalk', () => ({
  yellow: jest.fn((str) => `[yellow]${str}[/yellow]`),
  green: jest.fn((str) => `[green]${str}[/green]`),
  red: jest.fn((str) => `[red]${str}[/red]`),
  gray: jest.fn((str) => `[gray]${str}[/gray]`)
}));

const mockedYaml = jest.mocked(yaml);
const mockedConfig = jest.mocked(config);

describe('AI Context Utilities', () => {
  const mockConfig = {
    project: {
      name: 'test-project',
      type: 'test',
      description: 'Test Project'
    },
    name: 'test',
    development_workflow: {}
  };

  const defaultContext: AIContext = {
    config: mockConfig,
    workflow: {
      history: []
    },
    memory: {}
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockedConfig.loadConfig.mockResolvedValue(mockConfig);
  });

  describe('loadAIContext', () => {
    it('should load context with config', async () => {
      mockedYaml.loadYamlFile.mockResolvedValue(defaultContext);

      const result = await loadAIContext();

      expect(result).toEqual(defaultContext);
      expect(mockedConfig.loadConfig).toHaveBeenCalled();
      expect(mockedYaml.loadYamlFile).toHaveBeenCalled();
    });
  });

  describe('saveAIContext', () => {
    it('should save context to file', async () => {
      await saveAIContext(defaultContext);

      expect(mockedYaml.saveYamlFile).toHaveBeenCalledWith(
        expect.any(String),
        defaultContext
      );
    });
  });

  describe('updateAIContext', () => {
    it('should update existing context', async () => {
      const updates = {
        currentStep: 'new-step',
        memory: { key: 'value' }
      };

      mockedYaml.loadYamlFile.mockResolvedValue(defaultContext);

      await updateAIContext(updates);

      expect(mockedYaml.saveYamlFile).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          ...defaultContext,
          ...updates
        })
      );
    });
  });

  describe('clearAIContext', () => {
    it('should reset context to default state', async () => {
      await clearAIContext();

      expect(mockedYaml.saveYamlFile).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          config: mockConfig,
          workflow: { history: [] },
          memory: {}
        })
      );
    });
  });

  describe('addWorkflowStep', () => {
    it('should add step to workflow history', async () => {
      mockedYaml.loadYamlFile.mockResolvedValue(defaultContext);

      await addWorkflowStep('test-step', 'completed', 'test note');

      expect(mockedYaml.saveYamlFile).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          workflow: {
            currentStep: 'test-step',
            history: [
              expect.objectContaining({
                step: 'test-step',
                status: 'completed',
                notes: 'test note'
              })
            ]
          }
        })
      );
    });
  });

  describe('getWorkflowHistory', () => {
    it('should return workflow history', async () => {
      const contextWithHistory = {
        ...defaultContext,
        workflow: {
          history: [
            {
              step: 'test-step',
              timestamp: new Date().toISOString(),
              status: 'completed',
              notes: 'test note'
            }
          ]
        }
      };

      mockedYaml.loadYamlFile.mockResolvedValue(contextWithHistory);

      const result = await getWorkflowHistory();

      expect(result).toEqual(contextWithHistory.workflow.history);
    });
  });

  describe('getCurrentStep', () => {
    it('should return current step', async () => {
      const contextWithStep = {
        ...defaultContext,
        workflow: {
          currentStep: 'current-step',
          history: []
        }
      };

      mockedYaml.loadYamlFile.mockResolvedValue(contextWithStep);

      const result = await getCurrentStep();

      expect(result).toBe('current-step');
    });
  });

  describe('formatWorkflowHistory', () => {
    it('should format empty history', () => {
      const result = formatWorkflowHistory([]);

      expect(result).toBe('[yellow]No workflow steps recorded yet.[/yellow]');
    });

    it('should format history entries', () => {
      const history = [
        {
          step: 'test-step',
          timestamp: '2023-01-01T00:00:00.000Z',
          status: 'completed' as const,
          notes: 'test note'
        }
      ];

      const result = formatWorkflowHistory(history);

      expect(result).toContain('[green]✓[/green]');
      expect(result).toContain('test-step');
      expect(result).toContain('[gray]test note[/gray]');
    });

    it('should handle different status types', () => {
      const history = [
        {
          step: 'completed-step',
          timestamp: '2023-01-01T00:00:00.000Z',
          status: 'completed' as const
        },
        {
          step: 'failed-step',
          timestamp: '2023-01-01T00:00:00.000Z',
          status: 'failed' as const
        },
        {
          step: 'skipped-step',
          timestamp: '2023-01-01T00:00:00.000Z',
          status: 'skipped' as const
        }
      ];

      const result = formatWorkflowHistory(history);

      expect(result).toContain('[green]✓[/green]');
      expect(result).toContain('[red]✗[/red]');
      expect(result).toContain('[yellow]⚠[/yellow]');
    });
  });
});
