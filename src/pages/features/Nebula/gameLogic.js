import { tierValue } from './tiers.js'

export const GRID_SIZE = 4

// Slides + merges a single row leftward. Used for all four directions by
// transposing/reversing the grid beforehand and undoing it after.
export function slideAndMergeRow(row) {
  const tiles = row.filter(Boolean)
  const result = []
  let scoreGained = 0

  let i = 0
  while (i < tiles.length) {
    const current = tiles[i]
    const next = tiles[i + 1]
    if (next && current.tier === next.tier) {
      const newTier = current.tier + 1
      result.push({ id: current.id, tier: newTier, isNew: false, justMerged: true })
      scoreGained += tierValue(newTier)
      i += 2
    } else {
      result.push({ ...current, isNew: false, justMerged: false })
      i += 1
    }
  }

  while (result.length < GRID_SIZE) result.push(null)

  const rowSignature = row.map(c => (c ? c.tier : -1)).join(',')
  const resultSignature = result.map(c => (c ? c.tier : -1)).join(',')

  return { row: result, scoreGained, changed: rowSignature !== resultSignature }
}

export function getColumn(grid, colIndex) {
  return grid.map(row => row[colIndex])
}

export function setColumn(grid, colIndex, newCol) {
  return grid.map((row, r) => row.map((cell, c) => (c === colIndex ? newCol[r] : cell)))
}

export function applyMove(grid, direction) {
  let newGrid = grid.map(row => [...row])
  let scoreGained = 0
  let changed = false

  if (direction === 'left' || direction === 'right') {
    newGrid = newGrid.map(row => {
      const working = direction === 'right' ? [...row].reverse() : row
      const result = slideAndMergeRow(working)
      scoreGained += result.scoreGained
      if (result.changed) changed = true
      return direction === 'right' ? result.row.reverse() : result.row
    })
  } else {
    for (let c = 0; c < GRID_SIZE; c++) {
      const col = getColumn(newGrid, c)
      const working = direction === 'down' ? [...col].reverse() : col
      const result = slideAndMergeRow(working)
      scoreGained += result.scoreGained
      if (result.changed) changed = true
      const finalCol = direction === 'down' ? result.row.reverse() : result.row
      newGrid = setColumn(newGrid, c, finalCol)
    }
  }

  return { grid: newGrid, scoreGained, changed }
}

export function isGameOver(grid) {
  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      if (!grid[r][c]) return false
      if (c < GRID_SIZE - 1 && grid[r][c].tier === grid[r][c + 1]?.tier) return false
      if (r < GRID_SIZE - 1 && grid[r][c].tier === grid[r + 1][c]?.tier) return false
    }
  }
  return true
}

export function highestTier(grid) {
  let max = 0
  grid.forEach(row => row.forEach(cell => {
    if (cell && cell.tier > max) max = cell.tier
  }))
  return max
}