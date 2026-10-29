// Builds public/brand/ from the owner's logo artwork (a JPEG on a white background).
//   node scripts/build-logo-assets.mjs <logo.jpg> [outDir=public/brand]
// Then re-check the output on white and on navy. The icons and the social image are made from
// emblem.png and lockup-full.png (see docs/design/image-credits.md).
//
// Background removal: near-white regions that touch the image border, plus enclosed ones that are
// neutral white (letter counters, gaps in the mane), become transparent. Tinted near-white spots
// inside shapes are specular highlights and stay opaque, so metallic shine never turns see-through
// on navy. Only pixels at the boundary get partial alpha (colour-to-alpha against white).
import sharp from "sharp";

const [src, out = "public/brand"] = process.argv.slice(2);
if (!src) {
  console.error("Usage: node scripts/build-logo-assets.mjs <logo.jpg> [outDir]");
  process.exit(1);
}

async function transparent() {
  const { data, info } = await sharp(src).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const W = info.width, H = info.height, C = info.channels, N = W * H;
  const white = new Uint8Array(N);
  for (let p = 0; p < N; p++) {
    const r = data[p * C], g = data[p * C + 1], b = data[p * C + 2];
    const mn = Math.min(r, g, b), mx = Math.max(r, g, b);
    white[p] = mn >= 232 && mx - mn <= 22 ? 1 : 0;
  }
  // Connected near-white regions, with their mean colour and the colour of their edge.
  const label = new Int32Array(N).fill(-1), stack = new Int32Array(N), comps = [];
  for (let s = 0; s < N; s++) {
    if (!white[s] || label[s] >= 0) continue;
    const c = { area: 0, border: false, sum: [0, 0, 0], ring: [0, 0, 0, 0] }, id = comps.length;
    let sp = 0;
    stack[sp++] = s;
    label[s] = id;
    while (sp) {
      const p = stack[--sp], x = p % W, y = (p / W) | 0;
      c.area++;
      for (let k = 0; k < 3; k++) c.sum[k] += data[p * C + k];
      if (x === 0 || y === 0 || x === W - 1 || y === H - 1) c.border = true;
      for (const q of [x > 0 ? p - 1 : -1, x < W - 1 ? p + 1 : -1, y > 0 ? p - W : -1, y < H - 1 ? p + W : -1]) {
        if (q < 0) continue;
        if (white[q]) {
          if (label[q] < 0) { label[q] = id; stack[sp++] = q; }
        } else {
          for (let k = 0; k < 3; k++) c.ring[k] += data[q * C + k];
          c.ring[3]++;
        }
      }
    }
    comps.push(c);
  }
  const isBg = comps.map((c) => {
    if (c.border) return true;
    const mean = c.sum.map((v) => v / c.area), tint = Math.max(...mean) - Math.min(...mean);
    const n = c.ring[3] || 1, ring = c.ring.slice(0, 3).map((v) => v / n);
    const ringTint = Math.max(...ring) - Math.min(...ring), ringLum = (ring[0] + ring[1] + ring[2]) / 3;
    if (c.area >= 60) return tint <= 5;
    return tint <= 8 && ringTint <= 12 && ringLum < 225; // small gaps between serifs: neutral grey edge
  });
  const bg = new Uint8Array(N);
  for (let p = 0; p < N; p++) bg[p] = white[p] && isBg[label[p]] ? 1 : 0;

  const rgba = Buffer.alloc(N * 4);
  for (let p = 0; p < N; p++) {
    if (bg[p]) continue;
    const r = data[p * C], g = data[p * C + 1], b = data[p * C + 2], x = p % W, y = (p / W) | 0;
    let edge = false;
    for (let dy = -2; dy <= 2 && !edge; dy++)
      for (let dx = -2; dx <= 2; dx++) {
        const xx = x + dx, yy = y + dy;
        if (xx >= 0 && yy >= 0 && xx < W && yy < H && bg[yy * W + xx]) { edge = true; break; }
      }
    if (!edge) { rgba.set([r, g, b, 255], p * 4); continue; }
    const a = Math.max(255 - r, 255 - g, 255 - b) / 255;
    if (a <= 0.02) continue;
    const un = (v) => Math.max(0, Math.min(255, Math.round((v - 255 * (1 - a)) / a)));
    rgba.set([un(r), un(g), un(b), Math.round(a * 255)], p * 4);
  }
  return { rgba, W, H };
}

