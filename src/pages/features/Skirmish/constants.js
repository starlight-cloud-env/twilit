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

// ---------- Mystery ship ----------
export const MYSTERY_SHIP_Y = 28
export const MYSTERY_SHIP_WIDTH = 46
export const MYSTERY_SHIP_HEIGHT = 18
export const MYSTERY_SHIP_SPEED = 2.2
export const MYSTERY_SHIP_POINTS = 150
export const MYSTERY_SHIP_SPAWN_MIN_FRAMES = 600  // ~10s at 60fps
export const MYSTERY_SHIP_SPAWN_MAX_FRAMES = 1200 // ~20s at 60fps
export const MYSTERY_SHIP_COLOR = '#fbbf24'

// ---------- Power-ups ----------
export const POWERUP_DROP_CHANCE = 0.15
export const POWERUP_SIZE = 22
export const POWERUP_FALL_SPEED = 2
export const POWERUP_WIDE_DURATION_FRAMES = 480 // ~8s at 60fps
export const POWERUP_WIDE_MULTIPLIER = 1.6
export const POWERUP_COLORS = { wide: '#38bdf8', multiball: '#f472b6' }
export const POWERUP_LABELS = { wide: 'W', multiball: 'M' }

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