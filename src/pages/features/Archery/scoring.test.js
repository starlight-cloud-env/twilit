import { describe, it, expect } from 'vitest'
import { countNinesAndTens } from './scoring.js'

describe('countNinesAndTens', () => {
  it('counts 9s and 10s separately', () => {
    expect(countNinesAndTens([9, 10, 9, 8, 10, 10])).toEqual({ nines: 2, tens: 3 })
  })

  it('returns zeros for an empty list', () => {
    expect(countNinesAndTens([])).toEqual({ nines: 0, tens: 0 })
  })

  it('ignores scores below 9', () => {
    expect(countNinesAndTens([0, 1, 5, 7, 8])).toEqual({ nines: 0, tens: 0 })
  })

  it('counts an all-tens end correctly', () => {
    expect(countNinesAndTens([10, 10, 10])).toEqual({ nines: 0, tens: 3 })
  })
})