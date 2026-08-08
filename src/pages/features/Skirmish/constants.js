// Virtual canvas resolution — actual rendered size scales via CSS,
// input coordinates are converted back into this coordinate system.
export const CANVAS_WIDTH = 480
export const CANVAS_HEIGHT = 600

export const PADDLE_WIDTH = 80
export const PADDLE_HEIGHT = 12
export const PADDLE_Y = CANVAS_HEIGHT - 30
export const PADDLE_SPEED = 7 // keyboard px/frame

export const BALL_RADIUS = 7
export const BASE_BALL_SPEED = 4.5
export const MAX_BALL_SPEED = 8

export const ALIEN_ROWS = 5
export const ALIEN_COLS = 8
export const ALIEN_WIDTH = 40
export const ALIEN_HEIGHT = 22
export const ALIEN_SPACING = 10
export const ALIEN_GRID_WIDTH = ALIEN_COLS * (ALIEN_WIDTH + ALIEN_SPACING) - ALIEN_SPACING
export const ALIEN_TOP_Y = 60
export const BASE_ALIEN_SPEED = 0.6
export const MAX_ALIEN_SPEED = 2.2
export const ROW_DROP_HEIGHT = ALIEN_HEIGHT + ALIEN_SPACING

export const STARTING_LIVES = 3

// Top row scores highest — classic Invaders convention.
export const ALIEN_TIERS = [
  { points: 50, color: '#f472b6' },
  { points: 40, color: '#c084fc' },
  { points: 30, color: '#818cf8' },
  { points: 20, color: '#38bdf8' },
  { points: 10, color: '#4ade80' },
]

export const COLORS = {
  background: '#0e0f18',
  gridLine: 'rgba(255,255,255,0.03)',
  paddle: '#b9b8ff',
  paddleGlow: 'rgba(185,184,255,0.5)',
  ball: '#f8fafc',
  wall: 'rgba(255,255,255,0.08)',
}