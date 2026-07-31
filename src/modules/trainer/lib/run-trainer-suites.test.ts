import { describe, expect, it } from 'vitest'

import { casesForSuite, initialCaseResults } from './run-trainer-suites'

describe('casesForSuite', () => {
  it('trainer suite has correct and wrong answer cases', () => {
    expect(casesForSuite('trainer')).toEqual([
      'correctAnswer',
      'wrongAnswer',
    ])
  })

  it('canvasChat suite has only canvasAndChat', () => {
    expect(casesForSuite('canvasChat')).toEqual(['canvasAndChat'])
  })

  it('all suite includes answer flows and canvas/chat', () => {
    expect(casesForSuite('all')).toEqual([
      'correctAnswer',
      'wrongAnswer',
      'canvasAndChat',
    ])
  })
})

describe('initialCaseResults', () => {
  it('marks every case pending with labels', () => {
    const results = initialCaseResults('trainer')
    expect(results).toHaveLength(2)
    expect(results.every((r) => r.status === 'pending')).toBe(true)
    expect(results.map((r) => r.id)).toEqual([
      'correctAnswer',
      'wrongAnswer',
    ])
    expect(results.map((r) => r.label)).toEqual([
      'Верный ответ',
      'Неверный ответ',
    ])
  })
})
