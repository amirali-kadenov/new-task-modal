import { c as k, e as g, j as r, m as R, a as E, U as M, V as S, W as v } from "./index-DNoheI6P.js";
import { A as H } from "./answer-cell-solution-CrROu6jX.js";
const D = ({
  id: x,
  layout: A,
  inputCount: T,
  withBefore: C = !1,
  withAfter: j = !1,
  cellInputClassName: I
}) => {
  const y = (h) => {
    const e = k.c(26), {
      task: t,
      deps: s,
      answer: l,
      onChange: c,
      mathInput: d
    } = h;
    if (g(t.solution)) {
      let u;
      return e[0] !== l || e[1] !== s || e[2] !== t ? (u = /* @__PURE__ */ r.jsx(H, { task: t, deps: s, answer: l, solution: t.solution, withBefore: C, withAfter: j, multi: !0 }), e[0] = l, e[1] = s, e[2] = t, e[3] = u) : u = e[3], u;
    }
    const m = s.helpers.TaskHelper.multipleTaskAnswerSeparator;
    let o;
    e[4] !== d || e[5] !== c || e[6] !== m ? (o = R({
      onChange: c,
      separator: m,
      mathInput: d,
      inputCount: T
    }), e[4] = d, e[5] = c, e[6] = m, e[7] = o) : o = e[7];
    const {
      bindRef: f,
      handleChange: w
    } = o;
    let n;
    e[8] !== s || e[9] !== t.title ? (n = /* @__PURE__ */ r.jsx(E, { title: t.title, deps: s }), e[8] = s, e[9] = t.title, e[10] = n) : n = e[10];
    let i;
    e[11] !== s || e[12] !== t.description ? (i = /* @__PURE__ */ r.jsx(M, { description: t.description, deps: s }), e[11] = s, e[12] = t.description, e[13] = i) : i = e[13];
    let a;
    e[14] !== l || e[15] !== f || e[16] !== s || e[17] !== w || e[18] !== t.answerInput || e[19] !== t.description || e[20] !== t.type ? (a = /* @__PURE__ */ r.jsx(S, { description: t.description, answerInput: t.answerInput, deps: s, answer: l, mode: "input", withBefore: C, withAfter: j, multi: !0, bindRef: f, onChange: w, taskType: t.type, cellInputClassName: I }), e[14] = l, e[15] = f, e[16] = s, e[17] = w, e[18] = t.answerInput, e[19] = t.description, e[20] = t.type, e[21] = a) : a = e[21];
    let p;
    return e[22] !== n || e[23] !== i || e[24] !== a ? (p = /* @__PURE__ */ r.jsxs("div", { className: v.container, "data-template-id": x, "data-layout": A, children: [
      n,
      i,
      a
    ] }), e[22] = n, e[23] = i, e[24] = a, e[25] = p) : p = e[25], p;
  };
  return y.displayName = x, y;
};
export {
  D as c
};
