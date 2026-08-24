import { q as N, G as e, j as l, a as C, k as E, l as D, b as W, r as U, H as B, e as O, m as V, h as q } from "./index-DNoheI6P.js";
import { S as F, T as M } from "./shared-solution-description-d9sTMhQm.js";
import { a as _, S as $ } from "./solution-answer-panel-C_30mrDJ.js";
const R = /* @__PURE__ */ new Set(["table.grid", "table.multiRow", "table.multiRowSvg"]), k = R, G = /* @__PURE__ */ new Set(["table.mixed", "table.list", "table.plain"]), X = /* @__PURE__ */ new Set(["table.inline", "table.list", "table.mixed"]);
function P(n) {
  const {
    id: t,
    mode: s,
    removeBorders: i,
    removePadding: a
  } = n;
  return N(e.table, i && e.tableRemoveBorders, a && e.tableRemovePadding, t === "table.plain" && i && !a && e.equationStretch, R.has(t) && e.tableRounded, t === "table.inline" && s === "input" && e.tableFlexInlineInput, t === "table.mixed" && s === "solution" && e.tableFlexMixedSolution, t === "table.mixed" && s === "input" && e.tableFlexMixedInput, t === "table.list" && s === "input" && e.tableFlexListInput, t === "table.list" && s === "solution" && e.tableFlexListSolution);
}
function y(n) {
  const {
    id: t,
    mode: s,
    isInput: i,
    isFirstCell: a,
    isLastCell: o,
    isHeaderRow: m,
    isLastRow: r
  } = n;
  return N(e.cell, i && e.inputCell, i && !X.has(t) && e.inputCellDefaultWidth, m && e.cellHeader, R.has(t) && r && e.cellNoBottomBorder, k.has(t) && a && !i && e.cellFirstColLabel, t === "table.inline" && s === "solution" && e.cellInlineSolution, t === "table.inline" && s === "input" && e.cellInlineInput, t === "table.inline" && s === "input" && i && e.inputCellInlineInput, t === "table.mixed" && s === "solution" && e.cellMixedSolution, t === "table.mixed" && s === "input" && e.cellMixedInput, t === "table.list" && s === "input" && o && e.cellListLastInput, t === "table.list" && s === "solution" && o && e.cellListLastSolution, t === "table.list" && s === "input" && i && e.inputCellListInput, t === "table.list" && s === "solution" && i && e.inputCellListSolution, t === "table.plain" && s === "solution" && i && e.inputCellPlainSolution);
}
function H(n) {
  const {
    id: t,
    mode: s
  } = n;
  return N(e.input, s === "solution" && G.has(t) && e.inputWidthAuto);
}
const Z = ({
  task: n,
  deps: t,
  answer: s,
  solution: i,
  templateId: a
}) => {
  const o = n.description.table;
  if (!o)
    return /* @__PURE__ */ l.jsxs(l.Fragment, { children: [
      /* @__PURE__ */ l.jsx(C, { title: n.title, deps: t }),
      /* @__PURE__ */ l.jsx(F, { task: n, deps: t }),
      /* @__PURE__ */ l.jsx(_, { solution: i, deps: t })
    ] });
  const m = t.helpers.TaskHelper.multipleTaskAnswerSeparator, S = E(i, m, (b) => t.global.translateTasks(b)), T = D(s, m);
  let v = 0;
  return /* @__PURE__ */ l.jsxs("div", { className: e.container, "data-template-id": a, "data-mode": "solution", children: [
    /* @__PURE__ */ l.jsx(C, { title: n.title, deps: t }),
    /* @__PURE__ */ l.jsx(F, { task: n, deps: t }),
    /* @__PURE__ */ l.jsx($, { userAnswer: T.join(" ; "), correctAnswer: W(S), deps: t }),
    /* @__PURE__ */ l.jsx("div", { className: e.tableWrapper, children: /* @__PURE__ */ l.jsx("table", { className: P({
      id: a != null ? a : "table.plain",
      mode: "solution",
      removeBorders: o.removeBorders,
      removePadding: o.removePadding
    }), style: {
      width: a === "table.mixed" ? "100%" : o.width
    }, "data-testid": "task-table", children: /* @__PURE__ */ l.jsx("tbody", { children: o.rows.map((b, h) => /* @__PURE__ */ l.jsx("tr", { children: b.cells.map((c, u) => {
      var x, w, g;
      const p = c === "answercell", d = typeof c == "string" ? c : t.global.translateTasks(c), j = p ? v++ : -1, L = a === "table.grid" ? h < o.rows.length - 1 : a === "table.multiRow" || a === "table.multiRowSvg" ? h === 0 : !1;
      return /* @__PURE__ */ l.jsx("td", { className: y({
        id: a != null ? a : "table.plain",
        mode: "solution",
        isInput: p,
        isFirstCell: u === 0,
        isLastCell: u === b.cells.length - 1,
        isHeaderRow: L,
        isLastRow: h === o.rows.length - 1
      }), colSpan: ((x = b.colspan_list) == null ? void 0 : x[u]) || 1, rowSpan: ((w = b.rowspan_list) == null ? void 0 : w[u]) || 1, children: p ? /* @__PURE__ */ l.jsx(U, { className: H({
        id: a != null ? a : "table.plain",
        mode: "solution"
      }), children: (g = S[j]) != null ? g : "" }) : /* @__PURE__ */ l.jsx(B, { content: d }) }, u);
    }) }, h)) }) }) }),
    /* @__PURE__ */ l.jsx(_, { solution: i, deps: t })
  ] });
}, Q = ({
  id: n
}) => {
  const t = ({
    task: s,
    deps: i,
    answer: a,
    onChange: o,
    mathInput: m
  }) => {
    if (O(s.solution))
      return /* @__PURE__ */ l.jsx(Z, { task: s, deps: i, answer: a, solution: s.solution, templateId: n });
    const r = s.description.table;
    if (!r)
      return /* @__PURE__ */ l.jsxs("div", { className: e.container, "data-template-id": n, "data-mode": "input", children: [
        /* @__PURE__ */ l.jsx(C, { title: s.title, deps: i }),
        /* @__PURE__ */ l.jsx(M, { task: s, deps: i })
      ] });
    const S = i.helpers.TaskHelper.multipleTaskAnswerSeparator, {
      bindRef: T,
      handleChange: v
    } = V({
      onChange: o,
      separator: S,
      mathInput: m
    }), b = D(a, S);
    let h = 0;
    return /* @__PURE__ */ l.jsxs("div", { className: e.container, "data-template-id": n, "data-mode": "input", children: [
      /* @__PURE__ */ l.jsx(C, { title: s.title, deps: i }),
      /* @__PURE__ */ l.jsx(M, { task: s, deps: i }),
      /* @__PURE__ */ l.jsx("div", { className: e.tableWrapper, children: /* @__PURE__ */ l.jsx("table", { className: P({
        id: n,
        mode: "input",
        removeBorders: r.removeBorders,
        removePadding: r.removePadding
      }), style: {
        width: n === "table.list" || n === "table.mixed" || n === "table.inline" ? "100%" : r.width
      }, "data-testid": "task-table", children: /* @__PURE__ */ l.jsx("tbody", { children: r.rows.map((c, u) => /* @__PURE__ */ l.jsx("tr", { children: c.cells.map((p, d) => {
        var g, f, A;
        const j = p === "answercell", L = typeof p == "string" ? p : i.global.translateTasks(p), x = j ? h++ : -1, w = n === "table.grid" ? u < r.rows.length - 1 : n === "table.multiRow" || n === "table.multiRowSvg" ? u === 0 : !1;
        return /* @__PURE__ */ l.jsx("td", { className: y({
          id: n,
          mode: "input",
          isInput: j,
          isFirstCell: d === 0,
          isLastCell: d === c.cells.length - 1,
          isHeaderRow: w,
          isLastRow: u === r.rows.length - 1
        }), colSpan: ((g = c.colspan_list) == null ? void 0 : g[d]) || 1, rowSpan: ((f = c.rowspan_list) == null ? void 0 : f[d]) || 1, children: j ? /* @__PURE__ */ l.jsx(q, { id: `table-input-${x}`, ref: T(`table-input-${x}`), formula: (A = b[x]) != null ? A : "", onMathFieldChanged: v, className: H({
          id: n,
          mode: "input"
        }) }) : /* @__PURE__ */ l.jsx(B, { content: L }) }, d);
      }) }, u)) }) }) })
    ] });
  };
  return t.displayName = n, t;
};
export {
  Q as c
};
