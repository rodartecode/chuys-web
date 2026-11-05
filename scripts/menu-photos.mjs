// Pulls the dish photos shown in the menu gallery (`dishPhotos` in src/data/menu.ts) from the live
// Square catalog. Read-only against Square. Each photo is resized to at most 1600 px wide and written
// to src/assets/menu/<file>, where Astro turns it into webp srcsets at build time.
//
// Needs the Square CLI signed in (`square auth login`, browser OAuth), so it runs locally only. The
// resized JPEGs are committed, and the build never calls Square.
//
// Usage: pnpm menu:photos
//
// To add a photo: add a row to PHOTOS (the image's name in Square → the file name the site uses),
// run this, then add the matching `dishPhotos` entry in menu.ts. tests/unit/menu.test.ts checks
// that every `dishPhotos` file exists.
import { execSync } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import sharp from "sharp";

const OUT_DIR = "src/assets/menu";
const MAX_WIDTH = 1600;

/** Square image name → file name under src/assets/menu/. */
const PHOTOS = {
  "chuys_chuysstyle.jpg": "chuys-style-tacos.jpg",
  "chuys_streettacos.jpg": "street-tacos.jpg",
  "chuys_asadaandpastorburrito.jpg": "burrito.jpg",
  "chuys_quesabirria.jpg": "quesabirria.jpg",
  "barbacoa-tacos.JPG": "crispy-barbacoa-taco.jpg",
  "chuys_surfandturffries.jpg": "surf-and-turf-fries.jpg",
  "chuys_minitorta.jpg": "mini-torta.jpg",
  "breakfast-burrito.JPG": "breakfast-burrito.jpg",
};

/** Runs a read-only square command and parses its JSON output. */
function square(args) {
  // A command string (not an args array) because `square` is a .cmd shim on Windows, which needs a shell.
  const out = execSync(`square ${args} --format json`, {
    encoding: "utf8",
    maxBuffer: 64 * 1024 * 1024,
    stdio: ["ignore", "pipe", "inherit"],
  });
  return JSON.parse(out);
}

const auth = square("auth status");
if (!auth.signedIn || auth.reauthRequired) {
  console.error("Square CLI isn't signed in. Run `square auth login`, then retry.");
  process.exit(1);
}

const images = (
  square("catalog catalog-object list --object-types IMAGE --all").objects ?? []
).filter((o) => !o.isDeleted);
const byName = new Map(images.map((o) => [o.imageData.name, o.imageData.url]));

const missing = Object.keys(PHOTOS).filter((name) => !byName.has(name));
if (missing.length > 0) {
  console.error(`Not in the Square catalog: ${missing.join(", ")}`);
  process.exit(1);
}

mkdirSync(OUT_DIR, { recursive: true });
for (const [name, file] of Object.entries(PHOTOS)) {
  const res = await fetch(byName.get(name));
  if (!res.ok) throw new Error(`${name}: HTTP ${res.status}`);
  const jpeg = await sharp(Buffer.from(await res.arrayBuffer()))
    .rotate() // apply EXIF orientation before the metadata is dropped
    .resize({ width: MAX_WIDTH, withoutEnlargement: true })
    .jpeg({ quality: 82, mozjpeg: true })
    .toBuffer({ resolveWithObject: true });
  writeFileSync(`${OUT_DIR}/${file}`, jpeg.data);
  console.log(
    `${file}: ${jpeg.info.width}×${jpeg.info.height}, ${Math.round(jpeg.data.length / 1024)} KB`
  );
}
console.log(`Wrote ${Object.keys(PHOTOS).length} photos to ${OUT_DIR}.`);
