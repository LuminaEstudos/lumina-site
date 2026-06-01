# Responsive Site Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make every Lumina site page responsive on mobile and desktop while preserving the current colors, theme, and animations.

**Architecture:** Keep a single shared responsive stylesheet in `style.css`, because all public pages already use it. Add a lightweight static regression script for required responsive rules and fix the existing `animation.js` syntax error so existing interactions run again.

**Tech Stack:** Static HTML, CSS, vanilla JavaScript, Node.js syntax/static verification, local static server, in-app browser visual QA.

---

### Task 1: Add Static Responsive Regression Check

**Files:**
- Create: `tools/check-responsive-site.mjs`
- Read: `style.css`
- Read: `animation.js`
- Read: `index.html`, `preview/index.html`, `tutoriais/index.html`, `testar/index.html`, `privacidade/index.html`, `termos/index.html`

- [ ] **Step 1: Write the failing test**

Create `tools/check-responsive-site.mjs`:

```js
import { readFileSync } from "node:fs";
import { execFileSync } from "node:child_process";

const files = {
  css: "style.css",
  js: "animation.js",
  pages: [
    "index.html",
    "preview/index.html",
    "tutoriais/index.html",
    "testar/index.html",
    "privacidade/index.html",
    "termos/index.html",
  ],
};

const css = readFileSync(files.css, "utf8");
const failures = [];

function expectIncludes(source, needle, message) {
  if (!source.includes(needle)) failures.push(message);
}

function expectMatches(source, pattern, message) {
  if (!pattern.test(source)) failures.push(message);
}

for (const page of files.pages) {
  const html = readFileSync(page, "utf8");
  expectIncludes(html, '<meta name="viewport" content="width=device-width, initial-scale=1">', `${page} must keep viewport meta`);
  expectMatches(html, /<link rel="stylesheet" href="(?:\.\/|\.\.\/)style\.css">/, `${page} must load shared style.css`);
}

try {
  execFileSync(process.execPath, ["--check", files.js], { stdio: "pipe" });
} catch {
  failures.push("animation.js must pass Node syntax check");
}

expectIncludes(css, "@media (max-width: 960px)", "style.css must keep tablet breakpoint");
expectIncludes(css, "@media (max-width: 680px)", "style.css must keep mobile breakpoint");
expectIncludes(css, "@media (max-width: 420px)", "style.css must include narrow phone breakpoint");
expectMatches(css, /html,\s*body\s*\{[^}]*overflow-x:\s*hidden/s, "html/body must prevent page-level horizontal overflow");
expectMatches(css, /img,\s*svg\s*\{[^}]*max-width:\s*100%/s, "images and svg must be bounded by viewport");
expectMatches(css, /\.wrap\s*\{[^}]*width:\s*min\(100%,\s*var\(--max-width\)\)/s, ".wrap must use viewport-safe width");
expectMatches(css, /\.terminal,\s*\.screenshot-container,\s*\.legal-card,\s*\.card,\s*\.step,\s*\.prompt-card\s*\{[^}]*min-width:\s*0/s, "framed content must be allowed to shrink");
expectMatches(css, /code,\s*pre,\s*\.release-line span,\s*footer a\s*\{[^}]*overflow-wrap:\s*anywhere/s, "long technical text must wrap safely");
expectMatches(css, /@media \(max-width:\s*680px\)[\s\S]*nav\s*\{[\s\S]*overflow-x:\s*auto/s, "mobile nav must scroll horizontally when needed");
expectMatches(css, /@media \(max-width:\s*680px\)[\s\S]*\.actions\s*\{[\s\S]*flex-direction:\s*column/s, "mobile action buttons must stack vertically");
expectMatches(css, /@media \(max-width:\s*680px\)[\s\S]*\.dashboard-tabs\s*\{[\s\S]*overflow-x:\s*auto/s, "mobile dashboard tabs must scroll horizontally when needed");
expectMatches(css, /@media \(max-width:\s*420px\)[\s\S]*\.terminal-top\s*\{[\s\S]*grid-template-columns:\s*auto 1fr/s, "narrow phone terminal header must fit");

if (failures.length > 0) {
  console.error("Responsive site checks failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log("Responsive site checks passed.");
```

- [ ] **Step 2: Run test to verify it fails**

Run:

```powershell
& 'C:\Users\lumin\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' tools/check-responsive-site.mjs
```

