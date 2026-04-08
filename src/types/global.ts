// GlobalType.ts
import type { User } from './api/api'
import type {
  CountryCurrency,
  EmployeeRole,
  Language,
  TaskDescriptionType,
} from './enums'

export interface Global {
  INFINITY: string
  isAuthenticated(): boolean
  isAuthenticatedWithToken(paramToken: string): boolean
  getTokenName(): string
  getToken(): string | undefined
  setUser(user: User): void
  getUser(): User
  hasParent(): boolean
  getParentPhoneNumber(): string
  getUserId(): number
  isTestUser(): boolean
  isScienceAcademyPupil(): boolean
  isPupilUser(): boolean
  isParentUser(): boolean
  isSanSchoolClient(): boolean
  isB2BClient(): boolean
  isSarafanEditor(): boolean
  isMobileUser(): boolean
  isUntTester(): boolean
  isLeadDivider(): boolean
  isFarmerLeadDivider(): boolean
  isB2CClient(): boolean
  isB2BClientAbleToPayout(): boolean
  isTeacherUser(): boolean
  getAutocallToken(department: string): string
  isQalanTeacher(): boolean
  isMarketer(): boolean
  isAdmin(): boolean
  isMainAdmin(): boolean
  isEmployee(): boolean
  isB2CEmployee(): boolean
  isManager(): boolean
  isB2BTeacher(): boolean
  isB2BAdmin(): boolean
  isContentEmployee(): boolean
  isItEmployee(): boolean
  isItDuty(): boolean
  isSuperAppAdmin(): boolean
  isReturnManager(): boolean
  isSalesDepartmentRole(): boolean
  isSbbEmployee(): boolean
  isContentEmployeeCanAddTaskMistakes(): boolean
  isContentEmployeeCanAddNewTasks(): boolean
  isContentEmployeeWithLimitedAccess(): boolean
  setLanguage(language: Language): void
  getLanguage(): Language
  setHost(host: string): void
  getHost(): string | null
  getHostNameWithHTTP(): string
  getLanguageByPupilLanguage(pupilLanguage: string): Language
  getAbbreviatedLanguage(): string
  getAbbreviatedLanguageByHost(): string
  isLanguageAzerbaijanSelected(): boolean
  isLocationLocalhost(): boolean
  isLocationQalanSchool(): boolean
  isLocationQalanKz(): boolean
  isLocationQalanRu(): boolean
  isLocationQalanUz(): boolean
  isLocationQalanAz(): boolean
  isLocationQalanEg(): boolean
  isLocationTestQalan(): boolean
  isLocationPreprodQalan(): boolean
  isPupilFromKz(): boolean
  isKazPupil(): boolean
  isSchoolPupil(): boolean
  isAzePupil(): boolean
  isEgyPupil(): boolean
  isGlobalLanguageRussian(): boolean
  getSalesCrmDomain(): string
  getFontSizeFactorName(): string
  getFontSizeFactor(): number
  isMobileBrowser(): boolean
  getCalculatorCellWidth(width: number): number
  getCalculatorCellCoefficient(): number
  isAndroidBrowser(): boolean
  isIPhoneBrowser(): boolean
  isTouchDevice(): boolean
  isTouchDeviceOrMobileBrowser(): boolean
  getIosVersion(): number
  translate(this: void, text: string | number | Record<string, string>): string
  translateWithLanguage(
    text: string | number | Record<string, string>,
    language: Language,
  ): string
  translateTasks<T>(text: T, language?: Language): string
  translateValues(text: string, textRus: string, textEng: string): string
  translateValueFromObject(
    object: Record<string, string>,
    value: string,
  ): string
  dontCloseIfBackClicked(): void
  saveLastAnswer(answer: string): void
  getLastAnswer(): string | null
  getCountryCode(): number
  getCountryCodeAsLetters(): string
  getCurrentCurrency(): string
  calculateForCurrentCurrency(money: number): number
  getCurrencyByDepartment(): CountryCurrency
  isHREmployee(): boolean
  isCalculatorInvisible(descriptionType: TaskDescriptionType): boolean
  isHRDirector(): boolean
  isEmployeeDeleted(): boolean
  isHRDashboardAvailable(): boolean
  isPowerBIDashboardAvailable(): boolean
  willCheckToPassSurvey(): boolean
  willCheckToPassSalesManager(): boolean
  getEmployeeCompany(): string
  getEmployeeRole(): EmployeeRole
  getRolesByDepartment(selectedDepartment: string): EmployeeRole[] | string[]
  getSupportRequestStatuses(): Array<{ value: number; label: string }>
  isEmployeeDataAnalyst(): boolean
  isB2BEmployee(): boolean
  getTeacherInstitutionId(): number
  getPupilGradeForArabic(): number
  getPublicOfferLink(): string
  getPrivacyPolicyLink(): string
  hasArabicSymbols(text: string): boolean
  changeBodyClassByLanguage(language: Language): void
  getFontSizeByFontSizeFactor(
    mainFontSize: number,
    fontSizeFactor: number,
    addAdditionalFontSize?: boolean,
    additionalFontSize?: number,
    fontSizeFactorMultiplier?: number,
  ): number
  getDivisionSymbol(): string
  getMultiplicationSymbol(): string
  isWebView(): boolean
}
