export type OperationType =
  | 'add'
  | 'subtract'
  | 'multiply'
  | 'divide'
  | 'power'
  | 'modulo'
  | 'percent';

export type UnaryOperationType =
  | 'square'
  | 'sqrt'
  | 'factorial'
  | 'sin'
  | 'cos'
  | 'tan'
  | 'log10'
  | 'ln';

export type ConstantType = 'pi' | 'e';

export interface CalculationRecord {
  id: string;
  timestamp: Date;
  operandA: number;
  operandB: number | null;
  operation: OperationType | UnaryOperationType;
  operatorSymbol: string;
  result: number | null;
  error?: string;
  pythonSnippet: string;
  expression: string;
}
