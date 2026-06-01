# Launch Editorial Site Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Prepare the Lumina public site for official-store launch readiness while keeping beta access controlled for friends and testers.

**Architecture:** Keep the static-site structure and shared `style.css`. Add the new canonical `beta/` and `cancelamento-reembolso/` pages, keep `/teste/` and `/testar/` as redirects, and verify required copy and links with a Node static check.

**Tech Stack:** Static HTML, CSS, vanilla JavaScript, Node.js static verification, local Python HTTP server.

---

### Task 1: Add Launch Content Regression Check

**Files:**
- Create: `tools/check-launch-site.mjs`
- Read: all public HTML pages

- [ ] **Step 1: Write the failing test**

Create `tools/check-launch-site.mjs` to require `/beta/`, `/cancelamento-reembolso/`, updated legal links, beta copy, and absence of stale `/testar/` navigation in canonical pages.

- [ ] **Step 2: Run test to verify it fails**

Run:

```powershell
& 'C:\Users\lumin\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' tools/check-launch-site.mjs
```

Expected: FAIL because `beta/index.html` and `cancelamento-reembolso/index.html` do not exist yet.

### Task 2: Create Canonical Beta And Redirect Pages

**Files:**
- Create: `beta/index.html`
- Modify: `teste/index.html`
- Create: `testar/index.html`

- [ ] **Step 1: Create `beta/index.html`**

Write a launch-ready beta page with the existing theme and sections for beta status, install options, what to test, feedback, and beta limitations.

- [ ] **Step 2: Convert old routes to redirects**

Make `teste/index.html` and `testar/index.html` redirect to `../beta/` with a visible fallback link.

### Task 3: Rewrite Product And Legal Pages

**Files:**
- Modify: `index.html`
- Modify: `preview/index.html`
- Modify: `tutoriais/index.html`
- Modify: `privacidade/index.html`
- Modify: `termos/index.html`
- Create: `cancelamento-reembolso/index.html`

- [ ] **Step 1: Recompose home**

Present Lumina first, keep beta download CTAs in the hero, and describe Free/Plus/Pro as the intended official-store model.

- [ ] **Step 2: Update preview and tutorials**

Remove overclaims, align community and sync wording to the current app, and point CTAs to `/beta/`.

- [ ] **Step 3: Rewrite privacy and terms**

Use Brazilian-law-oriented language for LGPD, CDC, plans, billing, store policies, data export, deletion, minors, and support.

- [ ] **Step 4: Add cancellation and refund page**

Cover cancellation timing, monthly/annual subscriptions, store-managed purchases, direct purchases, right of withdrawal where applicable, technical failures, unauthorized charges, and support review.

### Task 4: Update Shared Styling And Metadata

**Files:**
- Modify: `style.css`
- Modify: `README.md`

- [ ] **Step 1: Add small legal/product helper styles**

Add reusable classes only where existing cards/grids are insufficient.

- [ ] **Step 2: Update README page list**

List Home, Preview, Tutoriais, Beta, Privacidade, Termos, and Cancelamento/Reembolso.

### Task 5: Verify

**Files:**
- Read: all modified files

- [ ] **Step 1: Run static checks**

Run:

```powershell
& 'C:\Users\lumin\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' --check animation.js
& 'C:\Users\lumin\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' tools/check-responsive-site.mjs
& 'C:\Users\lumin\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' tools/check-launch-site.mjs
git diff --check
```

Expected: all commands exit 0.

- [ ] **Step 2: Serve and inspect locally**

Run:

```powershell
& 'C:\Users\lumin\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe' -m http.server 4173
```

Open the pages listed in the spec and confirm navigation, redirects and layout.

