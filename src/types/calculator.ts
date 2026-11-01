export type OperationType = 'add' | 'subtract' | 'multiply' | 'divide';

export interface CalculationRecord {
  id: string;
  timestamp: Date;
  operandA: number;
  operandB: number;
  operation: OperationType;
  operatorSymbol: string;
  result: number | null;
  error?: string;
  pythonSnippet: string;
  expression: string;
}

export interface UnitTestResult {
  name: string;
  description: string;
  status: 'passed' | 'failed' | 'pending';
  expected: number | string;
  actual: number | string;
  codeSnippet: string;
}

export type ActiveTab = 'calculator' | 'terminal' | 'code' | 'guide' | 'docs';

export type CalculatorTheme = 'dark' | 'idle' | 'classic';
