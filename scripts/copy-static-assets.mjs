import { cpSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const dist = resolve(root, "dist");

cpSync(resolve(root, "compositions"), resolve(dist, "compositions"), {
  recursive: true,
});

const gsapTarget = resolve(dist, "vendor/gsap/dist");
mkdirSync(gsapTarget, { recursive: true });
cpSync(
  resolve(root, "vendor/gsap/dist/gsap.min.js"),
  resolve(gsapTarget, "gsap.min.js"),
);
