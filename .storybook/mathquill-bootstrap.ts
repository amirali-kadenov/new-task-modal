/**
 * MathQuill expects classic `window.jQuery` before its IIFE runs.
 * `jquery-global` must be imported first so evaluation order is correct.
 */
import './jquery-global'

import '@edtr-io/mathquill/build/mathquill.css'
import '@edtr-io/mathquill/build/mathquill.js'
