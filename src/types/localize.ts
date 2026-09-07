interface Localize_DiscontentReasons_ServiceReason {
  title: string
  noTimelyCommunication: string
  mentorRude: string
  mentorExplainsBadly: string
  mentorInexperienced: string
  mentorMisled: string
  mentorPromisedButFailed: string
}

interface Localize_DiscontentReasons_ManagerReason {
  title: string
  misinformation: string
  overExpectations: string
  managerRude: string
  managerFailedToInform: string
  registrationError: string
}

interface Localize_DiscontentReasons_ClientReason {
  title: string
  noResult: string
  lostInterest: string
  noControl: string
  noDiagnosis: string
  noFourStageLearning: string
  inadequate: string
  manyPenaltyTasks: string
  topicMismatch: string
  expectationReality: string
  priceValueMismatch: string
}

interface Localize_DiscontentReasons_ProductReason {
  title: string
  materialQuality: string
  unclearTasks: string
  taskErrors: string
  repetitiveTasks: string
  olympiadUpdates: string
  missingTopics: string
}

interface Localize_DiscontentReasons_AppReason {
  title: string
  taskBug: string
  appBug: string
  serverIssues: string
  inconvenientInterface: string
  messageNotReceived: string
}

interface Localize_DiscontentReasons_SystemReason {
  title: string
  spamMessages: string
  autoCall: string
  freezing: string
  cashbackIssues: string
}

interface Localize_DiscontentReasons {
  serviceReason: Localize_DiscontentReasons_ServiceReason
  managerReason: Localize_DiscontentReasons_ManagerReason
  clientReason: Localize_DiscontentReasons_ClientReason
  productReason: Localize_DiscontentReasons_ProductReason
  appReason: Localize_DiscontentReasons_AppReason
  systemReason: Localize_DiscontentReasons_SystemReason
}

interface Localize_Errors {
  missingUpperCaseLetterPassword: string
  missingNumberPassword: string
  lengthOfPasswordIsTooShort: string
}

interface Localize_SbbReturnRequest {
  assignedSbbEmployee: string
  callTime: string
  createReturn: string
  inProcess: string
  infoFromSBB: string
  chat: string
  sipuni: string
  whatsapp: string
  call: string
  uploadScreen: string
  uploadAudio: string
  linkToCall: string
  claim: string
  infoAboutPupil: string
  infoForReturnManager: string
  count: string
  new: string
  tnbOrInProcess: string
  solved: string
  notSolved: string
  returnCreated: string
  confirmationType: string
  createdFromSbb: string
  tnb: string
  deleted: string
}

interface Localize_OlympiadPreview {
  letsYourChildOne: string
  letsYourChildTwo: string
  letsYourChildThree: string
  letsGiveChild: string
  joinOlympiad: string
  aboutOlympiad: string
  aroundClass: string
  aroundClassText: string
  threeOnline: string
  threeOnlineTextOne: string
  threeOnlineTextTwo: string
  fondHundred: string
  fondHundredText: string
  fourTourFree: string
  fourTourFreeTextOne: string
  fourTourFreeTextTwo: string
  prizeOlympiad: string
  prizeOlympiadFirst: string
  prizeOlympiadSecond: string
  prizeOlympiadThird: string
  afterWinner: string
  secondClass: string
  grandWinner: string
  checkList: string
  howJoin: string
  joinOne: string
  joinTwo: string
  joinThree: string
  joinFour: string
  whatQalan: string
  yourLevel: string
  yourLevelText: string
  diagnostic: string
  diagnosticText: string
  personalStudy: string
  personalStudyText: string
  videoStudy: string
  videoStudyText: string
  mentorSupport: string
  mentorSupportText: string
  mentorCall: string
  mentorCallText: string
  cashbackSum: string
  cashbackSumText: string
  dailyTask: string
  dailyTaskText: string
  cashback: string
  cashbackText: string
  faq: string
  whyFiveClass: string
  watchingVideo: string
  freeOlympiad: string
  olympiadFree: string
  olympiadFreeText: string
  olympiadTime: string
  olympiadTimeTextOne: string
  olympiadTimeTextTwo: string
  olympiadTimeTextThree: string
  olympiadTimeTextFour: string
  secondTry: string
  secondTryText: string
  oldMember: string
  oldMemberText: string
  onlyThree: string
  onlyThreeText: string
  aiQalan: string
}

interface Localize_CalculatorList {
  fraction: string
  plus: string
  multiply: string
  power: string
  minus: string
  divide: string
  comma: string
  sqrt: string
  removeLastChar: string
  semicolon: string
  point: string
  functions: string
  pi: string
  angle: string
  degree: string
  emptySystem: string
  factorial: string
  emptyCell: string
  limit: string
  infinity: string
}

interface Localize_TypesOfSessionSasks {
  notHappy: string
  return: string
  calculationExplanation: string
  givingAdvice: string
}

interface Localize_DiscontentParents {
  status: string
  sentForAssessmentSbb: string
  verifiedBySbb: string
  checkerSbb: string
  chooseSbb: string
  sbbEmployee: string
  isSolved: string
  isAccepted: string
  viewed: string
  critery: string
  open: string
  aboutTheClient: string
  evaluate: string
  commentSbb: string
  controlDiscontents: string
  dataFromMentor: string
}

interface Localize_SourcesOfSessionTasks {
  chat: string
  call: string
  truant: string
  sbb: string
  marketing: string
  opHunters: string
  headHolder: string
  discontent: string
  discontentSbb: string
  discontentRepeatedSbb: string
}

interface Localize_ConsultingSubcategories {
  techProblems: string
  script: string
  motivation: string
  other: string
}

interface Localize_SessionTaskTable {
  whoSent: string
  designatedMentor: string
  taskType: string
  timeOfInsertion: string
  reasonForReturn: string
  communicationTime: string
  status: string
  comment: string
  isTaskTaken: string
  taskTakenAt: string
}

interface Localize_FarmerLeadStatus {
  sold: string
  notSold: string
  thinking: string
  prepayment: string
  tnb: string
}

interface Localize_TaskMistakeStatus {
  mistake: string
  codeReview: string
  inProcess: string
  review: string
  fixed: string
}

interface Localize_TaskMistakeInfo {
  server: string
  language: string
  author: string
  createdAt: string
  lastEditedBy: string
  lastUpdatedAt: string
  filterByLastUpdatedEmployee: string
}

interface Localize_TaskMistakeTypes {
  howToFix: string
  causedBy: string
  isPersonalStudyTaskMistake: string
  selectMistakeTypes: string
  spelling: string
  description: string
  answer: string
  solution: string
  svg: string
  generation: string
}

interface Localize_DepartmentTypes {
  sales: string
  service: string
  HR: string
  finance: string
  content: string
  SBB: string
  marketing: string
}

interface Localize_ReportModal {
  taskCount: string
  reportTaskCount: string
  diagnostic: string
  allTime: string
  averageTaskTime: string
  personalTaskLesson: string
}

interface Localize_MainPage {
  pTech: string
  binom: string
  zaman: string
  ork: string
  zhanAu: string
  sUalikhan: string
  urk: string
  snm: string
  jos: string
  alm: string
  dailyUsers: string
  countUsers: string
  countPupils: string
  taskLevel: string
  paidCashback: string
  timerMentors: string
  register: string
  consultation: string
  olympiad: string
  mainTitle: string
  mainText: string
  olympiadText: string
  qalanIs: string
  appForPupil: string
  appForPupilText: string
  appForParent: string
  appForParentText: string
  supportMentor: string
  supportMentorText: string
  lotOfVideo: string
  lotOfVideoText: string
  factText: string
  afterStudy: string
  afterStudyText: string
  suspendPupil: string
  progressViewParent: string
  monitorPupil: string
  messageForParent: string
  trueEducation: string
  guardian: string
  takeConsultation: string
  takeConsultationText: string
  agreement: string
  howWorkApp: string
  forB2B: string
  forB2BFirstText: string
  forB2BSecondText: string
  forB2BThirdText: string
  forB2BFourthText: string
  ourClient: string
  zamanSchool: string
  phizTech: string
  josSchool: string
  ourProductQalan: string
  oferta: string
  confidentialInformation: string
  ourProduct: string
  contacts: string
  salesContacts: string
  moreQuestions: string
  mentorContacts: string
  workTimes: string
  freeDiagnostics: string
  freeDiagnosticsText: string
  more: string
  downloadApp: string
  watchVideo: string
  callMe: string
  signIn: string
  signUp: string
  signInAuth: string
  yourPhoneNumber: string
  password: string
  forgotYourPassword: string
  yourName: string
  yourSurname: string
  passwordRepeat: string
  iAmPupil: string
  iAmTeacher: string
  iAmParent: string
  male: string
  female: string
  gender: string
  yourFullname: string
  phoneNumber: string
  whyFiveClass: string
  watchingVideo: string
  freeOlympiad: string
}

interface Localize_SbbQuestionOperationModal_QuestionTypes {
  singleChoice: string
  scale: string
  openText: string
  multipleChoice: string
}

interface Localize_SbbQuestionOperationModal {
  questionQuantity: string
  addNewQuestion: string
  questionText: string
  choosePriority: string
  question: string
  priority: string
  type: string
  description: string
  questionType: string
  questionTypes: Localize_SbbQuestionOperationModal_QuestionTypes
}

interface Localize_CriteriaTypes {
  negativeBeginningUsingProduct: string
  negativeWasBeforeProduct: string
  negativeCausedByReturn: string
  negativeThatOccuredAfterNdays: string
  otherReasons: string
  customerDissatisfiedWithRefundSystem: string
  clientWhoCommunicatesWell: string
  clientWhoMisunderstoodHowPortalWorks: string
  dissatisfiedWithProductButReadyToConsider: string
  clientWhoCriticizesForNoApparentReason: string
  resentsTheCompany: string
}

interface Localize_UntStatisticPointsTitles {
  numbers: string
  equations: string
  equationSystems: string
  inequalities: string
  inequalitySystems: string
  mathModelingAndAnalysis: string
  sequences: string
  planimetry: string
  stereometry: string
  vectorsInSpaceAndTransformations: string
  algebra: string
  statistics: string
  geometry: string
  logics: string
}

