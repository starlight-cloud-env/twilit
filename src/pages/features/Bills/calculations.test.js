import { describe, it, expect } from 'vitest'
import {
  calculateTaxMultiplier,
  calculatePersonTotal,
  calculateItemizedGrandTotal,
  calculateEvenSplitGrandTotal,
  calculateEvenSplitPerPerson,
} from './calculations.js'

describe('calculateTaxMultiplier', () => {
  it('returns 1 for 0% tax', () => {
    expect(calculateTaxMultiplier(0)).toBe(1)
  })

  it('correctly converts a realistic decimal tax rate', () => {
    expect(calculateTaxMultiplier(8.25)).toBeCloseTo(1.0825, 10)
  })

  it('handles 100% tax as doubling', () => {
    expect(calculateTaxMultiplier(100)).toBe(2)
  })
})

describe('calculatePersonTotal', () => {
  it('applies the tax multiplier to a subtotal', () => {
    expect(calculatePersonTotal(20, 1.08)).toBeCloseTo(21.6, 10)
  })

  it('returns 0 for a 0 subtotal regardless of tax', () => {
    expect(calculatePersonTotal(0, 1.5)).toBe(0)
  })
})

describe('calculateItemizedGrandTotal', () => {
  it('sums each person\'s taxed total', () => {
    const people = [{ subtotal: 20 }, { subtotal: 30 }, { subtotal: 10 }]
    const taxMultiplier = calculateTaxMultiplier(10) // 1.1
    // (20 + 30 + 10) * 1.1 = 66
    expect(calculateItemizedGrandTotal(people, taxMultiplier)).toBeCloseTo(66, 10)
  })

  it('returns 0 for an empty list of people', () => {
    expect(calculateItemizedGrandTotal([], 1.1)).toBe(0)
  })

  it('handles a single person correctly', () => {
    const people = [{ subtotal: 15.5 }]
    expect(calculateItemizedGrandTotal(people, 1)).toBeCloseTo(15.5, 10)
  })
})

describe('calculateEvenSplitGrandTotal', () => {
  it('applies tax to the pre-tax total', () => {
    const taxMultiplier = calculateTaxMultiplier(8) // 1.08
    expect(calculateEvenSplitGrandTotal(100, taxMultiplier)).toBeCloseTo(108, 10)
  })

  it('treats a null pre-tax total as 0 rather than throwing', () => {
    expect(calculateEvenSplitGrandTotal(null, 1.1)).toBe(0)
  })

  it('treats an undefined pre-tax total as 0 rather than throwing', () => {
    expect(calculateEvenSplitGrandTotal(undefined, 1.1)).toBe(0)
  })
})

describe('calculateEvenSplitPerPerson', () => {
  it('divides the grand total evenly across people', () => {
    expect(calculateEvenSplitPerPerson(100, 4)).toBe(25)
  })

  it('guards against division by zero when people count is 0', () => {
    expect(calculateEvenSplitPerPerson(100, 0)).toBe(0)
  })

  it('guards against a negative people count', () => {
    expect(calculateEvenSplitPerPerson(100, -1)).toBe(0)
  })

  it('handles an uneven split without throwing (real-world rounding is a display concern)', () => {
    expect(calculateEvenSplitPerPerson(100, 3)).toBeCloseTo(33.333333, 5)
  })
})