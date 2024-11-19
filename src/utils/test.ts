import { loadAIContext } from './context';
import { spawnSync } from 'child_process';
import { getProjectConfig } from './config';
import fs from 'fs';
import path from 'path';
import { join } from 'path';
import { loadYamlFile } from './yaml';

interface TestOptions {
  files?: string;
  update?: boolean;
  watch?: boolean;
  coverage?: boolean;
  analyze?: boolean;
}

interface TestResult {
  passed: boolean;
  coverage?: {
    statements: number;
    branches: number;
    functions: number;
    lines: number;
  };
  duration: number;
  suites: number;
  tests: number;
  failures: number;
}

interface TestConfig {
  name: string;
  description?: string;
  tests: {
    name: string;
    description?: string;
    steps: {
      name: string;
      command?: string;
      expected?: {
        stdout?: string;
        stderr?: string;
        exitCode?: number;
      };
    }[];
  }[];
}

export async function runTests(options: TestOptions) {
  // Load AI context for test analysis
  await loadAIContext();
  
  // Get project config for test settings
  const config = await getProjectConfig();
  if (!config) {
    throw new Error('Project configuration not found');
  }
  const testCommand = config.test?.command || 'jest';
  
  const args: string[] = [];
  
  // Add files pattern if specified
  if (options.files) {
    args.push(options.files);
  }
  
  // Add update snapshot flag
  if (options.update) {
    args.push('--updateSnapshot');
  }
  
  // Add watch mode
  if (options.watch) {
    args.push('--watch');
  }

  // Add coverage collection
  if (options.coverage) {
    args.push('--coverage');
    args.push('--coverageDirectory=.ai/coverage');
  }

  // Add json reporter for analysis
  if (options.analyze) {
    args.push('--json');
    args.push('--outputFile=.ai/test-results.json');
  }
  
  console.log(`🧪 Running tests with ${testCommand}...`);
  
  // Run test command
  const result = spawnSync(testCommand, args, {
    stdio: 'inherit',
    shell: true
  });
  
  if (result.status !== 0) {
    throw new Error(`Tests failed with exit code ${result.status}`);
  }

  // Perform AI analysis if requested
  if (options.analyze) {
    await analyzeTestResults();
  }
}

async function analyzeTestResults() {
  console.log('\n📊 AI Analysis of Test Results\n');

  // Load test results
  const resultsPath = path.join(process.cwd(), '.ai/test-results.json');
  const coveragePath = path.join(process.cwd(), '.ai/coverage/coverage-final.json');
  
  if (!fs.existsSync(resultsPath)) {
    console.log('No test results found for analysis');
    return;
  }

  const results: TestResult = JSON.parse(fs.readFileSync(resultsPath, 'utf8'));
  let coverage;
  
  if (fs.existsSync(coveragePath)) {
    coverage = JSON.parse(fs.readFileSync(coveragePath, 'utf8'));
  }

  // Analyze results
  console.log('Test Overview:');
  console.log(`- Total Suites: ${results.suites}`);
  console.log(`- Total Tests: ${results.tests}`);
  console.log(`- Failures: ${results.failures}`);
  console.log(`- Duration: ${results.duration}ms`);

  if (coverage) {
    console.log('\nCoverage Analysis:');
    console.log(`- Statements: ${coverage.statements.pct}%`);
    console.log(`- Branches: ${coverage.branches.pct}%`);
    console.log(`- Functions: ${coverage.functions.pct}%`);
    console.log(`- Lines: ${coverage.lines.pct}%`);

    // Coverage recommendations
    if (coverage.statements.pct < 80) {
      console.log('\n⚠️ Coverage Recommendations:');
      console.log('- Consider adding more test cases');
      console.log('- Focus on untested code paths');
      console.log('- Add integration tests');
    }
  }

  // Performance analysis
  if (results.duration > 5000) {
    console.log('\n⚡ Performance Insights:');
    console.log('- Tests are taking longer than recommended');
    console.log('- Consider splitting into smaller suites');
    console.log('- Look for slow running tests');
  }

  // TODO: Add more advanced AI analysis
  // - Pattern recognition in failures
  // - Test quality assessment
  // - Suggestions for new test cases
  // - Integration test coverage
}

export async function loadTestConfig(testPath: string): Promise<TestConfig> {
  const configPath = join(testPath, 'test.yaml');
  const defaultConfig: TestConfig = {
    name: 'Default Test Suite',
    tests: []
  };

  return loadYamlFile(configPath, defaultConfig);
}

export async function runTest(test: TestConfig['tests'][0]): Promise<boolean> {
  console.log(`\nRunning test: ${test.name}`);
  if (test.description) {
    console.log(test.description);
  }

  for (const step of test.steps) {
    console.log(`\nStep: ${step.name}`);
    if (step.command) {
      // TODO: Implement test command execution
      console.log(`Command: ${step.command}`);
    }
  }

  return true;
}
