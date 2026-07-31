export const TemplateTypes = {
  Text: {
    Plain: 'text.plain',
    Before: 'text.before',
    After: 'text.after',
    BeforeAfter: 'text.beforeAfter',
    AiTranslation: 'text.aiTranslation',
    Multi: {
      Stack: {
        N2Before: 'text.multi.stack.n2.before',
        N2After: 'text.multi.stack.n2.after',
        N2BeforeAfter: 'text.multi.stack.n2.beforeAfter',
        N3Before: 'text.multi.stack.n3.before',
        N3BeforeAfter: 'text.multi.stack.n3.beforeAfter',
        N4After: 'text.multi.stack.n4.after',
        N5After: 'text.multi.stack.n5.after',
      },
      Inline: {
        N2After: 'text.multi.inline.n2.after',
        N3BeforeAfter: 'text.multi.inline.n3.beforeAfter',
        N5After: 'text.multi.inline.n5.after',
      },
    },
  },
  Test: {
    Plain: 'test.plain',
  },
  AnswerCell: {
    Plain: 'answerCell.plain',
    After: 'answerCell.after',
    Multi: {
      Inline: {
        N2Plain: 'answerCell.multi.inline.n2.plain',
      },
      Stack: {
        N2Plain: 'answerCell.multi.stack.n2.plain',
      },
    },
  },
  ColumnOperation: {
    Plain: 'columnOperation.plain',
    Multi: {
      Stack: {
        N2Before: 'columnOperation.multi.stack.n2.before',
      },
    },
  },
  Formula: {
    Plain: 'formula.plain',
    After: 'formula.after',
    Multi: {
      Stack: {
        N2Before: 'formula.multi.stack.n2.before',
      },
    },
  },
  Complex: {
    Plain: 'complex.plain',
    After: 'complex.after',
    BeforeAfter: 'complex.beforeAfter',
    Multi: {
      Stack: {
        N2After: 'complex.multi.stack.n2.after',
        N2BeforeAfter: 'complex.multi.stack.n2.beforeAfter',
      },
    },
  },
  Table: {
    Plain: 'table.plain',
    Grid: 'table.grid',
    Inline: 'table.inline',
    List: 'table.list',
    Mixed: 'table.mixed',
    MultiRow: 'table.multiRow',
    MultiRowSvg: 'table.multiRowSvg',
  },
  Comparison: {
    Plain: 'comparison.plain',
  },
  Equation: {
    Before: 'equation.before',
  },
}
