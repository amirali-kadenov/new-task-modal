import { c as A, j as l, i as M, r as w, o as L, h as H, M as $, s as k, g as D, a as b, e as O, f as z } from "./index-DNoheI6P.js";
import { S as K, a as P } from "./solution-answer-panel-C_30mrDJ.js";
const N = {
  text_before: "textBefore",
  text_after: "textAfter",
  image_before: "imageBefore",
  table_before: "tableBefore",
  with_audio: "withAudio"
}, U = (s) => N[s] ? N[s] : s.includes("_") ? s.replace(/_([a-z])/g, (e, o) => o.toUpperCase()) : s, I = (s) => {
  const e = {};
  for (const [o, t] of Object.entries(s))
    e[U(o)] = t;
  return e;
}, q = "_root_137tf_4", G = "_textBefore_137tf_10", J = "_textAfter_137tf_11", Q = "_imageBefore_137tf_16", V = "_images_137tf_17", W = "_container_137tf_29", X = "_side_137tf_39", Y = "_svgSide_137tf_54", Z = "_input_137tf_59", ee = "_answerFormula_137tf_83", _ = {
  root: q,
  textBefore: G,
  textAfter: J,
  imageBefore: Q,
  images: V,
  container: W,
  side: X,
  svgSide: Y,
  input: Z,
  answerFormula: ee
}, y = (s, e) => s == null || s === "" ? "" : M(s) ? e(s) : typeof s == "string" ? s : "", F = (s) => {
  const e = A.c(15), {
    description: o,
    deps: t
  } = s;
  let i, n, c, g;
  if (e[0] !== t || e[1] !== o) {
    const r = I(o);
    let m;
    e[6] !== t ? (m = (h) => t.global.translateTasks(h), e[6] = t, e[7] = m) : m = e[7];
    const d = m, p = y(r.textBefore, d);
    g = y(r.textAfter, d);
    const u = typeof r.imageBefore == "string" && r.imageBefore.trim() ? r.imageBefore : "", x = Array.isArray(r.images) ? r.images.filter(te) : [];
    i = p ? /* @__PURE__ */ l.jsx(w, { className: _.textBefore, children: p }) : null, n = u ? /* @__PURE__ */ l.jsx("div", { className: _.imageBefore, dangerouslySetInnerHTML: {
      __html: u
    } }) : null, c = x.length > 0 ? /* @__PURE__ */ l.jsx("div", { className: _.images, children: x.map(se) }) : null, e[0] = t, e[1] = o, e[2] = i, e[3] = n, e[4] = c, e[5] = g;
  } else
    i = e[2], n = e[3], c = e[4], g = e[5];
  let f;
  e[8] !== g ? (f = g ? /* @__PURE__ */ l.jsx(w, { className: _.textAfter, children: g }) : null, e[8] = g, e[9] = f) : f = e[9];
  let a;
  return e[10] !== i || e[11] !== n || e[12] !== c || e[13] !== f ? (a = /* @__PURE__ */ l.jsxs(l.Fragment, { children: [
    i,
    n,
    c,
    f
  ] }), e[10] = i, e[11] = n, e[12] = c, e[13] = f, e[14] = a) : a = e[14], a;
};
function te(s) {
  return typeof s == "string" && s.trim();
}
function se(s, e) {
  return /* @__PURE__ */ l.jsx("div", { dangerouslySetInnerHTML: {
    __html: s
  } }, e);
}
const T = (s, e) => {
  if (s == null) return "";
  let o = "";
  return typeof s == "number" ? o = String(s) : typeof s == "string" ? o = s : M(s) && (o = e(s)), L(o);
}, R = (s) => {
  const e = A.c(27), {
    description: o,
    deps: t,
    answer: i,
    mode: n,
    onChange: c,
    mathInputRef: g
  } = s;
  let f, a, r, m;
  if (e[0] !== t || e[1] !== o) {
    const j = I(o);
    let B;
    e[6] !== t ? (B = (E) => t.global.translateTasks(E), e[6] = t, e[7] = B) : B = e[7];
    const C = B;
    f = T(j.first, C), a = T(j.second, C), r = typeof j.svg1 == "string" && j.svg1.trim() ? j.svg1 : "", m = typeof j.svg2 == "string" && j.svg2.trim() ? j.svg2 : "", e[0] = t, e[1] = o, e[2] = f, e[3] = a, e[4] = r, e[5] = m;
  } else
    f = e[2], a = e[3], r = e[4], m = e[5];
  const d = m;
  let p;
  e[8] !== r ? (p = r ? /* @__PURE__ */ l.jsx("div", { className: _.svgSide, dangerouslySetInnerHTML: {
    __html: r
  } }) : null, e[8] = r, e[9] = p) : p = e[9];
  let u;
  e[10] !== f ? (u = /* @__PURE__ */ l.jsx("div", { className: _.side, "data-testid": "comparison-first", children: /* @__PURE__ */ l.jsx(w, { children: f }) }), e[10] = f, e[11] = u) : u = e[11];
  let x;
  e[12] !== i || e[13] !== g || e[14] !== n || e[15] !== c ? (x = n === "input" ? /* @__PURE__ */ l.jsx(H, { ref: g, formula: i, onMathFieldChanged: c, className: _.input }) : /* @__PURE__ */ l.jsx($, { className: _.answerFormula, children: k(i) }), e[12] = i, e[13] = g, e[14] = n, e[15] = c, e[16] = x) : x = e[16];
  let h;
  e[17] !== a ? (h = /* @__PURE__ */ l.jsx("div", { className: _.side, "data-testid": "comparison-second", children: /* @__PURE__ */ l.jsx(w, { children: a }) }), e[17] = a, e[18] = h) : h = e[18];
  let v;
  e[19] !== d ? (v = d ? /* @__PURE__ */ l.jsx("div", { className: _.svgSide, dangerouslySetInnerHTML: {
    __html: d
  } }) : null, e[19] = d, e[20] = v) : v = e[20];
  let S;
  return e[21] !== p || e[22] !== u || e[23] !== x || e[24] !== h || e[25] !== v ? (S = /* @__PURE__ */ l.jsxs("div", { className: _.container, "data-testid": "comparison-row", children: [
    p,
    u,
    x,
    h,
    v
  ] }), e[21] = p, e[22] = u, e[23] = x, e[24] = h, e[25] = v, e[26] = S) : S = e[26], S;
}, ie = (s) => {
  const e = A.c(28), {
    task: o,
    deps: t,
    answer: i,
    solution: n
  } = s;
  let c;
  e[0] !== t ? (c = (x) => t.global.translateTasks(x), e[0] = t, e[1] = c) : c = e[1];
  let g;
  e[2] !== n || e[3] !== c ? (g = D(n, c), e[2] = n, e[3] = c, e[4] = g) : g = e[4];
  const f = g;
  let a;
  e[5] !== t || e[6] !== o.title ? (a = /* @__PURE__ */ l.jsx(b, { title: o.title, deps: t }), e[5] = t, e[6] = o.title, e[7] = a) : a = e[7];
  let r;
  e[8] !== t || e[9] !== o.description ? (r = /* @__PURE__ */ l.jsx(F, { description: o.description, deps: t }), e[8] = t, e[9] = o.description, e[10] = r) : r = e[10];
  let m;
  e[11] !== i || e[12] !== f || e[13] !== t ? (m = /* @__PURE__ */ l.jsx(K, { userAnswer: i, correctAnswer: f, deps: t }), e[11] = i, e[12] = f, e[13] = t, e[14] = m) : m = e[14];
  let d;
  e[15] !== f || e[16] !== t || e[17] !== o.description ? (d = /* @__PURE__ */ l.jsx(R, { description: o.description, deps: t, answer: f, mode: "solution" }), e[15] = f, e[16] = t, e[17] = o.description, e[18] = d) : d = e[18];
  let p;
  e[19] !== t || e[20] !== n ? (p = /* @__PURE__ */ l.jsx(P, { solution: n, deps: t }), e[19] = t, e[20] = n, e[21] = p) : p = e[21];
  let u;
  return e[22] !== a || e[23] !== r || e[24] !== m || e[25] !== d || e[26] !== p ? (u = /* @__PURE__ */ l.jsxs("div", { className: _.root, children: [
    a,
    r,
    m,
    d,
    p
  ] }), e[22] = a, e[23] = r, e[24] = m, e[25] = d, e[26] = p, e[27] = u) : u = e[27], u;
}, ne = ({
  id: s
}) => {
  const e = (o) => {
    const t = A.c(22), {
      task: i,
      deps: n,
      answer: c,
      onChange: g,
      mathInput: f
    } = o;
    if (O(i.solution)) {
      let u;
      return t[0] !== c || t[1] !== n || t[2] !== i ? (u = /* @__PURE__ */ l.jsx(ie, { task: i, deps: n, answer: c, solution: i.solution }), t[0] = c, t[1] = n, t[2] = i, t[3] = u) : u = t[3], u;
    }
    let a;
    t[4] !== n || t[5] !== i.title ? (a = /* @__PURE__ */ l.jsx(b, { title: i.title, deps: n }), t[4] = n, t[5] = i.title, t[6] = a) : a = t[6];
    let r;
    t[7] !== n || t[8] !== i.description ? (r = /* @__PURE__ */ l.jsx(F, { description: i.description, deps: n }), t[7] = n, t[8] = i.description, t[9] = r) : r = t[9];
    let m;
    t[10] !== f ? (m = (u) => z(u, f), t[10] = f, t[11] = m) : m = t[11];
    let d;
    t[12] !== c || t[13] !== n || t[14] !== g || t[15] !== m || t[16] !== i.description ? (d = /* @__PURE__ */ l.jsx(R, { description: i.description, deps: n, answer: c, mode: "input", onChange: g, mathInputRef: m }), t[12] = c, t[13] = n, t[14] = g, t[15] = m, t[16] = i.description, t[17] = d) : d = t[17];
    let p;
    return t[18] !== a || t[19] !== r || t[20] !== d ? (p = /* @__PURE__ */ l.jsxs("div", { className: _.root, "data-template-id": s, children: [
      a,
      r,
      d
    ] }), t[18] = a, t[19] = r, t[20] = d, t[21] = p) : p = t[21], p;
  };
  return e.displayName = s, e;
}, le = ne({
  id: "comparison.plain"
});
export {
  le as ComparisonPlain,
  le as default
};
