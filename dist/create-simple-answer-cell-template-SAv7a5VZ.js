import { c as y, e as A, j as p, a as C, U as R, V as T, f as S, W as h } from "./index-DNoheI6P.js";
import { A as k } from "./answer-cell-solution-CrROu6jX.js";
const N = ({
  id: f,
  withBefore: d = !1,
  withAfter: x = !1,
  solutionAlignCenter: j = !1
}) => {
  const w = (I) => {
    const e = y.c(24), {
      task: t,
      deps: s,
      answer: i,
      onChange: u,
      mathInput: m
    } = I;
    if (A(t.solution)) {
      let o;
      return e[0] !== i || e[1] !== s || e[2] !== t ? (o = /* @__PURE__ */ p.jsx(k, { task: t, deps: s, answer: i, solution: t.solution, withBefore: d, withAfter: x, multi: !1, solutionAlignCenter: j }), e[0] = i, e[1] = s, e[2] = t, e[3] = o) : o = e[3], o;
    }
    let l;
    e[4] !== s || e[5] !== t.title ? (l = /* @__PURE__ */ p.jsx(C, { title: t.title, deps: s }), e[4] = s, e[5] = t.title, e[6] = l) : l = e[6];
    let n;
    e[7] !== s || e[8] !== t.description ? (n = /* @__PURE__ */ p.jsx(R, { description: t.description, deps: s }), e[7] = s, e[8] = t.description, e[9] = n) : n = e[9];
    let a;
    e[10] !== m ? (a = (o) => S(o, m), e[10] = m, e[11] = a) : a = e[11];
    let r;
    e[12] !== i || e[13] !== s || e[14] !== u || e[15] !== a || e[16] !== t.answerInput || e[17] !== t.description || e[18] !== t.type ? (r = /* @__PURE__ */ p.jsx(T, { description: t.description, answerInput: t.answerInput, deps: s, answer: i, mode: "input", withBefore: d, withAfter: x, multi: !1, onChange: u, mathInputRef: a, taskType: t.type }), e[12] = i, e[13] = s, e[14] = u, e[15] = a, e[16] = t.answerInput, e[17] = t.description, e[18] = t.type, e[19] = r) : r = e[19];
    let c;
    return e[20] !== l || e[21] !== n || e[22] !== r ? (c = /* @__PURE__ */ p.jsxs("div", { className: h.container, "data-template-id": f, children: [
      l,
      n,
      r
    ] }), e[20] = l, e[21] = n, e[22] = r, e[23] = c) : c = e[23], c;
  };
  return w.displayName = f, w;
};
export {
  N as c
};
