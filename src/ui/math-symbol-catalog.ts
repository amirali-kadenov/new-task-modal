export type SymbolEntry = {
  /** Short human label */
  label: string
  /** TeX for MathJax (MathText) */
  tex: string
  /**
   * TeX for MathQuill (MathInput).
   * - omit → use `tex` (after \\dfrac → \\frac)
   * - `false` → skip in MathInput catalog (unsupported by MathQuill)
   */
  mathquill?: string | false
}

export type SymbolSection = {
  title: string
  items: SymbolEntry[]
}

/** Default MathQuill adaptation: \\dfrac is not a MathQuill command. */
export const toMathQuillTex = (tex: string) => tex.replace(/\\dfrac/g, '\\frac')

export const getMathQuillTex = (item: SymbolEntry): string | null => {
  if (item.mathquill === false) return null
  if (typeof item.mathquill === 'string') return item.mathquill
  return toMathQuillTex(item.tex)
}

export const SYMBOL_SECTIONS: SymbolSection[] = [
  {
    title: 'Операторы',
    items: [
      { label: 'Сложение', tex: 'a + b' },
      { label: 'Вычитание', tex: 'a - b' },
      { label: 'Умножение (·)', tex: 'a \\cdot b' },
      { label: 'Умножение (×)', tex: 'a \\times b' },
      { label: 'Деление (:)', tex: 'a : b' },
      { label: 'Деление (÷)', tex: 'a \\div b' },
      { label: 'Плюс-минус', tex: 'a \\pm b' },
      { label: 'Минус-плюс', tex: 'a \\mp b', mathquill: false },
    ],
  },
  {
    title: 'Сравнения',
    items: [
      { label: 'Равно', tex: 'a = b' },
      { label: 'Не равно', tex: 'a \\neq b' },
      { label: 'Меньше', tex: 'a < b' },
      { label: 'Больше', tex: 'a > b' },
      { label: '≤', tex: 'a \\leq b' },
      { label: '≥', tex: 'a \\geq b' },
      { label: 'Примерно', tex: 'a \\approx b' },
      { label: 'Тождество', tex: 'a \\equiv b', mathquill: false },
    ],
  },
  {
    title: 'Степени и индексы',
    items: [
      { label: 'Квадрат', tex: 'x^2' },
      { label: 'Куб', tex: 'x^3' },
      { label: 'Степень', tex: 'x^{n}' },
      { label: 'Индекс', tex: 'a_{n}' },
      { label: 'Степень + индекс', tex: 'a_{n}^{2}' },
      { label: 'Двойной индекс', tex: 'a_{i,j}' },
      { label: 'Степень выражения', tex: '(a + b)^{2}' },
      { label: 'Башня степеней', tex: '2^{3^{2}}' },
    ],
  },
  {
    title: 'Дроби',
    items: [
      { label: '\\frac', tex: '\\frac{1}{2}' },
      { label: '\\dfrac', tex: '\\dfrac{3}{4}' },
      { label: 'Сложение дробей', tex: '\\dfrac{1}{2} + \\dfrac{1}{3}' },
      { label: 'Смешанное число', tex: '2\\dfrac{1}{3}' },
      { label: 'Дробь с выражением', tex: '\\dfrac{a + b}{c - d}' },
      { label: 'Дробь со степенью', tex: '\\dfrac{x^{2}}{y^{3}}' },
      { label: 'Сложная дробь', tex: '\\dfrac{\\dfrac{1}{2}}{\\dfrac{3}{4}}' },
      { label: 'Дробь под корнем', tex: '\\sqrt{\\dfrac{a}{b}}' },
    ],
  },
  {
    title: 'Корни',
    items: [
      { label: 'Квадратный', tex: '\\sqrt{2}' },
      { label: 'Квадратный (выражение)', tex: '\\sqrt{a^{2} + b^{2}}' },
      { label: 'Кубический', tex: '\\sqrt[3]{8}', mathquill: false },
      { label: 'n-й корень', tex: '\\sqrt[n]{x}', mathquill: false },
      { label: 'Произведение корней', tex: '\\sqrt{a} \\cdot \\sqrt{b}' },
      {
        label: 'Корень в степени',
        tex: '\\left(\\sqrt{x}\\right)^{2}',
        mathquill: '(\\sqrt{x})^{2}',
      },
    ],
  },
  {
    title: 'Скобки и модуль',
    items: [
      { label: 'Круглые', tex: '(a + b)' },
      { label: 'Квадратные', tex: '[a + b]' },
      { label: 'Фигурные', tex: '\\{a + b\\}', mathquill: false },
      { label: 'Модуль', tex: '|x|' },
      { label: 'Модуль выражения', tex: '|a - b|' },
      {
        label: '\\left\\right',
        tex: '\\left(\\dfrac{a}{b}\\right)',
        mathquill: '\\left(\\frac{a}{b}\\right)',
      },
      { label: 'Угловые', tex: '\\langle a, b \\rangle', mathquill: false },
    ],
  },
  {
    title: 'Греческие буквы (строчные)',
    items: [
      { label: 'α', tex: '\\alpha' },
      { label: 'β', tex: '\\beta' },
      { label: 'γ', tex: '\\gamma' },
      { label: 'δ', tex: '\\delta' },
      { label: 'θ', tex: '\\theta' },
      { label: 'λ', tex: '\\lambda' },
      { label: 'σ', tex: '\\sigma' },
      { label: 'υ', tex: '\\upsilon' },
      { label: 'φ', tex: '\\phi' },
      { label: 'π', tex: '\\pi' },
      { label: 'ω', tex: '\\omega' },
      { label: 'μ', tex: '\\mu' },
    ],
  },
  {
    title: 'Греческие буквы (заглавные)',
    items: [
      { label: 'Γ', tex: '\\Gamma' },
      { label: 'Δ', tex: '\\Delta' },
      { label: 'Θ', tex: '\\Theta' },
      { label: 'Λ', tex: '\\Lambda' },
      { label: 'Σ', tex: '\\Sigma' },
      { label: 'Φ', tex: '\\Phi' },
      { label: 'Ω', tex: '\\Omega' },
      { label: 'Π', tex: '\\Pi' },
    ],
  },
  {
    title: 'Латинские переменные',
    items: [
      { label: 'a…f', tex: 'a, b, c, d, e, f' },
      { label: 'x, y, z', tex: 'x, y, z' },
      { label: 'n, m, k', tex: 'n, m, k' },
      { label: 'A, B, C', tex: 'A, B, C' },
    ],
  },
  {
    title: 'Геометрия и единицы',
    items: [
      { label: 'Градус', tex: '90^{\\circ}' },
      { label: 'Угол', tex: '\\angle ABC', mathquill: false },
      { label: 'Треугольник', tex: '\\triangle ABC', mathquill: false },
      { label: 'Параллельность', tex: 'a \\parallel b', mathquill: false },
      { label: 'Перпендикуляр', tex: 'a \\perp b', mathquill: false },
      {
        label: 'Подобны',
        tex: '\\triangle ABC \\sim \\triangle DEF',
        mathquill: false,
      },
      {
        label: 'Конгруэнтны',
        tex: '\\triangle ABC \\cong \\triangle DEF',
        mathquill: false,
      },
    ],
  },
  {
    title: 'Прочее',
    items: [
      { label: 'Бесконечность', tex: '\\infty' },
      { label: 'Проценты', tex: '25\\%', mathquill: '25\\%' },
      { label: 'Многоточие', tex: '1, 2, 3, \\ldots, n' },
      { label: 'Запятая / точка с запятой', tex: 'a, b; c, d' },
      { label: 'Сумма', tex: '\\sum_{i=1}^{n} a_{i}' },
      { label: 'Произведение', tex: '\\prod_{i=1}^{n} a_{i}', mathquill: false },
      { label: 'Логарифм', tex: '\\log_{2} 8 = 3' },
      { label: 'Натуральный лог', tex: '\\ln e = 1', mathquill: false },
    ],
  },
  {
    title: 'Комбинации (школьная математика)',
    items: [
      { label: 'Линейное уравнение', tex: '2x + 3 = 11' },
      { label: 'Квадратное уравнение', tex: 'x^{2} - 5x + 6 = 0' },
      {
        label: 'Формула корней',
        tex: 'x = \\dfrac{-b \\pm \\sqrt{b^{2} - 4ac}}{2a}',
      },
      {
        label: 'Квадрат суммы',
        tex: '(a + b)^{2} = a^{2} + 2ab + b^{2}',
      },
      {
        label: 'Разность квадратов',
        tex: 'a^{2} - b^{2} = (a - b)(a + b)',
      },
      { label: 'Пропорция', tex: '\\dfrac{a}{b} = \\dfrac{c}{d}' },
      {
        label: 'Процент от числа',
        tex: '\\dfrac{15}{100} \\cdot 80 = 12',
      },
      {
        label: 'Среднее арифметическое',
        tex: '\\dfrac{a_{1} + a_{2} + \\ldots + a_{n}}{n}',
      },
      { label: 'Теорема Пифагора', tex: 'a^{2} + b^{2} = c^{2}' },
      { label: 'Площадь круга', tex: 'S = \\pi r^{2}' },
      { label: 'Длина окружности', tex: 'C = 2\\pi r' },
      {
        label: 'Синус / косинус',
        tex: '\\sin^{2}\\theta + \\cos^{2}\\theta = 1',
      },
      {
        label: 'Смешанная дробь + корень',
        tex: '1\\dfrac{1}{2} + \\sqrt{\\dfrac{9}{4}} = 3',
      },
      {
        label: 'Индекс + степень + дробь',
        tex: '\\dfrac{a_{1}^{2} + a_{2}^{2}}{b_{n}}',
      },
      {
        label: 'Неравенство с дробями',
        tex: '\\dfrac{1}{2} < \\dfrac{2}{3} < 1',
      },
      {
        label: 'Угол в градусах',
        tex: '\\angle A = 45^{\\circ},\\; \\angle B = 135^{\\circ}',
        mathquill: 'A = 45^{\\circ}, B = 135^{\\circ}',
      },
      {
        label: 'Греческие в формуле',
        tex: '\\alpha + \\beta + \\gamma = 180^{\\circ}',
      },
      { label: 'Модуль уравнения', tex: '|x - 3| = 5' },
    ],
  },
]
