import { c as D, k as O, l as q, j as i, a as G, b as Q, d as F, M as U, e as W, m as X, h as Y } from "./index-DNoheI6P.js";
import { g as J } from "./get-inline-input-entries-CGVm7T7Q.js";
import { S as Z, a as _ } from "./solution-answer-panel-C_30mrDJ.js";
import { s as u, T as K, m as H } from "./text-template.module-Dk8ZhN9f.js";
const tt = ($) => {
  const t = D.c(47), {
    task: T,
    deps: a,
    answer: b,
    solution: w,
    layout: S,
    normalizeBareMath: e
  } = $, s = e === void 0 ? !1 : e, l = a.helpers.TaskHelper.multipleTaskAnswerSeparator;
  let f;
  t[0] !== a.global ? (f = (M) => a.global.translateTasks(M), t[0] = a.global, t[1] = f) : f = t[1];
  const g = f;
  let j, m, d, p, x, h, n, r;
  if (t[2] !== b || t[3] !== a || t[4] !== S || t[5] !== l || t[6] !== s || t[7] !== w || t[8] !== T || t[9] !== g) {
    const M = O(w, l, g), v = q(b, l), V = J(T, g);
    h = u.container, t[18] !== a || t[19] !== T.title ? (n = /* @__PURE__ */ i.jsx(G, { title: T.title, deps: a }), t[18] = a, t[19] = T.title, t[20] = n) : n = t[20];
    const N = T;
    t[21] !== a || t[22] !== s || t[23] !== N ? (r = /* @__PURE__ */ i.jsx(K, { task: N, deps: a, normalizeBareMath: s }), t[21] = a, t[22] = s, t[23] = N, t[24] = r) : r = t[24];
    const R = v.join(" ; "), A = Q(M);
    t[25] !== a || t[26] !== R || t[27] !== A ? (j = /* @__PURE__ */ i.jsx(Z, { userAnswer: R, correctAnswer: A, deps: a }), t[25] = a, t[26] = R, t[27] = A, t[28] = j) : j = t[28], m = "text-inputs", d = S, p = S === "inline" ? u.inline : u.stack;
    let y;
    t[29] !== M || t[30] !== s ? (y = (E, I) => {
      var C;
      const {
        key: L,
        before: B,
        after: z
      } = E;
      return /* @__PURE__ */ i.jsxs("div", { className: `${u.inputRow} ${u.solutionRow}`, children: [
        B && /* @__PURE__ */ i.jsx(F, { "data-testid": "text-prefix", className: u.fieldLabel, value: H(B, s) }),
        /* @__PURE__ */ i.jsx(U, { className: u.answerFormula, children: (C = M[I]) != null ? C : "" }),
        z && /* @__PURE__ */ i.jsx(F, { "data-testid": "text-suffix", className: u.suffix, value: H(z, s) })
      ] }, L);
    }, t[29] = M, t[30] = s, t[31] = y) : y = t[31], x = V.map(y), t[2] = b, t[3] = a, t[4] = S, t[5] = l, t[6] = s, t[7] = w, t[8] = T, t[9] = g, t[10] = j, t[11] = m, t[12] = d, t[13] = p, t[14] = x, t[15] = h, t[16] = n, t[17] = r;
  } else
    j = t[10], m = t[11], d = t[12], p = t[13], x = t[14], h = t[15], n = t[16], r = t[17];
  let o;
  t[32] !== m || t[33] !== d || t[34] !== p || t[35] !== x ? (o = /* @__PURE__ */ i.jsx("div", { "data-testid": m, "data-layout": d, className: p, children: x }), t[32] = m, t[33] = d, t[34] = p, t[35] = x, t[36] = o) : o = t[36];
  let c;
  t[37] !== a || t[38] !== w ? (c = /* @__PURE__ */ i.jsx(_, { solution: w, deps: a }), t[37] = a, t[38] = w, t[39] = c) : c = t[39];
  let k;
  return t[40] !== j || t[41] !== o || t[42] !== c || t[43] !== h || t[44] !== n || t[45] !== r ? (k = /* @__PURE__ */ i.jsxs("div", { className: h, children: [
    n,
    r,
    j,
    o,
    c
  ] }), t[40] = j, t[41] = o, t[42] = c, t[43] = h, t[44] = n, t[45] = r, t[46] = k) : k = t[46], k;
}, it = ({
  id: $,
  layout: t,
  withBefore: T = !1,
  withAfter: a = !1,
  normalizeBareMath: b = !1
}) => {
  const w = (S) => {
    const e = D.c(40), {
      task: s,
      deps: l,
      answer: f,
      onChange: g,
      mathInput: j
    } = S;
    if (W(s.solution)) {
      let v;
      return e[0] !== f || e[1] !== l || e[2] !== s ? (v = /* @__PURE__ */ i.jsx(tt, { task: s, deps: l, answer: f, solution: s.solution, layout: t, normalizeBareMath: b }), e[0] = f, e[1] = l, e[2] = s, e[3] = v) : v = e[3], v;
    }
    const m = l.helpers.TaskHelper.multipleTaskAnswerSeparator;
    let d, p, x, h, n, r, o, c;
    if (e[4] !== f || e[5] !== l || e[6] !== j || e[7] !== g || e[8] !== m || e[9] !== s) {
      const {
        bindRef: v,
        handleChange: V
      } = X({
        onChange: g,
        separator: m,
        mathInput: j
      });
      let N;
      e[18] !== f || e[19] !== m ? (N = q(f, m), e[18] = f, e[19] = m, e[20] = N) : N = e[20];
      const R = N;
      let A;
      e[21] !== l.global ? (A = (I) => l.global.translateTasks(I), e[21] = l.global, e[22] = A) : A = e[22];
      const y = J(s, A);
      n = u.container, r = $, e[23] !== l || e[24] !== s.title ? (o = /* @__PURE__ */ i.jsx(G, { title: s.title, deps: l }), e[23] = l, e[24] = s.title, e[25] = o) : o = e[25];
      const E = s;
      e[26] !== l || e[27] !== E ? (c = /* @__PURE__ */ i.jsx(K, { task: E, deps: l, normalizeBareMath: b }), e[26] = l, e[27] = E, e[28] = c) : c = e[28], d = "text-inputs", p = t, x = t === "inline" ? u.inline : u.stack, h = y.map((I, L) => {
        var P;
        const {
          key: B,
          before: z,
          after: C
        } = I;
        return /* @__PURE__ */ i.jsxs("div", { className: u.inputRow, children: [
          T && z && /* @__PURE__ */ i.jsx(F, { "data-testid": "text-prefix", className: u.fieldLabel, value: H(z, b) }),
          /* @__PURE__ */ i.jsx(Y, { id: B, ref: v(B), formula: (P = R[L]) != null ? P : "", onMathFieldChanged: V, className: u.input }),
          a && C && /* @__PURE__ */ i.jsx(F, { "data-testid": "text-suffix", className: u.suffix, value: H(C, b) })
        ] }, B);
      }), e[4] = f, e[5] = l, e[6] = j, e[7] = g, e[8] = m, e[9] = s, e[10] = d, e[11] = p, e[12] = x, e[13] = h, e[14] = n, e[15] = r, e[16] = o, e[17] = c;
    } else
      d = e[10], p = e[11], x = e[12], h = e[13], n = e[14], r = e[15], o = e[16], c = e[17];
    let k;
    e[29] !== d || e[30] !== p || e[31] !== x || e[32] !== h ? (k = /* @__PURE__ */ i.jsx("div", { "data-testid": d, "data-layout": p, className: x, children: h }), e[29] = d, e[30] = p, e[31] = x, e[32] = h, e[33] = k) : k = e[33];
    let M;
    return e[34] !== n || e[35] !== r || e[36] !== o || e[37] !== c || e[38] !== k ? (M = /* @__PURE__ */ i.jsxs("div", { className: n, "data-template-id": r, children: [
      o,
      c,
      k
    ] }), e[34] = n, e[35] = r, e[36] = o, e[37] = c, e[38] = k, e[39] = M) : M = e[39], M;
  };
  return w.displayName = $, w;
};
export {
  it as c
};