interface Localize_RegisterForm {
  firstName: string
  surname: string
  phoneNumber: string
  register: string
  registering: string
  backToLogin: string
  enterRealPhoneNumber: string
  enterRelevantPassword: string
  teacherCode: string
  incorrectRepeatPassword: string
  incorrectNewPassword: string
  enterValidEmail: string
  chooseRole: string
  iAmPupil: string
  iAmTeacher: string
  chooseGender: string
  correctNumber: string
}

interface Localize_MlLogList {
  correct: string
  incorrect: string
  unselected: string
  greeting: string
  help: string
  ok: string
  mentor: string
  checked: string
  notChecked: string
}

interface Localize_PersonalStudyDashboard {
  consecutiveUnexecutedKPI: string
  newPupilsKPI: string
  failedDiagnostics: string
  explanationToNewPupils: string
  responsesFeedback: string
  sessions: string
  survey: string
  surveyStatistics: string
  nthOrderRefunds: string
  researchCausesOfReturns: string
  discontentParents: string
  unhappyParents: string
  unhappyParentsStatistics: string
  consecutiveUnexecutedTasks: string
  statisticsNonPerformers: string
  list: string
  groupedByPupil: string
  warningMentors: string
  mentorTasks: string
  mentorSessionTasks: string
  confirmationCode: string
  mobileAppSwap: string
  unansweredMessages: string
  returnStatistics: string
  failedCalls: string
  standardPupils: string
  standardPupilsStatistics: string
  freezingPupils: string
  sessionStatistics: string
  commonKpi: string
  ubtKpi: string
  testPupilKpi: string
  mlResponseStatistics: string
  mlPerformanceStatistics: string
  mlClosedStatistics: string
  sessionTaskStatistics: string
  autoSurvey: string
  evaluatedSessionsStatistics: string
  messageStatistics: string
  sevenDaysStatistics: string
  continueStatistics: string
  problemPupil: string
}

interface Localize_ProblemPupil {
  monitored: string
  doYouWantToChangeYourStudentStatus: string
  howManyDaysLeftToControl: string
  controlStartDate: string
  executionStatus: string
  addPupilControl: string
  enterPupilNumber: string
  startDayControl: string
  durationOfObservation: string
  whereDidThePupilsComeFrom: string
  reasonForMonitoring: string
}

interface Localize_SalesDashboard {
  sales: string
  likeOneC: string
  compareOneC: string
  findAnomaly: string
  parentRewards: string
  subscriptionChangeRequest: string
  salesSum: string
  salesKPI: string
  leadDivision: string
  salesAmount: string
  recordAnalysis: string
  recordingIndicators: string
  recordingStatistics: string
  farmerLeadStatistics: string
  conversion: string
  managerStatistics: string
  sarafanLeadStatistics: string
}

interface Localize_ConsecutiveUnexecutedTasksList {
  chooseDayCount: string
  notCompletedMoreThan30: string
  pupilAmount: string
  activePupilCount: string
  mentorFullname: string
  callStatus: string
  isCalled: string
  isStandard: string
  chooseManager: string
  chooseMentor: string
  chooseSbb: string
  studentStatistics: string
  pupilsWithFreezings: string
}

interface Localize_StatisticsNonPerformersList {
  mentorStatistics: string
  mentorAppealsStatistics: string
  nonCallMessageSent: string
  completedTasks: string
  performToday: string
  return: string
  later: string
  loggedIn: string
  notNeeded: string
}

interface Localize_MentorTaskList {
  addTasks: string
  taskDescription: string
  whoGaveTask: string
}

interface Localize_ClientHistories {
  generalInformation: string
  changes: string
  returns: string
  dissatisfaction: string
  tasks: string
  surveyResults: string
  saleErrors: string
  hobbiesInterestsPerformance: string
  schoolSchedule: string
  whoToldScript: string
  phoneNumber: string
  taskExplanation: string
  consultation: string
  different: string
  motivation: string
  generalStatistics: string
  whatChanged: string
  before: string
  after: string
  whoChanged: string
  subscriptionChanges: string
  studyDates: string
  profileChanges: string
  studyClass: string
  studyLanguage: string
  generalInformationChanges: string
  studyChanges: string
  topicPo: string
  tasksNumber: string
  deletedDiagnostics: string
  deletedUntDiagnostics: string
  skipUntDiagnosticLessons: string
  salesDate: string
  point: string
  note: string
  whoConducted: string
  whenAdded: string
  source: string
  taskCategory: string
  taskType: string
  exactTime: string
  whoTookTheTask: string
  whenTaskTaked: string
  criteryOkk: string
  acceptedRejected: string
  isClosed: string
  returnReasons: string
  red: string
  noColor: string
  returnType: string
  returnSum: string
  sentToSbb: string
  addNewPenaltyStandard: string
  addByOne: string
  addStandardByFile: string
}

interface Localize_ReturnStatisticsList {
  returnClosed: string
  statisticType: string
  returnClosureStatistics: string
  returnReasonsStatistics: string
  managerStatistics: string
  studyDurationStatistics: string
  monthStatistics: string
  returnPercentageStatistics: string
  returnStatistics: string
  managerReturnStatistics: string
  twoMonthsAgoPaymentsSum: string
  oneMonthsAgoPaymentsSum: string
  closedByMentor: string
  closedByReturnManager: string
  returned: string
  categoryStatistics: string
  unsolicitedReturnPayments: string
  amountClosedReturns: string
  amountReturnOfNewPupils: string
  betweenFiveAndFifteen: string
  amountReturnOfRemainingPupils: string
  otherPayments: string
  returnedAmount: string
  productReason: string
  mentorReason: string
  serviceReason: string
  managerReason: string
  clientReason: string
  platformReason: string
  returnCauseCategory: string
  returnCause: string
  returnCauseInRussian: string
  returnManagerEnteredInformation: string
  subscriptionDaysQuantity: string
  studiedDaysAmount: string
  studiedDaysSum: string
  bankCommissionSum: string
  managerCommissionSum: string
  isHoldManagerSum: string
  holdSum: string
  holdReason: string
  calculate: string
  isShortedStudyDuration: string
  changerDuration: string
  oldStudyMonths: string
  newStudyMonths: string
  realCauseCount: string
  addRealCause: string
  beforeFifteenDayReturns: string
  betweenFifteenAndThirtyDayReturns: string
  betweenThirtyOneAndNinetyDayReturns: string
  afterNinetyDayReturns: string
}

interface Localize_PhoneNumberChangeRequest {
  parentPhoneNumber: string
  pupilPhoneNumber: string
  editPhoneNumber: string
  oldPhoneNumber: string
  subscription: string
  notSubscription: string
  isWhatsApp: string
  isWeb: string
}

interface Localize_RatingPage_Filter {
  legend: string
  byClass: string
  byInstitution: string
  byDistrict: string
  byRegion: string
  byCountry: string
  onlyMyGrade: string
  allGrades: string
}

interface Localize_RatingPage_Summary {
  pupilsQuantity: string
  pupilPosition: string
}

interface Localize_RatingPage {
  simpleTaskPoints: string
  wordTaskPoints: string
  difficultTaskPoints: string
  controlWorkPoints: string
  ratingUpdateInfo: string
  weeklyRating: string
  place: string
  countOfTasks: string
  filter: Localize_RatingPage_Filter
  summary: Localize_RatingPage_Summary
  fullName: string
  allPoints: string
  green: string
  blue: string
  controlWork: string
}

interface Localize_FigureTypes {
  line: string
  asymptoteLine: string
  lineSegment: string
  parabola: string
  cubicParabola: string
  hyperbola: string
  circle: string
  rootFunction: string
  exponentialFunction: string
  logarithmGraph: string
}

interface Localize_Profile {
  title: string
  userDataSaved: string
  mainInfo: string
  bindTeacher: string
  changePassword: string
  myTeachers: string
  institutionTeachers: string
  subscribe: string
  addTeacherByCode: string
  teacherCode: string
  fullname: string
  teacherCodeMustBe10: string
  currentPassword: string
  newPassword: string
  repeatNewPassword: string
  incorrectRepeatPassword: string
  incorrectNewPassword: string
  region: string
  district: string
  institution: string
  findInstitutionByTyping: string
  noInstitutionsResults: string
  yourGrade: string
  grade: string
  gradeLetter: string
  studyLanguage: string
  department: string
  daysOff: string
  gradeNotChoosed: string
  languageNotChoosed: string
}

interface Localize_SelfWorksPage {
  newSelfWorkAdded: string
  selfWorkRemovedByTeacher: string
  acceptedPercent: string
  itIsNecessaryToPublishTheReadingStageOfTheFirstTopic: string
  youCollectedPercent: string
}

interface Localize_PupilFreezings {
  setDate: string
  freezingDate: string
  freezingEndDate: string
  amountOfDays: string
  whoAdded: string
  limitFreezings: string
  limitedMonthFreezings: string
  chooseDate: string
  freezingGetDate: string
  takenDay: string
  endDay: string
  freezeLimit: string
  totalFreezesUsed: string
  pupilFreezesUsed: string
  mentorFreezesUsed: string
  freezesRemaining: string
  availableOnlyMentors: string
}

interface Localize_Expense {
  expenseDate: string
  explanation: string
  newExpense: string
}

interface Localize_Task {
  chooseSection: string
  chooseChapter: string
}

interface Localize_TeacherPage {
  myProfile: string
  pupilListDashboard: string
  rating: string
  lessonList: string
  realtimeDashboard: string
  highViewDashboard: string
  selfWorkDashboard: string
  controlWorksDashboard: string
  constructorDashboard: string
  schoolProgress: string
}

interface Localize_PupilListDashboard {
  part: string
  school: string
  grade: string
  notMyPupil: string
  addPupil: string
  minimumTask: string
}

interface Localize_RealtimeDashboard {
  fromNow: string
  minutes: string
  oneHour: string
  hours: string
  oneWeek: string
  oneYear: string
  min: string
  all: string
  pupilsNotSubscribed: string
  nobodySolvedTasksByFilter: string
  nobodySolvedTasksByHours: string
  subscribePupilsToTeacherByPupilSide: string
  noMessages: string
  writeToPupil: string
  writeToParent: string
  incorrectAnswer: string
  solutionIsShown: string
  correctAnswer: string
  videoExplanationIsShown: string
}

