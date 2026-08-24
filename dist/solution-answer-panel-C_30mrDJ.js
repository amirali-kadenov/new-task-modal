var $ = Object.defineProperty;
var y = Object.getOwnPropertySymbols;
var M = Object.prototype.hasOwnProperty, F = Object.prototype.propertyIsEnumerable;
var N = (r, e, t) => e in r ? $(r, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : r[e] = t, S = (r, e) => {
  for (var t in e || (e = {}))
    M.call(e, t) && N(r, t, e[t]);
  if (y)
    for (var t of y(e))
      F.call(e, t) && N(r, t, e[t]);
  return r;
};
import { c as C, t as L, v, j as i, C as T, q as b, S as P, r as B, w as k, d as E, x as R, y as U, M as q } from "./index-DNoheI6P.js";
const D = "_title_mswcm_1", H = "_container_mswcm_5", W = "_formula_mswcm_17", Z = "_textBlock_mswcm_23", z = "_textAfterComplex_mswcm_27", j = {
  title: D,
  container: H,
  formula: W,
  textBlock: Z,
  textAfterComplex: z
}, A = (r) => /* @__PURE__ */ i.jsx(P, { content: r, formulaClassName: j.formula }), G = (r) => {
  const e = C.c(21), {
    solution: t,
    deps: s
  } = r;
  if (typeof t == "object" && t !== null && t.error) {
    let l;
    e[0] !== s || e[1] !== t.error ? (l = typeof t.error == "string" ? t.error : s.global.translateTasks(t.error), e[0] = s, e[1] = t.error, e[2] = l) : l = e[2];
    const n = l;
    let a;
    return e[3] !== n ? (a = /* @__PURE__ */ i.jsx("div", { className: j.container, children: /* @__PURE__ */ i.jsx(B, { inline: !0, children: n }) }), e[3] = n, e[4] = a) : a = e[4], a;
  }
  if (L(t)) {
    let l;
    e[5] === /* @__PURE__ */ Symbol.for("react.memo_cache_sentinel") ? (l = /* @__PURE__ */ i.jsx("p", { className: j.title, children: "Объяснение" }), e[5] = l) : l = e[5];
    let n;
    e[6] !== t ? (n = A(t), e[6] = t, e[7] = n) : n = e[7];
    let a;
    return e[8] !== n ? (a = /* @__PURE__ */ i.jsxs("div", { className: j.container, children: [
      l,
      n
    ] }), e[8] = n, e[9] = a) : a = e[9], a;
  }
  if (typeof t != "object" || t === null)
    return null;
  let u;
  e[10] !== s || e[11] !== t ? (u = !v(t) && t.content && (typeof t.content == "string" ? t.content : s.global.translateTasks(t.content)), e[10] = s, e[11] = t, e[12] = u) : u = e[12];
  const o = u;
  let m, c;
  if (e[13] !== s || e[14] !== o || e[15] !== t) {
    c = /* @__PURE__ */ Symbol.for("react.early_return_sentinel");
    e: {
      const l = v(t);
      let n;
      e[18] !== o ? (n = typeof o == "string" && o.trim(), e[18] = o, e[19] = n) : n = e[19];
      const a = !!n;
      if (!l && !a) {
        c = null;
        break e;
      }
      let h;
      e[20] === /* @__PURE__ */ Symbol.for("react.memo_cache_sentinel") ? (h = /* @__PURE__ */ i.jsx("p", { className: j.title, children: "Объяснение" }), e[20] = h) : h = e[20], m = /* @__PURE__ */ i.jsxs("div", { className: j.container, children: [
        h,
        l && /* @__PURE__ */ i.jsx(T, { parts: t.parts, deps: s }),
        a && /* @__PURE__ */ i.jsx("div", { className: b(j.textBlock, l && j.textAfterComplex), children: A(o) })
      ] });
    }
    e[13] = s, e[14] = o, e[15] = t, e[16] = m, e[17] = c;
  } else
    m = e[16], c = e[17];
  return c !== /* @__PURE__ */ Symbol.for("react.early_return_sentinel") ? c : m;
}, I = (r) => r && typeof r == "object" && "parts" in r && Array.isArray(r.parts) && r.parts.length > 0 ? r.parts : null, oe = (r) => {
  const e = C.c(8), {
    solution: t,
    deps: s,
    suppressFreeTextContent: u
  } = r;
  if (u)
    return null;
  let o;
  e[0] !== t ? (o = I(t), e[0] = t, e[1] = o) : o = e[1];
  const m = o;
  if (m) {
    let l;
    return e[2] !== s || e[3] !== m ? (l = /* @__PURE__ */ i.jsx(T, { parts: m, deps: s }), e[2] = s, e[3] = m, e[4] = l) : l = e[4], l;
  }
  let c;
  return e[5] !== s || e[6] !== t ? (c = /* @__PURE__ */ i.jsx(G, { solution: t, deps: s }), e[5] = s, e[6] = t, e[7] = c) : c = e[7], c;
}, J = (r) => /* @__PURE__ */ k.createElement("svg", S({ width: 24, height: 24, viewBox: "0 0 24 24", fill: "none", xmlns: "http://www.w3.org/2000/svg" }, r), /* @__PURE__ */ k.createElement("path", { d: "M7.5 12L10.5 15L16.5 9M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z", stroke: "#0066FE", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round" })), K = "_container_1scfb_2", O = "_highlight_1scfb_2", Q = "_highlightCenter_1scfb_25", V = "_label_1scfb_29", X = "_answer_1scfb_34", Y = "_userAnswer_1scfb_48", ee = "_ellipsis_1scfb_59", te = "_unit_1scfb_63", se = "_delimeter_1scfb_70", le = "_icon_1scfb_75", f = {
  container: K,
  highlight: O,
  highlightCenter: Q,
  label: V,
  answer: X,
  userAnswer: Y,
  ellipsis: ee,
  unit: te,
  delimeter: se,
  icon: le
}, ne = (r) => {
  const e = C.c(17), {
    text: t,
    unit: s,
    alignCenter: u
  } = r, {
    rowRef: o,
    displayText: m,
    truncated: c,
    onTypesetDone: l
  } = R(f.userAnswer, t), n = u && f.highlightCenter;
  let a;
  e[0] !== n ? (a = b(f.highlight, n), e[0] = n, e[1] = a) : a = e[1];
  let h, g;
  e[2] === /* @__PURE__ */ Symbol.for("react.memo_cache_sentinel") ? (h = /* @__PURE__ */ i.jsx(U, { className: f.icon }), g = /* @__PURE__ */ i.jsx("span", { className: f.label, children: "Ваш ответ:" }), e[2] = h, e[3] = g) : (h = e[2], g = e[3]);
  let p;
  e[4] !== m || e[5] !== l ? (p = /* @__PURE__ */ i.jsx(q, { className: f.userAnswer, onTypeset: l, children: m }), e[4] = m, e[5] = l, e[6] = p) : p = e[6];
  let x;
  e[7] !== c ? (x = c && /* @__PURE__ */ i.jsx("span", { className: f.ellipsis, "aria-hidden": "true", children: "…" }), e[7] = c, e[8] = x) : x = e[8];
  let _;
  e[9] !== s ? (_ = s ? /* @__PURE__ */ i.jsx(E, { "data-testid": "answer-unit", className: f.unit, value: s }) : null, e[9] = s, e[10] = _) : _ = e[10];
  let d;
  return e[11] !== o || e[12] !== a || e[13] !== p || e[14] !== x || e[15] !== _ ? (d = /* @__PURE__ */ i.jsxs("div", { ref: o, "data-testid": "user-answer-highlight", className: a, children: [
    h,
    g,
    p,
    x,
    _
  ] }), e[11] = o, e[12] = a, e[13] = p, e[14] = x, e[15] = _, e[16] = d) : d = e[16], d;
}, ae = (r) => {
  const e = C.c(25), {
    userAnswer: t,
    correctAnswer: s,
    correctLabel: u,
    unit: o,
    deps: m,
    alignCenter: c
  } = r;
  let l;
  e[0] !== t ? (l = t == null ? void 0 : t.trim(), e[0] = t, e[1] = l) : l = e[1];
  const n = !!l;
  let a;
  e[2] !== s ? (a = s == null ? void 0 : s.trim(), e[2] = s, e[3] = a) : a = e[3];
  const h = !!a;
  if (!n && !h)
    return null;
  let g;
  e[4] !== s || e[5] !== u || e[6] !== m ? (g = u != null ? u : m.global.translateTasks(s), e[4] = s, e[5] = u, e[6] = m, e[7] = g) : g = e[7];
  const p = g;
  let x;
  e[8] !== c || e[9] !== n || e[10] !== o || e[11] !== t ? (x = n && /* @__PURE__ */ i.jsx(ne, { text: t, unit: o, alignCenter: c }), e[8] = c, e[9] = n, e[10] = o, e[11] = t, e[12] = x) : x = e[12];
  let _;
  e[13] !== h || e[14] !== n ? (_ = n && h && /* @__PURE__ */ i.jsx("hr", { className: f.delimeter }), e[13] = h, e[14] = n, e[15] = _) : _ = e[15];
  let d;
  e[16] !== c || e[17] !== p || e[18] !== h || e[19] !== o ? (d = h && /* @__PURE__ */ i.jsxs("div", { className: b(f.highlight, c && f.highlightCenter), children: [
    /* @__PURE__ */ i.jsx(J, { className: f.icon }),
    /* @__PURE__ */ i.jsx("span", { className: f.label, children: "Правильный ответ:" }),
    /* @__PURE__ */ i.jsx(B, { inline: !0, className: f.answer, children: p }),
    o ? /* @__PURE__ */ i.jsx(E, { "data-testid": "answer-unit", className: f.unit, value: o }) : null
  ] }), e[16] = c, e[17] = p, e[18] = h, e[19] = o, e[20] = d) : d = e[20];
  let w;
  return e[21] !== x || e[22] !== _ || e[23] !== d ? (w = /* @__PURE__ */ i.jsxs("div", { className: f.container, children: [
    x,
    _,
    d
  ] }), e[21] = x, e[22] = _, e[23] = d, e[24] = w) : w = e[24], w;
};
export {
  ae as S,
  oe as a
};
