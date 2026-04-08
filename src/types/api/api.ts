// ApiInstanceType.ts

import type { JSX } from 'react'

import type { ValueOf } from '../utils'

import type { Task, TaskSolution, Translation } from './task'

export interface LoginData {
  phoneNumber?: string
  password: string
  countryCode?: string
  isByPhoneNumber?: boolean
  pupilCode?: string
}

export interface RegisterData {
  firstname: string
  surname: string
  phoneNumber: string
  password: string
  repeatPassword: string
  isPupil: boolean
  countryCode?: string
  confirmationCode?: string
}

export interface User {
  id: number
  firstname: string
  surname: string
  pupil?: {
    language: string
    isUntSubscribed?: boolean
  }
  employee?: {
    role: string
    isDeleted?: boolean
  }
}

export interface Theory {
  content: Translation
  type: string
  position: string
}

export interface Lesson {
  id: number
  title: Translation
  workInProgress: boolean
  withAudioPlayer: boolean
  videoUrl: string
  unitId: number
  type: number
  minutes: number | null
  locatedCountry: string
  key: number
  inTesting: boolean
  hideForPersonalStudyCourse: boolean
  hideForCountry: string[]
  hasTasks: boolean
  country: string | null
  theory: Theory[]
}

export interface Payment {
  id: number
  sum: number
  phoneNumber: string
  currency: string
  bankAccount: string
  methodType: string
  managerId: number
  paidAt: Date
  kaspiCheckLink?: string
  audioRecordingLink?: string
  checkAttachmentFile?: File
  checkAttachmentFileName?: string
  amocrmLink?: string
  agreementId?: string
  subscriptionType?: string
  courseType?: string
  location?: string
  pupilType?: string
  comment?: string
  engagementSourceType?: string
  districtId?: string
  address?: string
  postcode?: string
  subscriptionSum?: number
  managerSum?: number
  isNeedInternalInstalment?: boolean
  reward?: {
    userId: number
    sum: number
    phoneNumber: string
    phoneNumberOwner: string
  }
}

export interface Subscription {
  id: number
  userId: number
  dateFrom: Date
  dateTo: Date
  sum: number
  managerSum: number
  isNeedInternalInstalment: boolean
  courseType: string
  location: string
  pupilType: string
  comment?: string
  engagementSourceType?: string
  districtId?: string
  address?: string
  postcode?: string
  newPaymentIds?: number[]
  reward?: {
    userId: number
    sum: number
    phoneNumber: string
    phoneNumberOwner: string
  }
}

export interface NewPayment extends Payment {
  isNeedAddSubscription?: boolean
  subscriptionType?: string
}

interface CheckUserAnswerResult {
  GiveAttempt: 10
  ShowSolution: 20
  ShowCorrect: 30
  ShowVideoExplanation: 40
}

interface CheckAnswerResponse {
  result: ValueOf<CheckUserAnswerResult> // Enum indicating result (e.g., ShowCorrect, GiveAttempt, ShowSolution)
  solution: TaskSolution // Task solution (if provided)
  hint1: string // First hint (if available)
  hint2: string // Second hint (if available)
  attemptsCount: number // Number of attempts made
  userProgress: number // User's progress percentage
  penaltyTasks: Task[] // Array of penalty tasks (if any)
  newTasks: Task[] // Array of new tasks (if any)
  lockVersion: number // Version for optimistic locking
}

export type MessageInterface =
  | TextMessage
  | AudioMessage
  | FileMessage
  | ImageMessage
  | VideoMessage

interface BaseMessage {
  id: number
  senderUserId: number
  senderFullname: string
  sentAt: string
  isFromPupil?: boolean
}

export interface TextMessage extends BaseMessage {
  type: 'text'
  text: string | JSX.Element
}

export interface AudioMessage extends BaseMessage {
  type: 'audio'
  duration: number
  audioUrl: string
}

export interface FileMessage extends BaseMessage {
  type: 'file'
  fileName: string
  fileSize: number
  fileType: string
  fileUrl: string
}

export interface ImageMessage extends BaseMessage {
  type: 'image'
  fileUrl: string
}

export interface VideoMessage extends BaseMessage {
  type: 'video'
  fileUrl: string
  thumbnailUrl?: string
  duration?: number
}

export interface CheckAnswerErrorResponse {
  response: {
    status: number
    data: string
  }
  message: string
}

export interface TaskSolutionResponse {
  solution: TaskSolution
  penaltyTasks: Task[]
  newTasks: Task[]
  lockVersion: number
}

export interface VideoUrlAsTranslation {
  school: string
  with_audio_player: boolean
  aze: string | null
  kgz: string | null
  uzb: string | null
  eng: string | null
  rus: string | null
  kaz: string | null
  arjd: string // can be empty string
  arsa: string | null
  areg: string | null
  module_name: string
}

export interface VideoExplanationResponse {
  newTasks: Task[]
  attemptsCount: number
  locatedCountry: string
  lockVersion: number | null
  videoUrlAsTranslation: VideoUrlAsTranslation
  videoUrl: string
  videoId: string
  penaltyTasks: Task[]
  solution: TaskSolution | null
  result: number
}

export type ChatMessageType = 'text' | 'image' | 'video' | 'audio' | 'file'