interface Localize_MentorEvaluationCriteria {
  mentorPresent: string
  instructionPresent: string
  portalPresent: string
  personalStudyPresent: string
  diagnosticPresent: string
  freezingPresent: string
  cashbackPresent: string
  coinsAndCharsPresent: string
  standardPackagePresent: string
  mathPresent: string
  penaltySystemPresent: string
  mentorWorkTimePresent: string
  mentorDailyWorkPresent: string
  mentorWithParentPresent: string
}

interface Localize_SelfWorksDashboard {
  showWithFinished: string
  addSelfWork: string
  sendToWhatsappGroup: string
  copyToClipboard: string
  selfWorksThatNecessaryToExecute: string
  assignedSelfWorks: string
  unsuccessfullyFinishedSelfWorks: string
  finishedSelfWorks: string
  chooseExistingLesson: string
  chooseConstructorLesson: string
  deadline: string
  learningStage: string
  checkingStage: string
  create: string
  assignSelfWorks: string
  chooseExistingLessonOrConstructorLesson: string
  chooseDeadline: string
  chooseLesson: string
  selfWorksAssigned: string
  oldTasks: string
  newTasks: string
  repeatedTasks: string
  nextLesson: string
  isMistakeTasksIgnore: string
}

interface Localize_MentorEstimateTypes {
  expertise: string
  relevance: string
  care: string
  punctuation: string
  clarity: string
  fullness: string
  diligence: string
  correctness: string
  accessibility: string
}

interface Localize_ConstructorDashboard {
  lessonConstructor: string
  taskConstructor: string
  name: string
  tasksQuantity: string
  createDate: string
  chooseTasks: string
  createTask: string
  showTasks: string
  description: string
  task: string
  chooseFolder: string
  keyboard: string
  createFolder: string
  folderName: string
  addGeneration: string
  preview: string
  enterFolderName: string
  enterTaskAnswer: string
  enterTaskDescription: string
  taskDescription: string
  taskSolution: string
}

interface Localize_VariableModal {
  naturalNumber: string
  equation: string
}

interface Localize_LandingPage_B2bInfo {
  title: string
  feature1: string
  feature2: string
  feature3: string
  feature4: string
  phoneNumber: string
  learnMore: string
}

interface Localize_LandingPage_FeatureListBlock {
  feature1: string
  feature2: string
  feature3: string
  feature4: string
  feature5: string
  feature6: string
}

interface Localize_LandingPage_ForSomebodyBlock_ForTeacher {
  item1: string
  item2: string
  item3: string
}

interface Localize_LandingPage_ForSomebodyBlock_ForParents {
  item1: string
  item2: string
  item3: string
}

interface Localize_LandingPage_ForSomebodyBlock_ForPupil {
  item1: string
  item2: string
  item3: string
}

interface Localize_LandingPage_ForSomebodyBlock {
  teacher: string
  parents: string
  pupil: string
  beforeFor: string
  afterFor: string
  forTeacher: Localize_LandingPage_ForSomebodyBlock_ForTeacher
  forParents: Localize_LandingPage_ForSomebodyBlock_ForParents
  forPupil: Localize_LandingPage_ForSomebodyBlock_ForPupil
}

interface Localize_LandingPage_HowItWorksBlock_Title {
  howText: string
  itWorksText: string
}

interface Localize_LandingPage_HowItWorksBlock_Item1 {
  title: string
  description: string
}

interface Localize_LandingPage_HowItWorksBlock_Item2 {
  title: string
  description: string
}

interface Localize_LandingPage_HowItWorksBlock_Item3 {
  title: string
  description: string
}

interface Localize_LandingPage_HowItWorksBlock_Item4 {
  title: string
  description: string
}

interface Localize_LandingPage_HowItWorksBlock_Item5 {
  title: string
  description: string
}

interface Localize_LandingPage_HowItWorksBlock_Item6 {
  title: string
  description: string
}

interface Localize_LandingPage_HowItWorksBlock {
  title: Localize_LandingPage_HowItWorksBlock_Title
  description: string
  item1: Localize_LandingPage_HowItWorksBlock_Item1
  item2: Localize_LandingPage_HowItWorksBlock_Item2
  item3: Localize_LandingPage_HowItWorksBlock_Item3
  item4: Localize_LandingPage_HowItWorksBlock_Item4
  item5: Localize_LandingPage_HowItWorksBlock_Item5
  item6: Localize_LandingPage_HowItWorksBlock_Item6
}

interface Localize_LandingPage_ReviewsBlock {
  reviewsText: string
}

interface Localize_LandingPage {
  b2bInfo: Localize_LandingPage_B2bInfo
  title: string
  welcomeMessage: string
  loginMessage: string
  featureListBlock: Localize_LandingPage_FeatureListBlock
  service: string
  serviceUnt: string
  forSomebodyBlock: Localize_LandingPage_ForSomebodyBlock
  howItWorksBlock: Localize_LandingPage_HowItWorksBlock
  reviewsBlock: Localize_LandingPage_ReviewsBlock
}

interface Localize_ItSupport {
  support: string
  requestType: string
  description: string
  marks: string
  comment: string
  halfFixed: string
  noFixed: string
  mark: string
  bug: string
  dbRequest: string
  mistake: string
  cashbackCode: string
  saved: string
  edit: string
  mobile: string
  chat: string
  task: string
  personalStudy: string
  function: string
  affectedPeopleCount: string
  new: string
  fixed: string
  itComment: string
  taskStatus: string
  noAnswer: string
}

interface Localize_Footer {
  support: string
  workingHours: string
  workingDays: string
  office: string
  mentorContactNumber: string
  subscribeContactNumber: string
  salesContactNumber: string
  kazakhDepartment: string
  russianDepartment: string
  rule1: string
  rule2: string
  rule3: string
  rule4: string
}

interface Localize_Reward_Statuses {
  '10': string
  '20': string
  '30': string
  '31': string
  '32': string
  '33': string
  '40': string
}

interface Localize_Reward {
  kaspiPhoneNumber: string
  whoInvited: string
  dateOfEntry: string
  whoWasInvited: string
  addReward: string
  statuses: Localize_Reward_Statuses
}

interface Localize_PersonalStudyPage {
  warningText: string
  linkToTelegram: string
  needToBuySubscription: string
  inFreezing: string
  startNew: string
  continue: string
  tasksQuantity: string
  topicsThatNeedToBeMasteredOrRepeated: string
  yesterday: string
  today: string
  otherDay: string
  allSum: string
  givenCashback: string
  cashbackSum: string
  purchasedCharactersCashbackSum: string
  coinSum: string
  purchasedCharactersCoinSum: string
  leftCoinSum: string
  inRequest: string
  leftCashback: string
  leftCashbackAfterCommission: string
  cashbackLastUpdate: string
  passShownDiagnostic1: string
  passShownDiagnostic2: string
  attention: string
  cashbackAfterCommission: string
  cashbackAfterCommissionPayToMe: string
  writeParentsCardNumber: string
  writeParentsCardNumberPayToMe: string
  cashbackIsAcceptedOnlyOnWorkdays: string
  cashbackIsAcceptedOnlyOnWorkdaysNew: string
  cashbackIsNotAcceptedOnHolydays: string
  canNotGiveCashback: string
  date: string
  getCashback: string
  showCashbacks: string
  cashbackVideoExplanation: string
  myPhoneNumber: string
  myParentsPhoneNumber: string
  otherPhoneNumber: string
  nameoftheOwnerKaspi: string
  sendRequest: string
  iftheEnteredInformationisCorrect: string
  fillinEmptyCells: string
  toGetTheRemainingCashback: string
  cashbackRequestIsnotAcceptedAtNight: string
  theCashbackBalanceMustExceed0Tenge: string
  notAllowedToPayout: string
  theMainNumberOfTasks: string
  numberOfPenalties: string
  correctAnswers: string
  incorrectAnswers: string
  testScores: string
  videoExplanationsWereOpened: string
  solutionsWereOpened: string
  cashbackMaintenanceMessage: string
  requestForCashback: string
  cashbackRequestExists: string
  cashbackRequestLinkSent: string
  cashbackRequestLinkSentStatus: string
  cashbackRequestNewStatus: string
  cashbackRequestProcessedStatus: string
}

interface Localize_EmployeePenalties {
  employeeFines: string
  employeeName: string
  penaltyReason: string
  studentName: string
  studentPhoneNumber: string
  subscriptionType: string
  audioRecording: string
  penaltySum: string
  changedPenaltySum: string
  employeeRole: string
  penaltyDate: string
  isPenaltyAppeal: string
  appealReason: string
  newSubscription: string
  subscription: string
  subscriptionRenewal: string
  entryGetting: string
  authorFullName: string
  removePenalty: string
  penalty: string
  priorityType: string
}

interface Localize_EmployeeList_B2b {
  admin: string
  moderator: string
  manager: string
  seniorMentor: string
  mentor: string
  employee: string
}

interface Localize_EmployeeList {
  salesManager: string
  salesManagerFarmer: string
  financier: string
  accountant: string
  hunter: string
  hunterTeamLead: string
  mentor: string
  qcd: string
  hrEmployee: string
  marketolog: string
  directorSalesDepartment: string
  assistantSalesDepartment: string
  headSalesDepartment: string
  dataAnalytics: string
  headOfDepartment: string
  headOfMentor: string
  teamLeadOfMentors: string
  hrManager: string
  hrDirector: string
  hrRecruiter: string
  brandHR: string
  b2b: Localize_EmployeeList_B2b
  contentEmployee: string
  itEmployee: string
  returnManager: string
}

interface Localize_SendToWhatsApp {
  pupil: string
  parent: string
  checkTheCorrectnessOfWhatsApp: string
  firstMessage: string
  firstMessageTelegram: string
  informationAboutMakingPayment: string
  thisIsNotNewStudent: string
  certificate: string
}

interface Localize_PaymentIncomeRecognition {
  start: string
  end: string
  numberOfDaysTraining: string
  numberOfFreezingDays: string
  daysOfServiceByService: string
  days: string
  paymentAmount: string
  startAndEnd: string
}

