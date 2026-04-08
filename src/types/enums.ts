import type { ValueOf } from './utils'

export interface Enums {
  HttpStatusCode: {
    Forbid: 403
    BadRequest: 400
    Unauthorized: 401
    InternalServerError: 500
    Conflict: 409
    NotAcceptable: 406
    ValidationError: 422
    BadGateway: 502
  }
  UserActionResult: {
    None: 'none'
    Correct: 'correct'
    Error: 'error'
    SolutionShown: 'solution_shown'
    VideoExplanationShown: 'video_explanation_shown'
    Answered: 'answered'
  }
  TaskDescriptionType: {
    Formula: 'formula'
    Text: 'text'
    TextInline: 'textInline'
    Comparison: 'comparison'
    ColumnOperation: 'columnOperation'
    Test: 'test'
    Equation: 'equation'
    Complex: 'complex'
    CoordinatePlane: 'coordinatePlane'
    CoordinatePlane3D: 'coordinatePlane3D'
    TrigonometryCoordinatePlane: 'trigonometryCoordinatePlane'
    CalculateByImage: 'calculateByImage'
    CalculateByImageWithCell: 'calculateByImageWithCell'
    AnswerCell: 'answerCell'
    Drawing: 'drawing'
    Audio: 'audio'
    Coloring: 'coloring'
    MatchingWithDragging: 'matchingWithDragging'
    MatchingTask: 'matchingTask'
    OrderByLine: 'orderByLine'
    Image: 'image'
    HandwritingRecognition: 'handwritingRecognition'
    FrequencyPolygon: 'frequencyPolygon'
    FrequencyHistogram: 'frequencyHistogram'
    TableMultipleChoice: 'tableMultipleChoice'
    CubeCalculator: 'cubeCalculator'
    MultiInput: 'multi-input'
  }
  Language: {
    KkLatyn: 'kk-latyn'
    KkLatin: 'kk-latin'
    KkCyrillic: 'kk-cyrillic'
    KkLatinWithoutUmlaut: 'kk-latin_without_umlaut'
    Russian: 'russian'
    English: 'english'
    Uzbek: 'uzbek'
    Kyrgyz: 'kyrgyz'
    ArabicEgypt: 'ar-eg'
    ArabicSaudi: 'ar-sa'
    Azerbaijan: 'azerbaijani'
  }
  SocketCommand: {
    UserAway: 'user_away'
    UserOnline: 'user_online'
    UserOffline: 'user_offline'
    NewActiveTask: 'new_active_task'
    CloseActiveTask: 'close_active_task'
  }
  TaskSourceType: {
    PersonalStudy: 10
    Regular: 20
    SelfWork: 30
    Diagnostics: 40
  }
  CharacterLineTemplateNames: {
    yourAnswerIsCorrect: 'your_answer_is_correct'
    yourAnswerIsNotCorrect: 'your_answer_is_not_correct'
  }
  CheckUserAnswerResult: {
    GiveAttempt: 10
    ShowSolution: 20
    ShowCorrect: 30
    ShowVideoExplanation: 40
  }
  Country: {
    Kazakhstan: 'Kazakhstan'
    Russia: 'Russia'
    Uzbekistan: 'Uzbekistan'
    Azerbaijan: 'Azerbaijan'
  }
  LessonTheory: {
    Svg: 'svg'
    Text: 'text'
    Title: 'title'
    VideoUrl: 'video_url'
  }
}

export type CountryCurrency = ValueOf<{
  Kazakhstan: 'KZT'
  Russia: 'RUB'
  Uzbekistan: 'UZS'
  Azerbaijan: 'AZN'
  Gapik: 'gapik'
}>

export type EmployeeRole = ValueOf<{
  SalesManager: 'sales_manager'
  SalesManagerFarmer: 'sales_manager_farmer'
  Financier: 'financier'
  Accountant: 'accountant'
  Hunter: 'hunter'
  TeamLeadOfHunters: 'team_lead_of_hunters'
  Mentor: 'mentor'
  SBBEmployee: 'sbb_employee'
  HREmployee: 'hr_employee'
  HRDirector: 'hr_director'
  HRManager: 'hr_manager'
  HRRecruiter: 'hr_recruiter'
  BrandHR: 'brand_hr'
  Marketer: 'marketer'
  DirectorOfSalesDepartment: 'director_of_sales_department'
  AssistantOfSalesDepartment: 'assistant_of_sales_department'
  HeadOfSalesDepartment: 'head_of_sales_department'
  SanSchoolAdmin: 'sanschool_admin'
  HeadOfMentor: 'head_of_mentor'
  TeamLeadOfMentors: 'team_lead_of_mentors'
  DataAnalyst: 'data_analyst'
  B2BAdmin: 'b2b_admin'
  B2BModerator: 'b2b_moderator'
  B2BManager: 'b2b_manager'
  B2BSeniorMentor: 'b2b_senior_mentor'
  B2BMentor: 'b2b_mentor'
  B2BEmployee: 'b2b_employee'
  ContentEmployee: 'content_employee'
  ItEmployee: 'it_employee'
  ReturnManager: 'return_manager'
  HeadOfDepartment: 'head_of_department'
  SuperAppEmployee: 'super_app_employee'
}>

export type Language = ValueOf<{
  KkLatyn: 'kk-latyn'
  KkLatin: 'kk-latin'
  KkCyrillic: 'kk-cyrillic'
  KkLatinWithoutUmlaut: 'kk-latin_without_umlaut'
  Russian: 'russian'
  English: 'english'
  Uzbek: 'uzbek'
  Kyrgyz: 'kyrgyz'
  ArabicEgypt: 'ar-eg'
  ArabicSaudi: 'ar-sa'
  Azerbaijan: 'azerbaijani'
}>

export type TaskDescriptionType = ValueOf<{
  Formula: 'formula'
  Text: 'text'
  TextInline: 'textInline'
  Comparison: 'comparison'
  ColumnOperation: 'columnOperation'
  Test: 'test'
  Equation: 'equation'
  Complex: 'complex'
  CoordinatePlane: 'coordinatePlane'
  Table: 'table'
  CoordinatePlane3D: 'coordinatePlane3D'
  TrigonometryCoordinatePlane: 'trigonometryCoordinatePlane'
  CalculateByImage: 'calculateByImage'
  CalculateByImageWithCell: 'calculateByImageWithCell'
  AnswerCell: 'answerCell'
  Drawing: 'drawing'
  Audio: 'audio'
  Coloring: 'coloring'
  MatchingWithDragging: 'matchingWithDragging'
  MatchingTask: 'matchingTask'
  OrderByLine: 'orderByLine'
  Image: 'image'
  HandwritingRecognition: 'handwritingRecognition'
  FrequencyPolygon: 'frequencyPolygon'
  FrequencyHistogram: 'frequencyHistogram'
  TableMultipleChoice: 'tableMultipleChoice'
  CubeCalculator: 'cubeCalculator'
  MultiInput: 'multi-input'
}>

export type TaskAnswerInputType = ValueOf<{
  Simple: 10
  Hidden: 15
  TwoAnswers: 20
  ThreeAnswers: 30
  FourAnswers: 40
  FiveAnswers: 50
  TableSingleAnswer: 60
  SixAnswers: 70
}>

export type LessonTheory = ValueOf<{
  Svg: 'svg'
  Text: 'text'
  Title: 'title'
  VideoUrl: 'video_url'
}>
