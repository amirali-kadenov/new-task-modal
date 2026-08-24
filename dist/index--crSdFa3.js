import { c as v, j as c, h as B, M as R, s as C, d as N, r as W, g as $, a as F, e as y, f as I } from "./index-DNoheI6P.js";
import { S as D, a as P } from "./solution-answer-panel-C_30mrDJ.js";
const z = "_container_1bdhb_1", G = "_content_1bdhb_7", H = "_inputWrapper_1bdhb_11", J = "_beforeText_1bdhb_18", K = "_afterText_1bdhb_19", L = "_input_1bdhb_11", O = "_answerFormula_1bdhb_29", T = {
  container: z,
  content: G,
  inputWrapper: H,
  beforeText: J,
  afterText: K,
  input: L,
  answerFormula: O
}, E = (x, t) => x == null ? "" : t(x), M = (x) => {
  const t = v.c(24), {
    answerInput: s,
    deps: n,
    answer: f,
    mode: e,
    withBefore: o,
    withAfter: i,
    onChange: h,
    mathInputRef: b,
    correctAnswer: p
  } = x, m = o === void 0 ? !1 : o, u = i === void 0 ? !1 : i;
  let l;
  t[0] !== n ? (l = (k) => n.global.translateTasks(k), t[0] = n, t[1] = l) : l = t[1];
  const a = l;
  let d;
  t[2] !== (s == null ? void 0 : s.before) || t[3] !== a || t[4] !== m ? (d = m ? E(s == null ? void 0 : s.before, a) : "", t[2] = s == null ? void 0 : s.before, t[3] = a, t[4] = m, t[5] = d) : d = t[5];
  const r = d;
  let _;
  t[6] !== (s == null ? void 0 : s.after) || t[7] !== a || t[8] !== u ? (_ = u ? E(s == null ? void 0 : s.after, a) : "", t[6] = s == null ? void 0 : s.after, t[7] = a, t[8] = u, t[9] = _) : _ = t[9];
  const j = _;
  let w;
  t[10] !== r ? (w = r ? /* @__PURE__ */ c.jsx(N, { "data-testid": "equation-before", className: T.beforeText, value: r }) : null, t[10] = r, t[11] = w) : w = t[11];
  let A;
  t[12] !== f || t[13] !== p || t[14] !== b || t[15] !== e || t[16] !== h ? (A = e === "input" ? /* @__PURE__ */ c.jsx(B, { ref: b, formula: f, onMathFieldChanged: h, className: T.input }) : p ? /* @__PURE__ */ c.jsx(R, { className: T.answerFormula, children: C(p) }) : null, t[12] = f, t[13] = p, t[14] = b, t[15] = e, t[16] = h, t[17] = A) : A = t[17];
  let q;
  t[18] !== j ? (q = j ? /* @__PURE__ */ c.jsx(N, { "data-testid": "equation-after", className: T.afterText, value: j }) : null, t[18] = j, t[19] = q) : q = t[19];
  let g;
  return t[20] !== w || t[21] !== A || t[22] !== q ? (g = /* @__PURE__ */ c.jsxs("div", { className: T.inputWrapper, "data-testid": "equation-answer-row", children: [
    w,
    A,
    q
  ] }), t[20] = w, t[21] = A, t[22] = q, t[23] = g) : g = t[23], g;
}, S = (x) => {
  const t = v.c(6), {
    description: s,
    deps: n
  } = x;
  let f, e;
  if (t[0] !== n.global || t[1] !== s.content ? (e = n.global.translateTasks(s.content), f = e.trim(), t[0] = n.global, t[1] = s.content, t[2] = f, t[3] = e) : (f = t[2], e = t[3]), !f)
    return null;
  let o;
  return t[4] !== e ? (o = /* @__PURE__ */ c.jsx("div", { className: T.content, "data-testid": "equation-content", children: /* @__PURE__ */ c.jsx(W, { children: e }) }), t[4] = e, t[5] = o) : o = t[5], o;
}, Q = (x) => {
  const t = v.c(31), {
    task: s,
    deps: n,
    answer: f,
    solution: e,
    withBefore: o,
    withAfter: i
  } = x, h = o === void 0 ? !1 : o, b = i === void 0 ? !1 : i;
  let p;
  t[0] !== n ? (p = (w) => n.global.translateTasks(w), t[0] = n, t[1] = p) : p = t[1];
  let m;
  t[2] !== e || t[3] !== p ? (m = $(e, p), t[2] = e, t[3] = p, t[4] = m) : m = t[4];
  const u = m;
  let l;
  t[5] !== n || t[6] !== s.title ? (l = /* @__PURE__ */ c.jsx(F, { title: s.title, deps: n }), t[5] = n, t[6] = s.title, t[7] = l) : l = t[7];
  let a;
  t[8] !== n || t[9] !== s.description ? (a = /* @__PURE__ */ c.jsx(S, { description: s.description, deps: n }), t[8] = n, t[9] = s.description, t[10] = a) : a = t[10];
  let d;
  t[11] !== f || t[12] !== u || t[13] !== n ? (d = /* @__PURE__ */ c.jsx(D, { userAnswer: f, correctAnswer: u, deps: n }), t[11] = f, t[12] = u, t[13] = n, t[14] = d) : d = t[14];
  let r;
  t[15] !== f || t[16] !== u || t[17] !== n || t[18] !== s.answerInput || t[19] !== b || t[20] !== h ? (r = /* @__PURE__ */ c.jsx(M, { answerInput: s.answerInput, deps: n, answer: f, mode: "solution", withBefore: h, withAfter: b, correctAnswer: u }), t[15] = f, t[16] = u, t[17] = n, t[18] = s.answerInput, t[19] = b, t[20] = h, t[21] = r) : r = t[21];
  let _;
  t[22] !== n || t[23] !== e ? (_ = /* @__PURE__ */ c.jsx(P, { solution: e, deps: n }), t[22] = n, t[23] = e, t[24] = _) : _ = t[24];
  let j;
  return t[25] !== l || t[26] !== a || t[27] !== d || t[28] !== r || t[29] !== _ ? (j = /* @__PURE__ */ c.jsxs("div", { className: T.container, children: [
    l,
    a,
    d,
    r,
    _
  ] }), t[25] = l, t[26] = a, t[27] = d, t[28] = r, t[29] = _, t[30] = j) : j = t[30], j;
}, U = ({
  id: x,
  withBefore: t = !1,
  withAfter: s = !1
}) => {
  const n = (f) => {
    const e = v.c(22), {
      task: o,
      deps: i,
      answer: h,
      onChange: b,
      mathInput: p
    } = f;
    if (y(o.solution)) {
      let r;
      return e[0] !== h || e[1] !== i || e[2] !== o ? (r = /* @__PURE__ */ c.jsx(Q, { task: o, deps: i, answer: h, solution: o.solution, withBefore: t, withAfter: s }), e[0] = h, e[1] = i, e[2] = o, e[3] = r) : r = e[3], r;
    }
    let m;
    e[4] !== i || e[5] !== o.title ? (m = /* @__PURE__ */ c.jsx(F, { title: o.title, deps: i }), e[4] = i, e[5] = o.title, e[6] = m) : m = e[6];
    let u;
    e[7] !== i || e[8] !== o.description ? (u = /* @__PURE__ */ c.jsx(S, { description: o.description, deps: i }), e[7] = i, e[8] = o.description, e[9] = u) : u = e[9];
    let l;
    e[10] !== p ? (l = (r) => I(r, p), e[10] = p, e[11] = l) : l = e[11];
    let a;
    e[12] !== h || e[13] !== i || e[14] !== b || e[15] !== l || e[16] !== o.answerInput ? (a = /* @__PURE__ */ c.jsx(M, { answerInput: o.answerInput, deps: i, answer: h, mode: "input", withBefore: t, withAfter: s, onChange: b, mathInputRef: l }), e[12] = h, e[13] = i, e[14] = b, e[15] = l, e[16] = o.answerInput, e[17] = a) : a = e[17];
    let d;
    return e[18] !== m || e[19] !== u || e[20] !== a ? (d = /* @__PURE__ */ c.jsxs("div", { className: T.container, "data-template-id": x, children: [
      m,
      u,
      a
    ] }), e[18] = m, e[19] = u, e[20] = a, e[21] = d) : d = e[21], d;
  };
  return n.displayName = x, n;
}, Y = U({
  id: "equation.before",
  withBefore: !0
});
export {
  Y as EquationBefore,
  Y as default
};