interface Localize_IncorrectWhatsappPhoneNumber {
  quantityWhatsappPhoneNumber: string
  phoneNumbersWithoutWhatsapp: string
}

interface Localize_ManagerRecordStatsList {
  allCalls: string
  successfullCalls: string
  callDuration: string
}

interface Localize_ManagersFinanceReport {
  manager: string
  startingFromNovember: string
  septemberOctober: string
  date: string
  sumOfPayments: string
  sumOfReturns: string
  sumOfPenalties: string
  payout: string
  closingBalance: string
  openingBalance: string
  sumBeforeDeposit: string
  deposit: string
  sumAfterDeposit: string
  sumToHand: string
  addPenalty: string
  needToSend: string
  oweToCompany: string
  sendMoney: string
}

interface Localize_PaymentList {
  oldSarafan: string
  partner: string
  progrev: string
  continuation: string
  intern: string
  blogerKid: string
  relatives: string
  withoutReturn: string
  message: string
  returnRequest: string
  incomeRecognation: string
  paymentHistory: string
  paymentChangeRequest: string
  returnRequestSuccess: string
  canNotGetCheck: string
  landing: string
  installment: string
  month: string
  managerPayment: string
  withPrepayment: string
  rejectCause: string
  changingPupil: string
  unt: string
  autoPayment: string
  mailing: string
  noKaspiLink: string
  writeRelative: string
}

interface Localize_PayoutList {
  chooseRequestDate: string
  accept: string
  requestDone: string
  requestAccepted: string
  error: string
  sentCard: string
  requestToAccept: string
  requestToReject: string
  adminAdded: string
  rejected: string
  reject: string
  choosePayType: string
  bonus: string
  removed: string
}

interface Localize_ProblemPupilList {
  pupilProblem: string
  parentProblem: string
  whoProblem: string
  addProblemPupil: string
  recoverProblemPupil: string
  deleteProblemPupil: string
}

interface Localize_ReturnRequestList {
  returnCauses: string
  notAdded: string
}

interface Localize_B2bInstitution {
  dayOff: string
  mondayMessage: string
  isPupilsReceiveDailyMessage: string
  duplicated: string
  phoneNumberDuplicated: string
  plannedExercises: string
  executedExercises: string
  absent: string
  absentStudents: string
}

interface Localize_HuntersReferences {
  newHunter: string
  chooseHunter: string
  date: string
}

interface Localize_HunterCrmStatuses {
  present: string
  nonCall: string
  canNotParticipate: string
  notInvolved: string
  notRegisteredPhone: string
  double: string
  notWhatsappNumber: string
  notGiveParentsNumber: string
  studied: string
  recall: string
  forMobile: string
  forFarmer: string
  sarafanSent: string
  webinarSent: string
  whatsappResponded: string
  blackList: string
  noNeed: string
  free: string
  onlineNotNeeded: string
}

interface Localize_ManagersReferences {
  saleDepartment: string
  isHunterCloser: string
  newManager: string
  department: string
  binotelLine: string
  addBinotelLine: string
  holdMoney: string
  sendMoney: string
  holdMoneySum: string
  sendMoneySum: string
  late: string
  normative: string
  payment: string
}

interface Localize_MarketingNews {
  summary: string
  text: string
  postImage: string
}

interface Localize_MentorAssignedWorkday {
  workSchedule: string
  workingHours: string
  role: string
  pupilToControl: string
  newPupilsKPI: string
  motivation: string
  notConsecutively: string
  unt: string
  trialKPI: string
  mobile: string
  workType: string
  addMentor: string
  qualification: string
  assignTime: string
  workingDays: string
  addWorkingDays: string
  allPupils: string
  taskExplanation: string
  sbbApplication: string
  chat: string
  notCompleted: string
  problemPupil: string
  noWork: string
  lunch: string
  chooseTask: string
  chooseWeekday: string
  chooseLunch: string
  dayOff: string
  reassignedToWho: string
  pupil: string
  all: string
  parent: string
  startedAt: string
  finishedAt: string
  assignedStartedAt: string
  assignedFinishedAt: string
  mentorAssignedWorkday: string
  mentorWorkday: string
  editMentorWorkday: string
  editMentorAssignedWorkday: string
}

interface Localize_Weekdays {
  monday: string
  tuesday: string
  wednesday: string
  thursday: string
  friday: string
  saturday: string
  sunday: string
}

interface Localize_NewPupilCall {
  callLaterTime: string
  isPupil: string
  sendMessage: string
  sendedMessage: string
  seeMessage: string
  assigned: string
  numberOfPupilsForTomorrow: string
}

interface Localize_PrepaymentList {
  returnDate: string
  bankPercent: string
  returnFromBankSum: string
  returnSum: string
  returnByWhat: string
  returnSumZero: string
}

interface Localize_PaymentChangeRequest {
  needToAccept: string
  rejected: string
  accepted: string
  openToWatch: string
  sendDate: string
  removed: string
}

interface Localize_Messages {
  audioMessage: string
  videoMessage: string
  imageMessage: string
  documentMessage: string
}

interface Localize_LmsList {
  passPersonalTest: string
  passTemperamentTest: string
  pass: string
  chooseLesson: string
  psychotest: string
  theoryTest: string
  addVariant: string
  questionInKazakh: string
  questionInRussian: string
  changeQuestion: string
  changeTheory: string
  text: string
  video: string
  image: string
  audio: string
  theoryInKazakh: string
  theoryInRussian: string
  linkInKazakh: string
  linkInRussian: string
  addAnswer: string
  variant: string
  variantInRussian: string
  addTheory: string
  sbbList: string
  salesList: string
}

interface Localize_SubscriptionRequestList_Status {
  new: string
  unpaid: string
  mentorConfirmed: string
  mentorNotConfirmed: string
  financierConfirmed: string
  financierNotConfirmed: string
  renewedCheck: string
  SBBConfirmed: string
  SBBFoundMistake: string
  changeRequestHasBeenSubmitted: string
  changeRequestAccepted: string
  changeRequestRejected: string
  subscriptionChangedOtherPupil: string
}

interface Localize_SubscriptionRequestList_MessageButtons {
  toParentWhatsapp: string
  toPupilWhatsapp: string
  toParentSms: string
}

interface Localize_SubscriptionRequestList {
  newSubscriptions: string
  renewingSubscriptions: string
  subscriptionsAmount: string
  register: string
  calledPhoneNumber: string
  paid: string
  sendMessage: string
  parentPhoneNumber: string
  acceptFinancier: string
  renewCheck: string
  qcdCheck: string
  status: Localize_SubscriptionRequestList_Status
  messageButtons: Localize_SubscriptionRequestList_MessageButtons
  chooseQcd: string
  checkProblem: string
  normativ: string
  paymentProblem: string
  guaranteesProblem: string
}

interface Localize_FarmerCrmList_Status {
  expected: string
  letsThink: string
  kaspiReject: string
  halykReject: string
  jusanReject: string
  contactLater: string
  TNB1: string
  TNB2: string
  TNB3: string
}

interface Localize_FarmerCrmList {
  sevenDayLeads: string
  monthLeads: string
  leadFromBase: string
  dividedLeads: string
  soldLeads: string
  allLeads: string
  dailyReport: string
  weekReport: string
  monthlyReport: string
  takeDayOff: string
  chooseDate: string
  status: Localize_FarmerCrmList_Status
  dateTo: string
  callDay: string
  chooseResponsibleFarmer: string
}

interface Localize_Olympiad {
  class: string
  readTheRules: string
  internetNormal: string
  battery: string
  timeAhead: string
  noCheating: string
  olympiadForm: string
  fillForm: string
  dontMissResult: string
  downloadMobileQalan: string
  olympiadRules: string
  olympiadPayments: string
  olympiadStage: string
  olympiadYourTour: string
  olympiadYourTourGreat: string
  beforeStartOlympiad: string
  writeYourNumberCorrectly: string
  enterYourClassProperly: string
  goToPlaceWhereNoOneBothersYou: string
  checkTheInternetBeforeStarting: string
  chargeThePhone: string
  accessOtherSitesOrApplicationsIsProhibited: string
  timeAllottedForPass: string
  tasksCount: string
  toolsYouNeed: string
  penNotebook: string
  start: string
  passCarefully: string
  needCorrectData: string
  ifYouHaveQuestionWriteToWhatsapp: string
  youHaveReceivedPassFinalStage: string
  youHaveReceivedPassNextStage: string
  weContactYouSoonWithDetailedInformation: string
  downloadDiplomaInQualityFormat: string
  accordingResultsStageCompetition: string
  howeverJustGettingPointAchievement: string
  weSureThatYou: string
  outOfTasksCorrect: string
  youHaveCollected: string
  youDidNotGetPrize: string
  olympiadCanSubmittedOnlyOnce: string
  thankYouForParticipatingInOlympics: string
  purchaseRequiredDownloadDiploma: string
  ifYouPurchasedDiploma: string
  downloadDiploma: string
  haveQuestion: string
  parentWillPay: string
  byKaspiQR: string
  price: string
  diplomaWillSendOnWhatsapp: string
  willBeSendAuto: string
  chooseStage: string
  noDiploma: string
  chooseGrade: string
  selectLowerGradeTitle: string
  selectLowerGradeExample: string
}

interface Localize_Countries {
  Kazakhstan: string
  Russia: string
  Uzbekistan: string
  Azerbaijan: string
}

interface Localize_CashbackBlock {
  toBlock: string
  receiveReason: string
  startDate: string
  endDate: string
  responsible: string
  reason: string
}

interface Localize_SubscriptionList {
  newSubscription: string
  newPayment: string
  subscriptions: string
  withoutSubscription: string
  check: string
  kaspiPaymentRequest: string
  unitedPaymentRequest: string
}

interface Localize_Subscription {
  newPupil: string
  oldPupil: string
  whoRelative: string
  commentary: string
  paymentAmount: string
  shouldISplitThePayment: string
  amountToBeDistributed: string
  isItInUse: string
  selectTheParentStudentFromWhom: string
  needToCreateASubscription: string
  paymentPhoneNumber: string
  replaceCompletely: string
  math: string
  english: string
}

