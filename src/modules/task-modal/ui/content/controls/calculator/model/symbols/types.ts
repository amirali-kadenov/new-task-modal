import type { FC, SVGProps } from 'react'

type SvgComponent = FC<SVGProps<SVGSVGElement>>

export interface CalculatorSymbol {
  title: string
  latex?: string | null
  label: string
  icon?: SvgComponent | null
  action?: string
  upperCased?: Partial<CalculatorSymbol>
}

export interface LetterSymbol extends Omit<CalculatorSymbol, 'upperCased'> {
  upperCased: Partial<CalculatorSymbol>
}

export interface MainPanelSymbol extends Omit<CalculatorSymbol, 'upperCased'> {
  withTranslation?: boolean
}
