import { useRef, useEffect, useState, useCallback } from 'react'
import {
  CANVAS_WIDTH, CANVAS_HEIGHT,
  PADDLE_WIDTH, PADDLE_HEIGHT, PADDLE_Y, PADDLE_SPEED,
  BALL_RADIUS, BASE_BALL_SPEED, MAX_BALL_SPEED,
  ALIEN_ROWS, ALIEN_COLS, ALIEN_WIDTH, ALIEN_HEIGHT, ALIEN_SPACING,
  ALIEN_GRID_WIDTH, ALIEN_TOP_Y, BASE_ALIEN_SPEED, MAX_ALIEN_SPEED, ROW_DROP_HEIGHT,
  STARTING_LIVES, ALIEN_TIERS, COLORS,
  MYSTERY_SHIP_Y, MYSTERY_SHIP_WIDTH, MYSTERY_SHIP_HEIGHT, MYSTERY_SHIP_SPEED,
  MYSTERY_SHIP_POINTS, MYSTERY_SHIP_SPAWN_MIN_FRAMES, MYSTERY_SHIP_SPAWN_MAX_FRAMES,
  MYSTERY_SHIP_COLOR,
  POWERUP_DROP_CHANCE, POWERUP_SIZE, POWERUP_FALL_SPEED,
  POWERUP_WIDE_DURATION_FRAMES, POWERUP_WIDE_MULTIPLIER, POWERUP_COLORS, POWERUP_LABELS,
} from '../pages/features/Skirmish/constants.js'

function createAlienGrid() {
  const aliens = []
  for (let row = 0; row < ALIEN_ROWS; row++) {
    for (let col = 0; col < ALIEN_COLS; col++) {
      aliens.push({ row, col, alive: true })
    }
  }
  return aliens
}

function createBall(paddleX, paddleWidth) {
  return {
    x: paddleX + paddleWidth / 2,
    y: PADDLE_Y - BALL_RADIUS - 1,
    vx: 0,
    vy: 0,
    launched: false,
  }
}

function randomSpawnDelay() {
  return Math.floor(
    MYSTERY_SHIP_SPAWN_MIN_FRAMES + Math.random() * (MYSTERY_SHIP_SPAWN_MAX_FRAMES - MYSTERY_SHIP_SPAWN_MIN_FRAMES)
  )
}

function freshGameState() {
  const paddleX = CANVAS_WIDTH / 2 - PADDLE_WIDTH / 2
  return {
    paddle: { x: paddleX },
    balls: [createBall(paddleX, PADDLE_WIDTH)],
    aliens: createAlienGrid(),
    alienOffsetX: (CANVAS_WIDTH - ALIEN_GRID_WIDTH) / 2,
    alienDirection: 1,
    alienSpeed: BASE_ALIEN_SPEED,
    ballSpeed: BASE_BALL_SPEED,
    formationDropY: 0,
    keys: { left: false, right: false },
    targetPaddleX: null,
    frame: 0,
    mysteryShip: null,
    mysteryShipTimer: randomSpawnDelay(),
    powerUps: [],
    paddleWideUntilFrame: 0,
  }
}

function alienRect(alien, game) {
  return {
    x: game.alienOffsetX + alien.col * (ALIEN_WIDTH + ALIEN_SPACING),
    y: ALIEN_TOP_Y + alien.row * (ALIEN_HEIGHT + ALIEN_SPACING) + game.formationDropY,
    width: ALIEN_WIDTH,
    height: ALIEN_HEIGHT,
  }
}

function effectivePaddleWidth(game) {
  return game.frame < game.paddleWideUntilFrame ? PADDLE_WIDTH * POWERUP_WIDE_MULTIPLIER : PADDLE_WIDTH
}

function applyPowerUp(game, type) {
  if (type === 'wide') {
    game.paddleWideUntilFrame = game.frame + POWERUP_WIDE_DURATION_FRAMES
  } else if (type === 'multiball') {
    const launchedBalls = game.balls.filter(b => b.launched)
    const base = launchedBalls[0]
    if (base) {
      game.balls.push(
        { x: base.x, y: base.y, vx: base.vx + 1.6, vy: base.vy, launched: true },
        { x: base.x, y: base.y, vx: base.vx - 1.6, vy: base.vy, launched: true },
      )
    }
  }
}

