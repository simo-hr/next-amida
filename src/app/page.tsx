'use client'
import React, { useEffect, useRef, useState } from 'react'
import MultiLineInput from '@/app/_components/MultiLineInput'
import {
  DEFAULT_CANVAS_HEIGHT,
  CANVAS_HEIGHT,
  HORIZONTAL_LINES,
  START_X,
  START_Y,
  LINE_LENGTH,
  LINE_SPACING,
} from '@/app/const'
import { HorizontalLine, VerticalLine } from '@/app/types'
import Button from '@/app/_components/Button'

const drawLine = (ctx: CanvasRenderingContext2D, color: string, x1: number, y1: number, x2: number, y2: number) => {
  ctx.beginPath()
  ctx.lineWidth = 3
  ctx.strokeStyle = color
  ctx.moveTo(x1, y1)
  ctx.lineTo(x2, y2)
  ctx.stroke()
}

const drawAnimatedLine = (
  ctx: CanvasRenderingContext2D,
  color: string,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  duration: number = 200
): Promise<void> => {
  return new Promise((resolve) => {
    let startTime: number | null = null
    const animate = (currentTime: number) => {
      if (startTime === null) {
        startTime = currentTime
      }

      const elapsedTime = currentTime - startTime
      const progress = Math.min(elapsedTime / duration, 1)
      const currentX = x1 + (x2 - x1) * progress
      const currentY = y1 + (y2 - y1) * progress
      drawLine(ctx, color, x1, y1, currentX, currentY)

      progress < 1 ? requestAnimationFrame(animate) : resolve()
    }

    requestAnimationFrame(animate)
  })
}

const drawAmidakuji = (
  ctx: CanvasRenderingContext2D,
  _goalList: string[]
): { horizontalLines: HorizontalLine[]; verticalLines: VerticalLine[] } => {
  const verticalLines: VerticalLine[] = []
  const goalList = _goalList.filter((goal) => goal !== '')
  ctx.font = '16px Roboto medium'
  ctx.fillStyle = 'gray'
  for (let i = 0; i < goalList.length; i++) {
    const x = START_X + i * LINE_SPACING
    drawLine(ctx, 'gray', x, START_Y, x, START_Y + LINE_LENGTH)
    const text = goalList[i]
    const textWidth = ctx.measureText(text).width
    ctx.fillText(text, x - textWidth / 2, START_Y + LINE_LENGTH + 20)
    verticalLines.push({ x, y1: START_Y, y2: START_Y + LINE_LENGTH })
  }

  const horizontalLines = []
  for (let i = 1; i < HORIZONTAL_LINES; i++) {
    const y = START_Y + (i * LINE_LENGTH) / HORIZONTAL_LINES
    const x1 = START_X + Math.floor(Math.random() * (goalList.length - 1)) * LINE_SPACING
    const x2 = x1 + LINE_SPACING
    drawLine(ctx, 'gray', x1, y, x2, y)
    horizontalLines.push({ y, x1, x2 })
  }
  return { horizontalLines, verticalLines }
}

const runAmidakuji = async (
  ctx: CanvasRenderingContext2D,
  startLine: VerticalLine,
  horizontalLines: HorizontalLine[],
  verticalLines: VerticalLine[]
) => {
  let [currentX, currentY, currentVerticalLine] = [startLine.x, startLine.y1, startLine]
  while (true) {
    const horizontalLine = horizontalLines.find(
      (line) => (currentX === line.x1 || currentX === line.x2) && line.y > currentY
    )

    if (!horizontalLine) {
      await drawAnimatedLine(ctx, 'red', currentX, currentY, currentX, currentVerticalLine.y2)
      break
    }

    await drawAnimatedLine(ctx, 'red', currentX, currentY, currentX, horizontalLine.y)
    if (currentX === horizontalLine.x1) {
      await drawAnimatedLine(ctx, 'red', currentX, horizontalLine.y, horizontalLine.x2, horizontalLine.y)
      currentX = horizontalLine.x2
    } else if (currentX === horizontalLine.x2) {
      await drawAnimatedLine(ctx, 'red', currentX, horizontalLine.y, horizontalLine.x1, horizontalLine.y)
      currentX = horizontalLine.x1
    }
    currentY = horizontalLine.y
    currentVerticalLine = verticalLines.find((line) => line.x === currentX)!

    if (currentY === currentVerticalLine.y2 - LINE_SPACING) {
      await drawAnimatedLine(ctx, 'red', currentX, currentY, currentX, currentVerticalLine.y2)
      break
    }
  }
}

export default function Home() {
  // const [inputList, setInputList] = useState<string[]>([''])
  const [inputList, setInputList] = useState<string[]>([
    '下川',
    '下川',
    '下川',
    '下川',
    '下川',
    '下川',
    '下川',
    '下川',
    '下川',
    '下川',
    '下川',
  ])
  const [isRunning, setIsRunning] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const horizontalLinesRef = useRef<HorizontalLine[]>([])
  const verticalLinesRef = useRef<VerticalLine[]>([])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    canvas.width = DEFAULT_CANVAS_HEIGHT
    canvas.height = CANVAS_HEIGHT
    const ctx = canvas.getContext('2d')
    if (ctx) {
      ctx.fillStyle = '#fff'
      ctx.fillRect(0, 0, CANVAS_HEIGHT, DEFAULT_CANVAS_HEIGHT)
    }
  }, [])

  const reset = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (ctx) {
      ctx.fillStyle = '#fff'
      ctx.fillRect(0, 0, DEFAULT_CANVAS_HEIGHT, CANVAS_HEIGHT)
    }
    setInputList(inputList.filter((text) => text !== ''))
    horizontalLinesRef.current = []
    verticalLinesRef.current = []
  }

  const handleDrawAmida = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    reset()
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')!
    const { horizontalLines, verticalLines } = drawAmidakuji(ctx, inputList)
    horizontalLinesRef.current = horizontalLines
    verticalLinesRef.current = verticalLines
  }

  const handleClick = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if (!canvasRef.current) return
    setIsRunning(true)
    const startLine = verticalLinesRef.current[Math.floor(Math.random() * inputList.length)]
    await runAmidakuji(
      canvasRef.current.getContext('2d')!,
      startLine,
      horizontalLinesRef.current,
      verticalLinesRef.current
    )
    setIsRunning(false)
  }

  return (
    <div className="container">
      <h2>公正なあみだくじ</h2>
      <MultiLineInput inputList={inputList} setInputList={setInputList} />
      <div className="button-container">
        <Button disabled={isRunning} onClick={handleDrawAmida}>
          あみだくじを生成
        </Button>
        <Button disabled={isRunning} onClick={handleClick}>
          START
        </Button>
      </div>
      <canvas ref={canvasRef} width={DEFAULT_CANVAS_HEIGHT} height={CANVAS_HEIGHT}></canvas>
    </div>
  )
}
