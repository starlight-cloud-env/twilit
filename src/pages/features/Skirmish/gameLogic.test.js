import { describe, it, expect } from 'vitest'
import {
  alienRect,
  effectivePaddleWidth,
  circleIntersectsRect,
  calculatePaddleBounceVx,
  clampAlienDrift,
} from './gameLogic.js'
import { PADDLE_WIDTH, POWERUP_WIDE_MULTIPLIER, ALIEN_WIDTH, ALIEN_HEIGHT, CANVAS_WIDTH, ALIEN_GRID_WIDTH } from './constants.js'

describe('alienRect', () => {
  it('positions an alien based on its row/col and the formation offset', () => {
    const alien = { row: 0, col: 0 }
    const rect = alienRect(alien, 100, 0)

    expect(rect.x).toBe(100)
    expect(rect.y).toBeGreaterThan(0)
    expect(rect.width).toBe(ALIEN_WIDTH)
    expect(rect.height).toBe(ALIEN_HEIGHT)
  })

  it('shifts an alien down by the formation drop amount', () => {
    const alien = { row: 0, col: 0 }
    const withoutDrop = alienRect(alien, 100, 0)
    const withDrop = alienRect(alien, 100, 32)

    expect(withDrop.y).toBe(withoutDrop.y + 32)
  })

  it('positions later columns further to the right', () => {
    const rect0 = alienRect({ row: 0, col: 0 }, 0, 0)
    const rect1 = alienRect({ row: 0, col: 1 }, 0, 0)

    expect(rect1.x).toBeGreaterThan(rect0.x)
  })
})

describe('effectivePaddleWidth', () => {
  it('returns the base width when no wide power-up is active', () => {
    expect(effectivePaddleWidth(100, 0)).toBe(PADDLE_WIDTH)
  })

  it('returns the widened width while the power-up window is still active', () => {
    expect(effectivePaddleWidth(100, 200)).toBe(PADDLE_WIDTH * POWERUP_WIDE_MULTIPLIER)
  })

  it('returns the base width exactly when the power-up window has just expired', () => {
    expect(effectivePaddleWidth(200, 200)).toBe(PADDLE_WIDTH)
  })
})

describe('circleIntersectsRect', () => {
  const rect = { x: 100, y: 100, width: 40, height: 20 }

  it('detects overlap when the circle is fully inside the rect', () => {
    const circle = { x: 110, y: 105, radius: 5 }
    expect(circleIntersectsRect(circle, rect)).toBe(true)
  })

  it('detects overlap when the circle only grazes the edge', () => {
    const circle = { x: 100, y: 105, radius: 5 } // center right at rect's left edge
    expect(circleIntersectsRect(circle, rect)).toBe(true)
  })

  it('returns false when the circle is clearly outside the rect', () => {
    const circle = { x: 0, y: 0, radius: 5 }
    expect(circleIntersectsRect(circle, rect)).toBe(false)
  })

  it('returns false when the circle is close but not yet touching', () => {
    const circle = { x: 100 - 20, y: 105, radius: 5 } // 20px left of rect, radius only 5
    expect(circleIntersectsRect(circle, rect)).toBe(false)
  })
})

describe('calculatePaddleBounceVx', () => {
  it('sends the ball straight up (vx = 0) when it hits dead center', () => {
    const paddleX = 100
    const paddleWidth = 80
    const centerX = paddleX + paddleWidth / 2
    expect(calculatePaddleBounceVx(centerX, paddleX, paddleWidth, 5)).toBeCloseTo(0, 10)
  })

  it('deflects sharply right when hit on the far right edge', () => {
    const paddleX = 100
    const paddleWidth = 80
    const rightEdgeX = paddleX + paddleWidth
    expect(calculatePaddleBounceVx(rightEdgeX, paddleX, paddleWidth, 5)).toBeCloseTo(5, 10)
  })

  it('deflects sharply left when hit on the far left edge', () => {
    const paddleX = 100
    const paddleWidth = 80
    expect(calculatePaddleBounceVx(paddleX, paddleX, paddleWidth, 5)).toBeCloseTo(-5, 10)
  })

  it('scales deflection proportionally to ball speed', () => {
    const paddleX = 100
    const paddleWidth = 80
    const rightEdgeX = paddleX + paddleWidth
    expect(calculatePaddleBounceVx(rightEdgeX, paddleX, paddleWidth, 10)).toBeCloseTo(10, 10)
  })
})

describe('clampAlienDrift', () => {
  it('leaves the formation untouched while still within bounds', () => {
    const result = clampAlienDrift(50, 1)
    expect(result).toEqual({ offsetX: 50, direction: 1 })
  })

  it('bounces off the left wall and reverses direction', () => {
    const result = clampAlienDrift(-5, -1)
    expect(result).toEqual({ offsetX: 0, direction: 1 })
  })

  it('bounces off the right wall and reverses direction', () => {
    const overshoot = CANVAS_WIDTH - ALIEN_GRID_WIDTH + 5
    const result = clampAlienDrift(overshoot, 1)
    expect(result).toEqual({ offsetX: CANVAS_WIDTH - ALIEN_GRID_WIDTH, direction: -1 })
  })
})