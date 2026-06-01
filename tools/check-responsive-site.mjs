import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";

const files = {
  css: "style.css",
  js: "animation.js",
  pages: [
    "index.html",
    "preview/index.html",
    "tutoriais/index.html",
    "beta/index.html",
    "teste/index.html",
    "testar/index.html",
    "privacidade/index.html",
    "termos/index.html",
    "cancelamento-reembolso/index.html",
  ],
};

const css = readFileSync(files.css, "utf8");
const js = readFileSync(files.js, "utf8");
const failures = [];

function expectIncludes(source, needle, message) {
  if (!source.includes(needle)) failures.push(message);
}

function expectMatches(source, pattern, message) {
  if (!pattern.test(source)) failures.push(message);
}

for (const page of files.pages) {
  const html = readFileSync(page, "utf8");
  expectIncludes(
    html,
    '<meta name="viewport" content="width=device-width, initial-scale=1">',
    `${page} must keep viewport meta`,
  );
  expectMatches(
    html,
    /<link rel="stylesheet" href="(?:\.\/|\.\.\/)style\.css">/,
    `${page} must load shared style.css`,
  );
  if (html.includes("scrollIntoView")) {
    failures.push(`${page} must not use scrollIntoView for mobile tutorial nav`);
  }
  if (html.includes("threshold: 0.05")) {
    failures.push(`${page} reveal observer must trigger as soon as content enters the viewport`);
  }
}

try {
  execFileSync(process.execPath, ["--check", files.js], { stdio: "pipe" });
} catch {
  failures.push("animation.js must pass Node syntax check");
}

expectIncludes(
  js,
  "nav.scrollTo({",
  "animation.js must scroll the tutorial nav container horizontally",
);
if (js.includes("scrollIntoView")) {
  failures.push("animation.js must not use scrollIntoView for mobile tutorial nav");
}
if (js.includes("threshold: 0.05")) {
  failures.push("animation.js reveal observer must trigger as soon as content enters the viewport");
}

expectIncludes(css, "@media (max-width: 960px)", "style.css must keep tablet breakpoint");
expectIncludes(css, "@media (max-width: 680px)", "style.css must keep mobile breakpoint");
expectIncludes(css, "@media (max-width: 420px)", "style.css must include narrow phone breakpoint");
expectMatches(
  css,
  /html,\s*body\s*\{[^}]*overflow-x:\s*hidden/s,
  "html/body must prevent page-level horizontal overflow",
);
expectMatches(
  css,
  /img,\s*svg\s*\{[^}]*max-width:\s*100%/s,
  "images and svg must be bounded by viewport",
);
expectMatches(
  css,
  /\.wrap\s*\{[^}]*width:\s*min\(100%,\s*var\(--max-width\)\)/s,
  ".wrap must use viewport-safe width",
);
expectMatches(
  css,
  /\.terminal,[\s\S]*\.prompt-card,[\s\S]*\.tutorial-step-item\s*\{[^}]*min-width:\s*0/s,
  "framed content must be allowed to shrink",
);
expectMatches(
  css,
  /code,\s*pre,\s*\.release-line span,\s*footer a\s*\{[^}]*overflow-wrap:\s*anywhere/s,
  "long technical text must wrap safely",
);
expectMatches(
  css,
  /@media \(max-width:\s*680px\)[\s\S]*nav\s*\{[\s\S]*overflow-x:\s*auto/s,
  "mobile nav must scroll horizontally when needed",
);
expectMatches(
  css,
  /@media \(max-width:\s*680px\)[\s\S]*\.actions\s*\{[\s\S]*flex-direction:\s*column/s,
  "mobile action buttons must stack vertically",
);
expectMatches(
  css,
  /@media \(max-width:\s*680px\)[\s\S]*\.dashboard-tabs\s*\{[\s\S]*overflow-x:\s*auto/s,
  "mobile dashboard tabs must scroll horizontally when needed",
);
expectMatches(
  css,
  /@media \(max-width:\s*420px\)[\s\S]*\.terminal-top\s*\{[\s\S]*grid-template-columns:\s*auto 1fr/s,
  "narrow phone terminal header must fit",
);
expectMatches(
  css,
  /\.js-enabled \.reveal,[\s\S]*\.js-enabled \.reveal-right\s*\{[\s\S]*animation-timeline:\s*auto !important/s,
  "scroll reveal must not stay controlled by view-timeline on long sections",
);

if (failures.length > 0) {
  console.error("Responsive site checks failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log("Responsive site checks passed.");
