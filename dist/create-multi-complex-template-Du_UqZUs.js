import { c as z, k as G, l as F, R as V, j as s, a as $, J as D, b as K, Q as n, d as R, M as O, e as U, m as W, h as X } from "./index-DNoheI6P.js";
import { g as L } from "./get-inline-input-entries-CGVm7T7Q.js";
import { S as Y, a as Z } from "./solution-answer-panel-C_30mrDJ.js";
const _ = (I) => {
  var S, v, M, j;
  const e = z.c(44), {
    task: l,
    deps: t,
    answer: w,
    solution: a,
    layout: u
  } = I, p = t.helpers.TaskHelper.multipleTaskAnswerSeparator;
  let A;
  e[0] !== t.global ? (A = (N) => t.global.translateTasks(N), e[0] = t.global, e[1] = A) : A = e[1];
  const d = A;
  let h;
  e[2] !== p || e[3] !== a || e[4] !== d ? (h = G(a, p, d), e[2] = p, e[3] = a, e[4] = d, e[5] = h) : h = e[5];
  const o = h;
  let x, i, r, c, m;
  if (e[6] !== w || e[7] !== o || e[8] !== t || e[9] !== u || e[10] !== p || e[11] !== l || e[12] !== d) {
    const N = F(w, p), H = !!((S = l.description) != null && S.isAnswerCellHidden);
    let T;
    e[18] !== o || e[19] !== ((v = l.description) == null ? void 0 : v.parts) ? (T = V((M = l.description) == null ? void 0 : M.parts) ? o : null, e[18] = o, e[19] = (j = l.description) == null ? void 0 : j.parts, e[20] = T) : T = e[20];
    const C = T, P = L(l, d);
    x = n.container, e[21] !== t || e[22] !== l.title ? (i = /* @__PURE__ */ s.jsx($, { title: l.title, deps: t }), e[21] = t, e[22] = l.title, e[23] = i) : i = e[23], e[24] !== t || e[25] !== C || e[26] !== l.description ? (r = /* @__PURE__ */ s.jsx(D, { description: l.description, deps: t, tableSolutionAnswers: C }), e[24] = t, e[25] = C, e[26] = l.description, e[27] = r) : r = e[27];
    const E = N.join(" ; ");
    let g;
    e[28] !== o ? (g = K(o), e[28] = o, e[29] = g) : g = e[29], e[30] !== t || e[31] !== g || e[32] !== E ? (c = /* @__PURE__ */ s.jsx(Y, { userAnswer: E, correctAnswer: g, deps: t }), e[30] = t, e[31] = g, e[32] = E, e[33] = c) : c = e[33], m = H ? null : /* @__PURE__ */ s.jsx("div", { "data-testid": "text-inputs", "data-layout": u, className: u === "inline" ? n.inline : n.stack, children: P.map((J, Q) => {
      var k;
      const {
        key: q,
        before: y,
        after: B
      } = J;
      return /* @__PURE__ */ s.jsxs("div", { className: `${n.inputRow} ${n.solutionRow}`, children: [
        y ? /* @__PURE__ */ s.jsx(R, { "data-testid": "text-prefix", className: n.fieldLabel, value: y }) : null,
        /* @__PURE__ */ s.jsx(O, { className: n.answerFormula, children: (k = o[Q]) != null ? k : "" }),
        B ? /* @__PURE__ */ s.jsx(R, { "data-testid": "text-suffix", className: n.suffix, value: B }) : null
      ] }, q);
    }) }), e[6] = w, e[7] = o, e[8] = t, e[9] = u, e[10] = p, e[11] = l, e[12] = d, e[13] = x, e[14] = i, e[15] = r, e[16] = c, e[17] = m;
  } else
    x = e[13], i = e[14], r = e[15], c = e[16], m = e[17];
  let f;
  e[34] !== t || e[35] !== a ? (f = /* @__PURE__ */ s.jsx(Z, { solution: a, deps: t }), e[34] = t, e[35] = a, e[36] = f) : f = e[36];
  let b;
  return e[37] !== x || e[38] !== i || e[39] !== r || e[40] !== c || e[41] !== m || e[42] !== f ? (b = /* @__PURE__ */ s.jsxs("div", { className: x, children: [
    i,
    r,
    c,
    m,
    f
  ] }), e[37] = x, e[38] = i, e[39] = r, e[40] = c, e[41] = m, e[42] = f, e[43] = b) : b = e[43], b;
}, le = ({
  id: I,
  layout: e,
  withBefore: l = !1,
  withAfter: t = !1
}) => {
  const w = ({
    task: a,
    deps: u,
    answer: p,
    onChange: A,
    mathInput: d
  }) => {
    var v, M;
    if (U(a.solution))
      return /* @__PURE__ */ s.jsx(_, { task: a, deps: u, answer: p, solution: a.solution, layout: e });
    const h = !!((v = a.description) != null && v.isAnswerCellHidden), o = V((M = a.description) == null ? void 0 : M.parts), x = h && o, i = u.helpers.TaskHelper.multipleTaskAnswerSeparator, {
      bindRef: r,
      handleChange: c
    } = W({
      onChange: A,
      separator: i,
      mathInput: d
    });
    let m = 0;
    const f = x ? {
      answer: p,
      separator: i,
      bindRef: r,
      handleChange: c,
      nextInputIndex: () => m++
    } : null, b = F(p, i), S = L(a, (j) => u.global.translateTasks(j));
    return /* @__PURE__ */ s.jsxs("div", { className: n.container, "data-template-id": I, children: [
      /* @__PURE__ */ s.jsx($, { title: a.title, deps: u }),
      /* @__PURE__ */ s.jsx(D, { description: a.description, deps: u, tableAnswerBindings: f }),
      h ? null : /* @__PURE__ */ s.jsx("div", { "data-testid": "text-inputs", "data-layout": e, className: n.stack, children: S.map(({
        key: j,
        before: N,
        after: H
      }, T) => {
        var C;
        return /* @__PURE__ */ s.jsxs("div", { className: n.inputRow, children: [
          l && N ? /* @__PURE__ */ s.jsx(R, { "data-testid": "text-prefix", className: n.fieldLabel, value: N }) : null,
          /* @__PURE__ */ s.jsx(X, { id: j, ref: r(j), formula: (C = b[T]) != null ? C : "", onMathFieldChanged: c, className: n.input }),
          t && H ? /* @__PURE__ */ s.jsx(R, { "data-testid": "text-suffix", className: n.suffix, value: H }) : null
        ] }, j);
      }) })
    ] });
  };
  return w.displayName = I, w;
};
export {
  le as c
};
