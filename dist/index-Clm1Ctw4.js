import { c as V, k as K, l as q, p as Q, A as U, B as W, D as X, j as i, a as z, L as Y, E as G, b as Z, F as c, d as I, M as _, e as tt, m as et, h as st } from "./index-DNoheI6P.js";
import { g as J } from "./get-inline-input-entries-CGVm7T7Q.js";
import { S as it, a as at } from "./solution-answer-panel-C_30mrDJ.js";
const lt = (B) => {
  const t = V.c(43), {
    task: w,
    deps: a,
    answer: M,
    solution: g,
    layout: e
  } = B, l = a.helpers.TaskHelper.multipleTaskAnswerSeparator;
  let s;
  t[0] !== a.global ? (s = (n) => a.global.translateTasks(n), t[0] = a.global, t[1] = s) : s = t[1];
  const d = s;
  let k, N, p, m, f, x, o, v, r;
  if (t[2] !== M || t[3] !== a || t[4] !== e || t[5] !== l || t[6] !== g || t[7] !== w || t[8] !== d) {
    const n = K(g, l, d), L = q(M, l), A = J(w, d), D = Q(w, a), E = !!(D && U(D)) && D ? W(D, {
      quotient: n[0] || void 0
    }) : null;
    k = E ? X(E) : null, x = c.container, t[18] !== a || t[19] !== w.title ? (o = /* @__PURE__ */ i.jsx(z, { title: w.title, deps: a }), t[18] = a, t[19] = w.title, t[20] = o) : o = t[20], v = k ? /* @__PURE__ */ i.jsx(Y, { dividend: k.dividend, divisor: k.divisor }) : /* @__PURE__ */ i.jsx(G, { task: w, deps: a, quotient: n[0] || void 0, remainder: n[1] || void 0 });
    const T = L.join(" ; "), y = Z(n);
    t[21] !== a || t[22] !== T || t[23] !== y ? (r = /* @__PURE__ */ i.jsx(it, { userAnswer: T, correctAnswer: y, deps: a }), t[21] = a, t[22] = T, t[23] = y, t[24] = r) : r = t[24], N = "text-inputs", p = e, m = e === "inline" ? c.inline : c.stack;
    let C;
    t[25] !== n ? (C = (O, R) => {
      var P;
      const {
        key: F,
        before: $,
        after: H
      } = O;
      return /* @__PURE__ */ i.jsxs("div", { className: `${c.inputRow} ${c.solutionRow}`, children: [
        $ && /* @__PURE__ */ i.jsx(I, { "data-testid": "text-prefix", className: c.fieldLabel, value: $ }),
        /* @__PURE__ */ i.jsx(_, { className: c.answerFormula, children: (P = n[R]) != null ? P : "" }),
        H && /* @__PURE__ */ i.jsx(I, { "data-testid": "text-suffix", className: c.suffix, value: H })
      ] }, F);
    }, t[25] = n, t[26] = C) : C = t[26], f = A.map(C), t[2] = M, t[3] = a, t[4] = e, t[5] = l, t[6] = g, t[7] = w, t[8] = d, t[9] = k, t[10] = N, t[11] = p, t[12] = m, t[13] = f, t[14] = x, t[15] = o, t[16] = v, t[17] = r;
  } else
    k = t[9], N = t[10], p = t[11], m = t[12], f = t[13], x = t[14], o = t[15], v = t[16], r = t[17];
  let u;
  t[27] !== N || t[28] !== p || t[29] !== m || t[30] !== f ? (u = /* @__PURE__ */ i.jsx("div", { "data-testid": N, "data-layout": p, className: m, children: f }), t[27] = N, t[28] = p, t[29] = m, t[30] = f, t[31] = u) : u = t[31];
  const h = !!k;
  let j;
  t[32] !== a || t[33] !== g || t[34] !== h ? (j = /* @__PURE__ */ i.jsx(at, { solution: g, deps: a, suppressFreeTextContent: h }), t[32] = a, t[33] = g, t[34] = h, t[35] = j) : j = t[35];
  let b;
  return t[36] !== u || t[37] !== j || t[38] !== x || t[39] !== o || t[40] !== v || t[41] !== r ? (b = /* @__PURE__ */ i.jsxs("div", { className: x, children: [
    o,
    v,
    r,
    u,
    j
  ] }), t[36] = u, t[37] = j, t[38] = x, t[39] = o, t[40] = v, t[41] = r, t[42] = b) : b = t[42], b;
}, nt = ({
  id: B,
  layout: t,
  withBefore: w = !1,
  withAfter: a = !1
}) => {
  const M = (g) => {
    const e = V.c(40), {
      task: l,
      deps: s,
      answer: d,
      onChange: k,
      mathInput: N
    } = g;
    if (tt(l.solution)) {
      let n;
      return e[0] !== d || e[1] !== s || e[2] !== l ? (n = /* @__PURE__ */ i.jsx(lt, { task: l, deps: s, answer: d, solution: l.solution, layout: t }), e[0] = d, e[1] = s, e[2] = l, e[3] = n) : n = e[3], n;
    }
    const p = s.helpers.TaskHelper.multipleTaskAnswerSeparator;
    let m, f, x, o, v, r, u, h;
    if (e[4] !== d || e[5] !== s || e[6] !== N || e[7] !== k || e[8] !== p || e[9] !== l) {
      const {
        bindRef: n,
        handleChange: L
      } = et({
        onChange: k,
        separator: p,
        mathInput: N
      });
      let A;
      e[18] !== d || e[19] !== p ? (A = q(d, p), e[18] = d, e[19] = p, e[20] = A) : A = e[20];
      const D = A;
      let S;
      e[21] !== s.global ? (S = (T) => s.global.translateTasks(T), e[21] = s.global, e[22] = S) : S = e[22];
      const E = J(l, S);
      v = c.container, r = B, e[23] !== s || e[24] !== l.title ? (u = /* @__PURE__ */ i.jsx(z, { title: l.title, deps: s }), e[23] = s, e[24] = l.title, e[25] = u) : u = e[25], e[26] !== s || e[27] !== l ? (h = /* @__PURE__ */ i.jsx(G, { task: l, deps: s }), e[26] = s, e[27] = l, e[28] = h) : h = e[28], m = "text-inputs", f = t, x = c.stack, o = E.map((T, y) => {
        var F;
        const {
          key: C,
          before: O,
          after: R
        } = T;
        return /* @__PURE__ */ i.jsxs("div", { className: c.inputRow, children: [
          w && O && /* @__PURE__ */ i.jsx(I, { "data-testid": "text-prefix", className: c.fieldLabel, value: O }),
          /* @__PURE__ */ i.jsx(st, { id: C, ref: n(C), formula: (F = D[y]) != null ? F : "", onMathFieldChanged: L, className: c.input }),
          a && R && /* @__PURE__ */ i.jsx(I, { "data-testid": "text-suffix", className: c.suffix, value: R })
        ] }, C);
      }), e[4] = d, e[5] = s, e[6] = N, e[7] = k, e[8] = p, e[9] = l, e[10] = m, e[11] = f, e[12] = x, e[13] = o, e[14] = v, e[15] = r, e[16] = u, e[17] = h;
    } else
      m = e[10], f = e[11], x = e[12], o = e[13], v = e[14], r = e[15], u = e[16], h = e[17];
    let j;
    e[29] !== m || e[30] !== f || e[31] !== x || e[32] !== o ? (j = /* @__PURE__ */ i.jsx("div", { "data-testid": m, "data-layout": f, className: x, children: o }), e[29] = m, e[30] = f, e[31] = x, e[32] = o, e[33] = j) : j = e[33];
    let b;
    return e[34] !== v || e[35] !== r || e[36] !== u || e[37] !== h || e[38] !== j ? (b = /* @__PURE__ */ i.jsxs("div", { className: v, "data-template-id": r, children: [
      u,
      h,
      j
    ] }), e[34] = v, e[35] = r, e[36] = u, e[37] = h, e[38] = j, e[39] = b) : b = e[39], b;
  };
  return M.displayName = B, M;
}, ct = nt({
  id: "columnOperation.multi.stack.n2.before",
  layout: "stack",
  withBefore: !0
});
export {
  ct as ColumnOperationMultiStackN2Before
};
