import DeleteIcon from '@/assets/icons/calc/delete.svg'
import DivideIcon from '@/assets/icons/calc/divide.svg'
import FractionIcon from '@/assets/icons/calc/fraction.svg'
import MinusIcon from '@/assets/icons/calc/minus.svg'
import MultiIcon from '@/assets/icons/calc/multi.svg'
import PlusIcon from '@/assets/icons/calc/plus.svg'

import type { MainPanelSymbol } from './types'

export const MAIN: MainPanelSymbol[] = [
  { title: '<', latex: '<', label: '<' },
  { title: '>', latex: '>', label: '>' },
  { title: '≠', latex: '\\neq', label: '≠' },
  { title: '=', latex: '=', label: '=' },
  {
    title: 'Delete',
    latex: 'Delete',
    label: 'Delete',
    icon: DeleteIcon,
    withTranslation: true,
  },
  { title: 'x/y', latex: '\\frac', label: 'Fraction', icon: FractionIcon },
  { title: '7', latex: '7', label: '7' },
  { title: '8', latex: '8', label: '8' },
  { title: '9', latex: '9', label: '9' },
  { title: '÷', latex: ':', label: 'Divide', icon: DivideIcon },
  { title: 'x²', latex: '^2', label: 'x²' },
  { title: '4', latex: '4', label: '4' },
  { title: '5', latex: '5', label: '5' },
  { title: '6', latex: '6', label: '6' },
  { title: '×', latex: '\\cdot', label: 'Multi', icon: MultiIcon },
  { title: 'x³', latex: '^3', label: 'x³' },
  { title: '1', latex: '1', label: '1' },
  { title: '2', latex: '2', label: '2' },
  { title: '3', latex: '3', label: '3' },
  { title: '-', latex: '-', label: 'Minus', icon: MinusIcon },
  { title: '( )', latex: '( )', label: '( )' },
  { title: ';', latex: ';', label: ';' },
  { title: '0', latex: '0', label: '0' },
  { title: ',', latex: ',', label: ',' },
  { title: '+', latex: '+', label: 'Plus', icon: PlusIcon },
]
