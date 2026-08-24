import { c as v, s as E, g as B, t as K, b as O, j as o, a as D, K as h, M as P, e as q, i as z, I as G, d as y, f as H, h as J } from "./index-DNoheI6P.js";
import { S as L } from "./shared-solution-description-d9sTMhQm.js";
import { S as C, a as Q } from "./solution-answer-panel-C_30mrDJ.js";
const U = (x) => {
  const t = v.c(35), {
    task: N,
    deps: l,
    answer: S,
    solution: e
  } = x;
  let a, i, n;
  if (t[0] !== l || t[1] !== e) {
    let p;
    t[5] !== l ? (p = (F) => l.global.translateTasks(F), t[5] = l, t[6] = p) : p = t[6], a = E(B(e, p));
    let m;
    t[7] !== e ? (m = K(e), t[7] = e, t[8] = m) : m = t[8], i = m, n = O([a]), t[0] = l, t[1] = e, t[2] = a, t[3] = i, t[4] = n;
  } else
    a = t[2], i = t[3], n = t[4];
  const u = n;
  let d;
  t[9] !== l || t[10] !== N.title ? (d = /* @__PURE__ */ o.jsx(D, { title: N.title, deps: l }), t[9] = l, t[10] = N.title, t[11] = d) : d = t[11];
  const A = N;
  let r;
  t[12] !== l || t[13] !== A ? (r = /* @__PURE__ */ o.jsx(L, { task: A, deps: l }), t[12] = l, t[13] = A, t[14] = r) : r = t[14];
  let s;
  t[15] !== S || t[16] !== a || t[17] !== l || t[18] !== i || t[19] !== u ? (s = !i && /* @__PURE__ */ o.jsxs(o.Fragment, { children: [
    /* @__PURE__ */ o.jsx(C, { userAnswer: S, correctAnswer: u, deps: l }),
    a && /* @__PURE__ */ o.jsx("div", { className: `${h.inputRow} ${h.solutionRow}`, children: /* @__PURE__ */ o.jsx(P, { className: h.answerFormula, children: a }) })
  ] }), t[15] = S, t[16] = a, t[17] = l, t[18] = i, t[19] = u, t[20] = s) : s = t[20];
  let f;
  t[21] !== S || t[22] !== l || t[23] !== i || t[24] !== u ? (f = i && /* @__PURE__ */ o.jsx(C, { userAnswer: S, correctAnswer: u, deps: l }), t[21] = S, t[22] = l, t[23] = i, t[24] = u, t[25] = f) : f = t[25];
  let c;
  t[26] !== l || t[27] !== e ? (c = /* @__PURE__ */ o.jsx(Q, { solution: e, deps: l }), t[26] = l, t[27] = e, t[28] = c) : c = t[28];
  let j;
  return t[29] !== d || t[30] !== r || t[31] !== s || t[32] !== f || t[33] !== c ? (j = /* @__PURE__ */ o.jsxs("div", { className: h.container, children: [
    d,
    r,
    s,
    f,
    c
  ] }), t[29] = d, t[30] = r, t[31] = s, t[32] = f, t[33] = c, t[34] = j) : j = t[34], j;
}, $ = (x, t) => x == null ? "" : z(x) ? t(x) : typeof x == "string" ? x : "", Y = ({
  id: x,
  withBefore: t = !1,
  withAfter: N = !1
}) => {
  const l = (S) => {
    const e = v.c(36), {
      task: a,
      deps: i,
      answer: n,
      onChange: u,
      mathInput: d
    } = S;
    if (q(a.solution)) {
      let g;
      return e[0] !== n || e[1] !== i || e[2] !== a ? (g = /* @__PURE__ */ o.jsx(U, { task: a, deps: i, answer: n, solution: a.solution }), e[0] = n, e[1] = i, e[2] = a, e[3] = g) : g = e[3], g;
    }
    let A;
    e[4] !== i ? (A = (g) => i.global.translateTasks(g), e[4] = i, e[5] = A) : A = e[5];
    const r = A, s = a.answerInput;
    let f;
    e[6] !== (s == null ? void 0 : s.before) || e[7] !== r ? (f = t ? $(s == null ? void 0 : s.before, r) : "", e[6] = s == null ? void 0 : s.before, e[7] = r, e[8] = f) : f = e[8];
    const c = f;
    let j;
    e[9] !== (s == null ? void 0 : s.after) || e[10] !== r ? (j = N ? $(s == null ? void 0 : s.after, r) : "", e[9] = s == null ? void 0 : s.after, e[10] = r, e[11] = j) : j = e[11];
    const p = j;
    let m;
    e[12] !== i || e[13] !== a.title ? (m = /* @__PURE__ */ o.jsx(D, { title: a.title, deps: i }), e[12] = i, e[13] = a.title, e[14] = m) : m = e[14];
    let F;
    e[15] !== i || e[16] !== a ? (F = /* @__PURE__ */ o.jsx(G, { task: a, deps: i }), e[15] = i, e[16] = a, e[17] = F) : F = e[17];
    let T;
    e[18] !== c ? (T = c && /* @__PURE__ */ o.jsx(y, { "data-testid": "text-prefix", className: h.prefix, value: c }), e[18] = c, e[19] = T) : T = e[19];
    let M;
    e[20] !== d ? (M = (g) => H(g, d), e[20] = d, e[21] = M) : M = e[21];
    let b;
    e[22] !== n || e[23] !== u || e[24] !== M ? (b = /* @__PURE__ */ o.jsx(J, { ref: M, formula: n, onMathFieldChanged: u, className: h.input }), e[22] = n, e[23] = u, e[24] = M, e[25] = b) : b = e[25];
    let k;
    e[26] !== p ? (k = p && /* @__PURE__ */ o.jsx(y, { "data-testid": "text-suffix", className: h.suffix, value: p }), e[26] = p, e[27] = k) : k = e[27];
    let R;
    e[28] !== F || e[29] !== T || e[30] !== b || e[31] !== k ? (R = /* @__PURE__ */ o.jsxs("div", { className: h.expressionRow, children: [
      F,
      T,
      b,
      k
    ] }), e[28] = F, e[29] = T, e[30] = b, e[31] = k, e[32] = R) : R = e[32];
    let w;
    return e[33] !== R || e[34] !== m ? (w = /* @__PURE__ */ o.jsxs("div", { className: h.container, "data-template-id": x, children: [
      m,
      R
    ] }), e[33] = R, e[34] = m, e[35] = w) : w = e[35], w;
  };
  return l.displayName = x, l;
};
export {
  Y as c
};