Expected: FAIL, including `animation.js must pass Node syntax check` and missing responsive rule messages.

### Task 2: Fix Existing JavaScript Syntax Error

**Files:**
- Modify: `animation.js`

- [ ] **Step 1: Confirm current syntax failure**

Run:

```powershell
& 'C:\Users\lumin\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' --check animation.js
```

Expected: FAIL with `SyntaxError: Unexpected end of input`.

- [ ] **Step 2: Close the open blocks without changing animation behavior**

In `animation.js`, close the tutorial nav `if` block after observing tutorial sections, and close the tab button click handler and `forEach` after the `setTimeout` block. Keep existing selectors, animation classes, timings, and lightbox behavior.

- [ ] **Step 3: Replace mobile tutorial active-link scrolling**

Replace `link.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });` with container-only horizontal scrolling:

```js
const nav = link.closest(".tutorial-nav");
if (nav) {
  const navWidth = nav.offsetWidth;
  const linkLeft = link.offsetLeft;
  const linkWidth = link.offsetWidth;
  nav.scrollTo({
    left: linkLeft - (navWidth / 2) + (linkWidth / 2),
    behavior: "smooth"
  });
}
```

- [ ] **Step 4: Verify syntax passes**

Run:

```powershell
& 'C:\Users\lumin\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' --check animation.js
```

Expected: PASS with exit code 0.

### Task 3: Add Responsive CSS Rules

**Files:**
- Modify: `style.css`

- [ ] **Step 1: Add global overflow and shrink safeguards**

Add viewport-safe rules near the base layout section:

```css
html,
body {
  overflow-x: hidden;
  max-width: 100%;
}

img,
svg {
  max-width: 100%;
}

.wrap {
  width: min(100%, var(--max-width));
}

.terminal,
.screenshot-container,
.legal-card,
.card,
.step,
.prompt-card {
  min-width: 0;
}

code,
pre,
.release-line span,
footer a {
  overflow-wrap: anywhere;
  word-break: break-word;
}
```

- [ ] **Step 2: Strengthen tablet layout**

Inside `@media (max-width: 960px)`, ensure hero content, screenshots, legal grids, tutorial layout, and dashboard tabs fit the viewport without changing colors or animations.

- [ ] **Step 3: Strengthen mobile layout**

Inside `@media (max-width: 680px)`, stack action buttons with `.actions { flex-direction: column; }`, keep mobile nav horizontally scrollable, make dashboard tabs horizontally scrollable, reduce paddings, and make terminal/lightbox/legal content fit narrow screens.

- [ ] **Step 4: Add narrow phone breakpoint**

Add `@media (max-width: 420px)` for very narrow screens, including terminal header layout and compact navigation/link/button sizing.

- [ ] **Step 5: Verify static responsive checks pass**

Run:

```powershell
& 'C:\Users\lumin\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' tools/check-responsive-site.mjs
```

Expected: PASS with `Responsive site checks passed.`

### Task 4: Browser Verification

**Files:**
- Read/serve all site files.

- [ ] **Step 1: Start local static server**

Run:

```powershell
& 'C:\Users\lumin\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe' -m http.server 4173
```

Expected: server starts at `http://localhost:4173`.

- [ ] **Step 2: Inspect all required pages**

Open these paths at desktop and mobile widths:

```text
http://localhost:4173/
http://localhost:4173/preview/
http://localhost:4173/tutoriais/
http://localhost:4173/testar/
http://localhost:4173/privacidade/
http://localhost:4173/termos/
```

Expected: no body-level horizontal overflow, no clipped primary content, nav/tabs remain usable, existing animations/interactions still run.

- [ ] **Step 3: Final verification**

Run:

```powershell
git diff --check
& 'C:\Users\lumin\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' --check animation.js
& 'C:\Users\lumin\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' tools/check-responsive-site.mjs
```

Expected: all commands exit 0.

### Task 5: Completion Notes

**Files:**
- Read: `git diff --stat`
- Read: `git status --short --branch`

- [ ] **Step 1: Summarize changed files**

Run:

```powershell
git diff --stat
git status --short --branch
```

Expected: only planned docs, CSS, JS, and test script changes are present.

- [ ] **Step 2: Report commit suggestion**

Use this suggested commit message:

```text
0.2.3 - responsividade mobile do site
```