export interface Api {
  getConvertedTextToSpeech(
    language: string,
    text: string,
  ): Promise<string | undefined>
  urlByCompany(company: string): string
  urlByLanguage(language: string): string
  sendToSeshat(strokes: unknown[]): Promise<unknown>
  getUserRating(): Promise<unknown>
  getScienceAcademyPupilsRating(userId: number): Promise<unknown>
  getRating(filter: Record<string, unknown>): Promise<unknown>
  updatePayoutStatus(transactionId: number): Promise<unknown>
  getCoursesList(): Promise<unknown>
  getCourseChapters(
    courseId: number,
    grade: number,
    language: string,
  ): Promise<unknown>
  refreshUserSession(): Promise<unknown>
  getTasksByLessonId(
    lessonId: number,
    selfWorkId?: number,
    language?: string,
  ): Promise<unknown>
  getCheckTasksByLessonId(
    lessonId: number,
    selfWorkId?: number,
    preparationType?: string,
  ): Promise<unknown>
  getUntDiagnosticTasksByLessonIds(
    lessonIds: number[],
    preparationType: string,
  ): Promise<unknown>
  getPupilUntDiagnostics(
    userId: number,
    preparationType: string,
  ): Promise<unknown>
  skipUserUntDiagnostics(
    checkLessonId: number,
    untLessonIds: number[],
  ): Promise<unknown>
  deleteUserUntDiagnostics(checkLessonId: number): Promise<unknown>
  getTasksByControlWorkId(controlWorkId: number): Promise<unknown>
  getTasksByUserLessonId(userLessonId: number): Promise<unknown>
  getTasksByUserCheckLessonId(userCheckLessonId: number): Promise<unknown>
  getTasksByPersonalStudyItemId(
    itemId: number,
    language: string,
  ): Promise<unknown>
  getTaskSolution(task: Task, lessonId?: number): Promise<TaskSolutionResponse>
  getVideoExplanation(
    task: Task & {
      language?: string
    },
  ): Promise<VideoExplanationResponse>
  getVideoExplanationForControlWork(task: Task): Promise<unknown>
  checkAnswer(
    task: Task,
    lessonId?: number,
    language?: string,
  ): Promise<CheckAnswerResponse>
  login(data: LoginData): Promise<unknown>
  loginByParentPhoneNumber(data: LoginData): Promise<unknown>
  register(data: RegisterData): Promise<unknown>
  freeSubscriptionRegister(data: RegisterData): Promise<unknown>
  acceptTerms(userId: number): Promise<unknown>
  isAcceptedTerms(userId: number): Promise<unknown>
  getLastUserActions(
    hours: number,
    institutionId?: number,
    classId?: number,
    groupId?: number,
  ): Promise<unknown>
  getLastUserActionsOfSubscribedPupils(hours: number): Promise<unknown>
  getSubscribedPupils(dateFrom: string, dateTo: string): Promise<unknown>
  getSubscribedNewPupils(): Promise<unknown>
  getUserActionsBySearchText(searchText: string): Promise<unknown>
  getCurrentMentorSessions(): Promise<unknown>
  getSessionsBySearchText(
    searchText: string,
    isParent: boolean,
  ): Promise<unknown>
  isMentorAssigned(
    mentorUserId: number,
    pupilId: number,
    isPupil: boolean,
    sessionId?: number,
    isOpened?: boolean,
  ): Promise<unknown>
  getLastUserActionsOfDiagnosticsLessons(hours: number): Promise<unknown>
  getLastUserActionsOfPaidPupils(searchText: string): Promise<unknown>
  getUserActionsByDateRange(
    dateRange: { startDate: string; endDate: string },
    institutionId?: number,
    classId?: number,
  ): Promise<unknown>
  getLessonById(lessonId: number, language: string): Promise<Lesson>
  getUserActionById(userActionId: number): Promise<unknown>
  addCoinForTheory(
    lessonId: number,
    personalStudyItemId?: number,
    applicationType?: string,
  ): Promise<unknown>
  getTeacherList(): Promise<unknown>
  getB2BTeacherList(): Promise<unknown>
  getB2BTeachersByInstitutionStatus(status: string): Promise<unknown>
  getB2BTeachersByInstitutionId(institutionId: number): Promise<unknown>
  getSchoolTeacherList(institutionId: number): Promise<unknown>
  getSanSchoolTeacherData(date: string): Promise<unknown>
  getSanSchoolPupilDiagnosticList(sourceType: string): Promise<unknown>
  getPupilList(searchText: string): Promise<unknown>
  getCurrentEmployeeAssignedPupilList(): Promise<unknown>
  getEmployeeAssignedPupilListByEmployeeId(employeeId: number): Promise<unknown>
  changeEmployeeAssignedPupilStatus(
    id: number,
    status: string,
  ): Promise<unknown>
  editEmployeeIdsOnAssignedMobilePupils(
    employeeId: number,
    mobilePupilIds: number[],
  ): Promise<unknown>
  getPupilMobileStatusBySearchText(searchText: string): Promise<unknown>
  getPupilMobileStatisticByDepartment(
    department: string,
    role: string,
  ): Promise<unknown>
  getPupilMobileByDate(date: string): Promise<unknown>
  getPupilProfileData(pupilUserId: number): Promise<unknown>
  getOurPupilsBySearchText(searchText: string): Promise<unknown>
  getOurPupils(
    studyLanguage: string,
    department: string,
    date: string,
    courseType: string,
  ): Promise<unknown>
  saveTeacher(teacher: unknown): Promise<unknown>
  saveTeacherProfile(teacher: unknown): Promise<unknown>
  addTeacher(teacher: unknown): Promise<unknown>
  changeUserPassword(userId: number, password: string): Promise<unknown>
  savePupil(pupil: unknown): Promise<unknown>
  saveB2BPupilData(b2bPupil: unknown): Promise<unknown>
  savePupilByTeacher(pupil: unknown): Promise<unknown>
  addPupil(pupil: unknown): Promise<unknown>
  changePupilPreparationMinTaskQuantity(
    id: number,
    preparationMinTaskQuantity: number,
  ): Promise<unknown>
  addPupilByTeacher(pupil: unknown): Promise<unknown>
  bindTeacherToPupil(pupilId: number, teacherId: number): Promise<unknown>
  unbindTeacherFromPupil(pupilId: number, teacherId: number): Promise<unknown>
  deletePupil(pupilId: number): Promise<unknown>
  deleteB2BPupil(pupilId: number): Promise<unknown>
  restorePupil(pupilId: number): Promise<unknown>
  getInstitutionList(regionId: number): Promise<unknown>
  addInstitution(institution: unknown): Promise<unknown>
  saveInstitution(institution: unknown): Promise<unknown>
  addClass(classItem: unknown): Promise<unknown>
  saveClass(classItem: unknown): Promise<unknown>
  saveControlWorkTaskUserAnswer(
    taskId: string,
    userAnswer: unknown,
  ): Promise<unknown>
  saveCheckLessonTaskUserAnswer(
    taskId: string,
    userAnswer: unknown,
  ): Promise<unknown>
  setControlWorkAsFinished(controlWorkId: number): Promise<unknown>
  setCheckLessonAsFinished(userCheckLessonId: number): Promise<unknown>
  getRegions(): Promise<unknown>
  getDistricts(regionId: number): Promise<unknown>
  getInstitutions(districtId: number): Promise<unknown>
  getDistrictTeacherList(districtId: number): Promise<unknown>
  getTeacherPupils(teacherId: number): Promise<unknown>
  getCurrentTeacherGroupedPupils(): Promise<unknown>
  getCurrentTeacherPupils(): Promise<unknown>
  getCurrentTeacherInfo(): Promise<unknown>
  getCurrentManagerProgressInfo(): Promise<unknown>
  getManagersProgressInfo(filter: Record<string, unknown>): Promise<unknown>
  getInstitutionById(id: number): Promise<unknown>
  getClassById(id: number): Promise<unknown>
  getLessons(): Promise<unknown>
  getUserLessons(userId: number, courseId: number): Promise<unknown>
  getGroupedControlWorks(): Promise<unknown>
  assignControlWork(data: unknown): Promise<unknown>
  getCurrentTeacherControlWorks(): Promise<unknown>
  getCsvNewPayments(
    methodType: string,
    bankAccount: string,
    dateFrom: string,
    dateTo: string,
  ): Promise<unknown>
  cancelControlWork(controlWorkId: number): Promise<unknown>
  restoreControlWork(controlWorkId: number): Promise<unknown>
  getControlWorkStatuses(): Promise<unknown>
  getTeacherPupilsReport(pupilUserIds: number[]): Promise<unknown>
  getTeacherPupilsRating(pupilUserIds: number[]): Promise<unknown>
  getUnitsWithLessons(): Promise<unknown>
  getChaptersWithLessons(): Promise<unknown>
  getTaskListForExport(
    lessonId: number,
    withDifficulty: boolean,
  ): Promise<unknown>
  getTestTaskByGrade(grade: number): Promise<unknown>
  getTaskByType(taskType: string): Promise<unknown>
  getPupilsLastActionAt(): Promise<unknown>
  getTeacherByCode(teacherCode: string): Promise<unknown>
  bindCurrentUserToTeacherByCode(teacherCode: string): Promise<unknown>
  unbindPupilFromCurrentTeacher(pupilId: number): Promise<unknown>
  getSolutionByUserActionId(userActionId: number): Promise<unknown>
  getSolutionByTaskFields(
    taskType: string,
    taskFields: unknown,
  ): Promise<unknown>
  saveCurrentPupilProfile(userData: unknown): Promise<unknown>
  getCurrentPupilGrade(): Promise<unknown>
  getCurrentPupilInstitution(): Promise<unknown>
  saveCurrentTeacherProfile(userData: unknown): Promise<unknown>
  getCurrentPupilTeachers(): Promise<unknown>
  getTeachersByInstitutionId(institutionId: number): Promise<unknown>
  updatePassword(data: unknown): Promise<unknown>
  sendConfirmationCodeForRestorePassword(data: unknown): Promise<unknown>
  sendConfirmationCodeForRegistration(data: unknown): Promise<unknown>
  sendConfirmationCodeForCashback(): Promise<unknown>
  restorePassword(data: unknown): Promise<unknown>
  getSelfWorks(withFinished?: boolean): Promise<unknown>
  getInstitutionsOrTeachers(): Promise<unknown>
  sendMessagesAboutNonFinishedSelfWorks(): Promise<unknown>
  getSelfWorksByGroupId(
    groupId: number,
    withFinished?: boolean,
  ): Promise<unknown>
  createSelfWorks(selfWorks: unknown): Promise<unknown>
  getSelfWorkStatuses(): Promise<unknown>
  getPupilSelfWorks(): Promise<unknown>
  cancelSelfWork(selfWorkId: number): Promise<unknown>
  restoreSelfWork(selfWorkId: number): Promise<unknown>
  getPenaltySelfWork(selfWorkId: number): Promise<unknown>
  getCurrentTeacherLessons(): Promise<unknown>
  saveTeacherLesson(teacherLesson: unknown): Promise<unknown>
  getPreviewTasksByLessonId(lessonId: number): Promise<unknown>
  getLearnTasksByTeacherLessonId(
    teacherLessonId: number,
    selfWorkId?: number,
  ): Promise<unknown>
  getCheckTasksByTeacherLessonId(
    teacherLessonId: number,
    selfWorkId?: number,
  ): Promise<unknown>
  getTeacherLessonById(teacherLessonId: number): Promise<unknown>
  getGroupList(): Promise<unknown>
  createGroup(group: unknown): Promise<unknown>
  saveGroup(group: unknown): Promise<unknown>
  getGroupPupils(groupId: number): Promise<unknown>
  getEducationCenterPupils(): Promise<unknown>
  searchPupils(searchText: string): Promise<unknown>
  searchUsers(searchText: string): Promise<unknown>
  searchParents(searchText: string): Promise<unknown>
  updateParentId(pupilId: number, parentId: number): Promise<unknown>
  searchEmployee(searchText: string): Promise<unknown>
  searchFeedbacks(searchText: string): Promise<unknown>
  searchPayments(searchText: string): Promise<unknown>
  searchActiveSubscriptions(searchText: string): Promise<unknown>
  searchLastPayments(searchText: string): Promise<unknown>
  searchLastSanSchoolPayments(searchText: string): Promise<unknown>
  addPupilToGroup(groupId: number, pupilId: number): Promise<unknown>
  removePupilFromGroup(groupId: number, pupilId: number): Promise<unknown>
  getEducationCenterTeachers(): Promise<unknown>
  callToPupil(userId: number): Promise<unknown>
  callToParent(userId: number): Promise<unknown>
  audioCall(userId: number): Promise<unknown>
  getPaymentList(searchText: string): Promise<unknown>
  getPaymentListByFilter(filters: Record<string, unknown>): Promise<unknown>
  getManagerPayments(managerId: number): Promise<unknown>
  getManagersSuperBonuses(
    department: string,
    month: number,
    year: number,
  ): Promise<unknown>
  addPayment(payment: Payment): Promise<unknown>
  addPaymentWithoutCheck(payment: Payment): Promise<unknown>
  addPrePayment(prepayment: unknown): Promise<unknown>
  editPrePayment(prepayment: unknown): Promise<unknown>
  editPayment(payment: Payment): Promise<unknown>
  getPaymentByChangeRequestId(id: number): Promise<unknown>
  getPaymentChangeRequestsList(filterStatus: string): Promise<unknown>
  requestToEditPayment(payment: Payment): Promise<unknown>
  AcceptPaymentChangeRequest(paymentChangeRequest: unknown): Promise<unknown>
  AcceptPaymentChangeRequestByFinancier(
    paymentChangeRequest: unknown,
  ): Promise<unknown>
  RefusePaymentChangeRequest(refusePayment: unknown): Promise<unknown>
  addAutoPaymentProblemSolution(id: number, solution: string): Promise<unknown>
  getPayoutList(): Promise<unknown>
  getPayoutsByUserId(userId: number): Promise<unknown>
  addPayout(payment: Payment): Promise<unknown>
  getRewardList(language: string): Promise<unknown>
  addReward(reward: unknown): Promise<unknown>
  editReward(reward: unknown): Promise<unknown>
  getCommentList(entityId: number, entityType: string): Promise<unknown>
  addComment(
    text: string,
    entityId: number,
    entityType: string,
  ): Promise<unknown>
  patchCommentEmployeeAssignedPupil(
    id: number,
    comment: string,
  ): Promise<unknown>
  deleteComment(id: number): Promise<unknown>
  editComment(id: number, text: string): Promise<unknown>
  finishStudyActivity(): Promise<unknown>
  buySubscription(daysQuantity: number): Promise<unknown>
  checkSubscription(): Promise<unknown>
  getCurrentTeacherTaskFolders(): Promise<unknown>
  saveTeacherOwnTask(teacherTask: unknown): Promise<unknown>
  getTeacherTasksByFolderId(taskFolderId: number): Promise<unknown>
  getTeacherOwnTaskByTaskId(taskId: number): Promise<unknown>
  previewGeneratedTask(teacherTask: unknown): Promise<unknown>
  getChatMessages(
    pupilId?: number,
    withoutBotMessages?: boolean,
  ): Promise<unknown>
  getLastChatMessages(
    pupilId?: number,
    withBotMessages?: boolean,
  ): Promise<unknown>
  getChatMessagesRange(
    pupilId: number,
    withoutBotMessages: boolean,
    offset: number,
    limit?: number,
  ): Promise<unknown>
  getChatMessagesCount(
    pupilId: number,
    withoutBotMessages: boolean,
  ): Promise<unknown>
  sendChatMessage(data: string, type: ChatMessageType): Promise<unknown>
  sendChatMessageToPupil(pupilId: number, messageText: string): Promise<unknown>
  sendTemplateToPupil(pupilId: number, template: string): Promise<unknown>
  sendEvaluationTemplate(pupilId: number, type: string): Promise<unknown>
  sendEvaluationTemplateToParent(
    pupilId: number,
    type: string,
  ): Promise<unknown>
  sendTemplateToParent(pupilId: number, template: string): Promise<unknown>
  getWhatsappTemplates(isPupilTemplates: boolean): Promise<unknown>
  getWhatsappMessagesByPage(page: number, senderType: string): Promise<unknown>
  sendVoiceMessageToPupil(pupilId: number, blob: Blob): Promise<unknown>
  setCurrentPupilChatMessagesAsRead(): Promise<unknown>
  getParentChatMessages(
    pupilId: number,
    withoutBotMessages: boolean,
  ): Promise<unknown>
  getLastParentChatMessages(
    pupilId: number,
    withoutBotMessages?: boolean,
  ): Promise<unknown>
  getParentChatMessagesRange(
    pupilId: number,
    withoutBotMessages: boolean,
    offset: number,
    limit?: number,
  ): Promise<unknown>
  getParentChatMessagesCount(
    pupilId: number,
    withoutBotMessages: boolean,
  ): Promise<unknown>
  editMlLogActualTag(mlLogId: number, actualTag: string): Promise<unknown>
  sendChatMessageToParent(
    pupilId: number,
    messageText: string,
  ): Promise<unknown>
  addUserLastSolvingTask(activeTask: unknown): Promise<unknown>
  addOrEditTaskVideo(taskVideo: unknown): Promise<unknown>
  getDiagnosticsLessons(): Promise<unknown>
  getGeometryLessonsFunnelPage(userId: number): Promise<unknown>
  registerOnStartGeometryTasks(
    userData: unknown,
    language: string,
  ): Promise<unknown>
  getUpcomingYearTasksFunnelPage(userId: number): Promise<unknown>
  registerOnStartUpcomingYearTasks(
    userData: unknown,
    language: string,
  ): Promise<unknown>
  getDiagnosticLessonByLessonId(lessonId: number): Promise<unknown>
  getMentorDiagnostic(): Promise<unknown>
  getDiagnosticsLessonsReference(): Promise<unknown>
  diagnosticsCheckAnswer(task: Task): Promise<unknown>
  diagnosticsShowSolution(task: Task): Promise<unknown>
  getDiagnosticsSummary(lessonId: number): Promise<unknown>
  getPupilDiagnosticsSummary(userLessonId: number): Promise<unknown>
  getCurrentTeacherDiagnosticsLessons(pupilUserIds: number[]): Promise<unknown>
  getPersonalStudyItems(preparationType: string): Promise<unknown>
  addPersonalStudyItem(preparationType: string): Promise<unknown>
  getExistsFreezingToday(): Promise<{ existsToday: boolean }>
  removePersonalStudyItem(id: number): Promise<unknown>
  finishPersonalStudyItem(id: number, comment: string): Promise<unknown>
  getPersonalStudyChangeRequestsByLanguage(language: string): Promise<unknown>
  getPersonalStudyChangeRequestsByStatusAndByLanguage(
    status: string,
    language: string,
  ): Promise<unknown>
  refusedPersonalStudyRequest(personalStudyRequest: unknown): Promise<unknown>
  changePersonalStudyFromRequest(
    personalStudyRequest: unknown,
  ): Promise<unknown>
  addUntPersonalStudyTasks(
    selectedTasks: unknown[],
    selectedPoint: number,
  ): Promise<unknown>
  getUntPersonalStudyTasks(): Promise<unknown>
  deleteUntPersonalStudyTasks(point: number): Promise<unknown>
  editUntPersonalStudyTasks(
    selectedTasks: unknown[],
    point: number,
  ): Promise<unknown>
  rearrangeUntPersonalStudyTasks(
    rearrangedTasks: unknown[],
    point: number,
  ): Promise<unknown>
  getCurrentTeacherPersonalStudyItems(
    pupilUserIds: number[],
    preparationType: string,
  ): Promise<unknown>
  getMissedTasks(): Promise<unknown>
  getCurrentMathematicsLessons(pupilUserId: number): Promise<unknown>
  getB2BPupilPlanProgress(): Promise<unknown>
  checkIsUserB2BPupil(userId: number): Promise<unknown>
  getPersonalStudyRating(filter: Record<string, unknown>): Promise<unknown>
  getPersonalStudyCashback(): Promise<unknown>
  getCashbackSummary(): Promise<unknown>
  getPersonalStudyPupilList(): Promise<unknown>
  getIrregularPupilList(language: string, pupilType: string): Promise<unknown>
  addHandligBackwardPupilStatus(pupilStatus: unknown): Promise<unknown>
  getConsecutiveUnexecutedPupilList(
    language: string,
    dayNumber: number,
    navigation: string,
    courseType: string,
  ): Promise<unknown>
  getPersonalStudiesGroupedByDate(
    studyLanguage: string,
    date: string,
    country: string,
    kpiType: string,
    dayFrom: number,
    dayTo: number,
  ): Promise<unknown>
  getMobilePupilsKPI(
    date: string,
    language: string,
    courseType: string,
  ): Promise<unknown>
  getFilteredPersonalStudiesGroupedByDate(date: string): Promise<unknown>
  savePersonalStudyItem(item: {
    id: number
    nextLessonId?: number
    isMistakesIgnore?: boolean
  }): Promise<unknown>
  savePersonalStudyItemNextTask(
    id: number,
    nextPersonalStudyTaskId: number,
  ): Promise<unknown>
  getPersonalItemsUnt(dateTo: string, dateFrom: string): Promise<unknown>
  loadTelegramFile(telegramFileId: string): Promise<unknown>
  loadFile(fileName: string): Promise<unknown>
  startKemelOlympiadFirstStageForAnonymous(data: unknown): Promise<unknown>
  startKemelOlympiadForAnonymous(data: unknown): Promise<unknown>
  startKemelOlympiadForAuthenticated(
    grade: number,
    olympiadStage: string,
  ): Promise<unknown>
  getTasksByOlympiadItemId(olympiadItemId: number): Promise<unknown>
  editUserIdOfOlympiadItem(
    olympiadItemId: number,
    userId: number,
  ): Promise<unknown>
  getLastOlympiadInfo(olympiadPeriod: string): Promise<unknown>
  getLastDiplomaImage(stage: string): Promise<unknown>
  downloadUserLastDiploma(userId: number, stage: string): Promise<unknown>
  downloadUserCertificate(paymentId: number, type: string): Promise<unknown>
  registerOnDiagnostics(userData: unknown): Promise<unknown>
  getCashbackListByUserId(userId: number): Promise<unknown>
  getLeftoverCashback(userId: number): Promise<unknown>
  getKpi(date: string, company: string): Promise<unknown>
  getSalesKpi(
    companyName: string,
    dateFrom: string,
    dateTo: string,
  ): Promise<unknown>
  getSalesWithReturn(filter: Record<string, unknown>): Promise<unknown>
  getSalesByMonthOrInterval(
    department: string,
    month: number,
    dateFrom: string,
    dateTo: string,
    groupBy: string,
    groupType: string,
  ): Promise<unknown>
  getSalesBonuses(filter: Record<string, unknown>): Promise<unknown>
  updateBonusCoefficients(
    company: string,
    coefficients: unknown,
  ): Promise<unknown>
  getManagersSalesAmount(filter: Record<string, unknown>): Promise<unknown>
  getManagersSalesAmountForTV(filter: Record<string, unknown>): Promise<unknown>
  getCommandsMonthAmount(filter: Record<string, unknown>): Promise<unknown>
  getContinuationStatistics(filter: Record<string, unknown>): Promise<unknown>
  sendExplanationMessageToNewPupil(userId: number): Promise<unknown>
  sendMessageToNewParent(userId: number): Promise<unknown>
  sendMessageToNewParentMobile(userId: number): Promise<unknown>
  sendExplanationMessageToNewPupilMobile(userId: number): Promise<unknown>
  sendExplanationMessageToNewPupilTelegram(userId: number): Promise<unknown>
  sendMessageToNewParentTelegram(userId: number): Promise<unknown>
  sendTelegramMessageAboutPayment(userId: number): Promise<unknown>
  sendMessageAboutPayment(userId: number): Promise<unknown>
  sendUzbSmsToPupil(userId: number): Promise<unknown>
  sendUzbSmsToParent(userId: number): Promise<unknown>
  sendUzbOfferToParent(userId: number, language: string): Promise<unknown>
  startFreeTasksAuthentication(
    data: unknown,
    language: string,
  ): Promise<unknown>
  getProctoringLink(): Promise<unknown>
  startUnifiedNationalTest(examType: string): Promise<unknown>
  checkLastDiagnosticCompletion(preparationType: string): Promise<unknown>
  checkLastUntMockTestCompletion(): Promise<unknown>
  getPupilUntMockTestsItems(userId: number): Promise<unknown>
  getDataForPreparationStatistics(examDate: string): Promise<unknown>
  getPreparationStatisticsByUnits(
    preparationType: string,
    userId?: number,
  ): Promise<unknown>
  sendCertificate(
    recipientType: string,
    paymentId: number,
    type: string,
  ): Promise<unknown>
  sendRequestForCashback(request: unknown): Promise<unknown>
  rejectCashback(id: number): Promise<unknown>
  acceptCashback(id: number, method: string): Promise<unknown>
  acceptCashbacks(payouts: unknown[]): Promise<unknown>
  sendCashbackRequest(leftCashback: number): Promise<unknown>
  getActiveCashbackRequestForCurrentUser(): Promise<unknown>
  sendCashbackRequestByEmployee(
    userId: number,
    cashbackSum: number,
  ): Promise<unknown>
  getSalesReportGroupedBy(
    companyName: string,
    groupBy: string,
    isOnlyAutoWebinar: boolean,
    bankAccount: string,
    paymentMethod: string,
    dateFrom: string,
    dateTo: string,
    month: number,
  ): Promise<unknown>
  getManagerPaymentsbyDate(
    managerId: number,
    date: string,
    groupBy: string,
  ): Promise<unknown>
  getManagerCashbackbyCompanyName(
    managerId: number,
    companyName: string,
  ): Promise<unknown>
  checkWhatsappNumber(userId: number, recipientType: string): Promise<unknown>
  getExpenses(): Promise<unknown>
  addExpense(expense: unknown): Promise<unknown>
  editExpense(expense: unknown): Promise<unknown>
  getExpenseTypes(): Promise<unknown>
  deleteExpense(id: number): Promise<unknown>
  sendDoCashbackRequest(userId: number): Promise<unknown>
  getHunters(department: string): Promise<unknown>
  getUserHunterPins(department: string): Promise<unknown>
  addUserHunterPin(
    userId: number,
    hunterId: number,
    department: string,
  ): Promise<unknown>
  getHuntersWithEmployee(department: string): Promise<unknown>
  changeHunterActive(
    id: number,
    isActive: boolean,
    department: string,
  ): Promise<unknown>
  saveHunterSipuniId(
    id: number,
    sipuniId: string,
    department: string,
  ): Promise<unknown>
  addHunter(name: string, department: string): Promise<unknown>
  getHunterSalaryData(month: string): Promise<unknown>
  saveHunterWorkingDays(
    month: string,
    hunterWorkingDays: unknown,
  ): Promise<unknown>
  getCurrentUserHunterId(): Promise<unknown>
  sendWebinarMessage(
    hunterId: number,
    phoneNumber: string,
    webinarTime: string,
    department: string,
  ): Promise<unknown>
  callToLeadByHunter(
    hunterId: number,
    phoneNumber: string,
    department: string,
  ): Promise<unknown>
  sendLiveWebinarMessage(
    hunterId: number,
    phoneNumber: string,
    department: string,
  ): Promise<unknown>
  addExcelLeads(file: File, leadsType: string): Promise<unknown>
  addExcelLeadsToHunters(
    file: File,
    hunterIds: number[],
    leadsType: string,
  ): Promise<unknown>
  startDistributionWebinarLeads(
    filters: Record<string, unknown>,
  ): Promise<unknown>
  startDistributionMobileLeads(
    filters: Record<string, unknown>,
  ): Promise<unknown>
  getLeadsKpi(
    language: string,
    dateFrom: string,
    dateTo: string,
  ): Promise<unknown>
  getLeadsCount(filters: Record<string, unknown>): Promise<unknown>
  getManagers(): Promise<unknown>
  getManagersByDepartment(department: string): Promise<unknown>
  getOnlyManagersByDepartment(department: string): Promise<unknown>
  getManagerWorkdays(department: string, leadType: string): Promise<unknown>
  getTodayManagers(): Promise<unknown>
  addManagerWorkday(
    managerIds: number[],
    leadType: string,
    department: string,
  ): Promise<unknown>
  getFarmersByDepartment(department: string): Promise<unknown>
  getManagerByUserId(userId: number): Promise<unknown>
  getActiveManagers(): Promise<unknown>
  getPaymentHistory(paymentId: number): Promise<unknown>
  getPaymentHistoryById(paymentHistoryId: number): Promise<unknown>
  changeManagerActive(id: number, isActive: boolean): Promise<unknown>
  getSubscriptionList(searchText: string): Promise<unknown>
  getSubscriptionListByFilter(
    filters: Record<string, unknown>,
  ): Promise<unknown>
  getSubscriptionById(id: number): Promise<unknown>
  getSubscriptionHistory(subscriptionId: number): Promise<unknown>
  getSubscriptionHistoryById(subscriptionHistoryId: number): Promise<unknown>
  addSubscription(subscription: Subscription): Promise<unknown>
  editSubscription(subscription: Subscription): Promise<unknown>
  addSubscriptionByManager(subscription: Subscription): Promise<unknown>
  acceptPublishingSubscription(subscriptionId: number): Promise<unknown>
  rejectPublishingSubscription(subscriptionId: number): Promise<unknown>
  acceptSubscription(subscriptionId: number): Promise<unknown>
  rejectSubscription(subscriptionId: number): Promise<unknown>
  changeSubscriptionSbbEmployeeUserId(
    subscriptionId: number,
    userId: number,
  ): Promise<unknown>
  getSubscriptionNewPayments(subscriptionId: number): Promise<unknown>
  getNewPayments(company: string, date: string): Promise<unknown>
  getNewPaymentById(id: number): Promise<unknown>
  getRelativeSubscriptionRequestsByStatuses(
    statuses: number[],
  ): Promise<unknown>
  addNewPayment(
    newPayment: NewPayment,
    subscription: Subscription,
  ): Promise<unknown>
  editNewPayment(newPayment: NewPayment): Promise<unknown>
  editNewPaymentsSipuni(newPayments: {
    ids: number[]
    audioRecordingLink: string
    managerId: number
    amocrmLink?: string
  }): Promise<unknown>
  acceptNewPayment(newPaymentId: number, data: unknown): Promise<unknown>
  rejectNewPayment(newPaymentId: number, data: unknown): Promise<unknown>
  getUnusedNewPaymentsByManager(
    managerId: number,
    currency: string,
    subscriptionId: number,
  ): Promise<unknown>
  isNewPaymentUsedInSubscription(newPaymentId: number): Promise<unknown>
  getSubscriptionChangeRequests(
    status: string,
    navigation: string,
  ): Promise<unknown>
  getSubscriptionChangeRequestBySearchText(
    searchText: string,
    status: string,
  ): Promise<unknown>
  addSubscriptionChangeRequest(subscription: Subscription): Promise<unknown>
  getSubscriptionChangeRequest(id: number): Promise<unknown>
  acceptNewPaymentChangeRequest(id: number): Promise<unknown>
  rejectNewPaymentChangeRequest(id: number): Promise<unknown>
  acceptSubscriptionChangeRequest(
    id: number,
    accepterUserId: number,
  ): Promise<unknown>
  rejectSubscriptionChangeRequest(id: number): Promise<unknown>
  getNewPaymentChangeRequests(
    status: string,
    navigation: string,
  ): Promise<unknown>
  getNewPaymentChangeRequestBySearchText(
    searchText: string,
    status: string,
  ): Promise<unknown>
  addNewPaymentChangeRequest(newPayment: NewPayment): Promise<unknown>
  addNewReturn(newReturn: unknown): Promise<unknown>
  sendElasticLog(log: unknown): Promise<unknown>
  addNewSubscriptionCancel(
    returnRequest: unknown,
    subscriptionCancel: unknown,
    newReturns: unknown[],
  ): Promise<unknown>
  getSubscriptionCancelByReturnRequestId(
    returnRequestId: number,
  ): Promise<unknown>
  changeType(changedType: unknown): Promise<unknown>
  addMentorSessionTask(changedType: unknown): Promise<unknown>
  editMentorSessionTaskComment(id: number, newComment: string): Promise<unknown>
  editMentorSessionTask(changedType: unknown): Promise<unknown>
  getMentorSessionTasks(
    department: string,
    taskType: string,
    navigation: string,
    subcategory: string,
  ): Promise<unknown>
  getEmergingMentorSessionTaskById(id: number): Promise<unknown>
  getMentorSessionTaskStatistics(
    department: string,
    dateFrom: string,
    dateTo: string,
    taskType: string,
  ): Promise<unknown>
  getReportMentorStatistics(
    department: string,
    dateFrom: string,
    dateTo: string,
  ): Promise<unknown>
  assignMentorToSessionTask(id: number, mentorId: number): Promise<unknown>
  startSessionTaskCompletion(taskId: number): Promise<unknown>
  researchSessionTaskCompletion(taskId: number): Promise<unknown>
  addMentorTaskAndCloseSession(changedType: unknown): Promise<unknown>
  changeStatusSession(phoneNumber: string, status: string): Promise<unknown>
  getCurrentUserByToken(): Promise<unknown>
  getNewFreezingPupilsByDay(
    selectedDate: string,
    companyName: string,
    courseType?: string,
  ): Promise<unknown>
  getNewFreezingPupilsByMonth(
    companyName: string,
    courseType?: string,
  ): Promise<unknown>
  getBlackListClients(): Promise<unknown>
  addBlackListClient(client: unknown): Promise<unknown>
  editBlackListClient(client: unknown, isB2B?: boolean): Promise<unknown>
  deleteBlackListClient(client: unknown): Promise<unknown>
  getMlClosedStatistic(dateFrom: string, dateTo: string): Promise<unknown>
  checkReturnRequestRepeating(paymentId: number): Promise<unknown>
  getTotalNewPupilsKpi(company: string, date: string): Promise<unknown>
  AddMobileQuestionSurvey(question: unknown): Promise<unknown>
  getAllMobileSurveyQuestion(filter: string): Promise<unknown>
  editMobileSurveyQuestion(question: unknown): Promise<unknown>
  deleteMobileQuestion(questionId: number): Promise<unknown>
  getParentFeedbacksWithFilters(
    filters: Record<string, unknown>,
  ): Promise<unknown>
  getSurveyReport(filters: Record<string, unknown>): Promise<unknown>
  getDiscontentParentsReport(filters: Record<string, unknown>): Promise<unknown>
  getReturnReport(filters: Record<string, unknown>): Promise<unknown>
  getSbbLeadsReport(filters: Record<string, unknown>): Promise<unknown>
  getSbbNewPupilCallsReport(filters: Record<string, unknown>): Promise<unknown>
  addWebLeads(lead: unknown): Promise<unknown>
  addMobileLeads(lead: unknown): Promise<unknown>
  getCurrentEmployeeMobileLeads(): Promise<unknown>
  changeMobileLeadStatus(id: number, status: string): Promise<unknown>
  getMobileLeadPhoneNumber(id: number): Promise<unknown>
  updatePupilCashback(userId: number): Promise<unknown>
  getKassa24LinkForCashback(userId: number): Promise<unknown>
  getPaymentDuration(userId: number): Promise<unknown>
  saveGeneralInformation(
    userId: number,
    hobbyText: string,
    startsAt: string,
    endsAt: string,
  ): Promise<unknown>
  getGeneralInformation(userId: number): Promise<unknown>
  getClientChanges(userId: number): Promise<unknown>
  getDiscontents(userId: number): Promise<unknown>
  getMentorSessionTasksHistory(userId: number): Promise<unknown>
  getSurveyResults(userId: number): Promise<unknown>
  getSalesErrors(userId: number): Promise<unknown>
  getReturnsHistory(userId: number): Promise<unknown>
  getPenaltyStandards(): Promise<unknown>
  addPenaltyStandard(
    point: number,
    comment: string,
    department: string,
  ): Promise<unknown>
  updatePenaltyStandard(
    id: number,
    point: number,
    text: string,
    department: string,
  ): Promise<unknown>
  addPenaltyStandardListByExcel(file: File): Promise<unknown>
  deleteStandard(standardId: number): Promise<unknown>
  getReport(duration: string, userId: number): Promise<unknown>
  onFixNewPaymentMethodType(id: number): Promise<unknown>
  getReportLike1C(
    company: string,
    dateFrom: string,
    dateTo: string,
  ): Promise<unknown>
  getSalesComparisonReport(company: string, date: string): Promise<unknown>
  getTaskTemplatesGPTNew(): Promise<unknown>
  updateTaskTemplatesGPTNew(template: unknown): Promise<unknown>
  deleteTaskTemplatesGPTNew(templateId: number): Promise<unknown>
  addTaskTemplateGPTNew(template: unknown): Promise<unknown>
  getUzbPupils(): Promise<unknown>
  getFirstPlanDate(classId: number): Promise<unknown>
  getClassFirstPlanDate(classId: number): Promise<unknown>
  getSessionsByDateAndMlLog(
    department: string,
    dateFrom: string,
    dateTo: string,
  ): Promise<unknown>
  saveMlBotResponseEvaluation(evaluation: unknown): Promise<unknown>
  addB2BTeacherWeeklyPlan(
    dateFrom: string,
    exercisesQuantity: number,
    classId: number,
  ): Promise<unknown>
  getB2BTeacherPlan(
    filters: Record<string, unknown>,
    planType: string,
  ): Promise<unknown>
  getClassB2BTeacherPlan(
    classId: number,
    filters: Record<string, unknown>,
    planType: string,
  ): Promise<unknown>
  getB2BTeacherClasses(): Promise<unknown>
  getB2BTeacherPupils(id: number): Promise<unknown>
  getB2BInstitutionKPI(filters: Record<string, unknown>): Promise<unknown>
  getCurrentUserInstitutionFirstPlan(): Promise<unknown>
  getB2BTeacherKPI(filters: Record<string, unknown>): Promise<unknown>
  addNewFreezingToB2BPupils(
    b2bPupilsUserIds: number[],
    dateFrom: string,
    dateTo: string,
  ): Promise<unknown>
  getMarketingFunnelStatistic(
    filters: Record<string, unknown>,
  ): Promise<unknown>
  getMarketingContentStatistic(
    filters: Record<string, unknown>,
  ): Promise<unknown>
  saveSalesFunnelCost(salesFunnelCost: unknown): Promise<unknown>
  getMarketingCreativeStatistic(
    filters: Record<string, unknown>,
  ): Promise<unknown>
  addMentorPenalty(mentorPenalty: unknown): Promise<unknown>
  getMentorPenaltyList(
    navigation: string,
    dateFrom: string,
    dateTo: string,
    department: string,
  ): Promise<unknown>
  deleteMentorPenalty(mentorPenalty: unknown): Promise<unknown>
  distribePupilsToSBB(
    employeeUserIds: number[],
    pupils: unknown[],
  ): Promise<unknown>
  acceptProcessedPupilSbb(id: number, processedPupil: unknown): Promise<unknown>
  getCreatives(company: string): Promise<unknown>
  addCreative(creative: unknown): Promise<unknown>
  getLessonVideos(lessonId: number): Promise<unknown>
  addLessonVideo(videoTheory: unknown): Promise<unknown>
  editLessonVideo(videoTheory: unknown): Promise<unknown>
  deleteLessonVideo(videoTheory: unknown): Promise<unknown>
  editContentEmployeePermission(
    employeePermissionId: number,
    permissionName: string,
    value: boolean,
  ): Promise<unknown>
  getLessonPresentations(unitId: number, language: string): Promise<unknown>
  addLessonPresentation(lessonPresentation: unknown): Promise<unknown>
  editLessonPresentation(lessonPresentation: unknown): Promise<unknown>
  approveLessonPresentation(
    lessonPresentationId: number,
    isApproved: boolean,
    comment: string,
    type: string,
  ): Promise<unknown>
  addLessonPresentationVideoLink(
    lessonPresentationId: number,
    link: string,
    isYoutubeLink: boolean,
  ): Promise<unknown>
  getLessonPresentationHistory(lessonPresentationId: number): Promise<unknown>
  addTaskMistake(taskMistake: unknown): Promise<unknown>
  getTaskMistakes(language: string, server: string): Promise<unknown>
  getTaskMistakesHistory(
    task: Task,
    mistakeType: string,
    language: string,
  ): Promise<unknown>
  changeTaskMistakeStatus(
    taskMistakeId: number,
    status: string,
    server: string,
    language: string,
  ): Promise<unknown>
  changeMultipleTaskMistakeStatus(
    taskMistakeIds: number[],
    status: string,
  ): Promise<unknown>
  getTaskMistake(id: number): Promise<unknown>
  getTaskMistakeByType(
    type: string,
    server: string,
    language: string,
  ): Promise<unknown>
  changeTaskMistakeComment(id: number, comment: string): Promise<unknown>
  addNewMathTask(newMathTask: unknown): Promise<unknown>
  getNewMathTasks(lessonId: number): Promise<unknown>
  changeNewMathTask(newMathTask: unknown): Promise<unknown>
  sendCashbackToUzbPupil(
    confirmationCode: string,
    cardNumber: string,
    cashbackSum: number,
  ): Promise<unknown>
  sendCashbackToAzePupil(
    confirmationCode: string,
    cardNumber: string,
    cashbackSum: number,
  ): Promise<unknown>
  acceptAtmosCashback(transactionId: string): Promise<unknown>
  getProductCrmStatistic(filters: Record<string, unknown>): Promise<unknown>
  updateUntranslatedTasks(): Promise<unknown>
  uploadFile(file: File): Promise<unknown>
  enterTasksDifficutlyScoreFile(file: File): Promise<unknown>
  getTasksListWithScore(): Promise<unknown>
  getNotCompletedTasks(
    statisticType: string,
    grade: number,
    language: string,
  ): Promise<unknown>
  getMarketingReport(
    freedomBankStatementFile: File,
    firstTargetReportFile: File,
    secondTargetReportFile: File,
  ): Promise<unknown>
  addEmployeeSuggestion(employeeSuggestion: unknown): Promise<unknown>
  getCurrentEmployeeSuggestions(type: string): Promise<unknown>
  getEmployeeSuggestions(type: string): Promise<unknown>
  getEmployeeSuggestionById(suggestionId: number): Promise<unknown>
  updateEmployeeSuggestionStatus(employeeSuggestion: unknown): Promise<unknown>
  addCommentToEmployeeSuggestion(employeeSuggestion: unknown): Promise<unknown>
  addEmployeeSurvey(survey: unknown): Promise<unknown>
  getEmployeeSurveys(type: string): Promise<unknown>
  getSurveyDetails(surveyId: number): Promise<unknown>
  setActiveToSurvey(survey: unknown): Promise<unknown>
  getEmployeeSurveysToPass(type: string): Promise<unknown>
  getSurveyQuestionsToPass(surveyId: number): Promise<unknown>
  passEmployeeSurvey(survey: unknown): Promise<unknown>
  shouldToPassEmployeeSurvey(): Promise<unknown>
  getPassedSurveyList(type: string): Promise<unknown>
  getPassedSurveyEmployeesList(
    params: Record<string, unknown>,
  ): Promise<unknown>
  getPassedVoteResults(id: number): Promise<unknown>
  getEmployeeAnswersToSurvey(params: Record<string, unknown>): Promise<unknown>
  getHREmployeeNotesByEmployeeId(id: number): Promise<unknown>
  updateHREmployeeNotesByEmployeeId(
    id: number,
    params: unknown,
  ): Promise<unknown>
  getAllHRNoteTypes(): Promise<unknown>
  geHREmployeeNotesStatistics(
    id: number,
    params: Record<string, unknown>,
  ): Promise<unknown>
  addOrEditGameItem(gameItem: unknown): Promise<unknown>
  getGameItems(): Promise<unknown>
  deleteGameItem(id: number): Promise<unknown>
  getCurrentEmployeeRequestedSalaryUpdateItems(): Promise<unknown>
  createEmployeeSalaryUpdateRequest(employeeSalary: unknown): Promise<unknown>
  getEmployeeSalaryItems(): Promise<unknown>
  approveEmployeeSalaryUpdate(id: number, dateFrom: string): Promise<unknown>
  addEmployeeSalary(employeeSalary: unknown): Promise<unknown>
  getSevenDaysStatistics(filters: Record<string, unknown>): Promise<unknown>
  getMobileUserStatistic(): Promise<unknown>
  getMobileStandardUserStatistic(): Promise<unknown>
  getEmployeeRoleHistoryStatistics(
    dateFrom: string,
    dateTo: string,
  ): Promise<unknown>
  getAllITDuties(date: string): Promise<unknown>
  getAllITDutiesByUserId(userId: number): Promise<unknown>
  addItDuties(month: string, selectedEmployees: unknown[]): Promise<unknown>
  editITDuty(duty: unknown): Promise<unknown>
  getLastFixedSupport(): Promise<unknown>
  saveRequestMark(
    id: number,
    mark: number,
    markComment: string,
  ): Promise<unknown>
  getAllSupportRequests(): Promise<unknown>
  getSupportRequestsByUserId(userId: number): Promise<unknown>
  getITEmployees(): Promise<unknown>
  getITSupportRequestsByCurrentUserRole(role: string): Promise<unknown>
  getITSupportStatistics(dateFrom: string, dateTo: string): Promise<unknown>
  getITSupportAllRequests(dateFrom: string, dateTo: string): Promise<unknown>
  addSupportRequest(
    request: unknown,
    selectedOptions: string[],
    affectedPeopleCount: number,
  ): Promise<unknown>
  editSupportRequest(
    request: unknown,
    selectedOptions: string[],
    affectedPeopleCount: number,
  ): Promise<unknown>
  respondSupportRequest(
    request: unknown,
    newDescription: string,
  ): Promise<unknown>
  ChangeRequestStatus(request: unknown, isDublicated: boolean): Promise<unknown>
  getConfirmationCode(searchText: string): Promise<unknown>
  getSipuniAudioByPhoneNumber(
    phoneNumber: string,
    dateFrom: string,
    dateTo: string,
    isAllCalls?: boolean,
  ): Promise<unknown>
  getPromocodes(date: string): Promise<unknown>
  getAllPromocodes(): Promise<unknown>
  getAudioSpeechAnalytic(id: number, type: string): Promise<unknown>
  addSpeechAnalyticManually(audioRecordingLink: string): Promise<unknown>
  getUsersManualSpeechAnalytics(): Promise<unknown>
  updateStatusManualSpeechAnalytic(id: number): Promise<unknown>
  deleteSpeechAnalytic(id: number): Promise<unknown>
  updateSpeechAnalyticEvaluation(
    speechAnalyticId: number,
    userData: unknown,
  ): Promise<unknown>
  searchPupilByPhoneNumber(phoneNumber: string): Promise<unknown>
  addPromocode(promocode: unknown): Promise<unknown>
  getEmployeeSipuniLastCall(): Promise<unknown>
  getAppsflyerLeads(
    dateFrom: string,
    dateTo: string,
    platform: string,
    role: string,
  ): Promise<unknown>
  confirmRelative(formData: FormData): Promise<unknown>
  updateRelativeSubscriptionRequestStatus(
    request: unknown,
    status: number,
  ): Promise<unknown>
  getManagersQueue(): Promise<unknown>
  getColdManagersQueue(): Promise<unknown>
  getPupilCashbackInfo(role: string, pupilId: number): Promise<unknown>
  getHunterWhatsappAccounts(): Promise<unknown>
  addHunterWhatsappAccount(account: unknown): Promise<unknown>
  editHunterWhatsappAccount(account: unknown): Promise<unknown>
  changeHunterAccountStatus(id: number, isActive: boolean): Promise<unknown>
  sendTemplateToLeadByHunter(
    phoneNumber: string,
    templateName: string,
    hunterId: number,
  ): Promise<unknown>
  sendDistributedMailingToLeadsByHunters(
    leadFile: File,
    hunterIds: number[],
  ): Promise<unknown>
  sendDistributedMailingToLeadsByHuntersFromDb(
    hunterIds: number[],
    leadsCount: number,
  ): Promise<unknown>
  getHunterSentTemplates(filters: Record<string, unknown>): Promise<unknown>
  extractFromExcel(leadsFile: File): Promise<unknown>
  sendTemplateToLeads(
    language: string,
    leads: unknown[],
    department: string,
    selectedSourcePhoneNumber: string,
    templateName: string,
    dateTimeToSend: string,
  ): Promise<unknown>
  getUntSubscriptionsCount(): Promise<unknown>
  saveLeadsDistributions(
    managers: unknown[],
    sourceType: string,
  ): Promise<unknown>
  saveColdLeadDistributions(managers: unknown[]): Promise<unknown>
  getTodayLeadDistributions(): Promise<unknown>
  getHunterLeadsStatusStatistic(
    filters: Record<string, unknown>,
  ): Promise<unknown>
  getHunterLeadsSalesStatistic(
    filters: Record<string, unknown>,
  ): Promise<unknown>
  onFixSubscriptionDate(id: number): Promise<unknown>
  setPupilActiveTask(activeTask: unknown): Promise<unknown>
  clearManagersQueue(leadType: string): Promise<unknown>
  createKaspiPaymentRequest(
    sum: number,
    phoneNumber: string,
    methodType: string,
  ): Promise<unknown>
  createUnitedPaymentRequest(
    sum: number,
    phoneNumber: string,
    paymentType: string,
    installmentMonths: number,
  ): Promise<unknown>
  saveHuntersQueue(queue: number[]): Promise<unknown>
  getHuntersFromQueue(): Promise<unknown>
  getCsvSubscriptions(date: string): Promise<unknown>
  getSubscriptionsMobileStatistics(
    dateFrom: string,
    dateTo: string,
    language: string,
  ): Promise<unknown>
  updateEmployeePenaltyReason(
    id: number,
    updatedReason: string,
  ): Promise<unknown>
  updateMentorPenaltyReason(id: number, updatedReason: string): Promise<unknown>
  getAutocallAudiosOfThatDay(department: string, day: string): Promise<unknown>
  callByAutocall(
    department: string,
    days: number[],
    role: string,
    institutions: unknown[],
    isB2B?: boolean,
  ): Promise<unknown>
  deleteAutocallRequests(id: number): Promise<unknown>
  getAutocallAccountBalance(): Promise<unknown>
  getAutocallHistory(department: string, isB2B?: boolean): Promise<unknown>
  addManualAutocallRequest(
    type: string,
    department: string,
    days: number[],
    scheduledAt: string,
    role: string,
  ): Promise<unknown>
  addB2BManualAutocallRequest(
    type: string,
    institutions: unknown[],
    scheduledAt: string,
  ): Promise<unknown>
  getClosestAutocall(department: string): Promise<unknown>
  getAutocallBlockClients(isB2B?: boolean): Promise<unknown>
  addAutocallBlockClient(
    userId: number,
    roles: string[],
    reason: string,
    isB2B?: boolean,
  ): Promise<unknown>
  deleteAutocallBlockClient(id: number, isB2B?: boolean): Promise<unknown>
  getConsecutiveUnexecutedPupilsStatistic(
    department: string,
    dateFrom: string,
    dateTo: string,
  ): Promise<unknown>
  getAutocallSchedules(department: string): Promise<unknown>
  updateAutocallSchedule(autocallSchedule: unknown): Promise<unknown>
  toggleAutocallScheduleActive(autocallScheduleId: number): Promise<unknown>
  insertAutocallSchedule(autocallSchedule: unknown): Promise<unknown>
  updatePupilsParentPhoneNumber(
    userId: number,
    newParentPhoneNumber: string,
  ): Promise<unknown>
  updateSubscriptionsCalledStatus(
    subscriptionId: number,
    callStatus: string,
  ): Promise<unknown>
  getIncompleteTasksUsers(
    language: string,
    grades: number[],
    withStandardPupils: boolean,
  ): Promise<unknown>
  sendPushToIncompleteTasksUsers(
    role: string,
    selectedTemplateId: number,
    users: unknown[],
    target: string,
  ): Promise<unknown>
  validateNotificationExcel(file: File): Promise<unknown>
  sendPushToMobile(
    role: string,
    selectedTemplateId: number,
    file: File,
    target: string,
  ): Promise<unknown>
  saveLeadsByExcel(file: File): Promise<unknown>
  importFromAmocrmExcel(file: File): Promise<unknown>
  importFromWebinarExcel(file: File): Promise<unknown>
  sendNotAttendedWebinarList(phoneNumbers: string[]): Promise<unknown>
  getNotificationTemplates(): Promise<unknown>
  getNotificationsHistory(): Promise<unknown>
  createNotificationTemplate(template: unknown): Promise<unknown>
  updateNotificationTemplate(template: unknown): Promise<unknown>
  deleteNotificationTemplateById(templateId: number): Promise<unknown>
  getAllGamificationBlocks(): Promise<unknown>
  updateGamificationBlock(gamificationBlock: unknown): Promise<unknown>
  addGamificationBlock(gamificationBlock: unknown): Promise<unknown>
  addPupilGamificationSetting(
    blockTypes: string[],
    userId: number,
  ): Promise<unknown>
  getPupilGamificationSetting(userId: number): Promise<unknown>
  getSelectedCharacterTextLines(
    templateNames: string[],
    language: string,
  ): Promise<unknown>
  clearUserLastPurchases(userId: number): Promise<unknown>
  getMobileSurveys(survey: unknown): Promise<unknown>
  addMobileSurvey(survey: unknown): Promise<unknown>
  editMobileSurvey(survey: unknown): Promise<unknown>
  getUserResponse(surveyId: number): Promise<unknown>
  getMailingWhatsappTemplates(
    params?: Record<string, unknown>,
  ): Promise<unknown>
  createMailingWhatsappTemplate(templateData: unknown): Promise<unknown>
  getMailingWhatsappTemplate(templateName: string): Promise<unknown>
  updateMailingWhatsappTemplate(
    templateName: string,
    templateData: unknown,
  ): Promise<unknown>
  deleteMailingWhatsappTemplate(
    templateName: string,
    fromPhoneNumber: string,
  ): Promise<unknown>
  getNonCompletingPupilsExcel(
    fromDays: number,
    toDays: number,
    language: string,
    country: string,
  ): Promise<unknown>
}