export function useSkirmishGame() {
  const canvasRef = useRef(null)
  const rafRef = useRef(null)
  const gameRef = useRef(freshGameState())
  const waveClearTimerRef = useRef(null)

  const [score, setScore] = useState(0)
  const [lives, setLives] = useState(STARTING_LIVES)
  const [wave, setWave] = useState(1)
  const [status, setStatus] = useState('ready') // ready | playing | wave-clear | lost

  const statusRef = useRef(status)
  useEffect(() => { statusRef.current = status }, [status])

  const launch = useCallback(() => {
    const game = gameRef.current
    if (statusRef.current === 'ready') setStatus('playing')
    if (statusRef.current !== 'playing' && statusRef.current !== 'ready') return

    const ball = game.balls[0]
    if (ball && !ball.launched) {
      ball.launched = true
      ball.vx = (Math.random() - 0.5) * 2 * 1.5
      ball.vy = -game.ballSpeed
    }
  }, [])

  const reset = useCallback(() => {
    gameRef.current = freshGameState()
    setScore(0)
    setLives(STARTING_LIVES)
    setWave(1)
    setStatus('ready')
  }, [])

  const movePaddleToClientX = useCallback((clientX) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    const canvasX = (clientX - rect.left) * (CANVAS_WIDTH / rect.width)
    const width = effectivePaddleWidth(gameRef.current)
    gameRef.current.targetPaddleX = canvasX - width / 2
  }, [])

  // ---------- input ----------
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const onMouseMove = (e) => movePaddleToClientX(e.clientX)
    const onTouchMove = (e) => {
      if (e.touches[0]) movePaddleToClientX(e.touches[0].clientX)
    }
    const onPointerDown = () => launch()
    const onKeyDown = (e) => {
      if (e.key === 'ArrowLeft' || e.key === 'a') gameRef.current.keys.left = true
      if (e.key === 'ArrowRight' || e.key === 'd') gameRef.current.keys.right = true
      if (e.key === ' ') { e.preventDefault(); launch() }
    }
    const onKeyUp = (e) => {
      if (e.key === 'ArrowLeft' || e.key === 'a') gameRef.current.keys.left = false
      if (e.key === 'ArrowRight' || e.key === 'd') gameRef.current.keys.right = false
    }

    canvas.addEventListener('mousemove', onMouseMove)
    canvas.addEventListener('touchmove', onTouchMove, { passive: true })
    canvas.addEventListener('mousedown', onPointerDown)
    canvas.addEventListener('touchstart', onPointerDown, { passive: true })
    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)

    return () => {
      canvas.removeEventListener('mousemove', onMouseMove)
      canvas.removeEventListener('touchmove', onTouchMove)
      canvas.removeEventListener('mousedown', onPointerDown)
      canvas.removeEventListener('touchstart', onPointerDown)
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
    }
  }, [launch, movePaddleToClientX])

  // ---------- game loop ----------
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    const dpr = window.devicePixelRatio || 1
    canvas.width = CANVAS_WIDTH * dpr
    canvas.height = CANVAS_HEIGHT * dpr
    ctx.scale(dpr, dpr)

    const handleMiss = (game) => {
      game.formationDropY += ROW_DROP_HEIGHT
      game.balls = [createBall(game.paddle.x, effectivePaddleWidth(game))]

      setLives(prev => {
        const next = prev - 1
        if (next <= 0) {
          setStatus('lost')
        }
        return next
      })

      const bottomY = ALIEN_TOP_Y + (ALIEN_ROWS - 1) * (ALIEN_HEIGHT + ALIEN_SPACING)
        + ALIEN_HEIGHT + game.formationDropY
      if (bottomY >= PADDLE_Y) {
        setStatus('lost')
      }
    }

    const handleWaveClear = (game) => {
      setStatus('wave-clear')
      waveClearTimerRef.current = setTimeout(() => {
        game.aliens = createAlienGrid()
        game.formationDropY = 0
        game.alienOffsetX = (CANVAS_WIDTH - ALIEN_GRID_WIDTH) / 2
        game.alienDirection = 1
        game.alienSpeed = Math.min(game.alienSpeed * 1.08, MAX_ALIEN_SPEED)
        game.ballSpeed = Math.min(game.ballSpeed * 1.04, MAX_BALL_SPEED)
        game.balls = [createBall(game.paddle.x, effectivePaddleWidth(game))]
        setWave(w => w + 1)
        setStatus('playing')
      }, 1400)
    }

    const update = () => {
      const game = gameRef.current
      if (statusRef.current !== 'playing') return

      game.frame++
      const paddleWidth = effectivePaddleWidth(game)

      // Paddle
      if (game.targetPaddleX !== null) {
        game.paddle.x = game.targetPaddleX
      }
      if (game.keys.left) game.paddle.x -= PADDLE_SPEED
      if (game.keys.right) game.paddle.x += PADDLE_SPEED
      game.paddle.x = Math.max(0, Math.min(CANVAS_WIDTH - paddleWidth, game.paddle.x))

      // Alien formation drift
      game.alienOffsetX += game.alienDirection * game.alienSpeed
      if (game.alienOffsetX <= 0) {
        game.alienOffsetX = 0
        game.alienDirection = 1
      } else if (game.alienOffsetX + ALIEN_GRID_WIDTH >= CANVAS_WIDTH) {
        game.alienOffsetX = CANVAS_WIDTH - ALIEN_GRID_WIDTH
        game.alienDirection = -1
      }

      // Mystery ship
      if (!game.mysteryShip) {
        game.mysteryShipTimer--
        if (game.mysteryShipTimer <= 0) {
          const fromLeft = Math.random() < 0.5
          game.mysteryShip = {
            x: fromLeft ? -MYSTERY_SHIP_WIDTH : CANVAS_WIDTH,
            y: MYSTERY_SHIP_Y,
            direction: fromLeft ? 1 : -1,
          }
        }
      } else {
        game.mysteryShip.x += MYSTERY_SHIP_SPEED * game.mysteryShip.direction
        if (game.mysteryShip.x < -MYSTERY_SHIP_WIDTH - 10 || game.mysteryShip.x > CANVAS_WIDTH + 10) {
          game.mysteryShip = null
          game.mysteryShipTimer = randomSpawnDelay()
        }
      }

      // Power-ups falling
      game.powerUps = game.powerUps.filter(p => {
        p.y += POWERUP_FALL_SPEED
        if (
          p.y + POWERUP_SIZE >= PADDLE_Y &&
          p.y <= PADDLE_Y + PADDLE_HEIGHT &&
          p.x >= game.paddle.x - POWERUP_SIZE / 2 &&
          p.x <= game.paddle.x + paddleWidth + POWERUP_SIZE / 2
        ) {
          applyPowerUp(game, p.type)
          return false
        }
        return p.y <= CANVAS_HEIGHT
      })

      // Balls
      for (const ball of game.balls) {
        if (!ball.launched) {
          ball.x = game.paddle.x + paddleWidth / 2
          continue
        }

        ball.x += ball.vx
        ball.y += ball.vy

        if (ball.x - BALL_RADIUS <= 0) {
          ball.x = BALL_RADIUS
          ball.vx = -ball.vx
        } else if (ball.x + BALL_RADIUS >= CANVAS_WIDTH) {
          ball.x = CANVAS_WIDTH - BALL_RADIUS
          ball.vx = -ball.vx
        }
        if (ball.y - BALL_RADIUS <= 0) {
          ball.y = BALL_RADIUS
          ball.vy = -ball.vy
        }

        // Paddle collision
        if (
          ball.vy > 0 &&
          ball.y + BALL_RADIUS >= PADDLE_Y &&
          ball.y + BALL_RADIUS <= PADDLE_Y + PADDLE_HEIGHT + 10 &&
          ball.x >= game.paddle.x - BALL_RADIUS &&
          ball.x <= game.paddle.x + paddleWidth + BALL_RADIUS
        ) {
          const hitPos = (ball.x - (game.paddle.x + paddleWidth / 2)) / (paddleWidth / 2)
          ball.vy = -Math.abs(ball.vy)
          ball.vx = hitPos * game.ballSpeed
          ball.y = PADDLE_Y - BALL_RADIUS
        }

        // Mystery ship collision
        if (game.mysteryShip) {
          const ms = game.mysteryShip
          if (
            ball.x + BALL_RADIUS > ms.x &&
            ball.x - BALL_RADIUS < ms.x + MYSTERY_SHIP_WIDTH &&
            ball.y + BALL_RADIUS > ms.y &&
            ball.y - BALL_RADIUS < ms.y + MYSTERY_SHIP_HEIGHT
          ) {
            setScore(s => s + MYSTERY_SHIP_POINTS)
            game.mysteryShip = null
            game.mysteryShipTimer = randomSpawnDelay()
            ball.vy = -ball.vy
          }
        }

        // Alien collisions — one per frame per ball
        for (const alien of game.aliens) {
          if (!alien.alive) continue
          const rect = alienRect(alien, game)
          if (
            ball.x + BALL_RADIUS > rect.x &&
            ball.x - BALL_RADIUS < rect.x + rect.width &&
            ball.y + BALL_RADIUS > rect.y &&
            ball.y - BALL_RADIUS < rect.y + rect.height
          ) {
            alien.alive = false
            ball.vy = -ball.vy
            setScore(s => s + ALIEN_TIERS[alien.row].points)

            if (Math.random() < POWERUP_DROP_CHANCE) {
              const type = Math.random() < 0.5 ? 'wide' : 'multiball'
              game.powerUps.push({ x: rect.x + rect.width / 2, y: rect.y, type })
            }
            break
          }
        }
      }

      // Remove balls that fell past the paddle
      const survivingBalls = game.balls.filter(b => b.y - BALL_RADIUS <= CANVAS_HEIGHT)
      if (survivingBalls.length === 0 && game.balls.some(b => b.launched)) {
        handleMiss(game)
      } else {
        game.balls = survivingBalls
      }

      // Wave clear check
      if (game.aliens.every(a => !a.alive)) {
        handleWaveClear(game)
      }
    }

    const draw = () => {
      const game = gameRef.current
      const