interface Localize_SubscriptionsTable {
  buttons: string
  amount: string
  comeFrom: string
  checker: string
  confirmation: string
  change: string
  requestToChange: string
  requestForRefund: string
  paidAt: string
  internalInstalment: string
  acceptedDate: string
  courseType: string
}

interface Localize_ChangeSubscriptionStatus {
  everythingIsCorrect: string
  thereIsAnError: string
  selectPayment: string
}

interface Localize_IntegerVariable {
  start: string
  end: string
  step: string
  generate: string
  integer: string
}

interface Localize_MathEditor {
  noNeedCircle: string
  untilNatural: string
  untilTenth: string
  untilHunderdth: string
  untilThousandth: string
  untilTenThousandth: string
}

interface Localize_PlanedActualSales {
  enterPlan: string
  chooseMonth: string
  january: string
  february: string
  march: string
  april: string
  may: string
  june: string
  july: string
  august: string
  september: string
  october: string
  november: string
  december: string
  planSum: string
  factSum: string
  shownResult: string
  planMin: string
  factMin: string
  leadsCount: string
  salesCount: string
}

interface Localize_RecordingAnalysis {
  addRecording: string
  date: string
  leadType: string
  giveReason: string
  introducing: string
  findNeedness: string
  presentation: string
  parentObjection: string
  closeObjection: string
  landing: string
  landingBio: string
  bloger: string
  sarafanLink: string
  sarafanHunter: string
  brandMarketing: string
  mobile: string
  webinarHunter: string
  tiktok: string
  value: string
  advantage: string
  disadvantage: string
  status: string
  webinar: string
  savedWebinar: string
  sarafan: string
  farmer: string
  introduced: string
  notIntroduced: string
  notFullIntrodution: string
  identified: string
  notIdentified: string
  notClosed: string
  closed: string
  needConsulting: string
  notWantRascrochka: string
  anotherCourse: string
  notWantOnline: string
  notSure: string
  callBackLater: string
  passDiagnostics: string
  sendToWhatsApp: string
  needToThink: string
  isFree: string
  needRest: string
  wasFree: string
  expensive: string
  schoolStarts: string
  healthProblem: string
  pupilWillNotDo: string
  notBelievePlaceLimit: string
  wealthProblem: string
  noNeed: string
  seeLater: string
  internetProblem: string
  noTimeToWatch: string
  noWork: string
  seeAsPedagog: string
  pupilNoStudy: string
  wantToKnowPrice: string
  graphicProblem: string
  schoolPreparing: string
  ifPupilDislike: string
  guarentee: string
  ktlNis: string
  interrupt: string
  dislikePlatform: string
  suggest: string
  notSuggestNeedCourse: string
  clientNoListen: string
  priceProblem: string
  hurryClient: string
  webinarTeach: string
  farmerTeach: string
  normativProblem: string
  consultingAsRobot: string
  farmerLead: string
  noObrabotka: string
  notClearThinking: string
  microProblem: string
  rudeTalking: string
  minTalking: string
  thinkingClient: string
  normativ: string
  teacherPresentation: string
  needOdopbrenieThenConsulting: string
  psychologyNotWorking: string
  valueIsNotEnough: string
  twelveMonth: string
  oneMonth: string
  notFullAudio: string
  whatsappWorking: string
  notKnowPlatform: string
  objectionCloseProblem: string
  presentationGood: string
  obrabotkaNeed: string
  goodDialog: string
  expertNeed: string
}

interface Localize_SbbDiscontentParent {
  instagram: string
  return: string
  serviceChat: string
  dependMentor: string
  dependServer: string
  wrongInfoManager: string
  dependProduct: string
  negativeDay: string
  beforeNegative: string
  afterNegative: string
  afterDayNegative: string
  negativeOnReturn: string
  anotherCause: string
  goodClientAndCritic: string
  notKnowAboutPlatform: string
  hater: string
  dontLoveButCanWork: string
  goodClientNotWantToStudy: string
  employeeSolvedProblem: string
  quantity: string
  employees: string
  employeesStat: string
  stat: string
  variantQuant: string
  employeeName: string
  notEnded: string
  tnb: string
  ended: string
  divided: string
  canNotMark: string
}

interface Localize_SbbReturnCause {
  category: string
  mean: string
  closedByWho: string
  returnMonth: string
  part: string
  sum: string
}

interface Localize_SbbSurvey {
  answerVariant: string
}

interface Localize_TaskExp {
  openTaskExp: string
  closeTaskExp: string
  allTaskExp: string
  explainedCount: string
  notExplainedCount: string
  justClosedCount: string
  reassignedTaskExp: string
  explainedPercentage: string
  notExplainedPercentage: string
  tnbPercentage: string
  notContactPercentage: string
  mentorResponseTime: string
  fullExpTime: string
  explainTime: string
  explain: string
  taskOpenTime: string
  taskExplainedTime: string
  taskExpDuration: string
}

interface Localize_SessionList {
  firstResponse: string
  minute: string
  seconds: string
  allAverageResponseTime: string
  allMentorResponseTime: string
  allMLCloseTime: string
  allMentorSessionCloseTimeFromTaking: string
  allMentorSessionCloseTimeFromReceipt: string
  allSessionCloseTimeFromTaking: string
  allSessionCloseTimeFromReceipt: string
  allSessionCloseTime: string
  allSession: string
  median: string
  openSession: string
  closeSession: string
  allClosedSessions: string
  sessionsClosedByMentor: string
  sessionsClosedByBot: string
  sessionAverageCloseFromTaking: string
  sessionAverageCloseFromReceipt: string
  firstResponseRemoveOpenedAt: string
  allSessions: string
  markedSession: string
  notMarkedSession: string
  justClosed: string
  reassigned: string
  solved: string
  notSolved: string
  mentorAverageResponse: string
  sessionAverageClose: string
  session: string
  sessionOpenTime: string
  sessionCloseTime: string
  sessionDuration: string
  mark: string
  solvedStatus: string
  notMarked: string
  simplyClosed: string
  endedTime: string
}

interface Localize_TelegramChatList {
  telegramChat: string
  letters: string
  statistics: string
}

interface Localize_SessionTaskStatisticsList {
  refund: string
  dissatisfied: string
  consulting: string
  taskExplain: string
  hasSubscription: string
  openSession: string
  resolved: string
  undecided: string
}

interface Localize_TotalMentorKpiList {
  studentNumbers: string
  performersNumbers: string
  perfomanceKPI: string
  explanationKPI: string
  processingKPI: string
  freezing: string
  newStudents: string
  allStudents: string
}

interface Localize_TaskMistakeStatuses {
  new: string
  codeInReview: string
  inReview: string
  fixed: string
  notFixed: string
  notFinished: string
}

interface Localize_DashboardSections {
  functionals: string
  statistics: string
  telegramMessage: string
  sessions: string
  records: string
}

interface Localize_EmployeeTestTitles {
  temperamentTest: string
  personalityTest: string
}

interface Localize_HrDashboard {
  recommendation: string
  complaint: string
  myRecommendations: string
  myComplaints: string
  addRecommendation: string
  addComplaint: string
  yourRecommendation: string
  yourComplaint: string
  recommendations: string
  complaints: string
  surveys: string
  survey: string
  vote: string
  createSurvey: string
  createVote: string
  noteAboutEmployee: string
  noteStatistics: string
  surveyStatistics: string
  details: string
  allRecommendations: string
  allComplaints: string
  needToPass: string
  passed: string
  passing: string
  passSurvey: string
  passVote: string
  insertYourAnswer: string
  leaveComments: string
}

interface Localize_ScaleQuestionTypeAnswers {
  veryBad: string
  bad: string
  neutral: string
  good: string
  veryGood: string
}

interface Localize_RelativeSubscriptionRequestStatus {
  new: string
  accepted: string
  rejected: string
}

interface Localize_RelativeType {
  brother: string
  sister: string
  daughter: string
  son: string
}

interface Localize_InformingAboutRules {
  familiarWithInformation: string
  readRules: string
  ruleAboutGetCashback: string
}

interface Localize_TermsAndConditions {
  agreementWithTheTermsOfUse: string
  byContinuingToUseTheSite: string
  publicOffer: string
  privacyPolicy: string
  consentToTheProcessingOfPersonalData: string
  agreementWithThePublicOffer: string
  acceptAndContinue: string
  acceptingAndContinuing: string
}

interface Localize_Autocall {
  instant: string
  scheduled: string
  cancelled: string
  adminPanel: string
  closedAutocall: string
  settings: string
  callNow: string
  date: string
  target: string
  chooseDays: string
  call: string
  history: string
  ChooseDay: string
  audioFor: string
  balance: string
  areYouSure: string
  call2: string
  pupil: string
  parent: string
  day: string
  time: string
  days: string
  completed: string
  pending: string
  b2b: string
  chooseInstitutions: string
}

interface Localize_ProgressBar_Achievements_Descriptions {
  awakened: string
  student: string
  researcher: string
  practitioner: string
  advanced: string
  master: string
  strategist: string
  pro: string
  finalist: string
  legend: string
}

interface Localize_ProgressBar_Achievements {
  awakened: string
  student: string
  researcher: string
  practitioner: string
  advanced: string
  master: string
  strategist: string
  pro: string
  finalist: string
  legend: string
  descriptions: Localize_ProgressBar_Achievements_Descriptions
}

interface Localize_ProgressBar {
  progress: string
  leftUntilNextRank: string
  ranks: string
  youGetNewRank: string
  numberTasksTraining: string
  achievements: Localize_ProgressBar_Achievements
}

interface Localize_SalesBonus {
  bonuses: string
  shiftTurnover: string
  teamTurnover: string
  dayShiftTurnover: string
  eveningShiftTurnover: string
  coefficient: string
  formula: string
  shift: string
  dayShift: string
  eveningShift: string
  group: string
  headOfGroup: string
  teamLead: string
  trainer: string
  dayTrainer: string
  eveningTrainer: string
  shiftTrainers: string
  groupModalHeader: string
  groupModalHeader2: string
  rubToKzt: string
  name: string
  unknown: string
}

interface Localize_SpeechAnalytic_Criterias_Kaz {
  '1': string
  '2': string
  '3': string
  '4': string
  '5': string
  '6': string
  '7': string
  '8': string
  '9': string
}

