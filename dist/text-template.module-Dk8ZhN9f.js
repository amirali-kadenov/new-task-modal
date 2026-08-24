import { u as x, c as h, n as g, o as j, p as d, q as w, j as _, r as R } from "./index-DNoheI6P.js";
import { u as $, s as m } from "./task-description.module-Bo2R1GNx.js";
const T = (n) => n.includes("^") ? n.split(/(\\\([\s\S]*?\\\)|\$[^$]*\$)/).map((e) => e.startsWith("\\(") || e.startsWith("$") ? e : e.replace(/([^\s\\]*\^[0-9]+)/g, (c) => `\\(${x(c)}\\)`)).join("") : n, M = (n, s) => s ? T(n) : n, v = (n) => {
  const s = h.c(12), {
    task: e,
    deps: c,
    className: r,
    normalizeBareMath: p
  } = n, u = p === void 0 ? !1 : p, a = $(k);
  let l;
  s[0] !== c || s[1] !== u || s[2] !== e ? (l = g(j(M(d(e, c), u))), s[0] = c, s[1] = u, s[2] = e, s[3] = l) : l = s[3];
  const i = l;
  let t;
  s[4] !== r ? (t = w(m.container, r), s[4] = r, s[5] = t) : t = s[5];
  let o;
  s[6] !== a || s[7] !== i ? (o = a ? /* @__PURE__ */ _.jsx(N, { text: i, progress: a }) : i, s[6] = a, s[7] = i, s[8] = o) : o = s[8];
  let f;
  return s[9] !== t || s[10] !== o ? (f = /* @__PURE__ */ _.jsx(R, { className: t, children: o }), s[9] = t, s[10] = o, s[11] = f) : f = s[11], f;
}, N = (n) => {
  const s = h.c(13), {
    text: e,
    progress: c
  } = n, r = Math.floor(e.length * c);
  let p;
  s[0] !== r || s[1] !== e ? (p = e.slice(0, r), s[0] = r, s[1] = e, s[2] = p) : p = s[2];
  const u = p;
  let a;
  s[3] !== r || s[4] !== e ? (a = e.slice(r), s[3] = r, s[4] = e, s[5] = a) : a = s[5];
  const l = a;
  let i;
  s[6] !== u ? (i = /* @__PURE__ */ _.jsx("span", { className: m.highlighted, children: u }), s[6] = u, s[7] = i) : i = s[7];
  let t;
  s[8] !== l ? (t = /* @__PURE__ */ _.jsx("span", { className: m.remaining, children: l }), s[8] = l, s[9] = t) : t = s[9];
  let o;
  return s[10] !== i || s[11] !== t ? (o = /* @__PURE__ */ _.jsxs(_.Fragment, { children: [
    i,
    t
  ] }), s[10] = i, s[11] = t, s[12] = o) : o = s[12], o;
};
function k(n) {
  return n.progress;
}
const z = "_container_1pje6_4", F = "_inputRow_1pje6_10", b = "_solutionRow_1pje6_17", y = "_input_1pje6_10", L = "_answerFormula_1pje6_27", B = "_prefix_1pje6_31", S = "_suffix_1pje6_32", D = "_stack_1pje6_56", E = "_inline_1pje6_62", U = "_fieldLabel_1pje6_69", A = {
  container: z,
  inputRow: F,
  solutionRow: b,
  input: y,
  answerFormula: L,
  prefix: B,
  suffix: S,
  stack: D,
  inline: E,
  fieldLabel: U
};
export {
  v as T,
  M as m,
  A as s
};
