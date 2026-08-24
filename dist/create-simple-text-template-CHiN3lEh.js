import { c as G, s as L, g as O, j as r, a as H, b as Q, i as J, d as E, M as U, e as V, f as W, h as X } from "./index-DNoheI6P.js";
import { S as Y, a as Z } from "./solution-answer-panel-C_30mrDJ.js";
import { m as F, s as g, T as K } from "./text-template.module-Dk8ZhN9f.js";
const P = (o, t) => o == null ? "" : J(o) ? t(o) : typeof o == "string" ? o : "", _ = (o) => {
  const t = G.c(58), {
    task: m,
    deps: a,
    answer: B,
    solution: y,
    withBefore: z,
    withAfter: e,
    answerInputAsSuffix: f,
    normalizeBareMath: n
  } = o, b = z === void 0 ? !1 : z, R = e === void 0 ? !1 : e, v = f === void 0 ? !1 : f, i = n === void 0 ? !1 : n;
  let S;
  t[0] !== a ? (S = (l) => a.global.translateTasks(l), t[0] = a, t[1] = S) : S = t[1];
  const s = S;
  let N, d, h, u, c, k, j, p, x;
  if (t[2] !== B || t[3] !== v || t[4] !== a || t[5] !== i || t[6] !== y || t[7] !== m || t[8] !== s || t[9] !== R || t[10] !== b) {
    d = L(O(y, s));
    const l = m.answerInput;
    let C;
    t[20] !== (l == null ? void 0 : l.before) || t[21] !== i || t[22] !== s || t[23] !== b ? (C = b ? F(P(l == null ? void 0 : l.before, s), i) : "", t[20] = l == null ? void 0 : l.before, t[21] = i, t[22] = s, t[23] = b, t[24] = C) : C = t[24], h = C;
    let D;
    t[25] !== (l == null ? void 0 : l.after) || t[26] !== v || t[27] !== i || t[28] !== m.answerInput || t[29] !== s || t[30] !== R ? (D = v ? F(P(m.answerInput, s), i) : R ? F(P(l == null ? void 0 : l.after, s), i) : "", t[25] = l == null ? void 0 : l.after, t[26] = v, t[27] = i, t[28] = m.answerInput, t[29] = s, t[30] = R, t[31] = D) : D = t[31], u = D, p = g.container, t[32] !== a || t[33] !== m.title ? (x = /* @__PURE__ */ r.jsx(H, { title: m.title, deps: a }), t[32] = a, t[33] = m.title, t[34] = x) : x = t[34];
    const w = m;
    t[35] !== a || t[36] !== i || t[37] !== w ? (c = /* @__PURE__ */ r.jsx(K, { task: w, deps: a, normalizeBareMath: i }), t[35] = a, t[36] = i, t[37] = w, t[38] = c) : c = t[38], N = Y, k = B, j = Q([d]), t[2] = B, t[3] = v, t[4] = a, t[5] = i, t[6] = y, t[7] = m, t[8] = s, t[9] = R, t[10] = b, t[11] = N, t[12] = d, t[13] = h, t[14] = u, t[15] = c, t[16] = k, t[17] = j, t[18] = p, t[19] = x;
  } else
    N = t[11], d = t[12], h = t[13], u = t[14], c = t[15], k = t[16], j = t[17], p = t[18], x = t[19];
  let T;
  t[39] !== N || t[40] !== a || t[41] !== k || t[42] !== j ? (T = /* @__PURE__ */ r.jsx(N, { userAnswer: k, correctAnswer: j, deps: a }), t[39] = N, t[40] = a, t[41] = k, t[42] = j, t[43] = T) : T = t[43];
  let M;
  t[44] !== d || t[45] !== h || t[46] !== u ? (M = d && (h || u) && /* @__PURE__ */ r.jsxs("div", { className: `${g.inputRow} ${g.solutionRow}`, children: [
    h && /* @__PURE__ */ r.jsx(E, { "data-testid": "text-prefix", className: g.prefix, value: h }),
    /* @__PURE__ */ r.jsx(U, { className: g.answerFormula, children: d }),
    u && /* @__PURE__ */ r.jsx(E, { "data-testid": "text-suffix", className: g.suffix, value: u })
  ] }), t[44] = d, t[45] = h, t[46] = u, t[47] = M) : M = t[47];
  let A;
  t[48] !== a || t[49] !== y ? (A = /* @__PURE__ */ r.jsx(Z, { solution: y, deps: a }), t[48] = a, t[49] = y, t[50] = A) : A = t[50];
  let $;
  return t[51] !== c || t[52] !== T || t[53] !== M || t[54] !== A || t[55] !== p || t[56] !== x ? ($ = /* @__PURE__ */ r.jsxs("div", { className: p, children: [
    x,
    c,
    T,
    M,
    A
  ] }), t[51] = c, t[52] = T, t[53] = M, t[54] = A, t[55] = p, t[56] = x, t[57] = $) : $ = t[57], $;
}, q = (o, t) => o == null ? "" : J(o) ? t(o) : typeof o == "string" ? o : "", st = ({
  id: o,
  withBefore: t = !1,
  withAfter: m = !1,
  answerInputAsSuffix: a = !1,
  normalizeBareMath: B = !1
}) => {
  const y = (z) => {
    const e = G.c(37), {
      task: f,
      deps: n,
      answer: b,
      onChange: R,
      mathInput: v
    } = z;
    if (V(f.solution)) {
      let l;
      return e[0] !== b || e[1] !== n || e[2] !== f ? (l = /* @__PURE__ */ r.jsx(_, { task: f, deps: n, answer: b, solution: f.solution, withBefore: t, withAfter: m, answerInputAsSuffix: a, normalizeBareMath: B }), e[0] = b, e[1] = n, e[2] = f, e[3] = l) : l = e[3], l;
    }
    let i;
    e[4] !== n ? (i = (l) => n.global.translateTasks(l), e[4] = n, e[5] = i) : i = e[5];
    const S = i, s = f.answerInput;
    let N;
    e[6] !== (s == null ? void 0 : s.before) || e[7] !== S ? (N = t ? F(q(s == null ? void 0 : s.before, S), B) : "", e[6] = s == null ? void 0 : s.before, e[7] = S, e[8] = N) : N = e[8];
    const d = N;
    let h;
    e[9] !== (s == null ? void 0 : s.after) || e[10] !== f.answerInput || e[11] !== S ? (h = a ? F(q(f.answerInput, S), B) : m ? F(q(s == null ? void 0 : s.after, S), B) : "", e[9] = s == null ? void 0 : s.after, e[10] = f.answerInput, e[11] = S, e[12] = h) : h = e[12];
    const u = h;
    let c;
    e[13] !== n || e[14] !== f.title ? (c = /* @__PURE__ */ r.jsx(H, { title: f.title, deps: n }), e[13] = n, e[14] = f.title, e[15] = c) : c = e[15];
    const k = f;
    let j;
    e[16] !== n || e[17] !== k ? (j = /* @__PURE__ */ r.jsx(K, { task: k, deps: n, normalizeBareMath: B }), e[16] = n, e[17] = k, e[18] = j) : j = e[18];
    let p;
    e[19] !== d ? (p = d && /* @__PURE__ */ r.jsx(E, { "data-testid": "text-prefix", className: g.prefix, value: d }), e[19] = d, e[20] = p) : p = e[20];
    let x;
    e[21] !== v ? (x = (l) => W(l, v), e[21] = v, e[22] = x) : x = e[22];
    let T;
    e[23] !== b || e[24] !== R || e[25] !== x ? (T = /* @__PURE__ */ r.jsx(X, { ref: x, formula: b, onMathFieldChanged: R, className: g.input }), e[23] = b, e[24] = R, e[25] = x, e[26] = T) : T = e[26];
    let M;
    e[27] !== u ? (M = u && /* @__PURE__ */ r.jsx(E, { "data-testid": "text-suffix", className: g.suffix, value: u }), e[27] = u, e[28] = M) : M = e[28];
    let A;
    e[29] !== M || e[30] !== p || e[31] !== T ? (A = /* @__PURE__ */ r.jsxs("div", { className: g.inputRow, children: [
      p,
      T,
      M
    ] }), e[29] = M, e[30] = p, e[31] = T, e[32] = A) : A = e[32];
    let $;
    return e[33] !== A || e[34] !== c || e[35] !== j ? ($ = /* @__PURE__ */ r.jsxs("div", { className: g.container, "data-template-id": o, children: [
      c,
      j,
      A
    ] }), e[33] = A, e[34] = c, e[35] = j, e[36] = $) : $ = e[36], $;
  };
  return y.displayName = o, y;
};
export {
  st as c
};
