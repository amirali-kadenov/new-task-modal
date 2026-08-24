import { c as N, s as R, g as b, t as k, b as y, p as B, A as $, B as E, D as I, j as l, a as T, L as P, E as M, F as v, M as q, e as L, f as z, h as G } from "./index-DNoheI6P.js";
import { S as F, a as H } from "./solution-answer-panel-C_30mrDJ.js";
const J = (h) => {
  const e = N.c(42), {
    task: p,
    deps: t,
    answer: n,
    solution: s
  } = h;
  let i, m, r, o, d;
  if (e[0] !== t || e[1] !== s || e[2] !== p) {
    let C;
    e[8] !== t ? (C = (O) => t.global.translateTasks(O), e[8] = t, e[9] = C) : C = e[9], i = R(b(s, C));
    let S;
    e[10] !== s ? (S = k(s), e[10] = s, e[11] = S) : S = e[11], r = S, o = y([i]);
    const A = B(p, t);
    m = !!(A && $(A));
    const g = m && A ? E(A, {
      quotient: i || void 0
    }) : null;
    d = g ? I(g) : null, e[0] = t, e[1] = s, e[2] = p, e[3] = i, e[4] = m, e[5] = r, e[6] = o, e[7] = d;
  } else
    i = e[3], m = e[4], r = e[5], o = e[6], d = e[7];
  const a = d;
  let c;
  e[12] !== t || e[13] !== p.title ? (c = /* @__PURE__ */ l.jsx(T, { title: p.title, deps: t }), e[12] = t, e[13] = p.title, e[14] = c) : c = e[14];
  let f;
  e[15] !== i || e[16] !== t || e[17] !== a || e[18] !== p ? (f = a ? /* @__PURE__ */ l.jsx(P, { dividend: a.dividend, divisor: a.divisor }) : /* @__PURE__ */ l.jsx(M, { task: p, deps: t, quotient: i || void 0 }), e[15] = i, e[16] = t, e[17] = a, e[18] = p, e[19] = f) : f = e[19];
  let u;
  e[20] !== n || e[21] !== i || e[22] !== t || e[23] !== m || e[24] !== r || e[25] !== o ? (u = !r && /* @__PURE__ */ l.jsxs(l.Fragment, { children: [
    /* @__PURE__ */ l.jsx(F, { userAnswer: n, correctAnswer: o, deps: t }),
    i && !m && /* @__PURE__ */ l.jsx("div", { className: `${v.inputRow} ${v.solutionRow}`, children: /* @__PURE__ */ l.jsx(q, { className: v.answerFormula, children: i }) })
  ] }), e[20] = n, e[21] = i, e[22] = t, e[23] = m, e[24] = r, e[25] = o, e[26] = u) : u = e[26];
  let x;
  e[27] !== n || e[28] !== t || e[29] !== r || e[30] !== o ? (x = r && /* @__PURE__ */ l.jsx(F, { userAnswer: n, correctAnswer: o, deps: t }), e[27] = n, e[28] = t, e[29] = r, e[30] = o, e[31] = x) : x = e[31];
  const D = !!a;
  let j;
  e[32] !== t || e[33] !== s || e[34] !== D ? (j = /* @__PURE__ */ l.jsx(H, { solution: s, deps: t, suppressFreeTextContent: D }), e[32] = t, e[33] = s, e[34] = D, e[35] = j) : j = e[35];
  let w;
  return e[36] !== c || e[37] !== f || e[38] !== u || e[39] !== x || e[40] !== j ? (w = /* @__PURE__ */ l.jsxs("div", { className: v.container, children: [
    c,
    f,
    u,
    x,
    j
  ] }), e[36] = c, e[37] = f, e[38] = u, e[39] = x, e[40] = j, e[41] = w) : w = e[41], w;
}, K = ({
  id: h
}) => {
  const e = (p) => {
    const t = N.c(20), {
      task: n,
      deps: s,
      answer: i,
      onChange: m,
      mathInput: r
    } = p;
    if (L(n.solution)) {
      let u;
      return t[0] !== i || t[1] !== s || t[2] !== n ? (u = /* @__PURE__ */ l.jsx(J, { task: n, deps: s, answer: i, solution: n.solution }), t[0] = i, t[1] = s, t[2] = n, t[3] = u) : u = t[3], u;
    }
    let o;
    t[4] !== s || t[5] !== n.title ? (o = /* @__PURE__ */ l.jsx(T, { title: n.title, deps: s }), t[4] = s, t[5] = n.title, t[6] = o) : o = t[6];
    let d;
    t[7] !== s || t[8] !== n ? (d = /* @__PURE__ */ l.jsx(M, { task: n, deps: s }), t[7] = s, t[8] = n, t[9] = d) : d = t[9];
    let a;
    t[10] !== r ? (a = (u) => z(u, r), t[10] = r, t[11] = a) : a = t[11];
    let c;
    t[12] !== i || t[13] !== m || t[14] !== a ? (c = /* @__PURE__ */ l.jsx(G, { ref: a, formula: i, onMathFieldChanged: m, className: v.input }), t[12] = i, t[13] = m, t[14] = a, t[15] = c) : c = t[15];
    let f;
    return t[16] !== o || t[17] !== d || t[18] !== c ? (f = /* @__PURE__ */ l.jsxs("div", { className: v.container, "data-template-id": h, children: [
      o,
      d,
      c
    ] }), t[16] = o, t[17] = d, t[18] = c, t[19] = f) : f = t[19], f;
  };
  return e.displayName = h, e;
}, V = K({
  id: "columnOperation.plain"
});
export {
  V as ColumnOperationPlain
};
