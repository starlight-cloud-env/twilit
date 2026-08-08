import { useRef, useEffect, useState, useCallback } from 'react'
import {
  CANVAS_WIDTH, CANVAS_HEIGHT,
  PADDLE_WIDTH, PADDLE_HEIGHT, PADDLE_Y, PADDLE_SPEED,
  BALL_RADIUS, BASE_BALL_SPEED, MAX_BALL_SPEED,
  ALIEN_ROWS, ALIEN_COLS, ALIEN_WIDTH, ALIEN_HEIGHT, ALIEN_SPACING,
  ALIEN_GRID_WIDTH, ALIEN_TOP_Y, BASE_ALIEN_SPEED, MAX_ALIEN_SPEED, ROW_DROP_HEIGHT,
  STARTING_LIVES, ALIEN_TIERS, COLORS,
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

function createBall(paddleX) {
  return {
    x: paddleX + PADDLE_WIDTH / 2,
    y: PADDLE_Y - BALL_RADIUS - 1,
    vx: 0,
    vy: 0,
    launched: false,
  }
}

function freshGameState() {
  const paddleX = CANVAS_WIDTH / 2 - PADDLE_WIDTH / 2
  return {
    paddle: { x: paddleX },
    balls: [createBall(paddleX)],
    aliens: createAlienGrid(),
    alienOffsetX: (CANVAS_WIDTH - ALIEN_GRID_WIDTH) / 2,
    alienDirection: 1,
    alienSpeed: BASE_ALIEN_SPEED,
    ballSpeed: BASE_BALL_SPEED,
    formationDropY: 0,
    keys: { left: false, right: false },
    targetPaddleX: null,
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
    gameRef.current.targetPaddleX = canvasX - PADDLE_WIDTH / 2
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
      game.balls = [createBall(game.paddle.x)]

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
        game.balls = [createBall(game.paddle.x)]
        setWave(w => w + 1)
        setStatus('playing')
      }, 1400)
    }

    const update = () => {
      const game = gameRef.current
      if (statusRef.current !== 'playing') return

      // Paddle
      if (game.targetPaddleX !== null) {
        game.paddle.x = game.targetPaddleX
      }
      if (game.keys.left) game.paddle.x -= PADDLE_SPEED
      if (game.keys.right) game.paddle.x += PADDLE_SPEED
      game.paddle.x = Math.max(0, Math.min(CANVAS_WIDTH - PADDLE_WIDTH, game.paddle.x))

      // Alien formation drift
      game.alienOffsetX += game.alienDirection * game.alienSpeed
      if (game.alienOffsetX <= 0) {
        game.alienOffsetX = 0
        game.alienDirection = 1
      } else if (game.alienOffsetX + ALIEN_GRID_WIDTH >= CANVAS_WIDTH) {
        game.alienOffsetX = CANVAS_WIDTH - ALIEN_GRID_WIDTH
        game.alienDirection = -1
      }

      // Balls
      for (const ball of game.balls) {
        if (!ball.launched) {
          ball.x = game.paddle.x + PADDLE_WIDTH / 2
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
          ball.x <= game.paddle.x + PADDLE_WIDTH + BALL_RADIUS
        ) {
          const hitPos = (ball.x - (game.paddle.x + PADDLE_WIDTH / 2)) / (PADDLE_WIDTH / 2)
          ball.vy = -Math.abs(ball.vy)
          ball.vx = hitPos * game.ballSpeed
          ball.y = PADDLE_Y - BALL_RADIUS
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

      ctx.fillStyle = COLORS.background
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

      // Aliens
      for (const alien of game.aliens) {
        if (!alien.alive) continue
        const rect = alienRect(alien, game)
        ctx.fillStyle = ALIEN_TIERS[alien.row].color
        ctx.beginPath()
        ctx.roundRect(rect.x, rect.y, rect.width, rect.height, 4)
        ctx.fill()
      }

      // Paddle
      ctx.fillStyle = COLORS.paddle
      ctx.shadowColor = COLORS.paddleGlow
      ctx.shadowBlur = 10
      ctx.beginPath()
      ctx.roundRect(game.paddle.x, PADDLE_Y, PADDLE_WIDTH, PADDLE_HEIGHT, 6)
      ctx.fill()
      ctx.shadowBlur = 0

      // Balls
      ctx.fillStyle = COLORS.ball
      for (const ball of game.balls) {
        ctx.beginPath()
        ctx.arc(ball.x, ball.y, BALL_RADIUS, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    const loop = () => {
      update()
      draw()
      rafRef.current = requestAnimationFrame(loop)
    }
    rafRef.current = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(rafRef.current)
      clearTimeout(waveClearTimerRef.current)
    }
  }, [])

  return { canvasRef, score, lives, wave, status, launch, reset, canvasWidth: CANVAS_WIDTH, canvasHeight: CANVAS_HEIGHT }
}