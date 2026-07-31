'use client'

import clsx from 'clsx'
import type React from 'react'
import { useCallback, useEffect, useRef, useState } from 'react'

import DeleteIcon from '@/assets/icons/calc/delete.svg'
import BackIcon from '@/assets/icons/canvas/back.svg'
import EditIcon from '@/assets/icons/canvas/edit.svg'
import EraserIcon from '@/assets/icons/canvas/eraser.svg'
import ForwardIcon from '@/assets/icons/canvas/forward.svg'
import CloseIcon from '@/assets/icons/close.svg'

import styles from './canvas.module.scss'

type DrawingMode = 'draw' | 'erase'

interface Point {
  x: number
  y: number
}

interface CanvasProps {
  onClose: () => void
}

const STORAGE_KEY = 'drawing-board-data'

export function Canvas({ onClose }: CanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const isDrawingRef = useRef(false)
  const [mode, setMode] = useState<DrawingMode>('draw')
  const [history, setHistory] = useState<ImageData[]>([])
  const [historyStep, setHistoryStep] = useState(-1)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const savedData = localStorage.getItem(STORAGE_KEY)
    if (savedData) {
      const img = new Image()
      img.onload = () => {
        ctx.drawImage(img, 0, 0)
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
        setHistory([imageData])
        setHistoryStep(0)
      }
      img.src = savedData
    } else {
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      setHistory([imageData])
      setHistoryStep(0)
    }
  }, [])

  const saveToLocalStorage = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const dataUrl = canvas.toDataURL('image/png')
    localStorage.setItem(STORAGE_KEY, dataUrl)
  }, [])

  const handleClose = useCallback(() => {
    saveToLocalStorage()
    onClose()
  }, [saveToLocalStorage, onClose])

  const saveState = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
    const newHistory = history.slice(0, historyStep + 1)
    newHistory.push(imageData)
    setHistory(newHistory)
    setHistoryStep(newHistory.length - 1)
  }, [history, historyStep])

  const getCoordinates = (e: React.TouchEvent | React.MouseEvent): Point => {
    const canvas = canvasRef.current
    if (!canvas) return { x: 0, y: 0 }

    const rect = canvas.getBoundingClientRect()

    if ('touches' in e) {
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top,
      }
    }

    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    }
  }

  const startDrawing = (e: React.TouchEvent | React.MouseEvent) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const { x, y } = getCoordinates(e)

    isDrawingRef.current = true
    ctx.beginPath()
    ctx.moveTo(x, y)

    if (mode === 'draw') {
      ctx.globalCompositeOperation = 'source-over'
      ctx.strokeStyle = '#000000'
      ctx.lineWidth = 3
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'
    } else {
      ctx.globalCompositeOperation = 'destination-out'
      ctx.lineWidth = 50
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'
    }
  }

  const draw = (e: React.TouchEvent | React.MouseEvent) => {
    if (!isDrawingRef.current) return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const { x, y } = getCoordinates(e)
    ctx.lineTo(x, y)
    ctx.stroke()
  }

  const stopDrawing = () => {
    if (isDrawingRef.current) {
      isDrawingRef.current = false
      saveState()
    }
  }

  const undo = () => {
    if (historyStep <= 0) return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const newStep = historyStep - 1
    ctx.putImageData(history[newStep], 0, 0)
    setHistoryStep(newStep)
  }

  const redo = () => {
    if (historyStep >= history.length - 1) return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const newStep = historyStep + 1
    ctx.putImageData(history[newStep], 0, 0)
    setHistoryStep(newStep)
  }

  const clearBoard = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    saveState()
  }

  return (
    <>
      <div className={styles.container}>
        <canvas
          ref={canvasRef}
          className={styles.canvas}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
        />

        <div className={styles.controlPanel}>
          <div className={styles.controls}>
            <div className={clsx(styles.group, styles.edit)}>
              <button
                className={clsx(
                  styles.button,
                  mode === 'draw' && styles.active,
                )}
                onClick={() => setMode('draw')}
                title="Рисовать"
              >
                <EditIcon />
              </button>
              <button
                className={clsx(
                  styles.button,
                  mode === 'erase' && styles.active,
                )}
                onClick={() => setMode('erase')}
                title="Ластик"
              >
                <EraserIcon />
              </button>
            </div>

            <div className={clsx(styles.group, styles.history)}>
              <button
                className={styles.button}
                onClick={undo}
                disabled={historyStep <= 0}
                title="Назад"
              >
                <BackIcon />
              </button>
              <button
                className={styles.button}
                onClick={redo}
                disabled={historyStep >= history.length - 1}
                title="Вперед"
              >
                <ForwardIcon />
              </button>

              <button
                className={styles.button}
                onClick={clearBoard}
                title="Очистить всё"
              >
                <DeleteIcon />
              </button>
            </div>

            <div className={clsx(styles.group, styles.close)}>
              <button
                className={styles.button}
                onClick={handleClose}
                title="Закрыть доску"
              >
                <CloseIcon />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
