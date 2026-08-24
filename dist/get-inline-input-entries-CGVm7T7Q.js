const c = (u, t) => {
  const o = u.answerInput;
  return o ? Object.entries(o).filter(([r]) => r.startsWith("input")).sort(([r], [n]) => r.localeCompare(n)).map(([r, n]) => {
    var s, f;
    const e = n, i = typeof e.before == "string" ? t(e.before) : (s = e.before) != null && s.rus ? t(e.before.rus) : "", p = typeof e.after == "string" ? t(e.after) : (f = e.after) != null && f.rus ? t(e.after.rus) : "";
    return {
      key: r,
      before: i,
      after: p
    };
  }) : [];
};
export {
  c as g
};
