import { useState, useCallback } from 'react'
import { WIN_TIER_INDEX } from '../pages/features/Nebula/tiers.js'
import { applyMove, isGameOver, highestTier } from '../pages/features/Nebula/gameLogic.js'

const GRID_SIZE = 4

function emptyGrid() {
  return Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(null))
}

function emptyCells(grid) {
  const cells = []
  grid.forEach((row, r) => row.forEach((cell, c) => {
    if (!cell) cells.push([r, c])
  }))
  return cells
}

function spawnTile(grid) {
  const cells = emptyCells(grid)
  if (cells.length === 0) return grid

  const [r, c] = cells[Math.floor(Math.random() * cells.length)]
  const tier = Math.random() < 0.9 ? 0 : 1 // 90% Dust, 10% Asteroid

  const newGrid = grid.map(row => [...row])
  newGrid[r][c] = { id: crypto.randomUUID(), tier, isNew: true, justMerged: false }
  return newGrid
}

function initGrid() {
  return spawnTile(spawnTile(emptyGrid()))
}

export function useNebulaGame() {
  const [grid, setGrid] = useState(initGrid)
  const [score, setScore] = useState(0)
  const [status, setStatus] = useState('playing') // 'playing' | 'won' | 'lost'
  const [hasWonBefore, setHasWonBefore] = useState(false)

  const handleMove = useCallback((direction) => {
    setGrid(prevGrid => {
      if (status === 'lost') return prevGrid

      const cleared = prevGrid.map(row =>
        row.map(cell => (cell ? { ...cell, isNew: false, justMerged: false } : null))
      )
      const { grid: movedGrid, scoreGained, changed } = applyMove(cleared, direction)
      if (!changed) return prevGrid

      setScore(s => s + scoreGained)
      const spawnedGrid = spawnTile(movedGrid)

      if (!hasWonBefore && highestTier(spawnedGrid) >= WIN_TIER_INDEX) {
        setStatus('won')
        setHasWonBefore(true)
      } else if (isGameOver(spawnedGrid)) {
        setStatus('lost')
      }

      return spawnedGrid
    })
  }, [status, hasWonBefore])

  const reset = useCallback(() => {
    setGrid(initGrid())
    setScore(0)
    setStatus('playing')
    setHasWonBefore(false)
  }, [])

  const continuePlaying = useCallback(() => setStatus('playing'), [])

  return {
    grid,
    score,
    status,
    highestTierIndex: highestTier(grid),
    handleMove,
    reset,
    continuePlaying,
  }
}