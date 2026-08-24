import { c as q, j as u, N as C, O as T, _ as w, $ as B, a0 as I, w as H, q as z, r as k, i as P, a1 as N, a2 as R, a3 as S, a as O, e as W } from "./index-DNoheI6P.js";
import { S as M, a as E } from "./solution-answer-panel-C_30mrDJ.js";
const D = "_container_197pz_2", Q = "_question_197pz_8", U = "_questionAfter_197pz_14", J = "_figures_197pz_18", K = "_figuresVertical_197pz_24", X = "_images_197pz_29", Y = "_unsupported_197pz_40", Z = "_radioGroup_197pz_46", ee = "_radioGroupHorizontal_197pz_50", te = "_radioGroupWrap_197pz_56", j = {
  container: D,
  question: Q,
  questionAfter: U,
  figures: J,
  figuresVertical: K,
  images: X,
  unsupported: Y,
  radioGroup: Z,
  radioGroupHorizontal: ee,
  radioGroupWrap: te
}, $ = (m) => {
  const e = q.c(25), {
    description: s,
    deps: t
  } = m;
  let i, n, g, _, f, c;
  if (e[0] !== s.background || e[1] !== s.figures || e[2] !== s.images || e[3] !== s.isFiguresVertical) {
    c = /* @__PURE__ */ Symbol.for("react.early_return_sentinel");
    e: {
      const a = Array.isArray(s.images) ? s.images.filter(se) : [];
      let o;
      e[10] !== s.figures ? (o = Array.isArray(s.figures) ? s.figures : [], e[10] = s.figures, e[11] = o) : o = e[11], i = o;
      const p = !!s.isFiguresVertical;
      if (!a.length && !i.length && !s.background) {
        c = null;
        break e;
      }
      n = `${j.figures} ${p ? j.figuresVertical : ""}`, g = "test-figures", e[12] !== s.background ? (_ = s.background ? /* @__PURE__ */ u.jsx("div", { dangerouslySetInnerHTML: {
        __html: s.background
      } }) : null, e[12] = s.background, e[13] = _) : _ = e[13], f = a.length > 0 ? /* @__PURE__ */ u.jsx("div", { className: j.images, children: a.map(ie) }) : null;
    }
    e[0] = s.background, e[1] = s.figures, e[2] = s.images, e[3] = s.isFiguresVertical, e[4] = i, e[5] = n, e[6] = g, e[7] = _, e[8] = f, e[9] = c;
  } else
    i = e[4], n = e[5], g = e[6], _ = e[7], f = e[8], c = e[9];
  if (c !== /* @__PURE__ */ Symbol.for("react.early_return_sentinel"))
    return c;
  let r;
  if (e[14] !== t || e[15] !== i) {
    let a;
    e[17] !== t ? (a = (o, p) => {
      const h = C(o), d = Number(h.type);
      switch (d) {
        case T.Text:
          return /* @__PURE__ */ u.jsx(I, { part: h, deps: t }, p);
        case T.Image:
          return /* @__PURE__ */ u.jsx(B, { part: h, deps: t }, p);
        case T.AngleList:
          return /* @__PURE__ */ u.jsx(w, { part: h }, p);
        default:
          return /* @__PURE__ */ u.jsxs("p", { className: j.unsupported, children: [
            "Unsupported figure type ",
            d
          ] }, p);
      }
    }, e[17] = t, e[18] = a) : a = e[18], r = i.map(a), e[14] = t, e[15] = i, e[16] = r;
  } else
    r = e[16];
  let l;
  return e[19] !== n || e[20] !== g || e[21] !== _ || e[22] !== f || e[23] !== r ? (l = /* @__PURE__ */ u.jsxs("div", { className: n, "data-testid": g, children: [
    _,
    f,
    r
  ] }), e[19] = n, e[20] = g, e[21] = _, e[22] = f, e[23] = r, e[24] = l) : l = e[24], l;
};
function se(m) {
  return typeof m == "string" && m.trim();
}
function ie(m, e) {
  return /* @__PURE__ */ u.jsx("div", { dangerouslySetInnerHTML: {
    __html: m
  } }, e);
}
const ne = "_radioLabel_14h0g_1", ae = "_radioButton_14h0g_5", oe = "_disabled_14h0g_19", re = "_readOnly_14h0g_19", le = "_checked_14h0g_23", ce = "_radioInput_14h0g_38", de = "_radioControl_14h0g_51", ue = "_htmlLabel_14h0g_107", v = {
  radioLabel: ne,
  radioButton: ae,
  disabled: oe,
  readOnly: re,
  checked: le,
  radioInput: ce,
  radioControl: de,
  htmlLabel: ue
}, pe = (m) => m.includes("svg") || m.includes("<div"), fe = (m) => {
  const e = q.c(23), {
    name: s,
    value: t,
    label: i,
    checked: n,
    onChange: g,
    disabled: _,
    readOnly: f
  } = m, c = _ === void 0 ? !1 : _, r = f === void 0 ? !1 : f, l = H.useId();
  let a, o;
  e[0] !== n || e[1] !== c || e[2] !== i || e[3] !== r ? (a = pe(i), o = z(v.radioButton, n && v.checked, c && !r && v.disabled, r && v.readOnly, a && v.htmlLabel), e[0] = n, e[1] = c, e[2] = i, e[3] = r, e[4] = a, e[5] = o) : (a = e[4], o = e[5]);
  const p = c || r, h = a ? t : void 0;
  let d;
  e[6] !== n || e[7] !== l || e[8] !== s || e[9] !== g || e[10] !== p || e[11] !== h || e[12] !== t ? (d = /* @__PURE__ */ u.jsx("input", { id: l, type: "radio", name: s, value: t, checked: n, onChange: g, disabled: p, className: v.radioInput, "aria-label": h }), e[6] = n, e[7] = l, e[8] = s, e[9] = g, e[10] = p, e[11] = h, e[12] = t, e[13] = d) : d = e[13];
  let x;
  e[14] === /* @__PURE__ */ Symbol.for("react.memo_cache_sentinel") ? (x = /* @__PURE__ */ u.jsx("span", { className: v.radioControl, "aria-hidden": !0 }), e[14] = x) : x = e[14];
  let b;
  e[15] !== a || e[16] !== i ? (b = a ? /* @__PURE__ */ u.jsx("span", { className: v.radioLabel, dangerouslySetInnerHTML: {
    __html: i
  } }) : /* @__PURE__ */ u.jsx("span", { className: v.radioLabel, children: i }), e[15] = a, e[16] = i, e[17] = b) : b = e[17];
  let y;
  return e[18] !== l || e[19] !== o || e[20] !== d || e[21] !== b ? (y = /* @__PURE__ */ u.jsxs("label", { className: o, htmlFor: l, children: [
    d,
    x,
    b
  ] }), e[18] = l, e[19] = o, e[20] = d, e[21] = b, e[22] = y) : y = e[22], y;
}, ge = "_container_1dyth_1", _e = {
  container: ge
}, me = (m) => {
  const e = q.c(19), {
    name: s,
    options: t,
    value: i,
    onChange: n,
    disabled: g,
    readOnly: _,
    className: f,
    ariaLabel: c
  } = m, r = g === void 0 ? !1 : g, l = _ === void 0 ? !1 : _;
  let a;
  e[0] !== f ? (a = z(_e.container, f), e[0] = f, e[1] = a) : a = e[1];
  let o;
  if (e[2] !== r || e[3] !== s || e[4] !== n || e[5] !== t || e[6] !== l || e[7] !== i) {
    let h;
    e[9] !== r || e[10] !== s || e[11] !== n || e[12] !== l || e[13] !== i ? (h = (d) => /* @__PURE__ */ u.jsx(fe, { name: s, value: d.value, label: d.label, checked: i === d.value, onChange: () => n(d.value), disabled: r || d.disabled, readOnly: l }, d.value), e[9] = r, e[10] = s, e[11] = n, e[12] = l, e[13] = i, e[14] = h) : h = e[14], o = t.map(h), e[2] = r, e[3] = s, e[4] = n, e[5] = t, e[6] = l, e[7] = i, e[8] = o;
  } else
    o = e[8];
  let p;
  return e[15] !== c || e[16] !== a || e[17] !== o ? (p = /* @__PURE__ */ u.jsx("div", { className: a, role: "radiogroup", "aria-label": c, children: o }), e[15] = c, e[16] = a, e[17] = o, e[18] = p) : p = e[18], p;
}, F = (m) => {
  const e = q.c(14), {
    name: s,
    options: t,
    value: i,
    onChange: n,
    description: g,
    disabled: _,
    readOnly: f
  } = m, c = _ === void 0 ? !1 : _, r = f === void 0 ? !1 : f, l = !!g.isHorizontal, a = !!g.isWrapVariants, o = l ? "horizontal" : "vertical", p = l && j.radioGroupHorizontal, h = a && j.radioGroupWrap;
  let d;
  e[0] !== p || e[1] !== h ? (d = z(j.radioGroup, p, h), e[0] = p, e[1] = h, e[2] = d) : d = e[2];
  let x;
  e[3] !== c || e[4] !== s || e[5] !== n || e[6] !== t || e[7] !== r || e[8] !== d || e[9] !== i ? (x = /* @__PURE__ */ u.jsx(me, { className: d, name: s, options: t, value: i, onChange: n, disabled: c, readOnly: r, ariaLabel: "test-options" }), e[3] = c, e[4] = s, e[5] = n, e[6] = t, e[7] = r, e[8] = d, e[9] = i, e[10] = x) : x = e[10];
  let b;
  return e[11] !== o || e[12] !== x ? (b = /* @__PURE__ */ u.jsx("div", { "data-testid": "test-options", "data-layout": o, children: x }), e[11] = o, e[12] = x, e[13] = b) : b = e[13], b;
}, L = (m, e) => m == null || m === "" ? "" : P(m) ? e(m) : typeof m == "string" ? m : "", G = (m) => {
  const e = q.c(19), {
    description: s,
    deps: t
  } = m;
  let i;
  e[0] !== t ? (i = (p) => t.global.translateTasks(p), e[0] = t, e[1] = i) : i = e[1];
  const n = i;
  let g;
  e[2] !== s.question || e[3] !== n ? (g = L(s.question, n), e[2] = s.question, e[3] = n, e[4] = g) : g = e[4];
  const _ = g;
  let f;
  e[5] !== s.questionAfter || e[6] !== n ? (f = L(s.questionAfter, n), e[5] = s.questionAfter, e[6] = n, e[7] = f) : f = e[7];
  const c = f;
  let r;
  e[8] !== s.questionAlign || e[9] !== s.questionFontSize ? (r = {}, s.questionFontSize && (r.fontSize = s.questionFontSize), s.questionAlign && (r.textAlign = s.questionAlign), e[8] = s.questionAlign, e[9] = s.questionFontSize, e[10] = r) : r = e[10];
  let l;
  e[11] !== _ || e[12] !== r ? (l = _ ? /* @__PURE__ */ u.jsx("div", { className: j.question, "data-testid": "test-question", style: Object.keys(r).length > 0 ? r : void 0, children: /* @__PURE__ */ u.jsx(k, { children: _ }) }) : null, e[11] = _, e[12] = r, e[13] = l) : l = e[13];
  let a;
  e[14] !== c ? (a = c ? /* @__PURE__ */ u.jsx("div", { className: j.questionAfter, children: /* @__PURE__ */ u.jsx(k, { children: c }) }) : null, e[14] = c, e[15] = a) : a = e[15];
  let o;
  return e[16] !== l || e[17] !== a ? (o = /* @__PURE__ */ u.jsxs(u.Fragment, { children: [
    l,
    a
  ] }), e[16] = l, e[17] = a, e[18] = o) : o = e[18], o;
}, he = (m) => {
  const e = q.c(36), {
    task: s,
    deps: t,
    answer: i,
    solution: n
  } = m;
  let g;
  e[0] !== t ? (g = (V) => t.global.translateTasks(V), e[0] = t, e[1] = g) : g = e[1];
  const _ = g;
  let f, c, r, l;
  e[2] !== i || e[3] !== n || e[4] !== s.description || e[5] !== _ ? (c = N(s.description.variants, _), f = R(s.description, n, _), l = S(c, i), r = S(c, f), e[2] = i, e[3] = n, e[4] = s.description, e[5] = _, e[6] = f, e[7] = c, e[8] = r, e[9] = l) : (f = e[6], c = e[7], r = e[8], l = e[9]);
  const a = r;
  let o;
  e[10] !== t || e[11] !== s.title ? (o = /* @__PURE__ */ u.jsx(O, { title: s.title, deps: t }), e[10] = t, e[11] = s.title, e[12] = o) : o = e[12];
  let p, h;
  e[13] !== t || e[14] !== s.description ? (p = /* @__PURE__ */ u.jsx(G, { description: s.description, deps: t }), h = /* @__PURE__ */ u.jsx($, { description: s.description, deps: t }), e[13] = t, e[14] = s.description, e[15] = p, e[16] = h) : (p = e[15], h = e[16]);
  let d;
  e[17] !== a || e[18] !== t || e[19] !== l ? (d = /* @__PURE__ */ u.jsx(M, { userAnswer: l, correctAnswer: a, deps: t }), e[17] = a, e[18] = t, e[19] = l, e[20] = d) : d = e[20];
  const x = `${s.id}-solution`;
  let b;
  e[21] !== f || e[22] !== c || e[23] !== x || e[24] !== s.description ? (b = /* @__PURE__ */ u.jsx(F, { name: x, options: c, value: f, onChange: be, description: s.description, readOnly: !0 }), e[21] = f, e[22] = c, e[23] = x, e[24] = s.description, e[25] = b) : b = e[25];
  let y;
  e[26] !== t || e[27] !== n ? (y = /* @__PURE__ */ u.jsx(E, { solution: n, deps: t }), e[26] = t, e[27] = n, e[28] = y) : y = e[28];
  let A;
  return e[29] !== o || e[30] !== p || e[31] !== h || e[32] !== d || e[33] !== b || e[34] !== y ? (A = /* @__PURE__ */ u.jsxs("div", { className: j.container, children: [
    o,
    p,
    h,
    d,
    b,
    y
  ] }), e[29] = o, e[30] = p, e[31] = h, e[32] = d, e[33] = b, e[34] = y, e[35] = A) : A = e[35], A;
};
function be() {
}
const xe = ({
  id: m
}) => {
  const e = (s) => {
    const t = q.c(27), {
      task: i,
      deps: n,
      answer: g,
      onChange: _
    } = s;
    if (W(i.solution)) {
      let b;
      return t[0] !== g || t[1] !== n || t[2] !== i ? (b = /* @__PURE__ */ u.jsx(he, { task: i, deps: n, answer: g, solution: i.solution }), t[0] = g, t[1] = n, t[2] = i, t[3] = b) : b = t[3], b;
    }
    let f;
    t[4] !== n ? (f = (b) => n.global.translateTasks(b), t[4] = n, t[5] = f) : f = t[5];
    const c = f;
    let r;
    t[6] !== i.description.variants || t[7] !== c ? (r = N(i.description.variants, c), t[6] = i.description.variants, t[7] = c, t[8] = r) : r = t[8];
    const l = r;
    let a;
    t[9] !== n || t[10] !== i.title ? (a = /* @__PURE__ */ u.jsx(O, { title: i.title, deps: n }), t[9] = n, t[10] = i.title, t[11] = a) : a = t[11];
    let o, p;
    t[12] !== n || t[13] !== i.description ? (o = /* @__PURE__ */ u.jsx(G, { description: i.description, deps: n }), p = /* @__PURE__ */ u.jsx($, { description: i.description, deps: n }), t[12] = n, t[13] = i.description, t[14] = o, t[15] = p) : (o = t[14], p = t[15]);
    const h = String(i.id);
    let d;
    t[16] !== g || t[17] !== _ || t[18] !== l || t[19] !== h || t[20] !== i.description ? (d = /* @__PURE__ */ u.jsx(F, { name: h, options: l, value: g, onChange: _, description: i.description }), t[16] = g, t[17] = _, t[18] = l, t[19] = h, t[20] = i.description, t[21] = d) : d = t[21];
    let x;
    return t[22] !== a || t[23] !== o || t[24] !== p || t[25] !== d ? (x = /* @__PURE__ */ u.jsxs("div", { className: j.container, "data-template-id": m, children: [
      a,
      o,
      p,
      d
    ] }), t[22] = a, t[23] = o, t[24] = p, t[25] = d, t[26] = x) : x = t[26], x;
  };
  return e.displayName = m, e;
}, ve = xe({
  id: "test.plain"
});
export {
  ve as TestPlain,
  ve as default
};
