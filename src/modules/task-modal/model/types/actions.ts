import type { Task } from '@/types/api/task'

export interface TaskModalActions {
  /**
   * Loads lesson data for new free tasks
   */
  onLoadLesson(): void

  /**
   * Handles task answer changes
   */
  onTaskAnswerChanged(answer: unknown, description?: unknown): void

  /**
   * Handles task description changes
   */
  onTaskDescriptionChanged(description: unknown): void

  /**
   * Prevents clearing of selected indexes
   */
  preventClearSelectedIndexes(): void

  /**
   * Shows the previous task
   */
  onShowPrevTask(): void

  /**
   * Shows the next task
   */
  onShowNextTask(progress: number): void

  /**
   * Shows video explanation for the current task
   */
  onShowVideoExplanation(this: void): Promise<unknown>

  /**
   * Checks the user's answer for the current task
   */
  onCheckAnswer(): Promise<void>

  /**
   * Reverses answer for reversed table tasks
   */
  reverseAnswerForReversedTable(
    answer: string,
    answerCellsCountArray: number[],
  ): string

  /**
   * Shows solution for the current task
   */
  onShowSolution(this: void): Promise<unknown>

  /**
   * Opens the theory modal
   */
  onOpenTheoryModal(): void

  /**
   * Closes the theory modal
   */
  onCloseTheoryModal(): void

  /**
   * Opens the add task mistake modal
   */
  onAddTaskMistakeModalOpen(): void

  /**
   * Closes the add task mistake modal
   */
  onAddTaskMistakeModalClose(): void

  /**
   * Handles time elapsed modal close
   */
  onTimeElapsedModalClose(): void

  isLastPenaltyTaskAtPosition(activeTask: Task): boolean
}
