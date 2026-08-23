import { createSimpleComplexTemplate } from '../../lib/create-simple-complex-template'

/**
 * Same as `complex.plain`, but keeps the solution row centered instead of
 * end-aligned. Used for the complex_11 task group (4_11_1_1..4_11_1_4) — see
 * grade-4 chapter-11 routing.
 */
export const ComplexPlainCenter = createSimpleComplexTemplate({
  id: 'complex.plain.center',
})
