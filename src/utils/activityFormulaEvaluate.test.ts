import { describe, expect, it } from 'vitest';
import {
  collectFormulaOutputBindings,
  evaluateActivityFormula,
  extractFormulaParamCodes,
  isFormulaOutputComponent,
  sortFormulaBindingsTopologically,
} from './activityFormulaEvaluate';

describe('activityFormulaEvaluate', () => {
  it('extracts bracket and bare param codes', () => {
    const codes = extractFormulaParamCodes('[A]+B*2', new Set(['A', 'B']));
    expect(codes).toContain('A');
    expect(codes).toContain('B');
  });

  it('evaluates simple addition', () => {
    const result = evaluateActivityFormula('[A]+1', { A: '10' });
    expect(result).toEqual({ ok: true, value: '11', numeric: 11 });
  });

  it('returns missing_param when dependency empty', () => {
    const result = evaluateActivityFormula('[A]+1', { A: '' });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.reason).toBe('missing_param');
  });

  it('supports sum and size', () => {
    const sumResult = evaluateActivityFormula('sum([A],[B],[C])', { A: '1', B: '2', C: '3' });
    expect(sumResult).toMatchObject({ ok: true, value: '6' });
    const sizeResult = evaluateActivityFormula('size([A],[B])', { A: '1', B: '' });
    expect(sizeResult).toMatchObject({ ok: true, value: '1' });
  });

  it('detects formula output component', () => {
    expect(
      isFormulaOutputComponent({
        ioType: 'OUTPUT',
        validateRule: { formula: { mode: 'FORMULA', expression: '[A]+1' } },
      }),
    ).toBe(true);
    expect(
      isFormulaOutputComponent({
        ioType: 'INPUT',
        validateRule: { formula: { mode: 'FORMULA', expression: '[A]+1' } },
      }),
    ).toBe(false);
  });

  it('sorts chained formula outputs', () => {
    const bindings = collectFormulaOutputBindings(
      [
        { id: '2', paramCode: 'B', ioType: 'OUTPUT', validateRule: { formula: { expression: '[A]+1' } } },
        { id: '3', paramCode: 'C', ioType: 'OUTPUT', validateRule: { formula: { expression: '[B]+1' } } },
      ],
      (item, index) => String(item.id ?? index),
    );
    const { sorted } = sortFormulaBindingsTopologically(bindings);
    expect(sorted.map(b => b.paramCode)).toEqual(['B', 'C']);
  });
});
