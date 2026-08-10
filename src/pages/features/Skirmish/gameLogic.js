import {
  ALIEN_WIDTH, ALIEN_HEIGHT, ALIEN_SPACING, ALIEN_TOP_Y, ALIEN_GRID_WIDTH,
  CANVAS_WIDTH, PADDLE_WIDTH, POWERUP_WIDE_MULTIPLIER,
} from './constants.js'

export function alienRect(alien, alienOffsetX, formationDropY) {
  return {
    x: alienOffsetX + alien.col * (ALIEN_WIDTH + ALIEN_SPACING),
    y: ALIEN_TOP_Y + alien.row * (ALIEN_HEIGHT + ALIEN_SPACING) + formationDropY,
    width: ALIEN_WIDTH,
    height: ALIEN_HEIGHT,
  }
}

export function effectivePaddleWidth(frame, paddleWideUntilFrame) {
  return frame < paddleWideUntilFrame ? PADDLE_WIDTH * POWERUP_WIDE_MULTIPLIER : PADDLE_WIDTH
}

// Circle (ball) vs axis-aligned rectangle overlap — the same
// "expand the rect by the radius" check used throughout the game loop
// for paddle, alien, and mystery-ship collisions.
export function circleIntersectsRect(circle, rect) {
  return (
    circle.x + circle.radius > rect.x &&
    circle.x - circle.radius < rect.x + rect.width &&
    circle.y + circle.radius > rect.y &&
    circle.y - circle.radius < rect.y + rect.height
  )
}

// Where on the paddle the ball hit determines the bounce angle — a
// center hit goes straight up, edge hits deflect sharply left/right.
// hitPos ranges from -1 (far left edge) to +1 (far right edge).
export function calculatePaddleBounceVx(ballX, paddleX, paddleWidth, ballSpeed) {
  const hitPos = (ballX - (paddleX + paddleWidth / 2)) / (paddleWidth / 2)
  return hitPos * ballSpeed
}

// Bounces the alien formation off the screen edges, clamping its offset
// so it never visually overshoots the canvas boundary.
export function clampAlienDrift(offsetX, direction) {
  if (offsetX <= 0) {
    return { offsetX: 0, direction: 1 }
  }
  if (offsetX + ALIEN_GRID_WIDTH >= CANVAS_WIDTH) {
    return { offsetX: CANVAS_WIDTH - ALIEN_GRID_WIDTH, direction: -1 }
  }
  return { offsetX, direction }
}