interface Localize_SpeechAnalytic_Criterias_Rus {
  '1': string
  '2': string
  '3': string
  '4': string
  '5': string
  '6': string
}

interface Localize_SpeechAnalytic_Criterias {
  kaz: Localize_SpeechAnalytic_Criterias_Kaz
  rus: Localize_SpeechAnalytic_Criterias_Rus
}

interface Localize_SpeechAnalytic {
  callAnswerTime: string
  searchByLink: string
  areYouSureToDelete: string
  check: string
  audioLink: string
  update: string
  view: string
  audioChat: string
  shortDescription: string
  grade: string
  yourGrade: string
  criterias: Localize_SpeechAnalytic_Criterias
  item: string
  expertComment: string
  noComment: string
  yourComment: string
  yourText: string
  expertRecommendations: string
  recommendations: string
  insertedAt: string
  updatedAt: string
  linkAlreadyExists: string
  author: string
  linkCopied: string
  copyFailed: string
  addAnotherAudioLink: string
  removeAudioLink: string
  maxLinksReached: string
  invalidLinks: string
}

interface Localize_ManagerStatisticTable {
  managerName: string
  returnSum: string
  returnCount: string
  beforeFifteenDays: string
  betweenFiftenAndThirtyDays: string
  returnPercentOfSales: string
}

interface Localize_PowerBI {
  generalInformation: string
  sales: string
  fiveDayProgrev: string
  newPupilCallAnalysis: string
  customerService: string
  returnRequests: string
  careService: string
  clientFeedback: string
  managers: string
  managerPenalties: string
  pupils: string
  pupilsAndCompletedTasks: string
  pupilsWithoutTheMobileApp: string
  pupilFreezingOverview: string
  courses: string
  qalanEnglishMonitoring: string
  analytics: string
  coinsAndCashbackAnalytics: string
  allSessionAnalytics: string
  crmAnalytics: string
}

interface Localize_WhatsappTemplates {
  extractingDataFromFile: string
  title: string
  whatsappTemplate: string
  loadingTemplates: string
  selectTemplate: string
  totalTemplates: string
  sendTemplate: string
  createTemplate: string
  editTemplate: string
  deleteTemplate: string
  searchTemplates: string
  allStatuses: string
  approved: string
  pending: string
  rejected: string
  paused: string
  disabled: string
  refresh: string
  noTemplatesMatchFilters: string
  noTemplatesAvailable: string
  language: string
  createNewTemplate: string
  editingTemplate: string
  basicInformation: string
  templateNameCannotBeChangedAfterCreation: string
  onlyLowercaseLettersNumbersAndUnderscoresAllowed: string
  russian: string
  kazakh: string
  english: string
  templateComponents: string
  enterYourMessageTextHere: string
  addButton: string
  quickReply: string
  callPhone: string
  visitWebsite: string
  yourPhoneNumber: string
  websiteUrl: string
  templateNameIsRequired: string
  templateBodyTextIsRequired: string
  createdSuccessfully: string
  deletedSuccessfully: string
  unableToEditTemplate: string
  areYouSureYouWantToDeleteTemplate: string
  listOfRecipients: string
  dateTimeToSend: string
  sendNow: string
}

interface Localize_WhatsappMailingReport {
  title: string
  noData: string
  overallStatistics: string
  totalSent: string
  totalSuccessful: string
  totalError: string
  successRate: string
  totalInterestedReplies: string
  totalRejectedReplies: string
  errorRate: string
  lastSentDate: string
  sentCount: string
  selectDateRange: string
  fromDateIsAfterToDate: string
  dateRangeExceedsLimit: string
  loadError: string
  fromPhoneNumber: string
  template: string
  filters: string
  noFilterResults: string
  allTemplates: string
  allPhones: string
  clearFilters: string
}

