/* Build-time geometry for the archwire motif (shared by page heroes).
   A cubic Bézier arch and bracket placements along it, with tangent angles. */
export const ARCH = { p0: [56, 572], p1: [56, 150], p2: [300, 44], p3: [660, 44] };
export const archPath = `M${ARCH.p0} C${ARCH.p1} ${ARCH.p2} ${ARCH.p3}`;

const bez = (t, a, b, c, d) => {
  const u = 1 - t;
  return u * u * u * a + 3 * u * u * t * b + 3 * u * t * t * c + t * t * t * d;
};
const dBez = (t, a, b, c, d) => {
  const u = 1 - t;
  return 3 * u * u * (b - a) + 6 * u * t * (c - b) + 3 * t * t * (d - c);
};

/* Six brackets, molar → incisor, sized like real upper-arch teeth. */
export const brackets = () => {
  const { p0, p1, p2, p3 } = ARCH;
  const widths = [30, 26, 22, 22, 20, 18];
  const ts = [0.1, 0.26, 0.42, 0.58, 0.74, 0.9];
  return ts.map((t, i) => {
    const x = bez(t, p0[0], p1[0], p2[0], p3[0]);
    const y = bez(t, p0[1], p1[1], p2[1], p3[1]);
    const angle = (Math.atan2(dBez(t, p0[1], p1[1], p2[1], p3[1]), dBez(t, p0[0], p1[0], p2[0], p3[0])) * 180) / Math.PI;
    const w = widths[i], hw = w / 2, gx = Math.max(2, w * 0.09);
    return {
      i, x: +x.toFixed(1), y: +y.toFixed(1), angle: +angle.toFixed(1),
      pad: { x: -hw * 1.1, w: hw * 2.2 },
      wings: [[-hw, -gx, -8.5], [gx, hw, -8.5], [-hw, -gx, 2.2], [gx, hw, 2.2]].map(([a, b, yy]) => ({ x: +a.toFixed(1), w: +(b - a).toFixed(1), y: yy })),
    };
  });
};