(async () => {
  const { rgba, W, H } = await transparent();
  const base = () => sharp(rgba, { raw: { width: W, height: H, channels: 4 } });
  const trimmed = async (img) => sharp(await img.png().toBuffer()).trim({ threshold: 1 }).png().toBuffer();
  // The emblem (lion, laurel, ribbon) and the wordmark are separated by the first fully empty row
  // below the ribbon.
  const empty = [];
  for (let y = 0; y < H; y++) {
    let any = false;
    for (let x = 0; x < W && !any; x++) any = rgba[(y * W + x) * 4 + 3] > 24;
    empty.push(!any);
  }
  const split = empty.findIndex((e, y) => e && y > H * 0.6);
  const full = await trimmed(base());
  const emblem = await trimmed(base().extract({ left: 0, top: 0, width: W, height: split }));
  const word = await trimmed(base().extract({ left: 0, top: split, width: W, height: H - split }));

  // Wordmark for navy backgrounds: blue lettering → chrome (keeps its own shading), red brightened.
  const w = await sharp(word).raw().toBuffer({ resolveWithObject: true });
  for (let p = 0; p < w.info.width * w.info.height; p++) {
    const i = p * 4, r = w.data[i], g = w.data[i + 1], b = w.data[i + 2];
    if (b > r + 25 && b > g + 10) {
      const v = Math.round(200 + (Math.min(0.3 * r + 0.59 * g + 0.11 * b, 140) / 140) * 55);
      w.data.set([v, v, Math.min(255, v + 6)], i);
    } else if (r > g + 70 && r > b + 60) {
      w.data.set([Math.min(255, r + 45), Math.min(255, g + 38), Math.min(255, b + 48)], i);
    }
  }
  const wordOnDark = await sharp(w.data, { raw: w.info }).png().toBuffer();

  // Horizontal lockup (header and footer): emblem beside the wordmark.
  const em = await sharp(emblem).metadata(), wm = await sharp(word).metadata();
  const eh = 600, ew = Math.round((em.width * eh) / em.height);
  const wh = Math.round(eh * 0.58), ww = Math.round((wm.width * wh) / wm.height), gap = 50;
  const horizontal = async (wordBuf) =>
    sharp({ create: { width: ew + gap + ww, height: eh, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } })
      .composite([
        { input: await sharp(emblem).resize({ height: eh }).png().toBuffer(), left: 0, top: 0 },
        { input: await sharp(wordBuf).resize({ height: wh }).png().toBuffer(), left: ew + gap, top: Math.round((eh - wh) / 2) },
      ])
      .png()
      .toBuffer();

  const png = { compressionLevel: 9 };
  await sharp(full).png(png).toFile(`${out}/lockup-full.png`);
  await sharp(emblem).png(png).toFile(`${out}/emblem.png`);
  await sharp(await horizontal(word)).resize({ width: 1600 }).png(png).toFile(`${out}/lockup-horizontal.png`);
  await sharp(await horizontal(wordOnDark)).resize({ width: 1600 }).png(png).toFile(`${out}/lockup-horizontal-on-dark.png`);
  for (const f of ["lockup-full", "emblem", "lockup-horizontal", "lockup-horizontal-on-dark"]) {
    const m = await sharp(`${out}/${f}.png`).metadata();
    console.log(`${f}.png ${m.width}x${m.height}`);
  }
})();
