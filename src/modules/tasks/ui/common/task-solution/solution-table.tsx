import type { Translation } from '@/types/api/task'
import { MathText } from '@/ui/math-text/math-text'

import type { TaskModalDependencies } from '../../../../task-modal/model/types/props'
import type { SolutionTableRow } from '../../../lib/solution-types'

import s from './solution-table.module.scss'

interface Props {
  rows: SolutionTableRow[]
  width?: string
  deps: TaskModalDependencies
}

const renderCell = (
  cell: Translation | string,
  deps: TaskModalDependencies,
) => {
  if (typeof cell === 'string') {
    return <MathText>{cell}</MathText>
  }
  return <MathText>{deps.global.translateTasks(cell)}</MathText>
}

export const SolutionTable = ({ rows, width, deps }: Props) => {
  return (
    <div className={s.wrapper}>
      <table className={s.table} style={{ width: width ?? '100%' }}>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.cells.map((cell, cellIndex) => (
                <td
                  key={cellIndex}
                  className={s.cell}
                  colSpan={row.colspan_list?.[cellIndex] ?? 1}
                  rowSpan={row.rowspan_list?.[cellIndex] ?? 1}
                >
                  {renderCell(cell, deps)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
