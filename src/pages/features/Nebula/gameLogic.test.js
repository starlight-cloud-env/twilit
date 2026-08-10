import { describe, it, expect } from 'vitest'
import { slideAndMergeRow, applyMove, isGameOver, highestTier, GRID_SIZE } from './gameLogic.js'

const tile = (tier, id = Math.random().toString(36)) => ({ id, tier, isNew: false, justMerged: false })

describe('slideAndMergeRow', () => {
  it('slides tiles left, compacting gaps with no merges', () => {
    const row = [null, tile(0), null, tile(1)]
    const { row: result, scoreGained, changed } = slideAndMergeRow(row)

    expect(result.map(c => c?.tier ?? null)).toEqual([0, 1, null, null])
    expect(scoreGained).toBe(0)
    expect(changed).toBe(true)
  })

  it('merges two adjacent equal tiles into the next tier', () => {
    const row = [tile(0), tile(0), null, null]
    const { row: result, scoreGained } = slideAndMergeRow(row)

    expect(result[0].tier).toBe(1) // Dust + Dust -> Asteroid
    expect(result[1]).toBeNull()
    expect(scoreGained).toBe(4) // tierValue(1) = 2^(1+1) = 4
  })

  it('does not double-merge three in a row (only the first pair merges)', () => {
    const row = [tile(0), tile(0), tile(0), null]
    const { row: result } = slideAndMergeRow(row)

    // First two merge into tier 1, the third stays tier 0 and slides next to it
    expect(result.map(c => c?.tier ?? null)).toEqual([1, 0, null, null])
  })

  it('merges two separate pairs in the same row', () => {
    const row = [tile(0), tile(0), tile(2), tile(2)]
    const { row: result, scoreGained } = slideAndMergeRow(row)

    expect(result.map(c => c?.tier ?? null)).toEqual([1, 3, null, null])
    expect(scoreGained).toBe(tierValueFor(1) + tierValueFor(3))
  })

  it('reports changed: false when the row is already fully compacted with no merges possible', () => {
    const row = [tile(0), tile(1), tile(0), tile(1)]
    const { changed } = slideAndMergeRow(row)

    expect(changed).toBe(false)
  })

  it('marks merged tiles with justMerged: true and untouched tiles with justMerged: false', () => {
    const row = [tile(3), tile(3), tile(5), null]
    const { row: result } = slideAndMergeRow(row)

    expect(result[0].justMerged).toBe(true)
    expect(result[1].justMerged).toBe(false)
  })
})

describe('applyMove', () => {
  function buildGrid(rows) {
    return rows.map(row => row.map(t => (t === null ? null : tile(t))))
  }

  it('moving left slides every row left independently', () => {
    const grid = buildGrid([
      [null, 0, null, null],
      [null, null, 0, null],
      [null, null, null, null],
      [null, null, null, null],
    ])
    const { grid: result, changed } = applyMove(grid, 'left')

    expect(changed).toBe(true)
    expect(result[0][0].tier).toBe(0)
    expect(result[1][0].tier).toBe(0)
  })

  it('moving right merges tiles toward the right edge', () => {
    const grid = buildGrid([
      [0, 0, null, null],
      [null, null, null, null],
      [null, null, null, null],
      [null, null, null, null],
    ])
    const { grid: result } = applyMove(grid, 'right')

    expect(result[0][GRID_SIZE - 1].tier).toBe(1)
    expect(result[0][GRID_SIZE - 2]).toBeNull()
  })

  it('moving up merges tiles vertically toward the top', () => {
    const grid = buildGrid([
      [null, null, null, null],
      [0, null, null, null],
      [0, null, null, null],
      [null, null, null, null],
    ])
    const { grid: result } = applyMove(grid, 'up')

    expect(result[0][0].tier).toBe(1)
  })

  it('moving down merges tiles vertically toward the bottom', () => {
    const grid = buildGrid([
      [0, null, null, null],
      [0, null, null, null],
      [null, null, null, null],
      [null, null, null, null],
    ])
    const { grid: result } = applyMove(grid, 'down')

    expect(result[GRID_SIZE - 1][0].tier).toBe(1)
  })

  it('reports changed: false when a move would do nothing at all', () => {
    const grid = buildGrid([
      [0, 1, null, null],
      [null, null, null, null],
      [null, null, null, null],
      [null, null, null, null],
    ])
    const { changed } = applyMove(grid, 'left')

    expect(changed).toBe(false)
  })

  it('aggregates score across multiple merges in one move', () => {
    const grid = buildGrid([
      [0, 0, null, null],
      [1, 1, null, null],
      [null, null, null, null],
      [null, null, null, null],
    ])
    const { scoreGained } = applyMove(grid, 'left')

    expect(scoreGained).toBe(tierValueFor(1) + tierValueFor(2))
  })
})

describe('isGameOver', () => {
  it('returns false when there is at least one empty cell', () => {
    const grid = Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(tile(0)))
    grid[0][0] = null
    expect(isGameOver(grid)).toBe(false)
  })

  it('returns false when a full board still has an adjacent horizontal merge available', () => {
    const grid = Array.from({ length: GRID_SIZE }, (_, r) =>
      Array.from({ length: GRID_SIZE }, (_, c) => tile(r * GRID_SIZE + c))
    )
    grid[0][0] = tile(0)
    grid[0][1] = tile(0) // adjacent equal pair
    expect(isGameOver(grid)).toBe(false)
  })

  it('returns true when the board is full with no adjacent equal tiers anywhere', () => {
    // Checkerboard-style pattern guarantees no two orthogonal neighbors match
    const grid = Array.from({ length: GRID_SIZE }, (_, r) =>
      Array.from({ length: GRID_SIZE }, (_, c) => tile((r + c) % 2))
    )
    expect(isGameOver(grid)).toBe(true)
  })
})

describe('highestTier', () => {
  it('returns 0 for an empty grid', () => {
    const grid = Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(null))
    expect(highestTier(grid)).toBe(0)
  })

  it('returns the highest tier present anywhere on the grid', () => {
    const grid = Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(null))
    grid[1][2] = tile(4)
    grid[3][0] = tile(7)
    expect(highestTier(grid)).toBe(7)
  })
})

// ---- helpers ----
function tierValueFor(tierIndex) { return 2 ** (tierIndex + 1) }