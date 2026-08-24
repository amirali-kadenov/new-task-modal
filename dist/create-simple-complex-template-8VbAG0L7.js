import { N as Y, O as Z, c as _, s as k, g as I, b as ee, j as t, P as te, a as V, i as W, d as J, Q as a, M as se, e as ne, R as le, m as ie, J as K, h as oe, f as re } from "./index-DNoheI6P.js";
import { S as ae, a as ce } from "./solution-answer-panel-C_30mrDJ.js";
const X = (n) => {
  const e = n == null ? void 0 : n.parts;
  return e != null && e.length ? e.every((l) => {
    const s = Y(l);
    return Number(s.type) === Z.Text;
  }) : !1;
}, L = (n, e) => n == null ? "" : W(n) ? e(n) : typeof n == "string" ? n : "", de = (n) => {
  var G;
  const e = _.c(56), {
    task: l,
    deps: s,
    answer: T,
    solution: i,
    id: p,
    withBefore: N,
    withAfter: H,
    equationLayout: M
  } = n, h = N === void 0 ? !1 : N, c = H === void 0 ? !1 : H, A = M === void 0 ? !1 : M;
  let R;
  e[0] !== s.global ? (R = (B) => s.global.translateTasks(B), e[0] = s.global, e[1] = R) : R = e[1];
  const r = R, v = s.helpers.TaskHelper.multipleTaskAnswerSeparator;
  let x, d, j, f, u, m;
  if (e[2] !== T || e[3] !== i || e[4] !== l.answerInput || e[5] !== l.description || e[6] !== r || e[7] !== c || e[8] !== h) {
    const B = k(I(i, r)), o = l.answerInput, E = !!!((G = l.description) != null && G.isAnswerCellHidden) && !!B;
    let P;
    e[15] !== E || e[16] !== l.description ? (P = E && X(l.description), e[15] = E, e[16] = l.description, e[17] = P) : P = e[17], j = P;
    let O;
    e[18] !== (o == null ? void 0 : o.before) || e[19] !== r || e[20] !== h ? (O = h ? L(o == null ? void 0 : o.before, r) : "", e[18] = o == null ? void 0 : o.before, e[19] = r, e[20] = h, e[21] = O) : O = e[21];
    const Q = O;
    let z;
    e[22] !== (o == null ? void 0 : o.after) || e[23] !== r || e[24] !== c ? (z = c ? L(o == null ? void 0 : o.after, r) : "", e[22] = o == null ? void 0 : o.after, e[23] = r, e[24] = c, e[25] = z) : z = e[25];
    const q = z;
    d = E ? /* @__PURE__ */ t.jsxs(t.Fragment, { children: [
      Q ? /* @__PURE__ */ t.jsx(J, { "data-testid": "text-prefix", className: a.prefix, value: Q }) : null,
      /* @__PURE__ */ t.jsx(se, { className: a.answerFormula, children: B }),
      q ? /* @__PURE__ */ t.jsx(J, { "data-testid": "text-suffix", className: a.suffix, value: q }) : null
    ] }) : null, f = !!(d && (Q || q)), x = ae, u = T, m = ee([B]), e[2] = T, e[3] = i, e[4] = l.answerInput, e[5] = l.description, e[6] = r, e[7] = c, e[8] = h, e[9] = x, e[10] = d, e[11] = j, e[12] = f, e[13] = u, e[14] = m;
  } else
    x = e[9], d = e[10], j = e[11], f = e[12], u = e[13], m = e[14];
  const w = p === "complex.plain.center";
  let C;
  e[26] !== x || e[27] !== s || e[28] !== u || e[29] !== m || e[30] !== w ? (C = /* @__PURE__ */ t.jsx(x, { userAnswer: u, correctAnswer: m, deps: s, alignCenter: w }), e[26] = x, e[27] = s, e[28] = u, e[29] = m, e[30] = w, e[31] = C) : C = e[31];
  const b = C;
  let g;
  e[32] !== s || e[33] !== A || e[34] !== v || e[35] !== i || e[36] !== l.description || e[37] !== r ? (g = /* @__PURE__ */ t.jsx(te, { description: l.description, deps: s, solution: i, separator: v, translate: r, equationLayout: A }), e[32] = s, e[33] = A, e[34] = v, e[35] = i, e[36] = l.description, e[37] = r, e[38] = g) : g = e[38];
  const $ = g;
  let S;
  e[39] !== s || e[40] !== l.title ? (S = /* @__PURE__ */ t.jsx(V, { title: l.title, deps: s }), e[39] = s, e[40] = l.title, e[41] = S) : S = e[41];
  let y;
  e[42] !== d || e[43] !== b || e[44] !== $ || e[45] !== j || e[46] !== f ? (y = j ? /* @__PURE__ */ t.jsxs(t.Fragment, { children: [
    b,
    /* @__PURE__ */ t.jsxs("div", { className: `${a.expressionRow} ${a.solutionRow}`, "data-layout": "inline", "data-testid": "complex-expression-row", children: [
      $,
      d
    ] })
  ] }) : /* @__PURE__ */ t.jsxs(t.Fragment, { children: [
    $,
    b,
    f ? /* @__PURE__ */ t.jsx("div", { className: `${a.inputRow} ${a.solutionRow}`, children: d }) : null
  ] }), e[42] = d, e[43] = b, e[44] = $, e[45] = j, e[46] = f, e[47] = y) : y = e[47];
  let F;
  e[48] !== s || e[49] !== i ? (F = /* @__PURE__ */ t.jsx(ce, { solution: i, deps: s }), e[48] = s, e[49] = i, e[50] = F) : F = e[50];
  let D;
  return e[51] !== p || e[52] !== S || e[53] !== y || e[54] !== F ? (D = /* @__PURE__ */ t.jsxs("div", { className: a.container, "data-template-id": p, children: [
    S,
    y,
    F
  ] }), e[51] = p, e[52] = S, e[53] = y, e[54] = F, e[55] = D) : D = e[55], D;
}, U = (n, e) => n == null ? "" : W(n) ? e(n) : typeof n == "string" ? n : "", ue = ({
  id: n,
  withBefore: e = !1,
  withAfter: l = !1,
  equationLayout: s = !1
}) => {
  const T = ({
    task: i,
    deps: p,
    answer: N,
    onChange: H,
    mathInput: M
  }) => {
    var C, b;
    if (ne(i.solution))
      return /* @__PURE__ */ t.jsx(de, { task: i, deps: p, answer: N, solution: i.solution, id: n, withBefore: e, withAfter: l, equationLayout: s });
    const h = (g) => p.global.translateTasks(g), c = i.answerInput, A = !!((C = i.description) != null && C.isAnswerCellHidden), R = le((b = i.description) == null ? void 0 : b.parts), r = A && R, v = !A && X(i.description), x = p.helpers.TaskHelper.multipleTaskAnswerSeparator, d = r ? ie({
      onChange: H,
      separator: x,
      mathInput: M
    }) : null;
    let j = 0;
    const f = d ? {
      answer: N,
      separator: x,
      bindRef: d.bindRef,
      handleChange: d.handleChange,
      nextInputIndex: () => j++
    } : null, u = e ? U(c == null ? void 0 : c.before, h) : "", m = l ? U(c == null ? void 0 : c.after, h) : "", w = A ? null : /* @__PURE__ */ t.jsxs(t.Fragment, { children: [
      u ? /* @__PURE__ */ t.jsx(J, { "data-testid": "text-prefix", className: a.prefix, value: u }) : null,
      /* @__PURE__ */ t.jsx(oe, { ref: (g) => re(g, M), formula: N, onMathFieldChanged: H, className: a.input }),
      m ? /* @__PURE__ */ t.jsx(J, { "data-testid": "text-suffix", className: a.suffix, value: m }) : null
    ] });
    return /* @__PURE__ */ t.jsxs("div", { className: a.container, "data-template-id": n, children: [
      /* @__PURE__ */ t.jsx(V, { title: i.title, deps: p }),
      v ? /* @__PURE__ */ t.jsxs("div", { className: a.expressionRow, "data-layout": "inline", "data-testid": "complex-expression-row", children: [
        /* @__PURE__ */ t.jsx(K, { description: i.description, deps: p, tableAnswerBindings: f, equationLayout: s }),
        w
      ] }) : /* @__PURE__ */ t.jsxs(t.Fragment, { children: [
        /* @__PURE__ */ t.jsx(K, { description: i.description, deps: p, tableAnswerBindings: f, equationLayout: s }),
        w ? /* @__PURE__ */ t.jsx("div", { className: a.inputRow, children: w }) : null
      ] })
    ] });
  };
  return T.displayName = n, T;
};
export {
  ue as c
};
