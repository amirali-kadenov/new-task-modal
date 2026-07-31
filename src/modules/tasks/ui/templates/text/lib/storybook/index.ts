export {
  makeSolution,
  makeStoryDeps,
  makeTranslation,
  TextTemplateStory,
  withoutSolution,
} from './text-template-story'
export {
  ALL_GROUPS,
  filterGroups,
  getGroupControlOptions,
  getGroupTaskRefs,
  getOpenInTrainerControls,
  pickGroup,
  pickLaunch,
  pickTask,
  pickTaskLaunch,
  renderAllGroupsStory,
  renderAllTasksStory,
  renderDefaultStory,
  renderInTrainerStory,
  renderOpenInTrainerStory,
  renderWithSolutionStory,
  withLongTaskContent,
  LONG_TASK_PARAGRAPH,
} from './create-text-template-stories'
export type {
  TextTemplateStoryArgs,
  TextTemplateStoryMetaArgs,
} from './create-text-template-stories'
export {
  makeInTrainerCalcOverflowStory,
  makeInTrainerCorrectStory,
  makeInTrainerHintsStory,
  makeInTrainerShowAnswerStory,
  makeInTrainerTheoryStory,
  makeInTrainerWrongAnswerStory,
  makeOpenInTrainerStory,
} from './build-extra-trainer-stories'
export type { TrainerStoryArgs } from './build-extra-trainer-stories'
export { RenderTemplateGroups } from './render-template-groups'
export type {
  TemplateGroupFixture,
  TemplateGroupTaskRef,
} from './render-template-groups'
export { RenderTemplateAllTasks } from './render-template-all-tasks'
export type {
  AllTasksFile,
  TemplateAllTaskFixture,
} from './render-template-all-tasks'
export {
  DEFAULT_ALL_TASKS_GRADE,
  getAllTasksForGrade,
  normalizeAllTasksFile,
} from './render-template-all-tasks'
export {
  renderDataAllGroupsStory,
  renderDataAllTasksStory,
  renderDataOneTaskStory,
} from './render-data-stories'
export {
  buildStoryHref,
  encodeStoryArgs,
  sanitizeStorySegment,
  StoryDataLinks,
  templateStoryTitles,
  toStoryId,
} from './storybook-links'
export type { StoryLinkArgs, TemplateStoryTitles } from './storybook-links'
export { JsonDataList, JsonDataView } from './json-data-view'
export type { TaskDataContext } from './json-data-view'
export { TaskSectionTestPanel } from './task-section-test-panel'
export { TextTemplateTrainer } from './text-template-trainer'
export {
  getFixtureAnswerString,
  makeTrainerProps,
  makeTrainerState,
  resetTrainerSession,
  STORY_HINT1,
  STORY_HINT2,
  STORY_THEORY_VIDEO_URL,
} from './make-trainer-props'
export type { MakeTrainerPropsOptions } from './make-trainer-props'
export {
  makePlayCalcOverflowInTrainer,
  makePlayCanvasAndChatInTrainer,
  makePlayCorrectAnswerInTrainer,
  makePlayHintsInTrainer,
  makePlayOpenInTrainer,
  makePlayShowAnswerInTrainer,
  makePlayTheoryInTrainer,
  makePlayWrongAnswerInTrainer,
  runPlayCanvasAndChatInTrainer,
  runPlayCorrectAnswerForTask,
  runPlayCorrectAnswerInTrainer,
  runPlayTheoryInTrainer,
  runPlayWrongAnswerForTask,
  runPlayWrongAnswerInTrainer,
  withInstantPlay,
  PLAY_CASES_CALC_OVERFLOW,
  PLAY_CASES_CORRECT,
  PLAY_CASES_HINTS,
  PLAY_CASES_OPEN,
  PLAY_CASES_SHOW_ANSWER,
  PLAY_CASES_THEORY,
  PLAY_CASES_WRONG,
  TRAINER_STORY_DOCS,
  trainerPlayParameters,
} from './play-in-trainer'
export {
  makePlayAllGroupsSmoke,
  makePlayAllTasksSmoke,
} from './play-catalog-smoke'
export {
  AFTER_MATH_REGRESSION_GROUPS,
  makePlayMathRegressions,
  MATH_REGRESSION_GROUPS,
} from './play-math-regressions'
export {
  buildTrainerLaunchUrls,
  LAUNCH_BASE,
  TrainerLaunchLinks,
  withTrainerLaunchLinks,
} from './trainer-launch-links'
export type { TrainerLaunch } from './trainer-launch-links'
export {
  buildTrainerFolderDocsMarkdown,
  DEFAULT_TRAINER_DOCS_EXAMPLE,
  exampleFromTask,
  TemplateTrainerDocsPage,
  trainerFolderDocsParameters,
} from './trainer-folder-docs'
export type { TrainerDocsExample } from './trainer-folder-docs'
