'use client'

import React, { useEffect, useRef } from 'react'

const VERTICAL_LINES = 10
const HORIZONTAL_LINES = 40
const START_X = 50
const START_Y = 50
const LINE_LENGTH = 600
const LINE_SPACING = 100

type HorizontalLine = {
  y: number
  x1: number
  x2: number
}
type VerticalLine = {
  x: number
  y1: number
  y2: number
}

const drawLine = (ctx: CanvasRenderingContext2D, color: string, x1: number, y1: number, x2: number, y2: number) => {
  console.log('drawLine:', x1, y1, x2, y2)
  ctx.beginPath()
  ctx.moveTo(x1, y1)
  ctx.lineTo(x2, y2)
  ctx.strokeStyle = color
  ctx.stroke()
}
const drawAmidakuji = (
  ctx: CanvasRenderingContext2D
): { horizontalLines: HorizontalLine[]; verticalLines: VerticalLine[] } => {
  const verticalLines: VerticalLine[] = []
  for (let i = 0; i < VERTICAL_LINES; i++) {
    const x = START_X + i * LINE_SPACING
    drawLine(ctx, 'black', x, START_Y, x, START_Y + LINE_LENGTH)
    verticalLines.push({ x, y1: START_Y, y2: START_Y + LINE_LENGTH })
  }

  const horizontalLines = []
  for (let i = 1; i < HORIZONTAL_LINES; i++) {
    const y = START_Y + (i * LINE_LENGTH) / HORIZONTAL_LINES
    const x1 = START_X + Math.floor(Math.random() * (VERTICAL_LINES - 1)) * LINE_SPACING
    const x2 = x1 + LINE_SPACING
    drawLine(ctx, 'black', x1, y, x2, y)
    horizontalLines.push({ y, x1, x2 })
  }
  return { horizontalLines, verticalLines }
}

const runAmidakuji = (
  ctx: CanvasRenderingContext2D,
  startLine: VerticalLine,
  horizontalLines: HorizontalLine[],
  verticalLines: VerticalLine[]
) => {
  let currentX = startLine.x
  let currentY = startLine.y1
  let currentVerticalLine = startLine
  while (true) {
    const horizontalLine = horizontalLines.find((line) => {
      return (currentX === line.x1 || currentX === line.x2) && line.y > currentY
    })

    if (!horizontalLine) {
      drawLine(ctx, 'red', currentX, currentY, currentX, currentVerticalLine.y2)
      break
    }

    drawLine(ctx, 'red', currentX, currentY, currentX, horizontalLine.y)
    if (currentX === horizontalLine.x1) {
      drawLine(ctx, 'red', currentX, horizontalLine.y, horizontalLine.x2, horizontalLine.y)
      currentX = horizontalLine.x2
    } else if (currentX === horizontalLine.x2) {
      drawLine(ctx, 'red', currentX, horizontalLine.y, horizontalLine.x1, horizontalLine.y)
      currentX = horizontalLine.x1
    }
    currentY = horizontalLine.y
    currentVerticalLine = verticalLines.find((line) => line.x === currentX)!

    if (currentY === currentVerticalLine.y2 - LINE_SPACING) {
      drawLine(ctx, 'red', currentX, currentY, currentX, currentVerticalLine.y2)
      break
    }
  }
}

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const horizontalLinesRef = useRef<HorizontalLine[]>([])
  const verticalLinesRef = useRef<VerticalLine[]>([])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    canvas.width = 1200
    canvas.height = 1200
    const ctx = canvas.getContext('2d')
    if (ctx) {
      ctx.fillStyle = '#fff'
      ctx.fillRect(0, 0, 1200, 1200)
      const { horizontalLines, verticalLines } = drawAmidakuji(ctx)
      horizontalLinesRef.current = horizontalLines
      verticalLinesRef.current = verticalLines
    }
  }, [])

  const handleClick = (e: any) => {
    if (!canvasRef.current) return
    runAmidakuji(
      canvasRef.current.getContext('2d')!,
      verticalLinesRef.current[0],
      horizontalLinesRef.current,
      verticalLinesRef.current
    )
  }

  return (
    <div>
      <h1>あみだくじツール</h1>
      <canvas ref={canvasRef} width={600} height={600} onClick={handleClick}></canvas>
    </div>
  )
}
