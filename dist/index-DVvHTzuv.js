import { c as D, k as q, l as L, j as i, a as P, b as z, K as c, d as $, M as G, e as J, m as O, h as Q, I as U } from "./index-DNoheI6P.js";
import { g as K } from "./get-inline-input-entries-CGVm7T7Q.js";
import { S as W } from "./shared-solution-description-d9sTMhQm.js";
import { S as X, a as Y } from "./solution-answer-panel-C_30mrDJ.js";
const Z = (C) => {
  const t = D.c(44), {
    task: N,
    deps: s,
    answer: v,
    solution: g,
    layout: e
  } = C, a = s.helpers.TaskHelper.multipleTaskAnswerSeparator;
  let l;
  t[0] !== s.global ? (l = (h) => s.global.translateTasks(h), t[0] = s.global, t[1] = l) : l = t[1];
  const f = l;
  let k, w, d, m, p, n, r, o;
  if (t[2] !== v || t[3] !== s || t[4] !== e || t[5] !== a || t[6] !== g || t[7] !== N || t[8] !== f) {
    const h = q(g, a, f), T = L(v, a), M = K(N, f);
    p = c.container, t[17] !== s || t[18] !== N.title ? (n = /* @__PURE__ */ i.jsx(P, { title: N.title, deps: s }), t[17] = s, t[18] = N.title, t[19] = n) : n = t[19];
    const y = N;
    t[20] !== s || t[21] !== y ? (r = /* @__PURE__ */ i.jsx(W, { task: y, deps: s }), t[20] = s, t[21] = y, t[22] = r) : r = t[22];
    const S = T.join(" ; "), F = z(h);
    t[23] !== s || t[24] !== S || t[25] !== F ? (o = /* @__PURE__ */ i.jsx(X, { userAnswer: S, correctAnswer: F, deps: s }), t[23] = s, t[24] = S, t[25] = F, t[26] = o) : o = t[26], k = "text-inputs", w = e, d = e === "inline" ? c.inline : c.stack;
    let b;
    t[27] !== h ? (b = (B, I) => {
      var E;
      const {
        key: H,
        before: A,
        after: R
      } = B;
      return /* @__PURE__ */ i.jsxs("div", { className: `${c.inputRow} ${c.solutionRow}`, children: [
        A && /* @__PURE__ */ i.jsx($, { "data-testid": "text-prefix", className: c.fieldLabel, value: A }),
        /* @__PURE__ */ i.jsx(G, { className: c.answerFormula, children: (E = h[I]) != null ? E : "" }),
        R && /* @__PURE__ */ i.jsx($, { "data-testid": "text-suffix", className: c.suffix, value: R })
      ] }, H);
    }, t[27] = h, t[28] = b) : b = t[28], m = M.map(b), t[2] = v, t[3] = s, t[4] = e, t[5] = a, t[6] = g, t[7] = N, t[8] = f, t[9] = k, t[10] = w, t[11] = d, t[12] = m, t[13] = p, t[14] = n, t[15] = r, t[16] = o;
  } else
    k = t[9], w = t[10], d = t[11], m = t[12], p = t[13], n = t[14], r = t[15], o = t[16];
  let x;
  t[29] !== k || t[30] !== w || t[31] !== d || t[32] !== m ? (x = /* @__PURE__ */ i.jsx("div", { "data-testid": k, "data-layout": w, className: d, children: m }), t[29] = k, t[30] = w, t[31] = d, t[32] = m, t[33] = x) : x = t[33];
  let u;
  t[34] !== s || t[35] !== g ? (u = /* @__PURE__ */ i.jsx(Y, { solution: g, deps: s }), t[34] = s, t[35] = g, t[36] = u) : u = t[36];
  let j;
  return t[37] !== x || t[38] !== u || t[39] !== p || t[40] !== n || t[41] !== r || t[42] !== o ? (j = /* @__PURE__ */ i.jsxs("div", { className: p, children: [
    n,
    r,
    o,
    x,
    u
  ] }), t[37] = x, t[38] = u, t[39] = p, t[40] = n, t[41] = r, t[42] = o, t[43] = j) : j = t[43], j;
}, _ = ({
  id: C,
  layout: t,
  withBefore: N = !1,
  withAfter: s = !1
}) => {
  const v = (g) => {
    const e = D.c(40), {
      task: a,
      deps: l,
      answer: f,
      onChange: k,
      mathInput: w
    } = g;
    if (J(a.solution)) {
      let M;
      return e[0] !== f || e[1] !== l || e[2] !== a ? (M = /* @__PURE__ */ i.jsx(Z, { task: a, deps: l, answer: f, solution: a.solution, layout: t }), e[0] = f, e[1] = l, e[2] = a, e[3] = M) : M = e[3], M;
    }
    const d = l.helpers.TaskHelper.multipleTaskAnswerSeparator;
    let m, p, n, r, o, x, u, j;
    if (e[4] !== f || e[5] !== l || e[6] !== w || e[7] !== k || e[8] !== d || e[9] !== a) {
      const {
        bindRef: M,
        handleChange: y
      } = O({
        onChange: k,
        separator: d,
        mathInput: w
      });
      let S;
      e[18] !== f || e[19] !== d ? (S = L(f, d), e[18] = f, e[19] = d, e[20] = S) : S = e[20];
      const F = S;
      let b;
      e[21] !== l.global ? (b = (I) => l.global.translateTasks(I), e[21] = l.global, e[22] = b) : b = e[22];
      const B = K(a, b);
      o = c.container, x = C, e[23] !== l || e[24] !== a.title ? (u = /* @__PURE__ */ i.jsx(P, { title: a.title, deps: l }), e[23] = l, e[24] = a.title, e[25] = u) : u = e[25], e[26] !== l || e[27] !== a ? (j = /* @__PURE__ */ i.jsx(U, { task: a, deps: l }), e[26] = l, e[27] = a, e[28] = j) : j = e[28], m = "text-inputs", p = t, n = c.stack, r = B.map((I, H) => {
        var V;
        const {
          key: A,
          before: R,
          after: E
        } = I;
        return /* @__PURE__ */ i.jsxs("div", { className: c.inputRow, children: [
          N && R && /* @__PURE__ */ i.jsx($, { "data-testid": "text-prefix", className: c.fieldLabel, value: R }),
          /* @__PURE__ */ i.jsx(Q, { id: A, ref: M(A), formula: (V = F[H]) != null ? V : "", onMathFieldChanged: y, className: c.input }),
          s && E && /* @__PURE__ */ i.jsx($, { "data-testid": "text-suffix", className: c.suffix, value: E })
        ] }, A);
      }), e[4] = f, e[5] = l, e[6] = w, e[7] = k, e[8] = d, e[9] = a, e[10] = m, e[11] = p, e[12] = n, e[13] = r, e[14] = o, e[15] = x, e[16] = u, e[17] = j;
    } else
      m = e[10], p = e[11], n = e[12], r = e[13], o = e[14], x = e[15], u = e[16], j = e[17];
    let h;
    e[29] !== m || e[30] !== p || e[31] !== n || e[32] !== r ? (h = /* @__PURE__ */ i.jsx("div", { "data-testid": m, "data-layout": p, className: n, children: r }), e[29] = m, e[30] = p, e[31] = n, e[32] = r, e[33] = h) : h = e[33];
    let T;
    return e[34] !== o || e[35] !== x || e[36] !== u || e[37] !== j || e[38] !== h ? (T = /* @__PURE__ */ i.jsxs("div", { className: o, "data-template-id": x, children: [
      u,
      j,
      h
    ] }), e[34] = o, e[35] = x, e[36] = u, e[37] = j, e[38] = h, e[39] = T) : T = e[39], T;
  };
  return v.displayName = C, v;
}, at = _({
  id: "formula.multi.stack.n2.before",
  layout: "stack",
  withBefore: !0
});
export {
  at as FormulaMultiStackN2Before
};