export interface Localize {
  headerTitle: string
  discontentReason: string
  discontentReasons: Localize_DiscontentReasons
  selectCategory: string
  selectReasons: string
  errors: Localize_Errors
  realDiscontentReason: string
  nameManager: string
  region: string
  whoAccepted: string
  penaltyStandards: string
  accept: string
  accepting: string
  notAccept: string
  notAccepting: string
  freezingDays: string
  sender: string
  newFreezingRequests: string
  requestForFreezing: string
  comment: string
  whoSent: string
  causeCount: string
  showMore: string
  errorOutputCheck: string
  errorParentNotFound: string
  bankAcc: string
  new: string
  percent: string
  freezingCount: string
  completedCount: string
  NotCompletedCount: string
  accepted: string
  notAccepted: string
  repeatedRequest: string
  makeReturn: string
  network: string
  fullAmount: string
  kaspiCheckLink: string
  title: string
  educationCenter: string
  saved: string
  writeRequestReason: string
  stepNumber: string
  inTesting: string
  theory: string
  enterLastAnswer: string
  chooseLanguage: string
  useAnotherBrowserWebView: string
  timezoneWarning: string
  pricing: string
  diagnostics: string
  untDiagnostics: string
  passDiagnostics: string
  onlyNewStudents: string
  subscriptionHistory: string
  hasSubscription: string
  hasMobileApp: string
  noMobileApp: string
  researcher: string
  afterCommisionSum: string
  returnCommission: string
  afterSumCommision: string
  commission: string
  fileSum: string
  oneCSum: string
  platform: string
  differences: string
  insertFile: string
  listTasks: string
  insertExelFile: string
  checkAnomaly: string
  superBonus: string
  targetReport: string
  marketingReport: string
  businessCard: string
  freedomBankStatement: string
  tengeDifferences: string
  valutDifferences: string
  extractDay: string
  reportDay: string
  isRealtimeConnectedToMessages: string
  isItConnectedToRealtimeTasks: string
  showOnlyNonAnsweredMessages: string
  insertingAfterLoading: string
  searchInDatabaseByNumber: string
  searcher: string
  loader: string
  twoTimeMail: string
  sixTimeMail: string
  howManySend: string
  howManySended: string
  whenStart: string
  whenEnd: string
  readed: string
  personalStudy: string
  generalMath: string
  UNT: string
  mathLiteracy: string
  mathLiteracyShort: string
  topicsLearn: string
  payments: string
  prepayments: string
  awards: string
  subscriptionRequest: string
  farmerCrm: string
  myFinishedPersonalStudies: string
  subscribedLearners: string
  questions: string
  answers: string
  answer: string
  answerOptions: string
  notRegisteredInMessenger: string
  blockedUs: string
  QCD: string
  learning: string
  learningResults: string
  executionTime: string
  contactedThreeTimes: string
  numberOfParents: string
  employeeStatistics: string
  statisticsOnIssues: string
  whatDayFrom: string
  whatDayTo: string
  tenge: string
  howManyDaysQuestion: string
  uploadQuestions: string
  selectQuestion: string
  sbbReturnRequest: Localize_SbbReturnRequest
  whoseStatistics: string
  personalStudyDeleteOrStudentFinished: string
  olympiadPreview: Localize_OlympiadPreview
  calculatorList: Localize_CalculatorList
  tasks: string
  createArequest: string
  typesOfSessionSasks: Localize_TypesOfSessionSasks
  discontentParents: Localize_DiscontentParents
  sourcesOfSessionTasks: Localize_SourcesOfSessionTasks
  ConsultingSubcategories: Localize_ConsultingSubcategories
  ConsultingSubcategory: string
  source: string
  sessionTaskTable: Localize_SessionTaskTable
  farmerLeadStatus: Localize_FarmerLeadStatus
  taskMistakeStatus: Localize_TaskMistakeStatus
  taskMistakeInfo: Localize_TaskMistakeInfo
  taskMistakeTypes: Localize_TaskMistakeTypes
  departmentTypes: Localize_DepartmentTypes
  reportModal: Localize_ReportModal
  mainPage: Localize_MainPage
  notAccessable: string
  for1Day: string
  for1Week: string
  for1Month: string
  sendTask: string
  weekReport: string
  financialIssue: string
  pupilHealth: string
  offlineParticipate: string
  noInterest: string
  mentorNotConnected: string
  noFeedback: string
  lowQuality: string
  pupilTired: string
  falseInformation: string
  notSpecialSchool: string
  pupilNoTime: string
  noResult: string
  dissatisfiedPenaltySystem: string
  notCorrespondToClass: string
  fullNegativeParent: string
  numberOfPossibleAnswers: string
  number: string
  phoneNumbersQuantity: string
  employees: string
  addParent: string
  ended: string
  tnb: string
  reduction: string
  returnType: string
  isItResolved: string
  emergingTasks: string
  saveEmergingTask: string
  selectTime: string
  dissatisfiedProcessing: string
  whereInformationComeFrom: string
  unselected: string
  selected: string
  finished: string
  unsolved: string
  onlyMine: string
  total: string
  parent: string
  isParent: string
  problemDescription: string
  accordingStatus: string
  problem: string
  causeOfProblem: string
  dependsOnMentor: string
  messageToMentor: string
  dependsOnServer: string
  managerGaveIncorrectInformation: string
  dependsOnProduct: string
  parentProblem: string
  trueParentProblem: string
  discontentComment: string
  statisticsOnParents: string
  statisticsOfWhat: string
  typeOfCriterion: string
  byCategory: string
  whenAdded: string
  problemSolving: string
  processed: string
  notProcessed: string
  isHappyParent: string
  selectStudent: string
  chooseGroup: string
  sbbQuestionOperationModal: Localize_SbbQuestionOperationModal
  priorityChoosen: string
  dailyQuestionPriorityChoosen: string
  criteriaTypes: Localize_CriteriaTypes
  howSolved: string
  whyNotSolved: string
  newPupils: string
  processedPupils: string
  mentorReports: string
  pupilMessages: string
  parentMessages: string
  undefinedMessages: string
  message: string
  parentAssessment: string
  studentAssessment: string
  leaveWithoutAction: string
  updatedAt: string
  scoreSelect: string
  taskExplanationStats: string
  responseStats: string
  efficiencyStats: string
  point: string
  mentor: string
  estimation: string
  assessmentDate: string
  responseTaskExpTime: string
  fullExplainTime: string
  fullExplain: string
  allTaskExplanation: string
  explained: string
  completed: string
  tnbCount: string
  responseNumber: string
  addingNewAnswerOption: string
  newAnswerOption: string
  whichQuestionIsOption: string
  newVersionOfText: string
  freezings: string
  freezingBySelf: string
  points: string
  class: string
  letter: string
  grade: string
  beforeGrade: string
  chooseGrade: string
  unt: string
  logicTasks: string
  textTasks: string
  logicCourse: string
  logicalTasks: string
  preparationToSchool: string
  preparationToSpecialSchools: string
  math: string
  signOut: string
  task: string
  controlWork: string
  checkKnowledge: string
  untStatisticPointsTitles: Localize_UntStatisticPointsTitles
  minTaskForPreparation: string
  untPreparation: string
  alreadyCompleted: string
  pointsHaveBeenAdded: string
  taskAnswerIsEmpty: string
  previous: string
  next: string
  showSolution: string
  showingSolution: string
  iDontKnow: string
  telephone: string
  checkAnswer: string
  /** Shown above a test with more than one correct answer. */
  pickEveryFittingOption?: string
  checkingAnswer: string
  videoExplanation: string
  phoneNumber: string
  password: string
  skip: string
  repeatPassword: string
  confirmationCode: string
  cardNumber: string
  checkConfirmationCode: string
  resendCode: string
  resending: string
  confirmationCodeSent: string
  restorePassword: string
  passwordChanged: string
  passwordRestoring: string
  passwordSuccessfullyRestored: string
  signIn: string
  signingIn: string
  newPasswordTitle: string
  fillEmptyFields: string
  enterCorrectCardNumber: string
  fillFullName: string
  toMuchLetter: string
  thanksFollow: string
  noneCorrect: string
  wrongNameOlympiad: string
  minTasksError: string
  highSchoolMinTasksError: string
  outContacts: string
  codeConfirmationInfoText: string
  yourVariant: string
  yourQuestion: string
  registerForm: Localize_RegisterForm
  mlLogList: Localize_MlLogList
  started: string
  startedMinuteAgo: string
  callPupilPhoneNumber: string
  callParentPhoneNumber: string
  personalStudyDashboard: Localize_PersonalStudyDashboard
  problemPupil: Localize_ProblemPupil
  salesDashboard: Localize_SalesDashboard
  consecutiveUnexecutedTasksList: Localize_ConsecutiveUnexecutedTasksList
  statisticsNonPerformersList: Localize_StatisticsNonPerformersList
  mentorTaskList: Localize_MentorTaskList
  allOfNotFinished: string
  months: string
  clientHistories: Localize_ClientHistories
  returnStatisticsList: Localize_ReturnStatisticsList
  who: string
  pupilFirstname: string
  yourResult: string
  rightTasks: string
  rightTasksPlus: string
  timeTasks: string
  dontWorry: string
  whatNext: string
  payHundred: string
  payHundredText: string
  payKaspi: string
  downloadApp: string
  inApp: string
  downloadCertificate: string
  takeAnswer: string
  goNextTour: string
  takeCertificate: string
  takeCertificateText: string
  downloadApps: string
  joinNextTour: string
  joinNextTourText: string
  pupilSurname: string
  pupilPhoneNumber: string
  noCurrentSubscription: string
  phoneNumberChangeRequest: Localize_PhoneNumberChangeRequest
  parentPhoneNumber: string
  enterRealPupilPhoneNumber: string
  enterRealParentPhoneNumber: string
  start: string
  starting: string
  continue: string
  continuing: string
  testStart: string
  testStarting: string
  testContinue: string
  testContinuing: string
  mockTestStart: string
  untMockTest: string
  controlWorkStart: string
  controlWorkStarting: string
  controlWorkContinue: string
  controlWorkContinuing: string
  finish: string
  areYouSureToFinish: string
  sendThroughWhatsapp: string
  yourCode: string
  teacherCodeMessage: string
  notTelegramAccount: string
  sessionClosed: string
  template: string
  areYouSure: string
  yesFinish: string
  finishing: string
  noAndCancel: string
  areYouSureToRestartSolvingTasks: string
  yesSure: string
  yesStart: string
  areYouSureToStartCheckKnowledge: string
  areYouSureToStartControlWork: string
  goToHomePage: string
  yes: string
  no: string
  showDeleted: string
  iWantToBuyCourse: string
  buyCourse: string
  newAnswer: string
  appendToAnswer: string
  defining: string
  close: string
  inProcess: string
  sendOkk: string
  yourAnswer: string
  pupilAnswer: string
  correctAnswer: string
  yourAnswerIsCorrect: string
  yourAnswerIsCorrects: string[]
  yourAnswerIsNotCorrects: string[]
  yourAnswerIsNotCorrect: string
  checkInternetConnection: string
  temporarilyServerDoesNotWork: string
  serverError: string
  errorOnLoadingTasks: string
  controlWorkHasBeenAssigned: string
  controlWorkCanceled: string
  reportBug: string
  askQuestion: string
  fullName: string
  pupilCode: string
  sessionOpeningTime: string
  sessionDuration: string
  standardConversationTime: string
  subscriptionType: string
  transferToPremium: string
  transferToStandard: string
  ratingPage: Localize_RatingPage
  registration: string
  forgotYourPassword: string
  enterTeacherCode: string
  save: string
  saving: string
  cancel: string
  notFound: string
  downloadAudio: string
  previewTasks: string
  daysOfStudy: string
  dividingByPaket: string
  newPupilStatistics: string
  oldPupilStatistics: string
  fifteenDays: string
  fifteenDaysToFiftyFiveDays: string
  fiftyFiveDaysLater: string
  numberOfRequests: string
  timesAsked: string
  onRequest: string
  numberRequests: string
  startStudyDate: string
  dateOfRequest: string
  dayOfStudy: string
  trueReasonsForTheRequest: string
  times: string
  numberOfParentsSurvey: string
  daySurveyStatistics: string
  returnCategory: string
  realCauseOfReturn: string
  returnNumber: string
  figureTypes: Localize_FigureTypes
  chooseDrawingFigureType: string
  dailyTeamRating: string
  dailyManagerRating: string
  fillGraph: string
  profile: Localize_Profile
  selfWork: string
  selfWorksPage: Localize_SelfWorksPage
  closeSession: string
  add: string
  pupilFreezings: Localize_PupilFreezings
  expense: Localize_Expense
  Task: Localize_Task
  pupilsList: string
  managerRating: string
  managerReturnRating: string
  parents: string
  teacherPage: Localize_TeacherPage
  pupilListDashboard: Localize_PupilListDashboard
  realtimeDashboard: Localize_RealtimeDashboard
  mentorEvaluationCriteria: Localize_MentorEvaluationCriteria
  selfWorksDashboard: Localize_SelfWorksDashboard
  mentorEstimateTypes: Localize_MentorEstimateTypes
  constructorDashboard: Localize_ConstructorDashboard
  variableModal: Localize_VariableModal
  gradeHigherStudents: string
  returnSum: string
  laggingStudents: string
  writeWarning: string
  topDescription: string
  whichClassTasks: string
  chooseClassOrPupils: string
  loading: string
  choose: string
  sendWebinar: string
  requestSent: string
  noResults: string
  time: string
  show: string
  landingPage: Localize_LandingPage
  itSupport: Localize_ItSupport
  footer: Localize_Footer
  congratulations: string
  team: string
  reward: Localize_Reward
  personalStudyPage: Localize_PersonalStudyPage
  employeePenalties: Localize_EmployeePenalties
  employeeList: Localize_EmployeeList
  lessonTitle: string
  result: string
  status: string
  changeStatus: string
  startDate: string
  finishDate: string
  durationTime: string
  assignDate: string
  deadlineDate: string
  reloadPage: string
  reloadPageToGetLastChanges: string
  edit: string
  submitATask: string
  firstname: string
  firstnameInRussian: string
  surname: string
  writeToTeacher: string
  freeTasksText: string
  freeTasksText2: string
  summativeAssessment: string
  messagesHistory: string
  paginationText: string
  mentorEvaluate: string
  mentorEvaluated: string
  newLead: string
  messagesTemplate: string
  iHaveAlreadyRegistered: string
  withoutBotMessages: string
  withBotMessages: string
  numberOfNotCompleted: string
  totalNumber: string
  numberOfCompleted: string
  withdrawalOfFunds: string
  restOfTheSum: string
  numberOfGraduates: string
  numberOfSubscribers: string
  fromDate: string
  toDate: string
  connect: string
  endDate: string
  numberOfDays: string
  connectionDate: string
  contactedDateTime: string
  beforeFreezing: string
  afterFreezing: string
  changeSum: string
  fileAnAppeal: string
  isPenaltyAppeal: string
  toParent: string
  toPupil: string
  change: string
  remove: string
  whoAdd: string
  paymentDate: string
  conclusion: string
  open: string
  search: string
  selectTheStatus: string
  nonCall: string
  leaveUnchanged: string
  questionWithVariant: string
  gotThrough: string
  callBackLater: string
  numberOfAppraisers: string
  numberOfThoseWhoDidNotRate: string
  dateOfAssessment: string
  students: string
  amountOfPayments: string
  amountOfRequestedPayments: string
  amountOfFuturePayments: string
  totalAmountOfPayments: string
  studentCode: string
  studentFullname: string
  amountOfMoneyCollected: string
  numberOfConsecutiveUnfulfilled: string
  tookFreezingByHimself: string
  remainingAmountOfMoney: string
  allSales: string
  byDays: string
  byMonth: string
  numberOfPayments: string
  remains: string
  date: string
  numberOfLeads: string
  managers: string
  selectTestPaper: string
  selectOpenTestParer: string
  errorTestPaperTime: string
  selectCloseTestParer: string
  testParerDuration: string
  selectClassOrPupil: string
  selectClass: string
  assignTestWork: string
  accessOpens: string
  accessCloses: string
  averageResult: string
  educationalInstitutions: string
  shortName: string
  groups: string
  autopayments: string
  prepayment: string
  ourStudents: string
  expenses: string
  hunters: string
  refunds: string
  trialPupil: string
  managersFinances: string
  wrongWhatsAppNumber: string
  pupils: string
  leftStandardPupilsCount: string
  leftStandardPupilsStatistics: string
  pupilsUsedToStandard: string
  pupilsCompletedTheirStudies: string
  pupilsStandardStudying: string
  numberOfActiveTeachers: string
  numberOfTeachers: string
  numberOfInstitutions: string
  fullname: string
  removeFromGroup: string
  getCheck: string
  numberOfStudents: string
  newTeacher: string
  isNewTeacherExplained: string
  teacherExplainedOnly: string
  notTeacherExplainedOnly: string
  searchButton: string
  studentPhoneNumber: string
  parentsPhoneNumber: string
  group: string
  startOfTraining: string
  howManyDays: string
  numberOfTasks: string
  numberOfCorrectTasks: string
  block: string
  pupilTeachers: string
  rating: string
  return: string
  abbreviation: string
  FullnameInKazakh: string
  FullnameInRussian: string
  address: string
  classes: string
  district: string
  newEducationalInstitution: string
  newGroup: string
  connectPupilToGroup: string
  teacher: string
  school: string
  thoseWhoHaveProblem: string
  whoPaid: string
  isTheStudentNumberCorrect: string
  hasMessageBeenSentToStudent: string
  hasMessageBeenSentToParent: string
  isParentNumberCorrect: string
  correctedStudentNumber: string
  correctedParentNumber: string
  selectPaymentDate: string
  chooseManager: string
  chooseLeadType: string
  enablePrepayment: string
  refundRequest: string
  howDidTheyFindUs: string
  addPayment: string
  viewButtons: string
  whatsAppMessage: string
  enterNumber: string
  throughWhomTheyPaid: string
  throughWhatWasPaid: string
  bankAccount: string
  isPrepayment: string
  selectPrepayment: string
  paid: string
  notPaid: string
  linkAudioRecording: string
  paidTime: string
  paidDate: string
  enterTheCheck: string
  couldNotSelectFile: string
  select: string
  selectManagers: string
  kaspiRefuse: string
  halyqRefuse: string
  jusanRefuse: string
  changeMind: string
  notTimeToPay: string
  gettingRecord: string
  qcdResponse: string
  sendToWhatsApp: Localize_SendToWhatsApp
  requestDate: string
  parentReason: string
  whoEntersTheData: string
  coef: string
  refundClosed: string
  refundNotClosed: string
  audioRecordingLink: string
  emailReceivedDay: string
  decisionDate: string
  trueReason: string
  paymentIncomeRecognition: Localize_PaymentIncomeRecognition
  onePupilSum: string
  relative: string
  hybridStudents: string
  days: string
  day: string
  week: string
  month: string
  dayOfPayment: string
  enterFile: string
  maxSymbol: string
  causeChange: string
  requestReason: string
  newPupil: string
  parentFirstname: string
  parentSurname: string
  parentFullname: string
  incorrectWhatsappPhoneNumber: Localize_IncorrectWhatsappPhoneNumber
  managerRecordStatsList: Localize_ManagerRecordStatsList
  managersFinanceReport: Localize_ManagersFinanceReport
  paymentList: Localize_PaymentList
  payoutList: Localize_PayoutList
  problemPupilList: Localize_ProblemPupilList
  returnRequestList: Localize_ReturnRequestList
  b2bInstitution: Localize_B2bInstitution
  reportAboutMissingStudents: string
  authorName: string
  searchMinFiveSymbols: string
  huntersReferences: Localize_HuntersReferences
  hunterCrmStatuses: Localize_HunterCrmStatuses
  managersReferences: Localize_ManagersReferences
  marketingNews: Localize_MarketingNews
  updatePupilCashback: string
  isSolved: string
  isSolvedDiscontent: string
  solveTime: string
  report: string
  taskDescription: string
  mentorAssignedWorkday: Localize_MentorAssignedWorkday
  weekdays: Localize_Weekdays
  newPupilCall: Localize_NewPupilCall
  prepaymentList: Localize_PrepaymentList
  noEmptyFields: string
  paymentChangeRequest: Localize_PaymentChangeRequest
  searchByPhoneNumber: string
  messages: Localize_Messages
  lmsList: Localize_LmsList
  view: string
  viewed: string
  manager: string
  callMinute: string
  touch: string
  callCount: string
  salesCount: string
  salesPoints: string
  managerList: string
  leadCount: string
  pupilCount: string
  salesLeadCount: string
  subscribeLeadCount: string
  mentorStopStudy: string
  farmerLeadCount: string
  subscribeEnd: string
  subscribeEndCount: string
  fiftyDoNotStudy: string
  doNotWorkingConverstion: string
  listOp: string
  optionalName: string
  hunterName: string
  daysFromFirstStudyDay: string
  calledNumber: string
  calledTime: string
  anyTextGrade: string
  subscriptionRequestList: Localize_SubscriptionRequestList
  farmerCrmList: Localize_FarmerCrmList
  notPickUp: string
  pickUp: string
  singleAnswer: string
  multipleAnswer: string
  accumulatedCashback: string
  clientHistory: string
  sentCashback: string
  ownFreezing: string
  olympiad: Localize_Olympiad
  send: string
  sending: string
  holidayReason: string
  restReason: string
  countries: Localize_Countries
  countryOfPupil: string
  country: string
  part: string
  sum: string
  company: string
  solved: string
  aboutStudentDidntFinishedNoon: string
  aboutStudentDidntFinishedEvening: string
  daysOffs: string
  mondayMessage: string
  willMessageSend: string
  messageTime: string
  correcting: string
  selectSchool: string
  addStudents: string
  parentPhoneNumbers: string
  pupilTeacher: string
  firstDayMessage: string
  disable: string
  sentToStudent: string
  sentToParent: string
  inputTime: string
  doMessageNeedsToSend: string
  whoEntered: string
  cashbackBlock: Localize_CashbackBlock
  acceptedPayments: string
  leads: string
  refundPercentage: string
  staffNumber: string
  addStuff: string
  role: string
  currency: string
  subscriptionList: Localize_SubscriptionList
  subscription: Localize_Subscription
  subscriptionsTable: Localize_SubscriptionsTable
  changeSubscriptionStatus: Localize_ChangeSubscriptionStatus
  integerVariable: Localize_IntegerVariable
  mathEditor: Localize_MathEditor
  notFinished: string
  notStarted: string
  notDownloaded: string
  notStartedYet: string
  planedActualSales: Localize_PlanedActualSales
  plan: string
  fact: string
  planFact: string
  addSarafan: string
  addQBS: string
  donePercentage: string
  addLead: string
  monthPlanFact: string
  recordingAnalysis: Localize_RecordingAnalysis
  needToLeavePhoneNumber: string
  leaveRequest: string
  enterParentPhoneNumber: string
  sbbDiscontentParent: Localize_SbbDiscontentParent
  sbbReturnCause: Localize_SbbReturnCause
  sbbSurvey: Localize_SbbSurvey
  nextPupil: string
  taskExp: Localize_TaskExp
  callLater: string
  sessionList: Localize_SessionList
  adjustingTooltips: string
  taskDifficulty: string
  taskNumbers: string
  classProgressPercentage: string
  standardKPI: string
  schoolProgressPercentage: string
  averageTaskCompletionTime: string
  averageSchoolTaskCompletionTime: string
  selectMinimumOfNumbersOfBatteries: string
  beginningOfTheWeek: string
  numberOfBatteries: string
  viewStudent: string
  numberOfCompletedBatteries: string
  averageTimeSpentCompleteBattery: string
  numberOfLeftBatteries: string
  studentPerformance: string
  studentsPerformance: string
  telegramChatList: Localize_TelegramChatList
  chooseDate: string
  sessionTaskStatisticsList: Localize_SessionTaskStatisticsList
  totalMentorKpiList: Localize_TotalMentorKpiList
  content: string
  salesTime: string
  marketing: string
  taskMistakeStatuses: Localize_TaskMistakeStatuses
  lastModifiedBy: string
  DashboardSections: Localize_DashboardSections
  employeeTestTitles: Localize_EmployeeTestTitles
  current: string
  byInterval: string
  mobileUserStatistics: string
  hrDashboard: Localize_HrDashboard
  scaleQuestionTypeAnswers: Localize_ScaleQuestionTypeAnswers
  promocode: string
  funnelConversion: string
  contentMarketingConversion: string
  personalStudyHasNotBeenStarted: string
  showAudioChat: string
  isActive: string
  showAdditionalInfromation: string
  clearAudioLinks: string
  translationError: string
  kpiForThreeDays: string
  appWithPupilCount: string
  appWithParentCount: string
  freezeCount: string
  mentorSetCount: string
  pupilSetCount: string
  finishedQuantity: string
  nonFinishedQuantity: string
  toggleVisibilityAudio: string
  analysisAccepted: string
  analysisNotAccepted: string
  studyEndDate: string
  leadsNotStartedPS: string
  employeeInfo: string
  relativeConfirmed: string
  RelativeSubscriptionRequestStatus: Localize_RelativeSubscriptionRequestStatus
  actions: string
  sortByStatus: string
  sortByEmployee: string
  chooseDepartment: string
  chooseEmployee: string
  confirm: string
  relativeRelation: string
  proofOfRelative: string
  chooseVariant: string
  downloadBirthCertificate: string
  downloadMarriageCertificate: string
  surnamesNotMatch: string
  RelativeType: Localize_RelativeType
  reductionPeriod: string
  englishCourse: string
  forbiddenMessage: string
  short_amount: string
  allCourses: string
  relativeSubscriptionRequestStatusWasChanged: string
  refundCharacters: string
  parentsInactiveMoreThan30: string
  untDiagnosticsLessons: string
  sentLink: string
  linkSentSuccessfully: string
  linkNotSent: string
  linkGenerationInProgress: string
  tryAfter: string
  withoutMentor: string
  informingAboutRules: Localize_InformingAboutRules
  termsAndConditions: Localize_TermsAndConditions
  autocall: Localize_Autocall
  progressBar: Localize_ProgressBar
  salesBonus: Localize_SalesBonus
  speechAnalytic: Localize_SpeechAnalytic
  taskExplanationStarted: string
  lastTask: string
  research: string
  managerStatisticTable: Localize_ManagerStatisticTable
  powerBI: Localize_PowerBI
  whatsappTemplates: Localize_WhatsappTemplates
  whatsappMailingReport: Localize_WhatsappMailingReport
}
