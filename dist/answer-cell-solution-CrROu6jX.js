import { c as D, k as E, l as R, s as M, X as U, j as A, a as H, U as N, b as V, V as W, Y as X, Z as Y, W as Z } from "./index-DNoheI6P.js";
import { S as _, a as $ } from "./solution-answer-panel-C_30mrDJ.js";
const G = (k) => {
  const t = D.c(45), {
    task: e,
    deps: s,
    answer: o,
    solution: a,
    withBefore: I,
    withAfter: S,
    multi: T,
    solutionAlignCenter: v
  } = k, y = I === void 0 ? !1 : I, c = S === void 0 ? !1 : S, n = T === void 0 ? !1 : T, h = v === void 0 ? !1 : v;
  let j;
  t[0] !== s.global ? (j = (m) => s.global.translateTasks(m), t[0] = s.global, t[1] = j) : j = t[1];
  const p = j, l = s.helpers.TaskHelper.multipleTaskAnswerSeparator;
  let u, w, r, i, d;
  if (t[2] !== o || t[3] !== s || t[4] !== n || t[5] !== l || t[6] !== a || t[7] !== h || t[8] !== e.answerInput || t[9] !== e.description || t[10] !== e.title || t[11] !== e.type || t[12] !== p || t[13] !== c || t[14] !== y) {
    const m = E(a, l, p);
    let C;
    t[20] !== o || t[21] !== n || t[22] !== l ? (C = n ? R(M(o), l).join(" ; ") : M(o), t[20] = o, t[21] = n, t[22] = l, t[23] = C) : C = t[23];
    const b = C, P = m.some(q);
    let g;
    t[24] !== n || t[25] !== e.answerInput || t[26] !== p || t[27] !== c ? (g = c && !n ? U(e.answerInput, p) : "", t[24] = n, t[25] = e.answerInput, t[26] = p, t[27] = c, t[28] = g) : g = t[28];
    const B = g;
    w = Z.container, t[29] !== s || t[30] !== e.title ? (r = /* @__PURE__ */ A.jsx(H, { title: e.title, deps: s }), t[29] = s, t[30] = e.title, t[31] = r) : r = t[31], t[32] !== s || t[33] !== e.description ? (i = /* @__PURE__ */ A.jsx(N, { description: e.description, deps: s }), t[32] = s, t[33] = e.description, t[34] = i) : i = t[34], d = /* @__PURE__ */ A.jsx(_, { userAnswer: b, correctAnswer: V(m), unit: B, deps: s, alignCenter: h }), u = P ? /* @__PURE__ */ A.jsx(W, { description: e.description, answerInput: e.answerInput, deps: s, answer: X(m, l), mode: "solution", withBefore: y, withAfter: c, multi: n, taskType: e.type, solutionAlignCenter: h }) : null, t[2] = o, t[3] = s, t[4] = n, t[5] = l, t[6] = a, t[7] = h, t[8] = e.answerInput, t[9] = e.description, t[10] = e.title, t[11] = e.type, t[12] = p, t[13] = c, t[14] = y, t[15] = u, t[16] = w, t[17] = r, t[18] = i, t[19] = d;
  } else
    u = t[15], w = t[16], r = t[17], i = t[18], d = t[19];
  let f;
  t[35] !== s || t[36] !== a ? (f = /* @__PURE__ */ A.jsx($, { solution: a, deps: s }), t[35] = s, t[36] = a, t[37] = f) : f = t[37];
  let x;
  return t[38] !== u || t[39] !== f || t[40] !== w || t[41] !== r || t[42] !== i || t[43] !== d ? (x = /* @__PURE__ */ A.jsxs("div", { className: w, children: [
    r,
    i,
    d,
    u,
    f
  ] }), t[38] = u, t[39] = f, t[40] = w, t[41] = r, t[42] = i, t[43] = d, t[44] = x) : x = t[44], x;
};
function q(k) {
  return !Y(k);
}
export {
  G as A
};
