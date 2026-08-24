import { c as u, p as h, q as g, j as m, r as d, I as j, J as T } from "./index-DNoheI6P.js";
import { u as D, s as f } from "./task-description.module-Bo2R1GNx.js";
const k = (x) => {
  const s = u.c(11), {
    task: t,
    deps: i,
    className: n
  } = x, l = D(N);
  let p;
  s[0] !== i || s[1] !== t ? (p = h(t, i), s[0] = i, s[1] = t, s[2] = p) : p = s[2];
  const a = p;
  let r;
  s[3] !== n ? (r = g(f.container, n), s[3] = n, s[4] = r) : r = s[4];
  let o;
  s[5] !== l || s[6] !== a ? (o = l ? /* @__PURE__ */ m.jsx(y, { text: a, progress: l }) : a, s[5] = l, s[6] = a, s[7] = o) : o = s[7];
  let e;
  return s[8] !== r || s[9] !== o ? (e = /* @__PURE__ */ m.jsx(d, { className: r, children: o }), s[8] = r, s[9] = o, s[10] = e) : e = s[10], e;
}, y = (x) => {
  const s = u.c(13), {
    text: t,
    progress: i
  } = x, n = Math.floor(t.length * i);
  let l;
  s[0] !== n || s[1] !== t ? (l = t.slice(0, n), s[0] = n, s[1] = t, s[2] = l) : l = s[2];
  const p = l;
  let a;
  s[3] !== n || s[4] !== t ? (a = t.slice(n), s[3] = n, s[4] = t, s[5] = a) : a = s[5];
  const r = a;
  let o;
  s[6] !== p ? (o = /* @__PURE__ */ m.jsx("span", { className: f.highlighted, children: p }), s[6] = p, s[7] = o) : o = s[7];
  let e;
  s[8] !== r ? (e = /* @__PURE__ */ m.jsx("span", { className: f.remaining, children: r }), s[8] = r, s[9] = e) : e = s[9];
  let c;
  return s[10] !== o || s[11] !== e ? (c = /* @__PURE__ */ m.jsxs(m.Fragment, { children: [
    o,
    e
  ] }), s[10] = o, s[11] = e, s[12] = c) : c = s[12], c;
};
function N(x) {
  return x.progress;
}
const C = (x) => {
  var o;
  const s = u.c(11), {
    task: t,
    deps: i,
    className: n
  } = x, l = (o = t.description) == null ? void 0 : o.type, p = l === i.enums.TaskDescriptionType.Formula || l === "formula", a = l === i.enums.TaskDescriptionType.Complex || l === "complex";
  if (p) {
    const e = t;
    let c;
    return s[0] !== n || s[1] !== i || s[2] !== e ? (c = /* @__PURE__ */ m.jsx(j, { task: e, deps: i, className: n }), s[0] = n, s[1] = i, s[2] = e, s[3] = c) : c = s[3], c;
  }
  if (a) {
    const e = t.description;
    let c;
    return s[4] !== i || s[5] !== e ? (c = /* @__PURE__ */ m.jsx(T, { description: e, deps: i }), s[4] = i, s[5] = e, s[6] = c) : c = s[6], c;
  }
  let r;
  return s[7] !== n || s[8] !== i || s[9] !== t ? (r = /* @__PURE__ */ m.jsx(k, { task: t, deps: i, className: n }), s[7] = n, s[8] = i, s[9] = t, s[10] = r) : r = s[10], r;
};
export {
  C as S,
  k as T
};
