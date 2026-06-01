import { existsSync, readFileSync } from "node:fs";

const pages = [
  "index.html",
  "preview/index.html",
  "tutoriais/index.html",
  "beta/index.html",
  "teste/index.html",
  "testar/index.html",
  "privacidade/index.html",
  "termos/index.html",
  "cancelamento-reembolso/index.html",
];

const canonicalPages = [
  "index.html",
  "preview/index.html",
  "tutoriais/index.html",
  "beta/index.html",
  "privacidade/index.html",
  "termos/index.html",
  "cancelamento-reembolso/index.html",
];

const failures = [];

function read(path) {
  if (!existsSync(path)) {
    failures.push(`${path} must exist`);
    return "";
  }

  return readFileSync(path, "utf8");
}

function expectIncludes(source, needle, message) {
  if (!source.includes(needle)) failures.push(message);
}

function expectNotIncludes(source, needle, message) {
  if (source.includes(needle)) failures.push(message);
}

const htmlByPage = new Map(pages.map((page) => [page, read(page)]));

for (const page of canonicalPages) {
  const html = htmlByPage.get(page) ?? "";
  expectIncludes(html, "Cancelamento e Reembolso", `${page} must link the cancellation/refund policy`);
  expectIncludes(html, "Privacidade", `${page} must link privacy policy`);
  expectIncludes(html, "Termos", `${page} must link terms of use`);
  expectIncludes(html, "Beta", `${page} must expose beta navigation`);
  expectNotIncludes(html, "href=\"../testar/\"", `${page} must not link to legacy /testar/`);
  expectNotIncludes(html, "href=\"./testar/\"", `${page} must not link to legacy /testar/`);
}

const home = htmlByPage.get("index.html") ?? "";
expectIncludes(home, "Planos Free, Plus e Pro", "home must present the launch plan model");
expectIncludes(home, "beta fechado", "home must clearly state beta status");
expectIncludes(home, "Baixar para Windows", "home must keep Windows download CTA");
expectIncludes(home, "Baixar Android", "home must keep Android download CTA");

const beta = htmlByPage.get("beta/index.html") ?? "";
expectIncludes(beta, "Beta fechado", "beta page must be the canonical beta page");
expectIncludes(beta, "amigos e testers", "beta page must mention friends/testers");
expectIncludes(beta, "downloads/windows/LuminaSetup.exe", "beta page must link Windows installer");
expectIncludes(beta, "downloads/android/Lumina.apk", "beta page must link Android APK");

const privacy = htmlByPage.get("privacidade/index.html") ?? "";
expectIncludes(privacy, "Lei Geral de Proteção de Dados", "privacy must mention LGPD");
expectIncludes(privacy, "Supabase", "privacy must mention Supabase");
expectIncludes(privacy, "Google", "privacy must mention Google login/provider");
expectIncludes(privacy, "Comunidade", "privacy must mention community data");

const terms = htmlByPage.get("termos/index.html") ?? "";
expectIncludes(terms, "Código de Defesa do Consumidor", "terms must mention Brazilian consumer law");
expectIncludes(terms, "assinatura", "terms must cover subscriptions");
expectIncludes(terms, "lojas oficiais", "terms must cover official stores");

const cancellation = htmlByPage.get("cancelamento-reembolso/index.html") ?? "";
expectIncludes(cancellation, "Direito de arrependimento", "cancellation policy must cover withdrawal rights");
expectIncludes(cancellation, "Google Play", "cancellation policy must cover Google Play");
expectIncludes(cancellation, "App Store", "cancellation policy must cover App Store");
expectIncludes(cancellation, "reembolso proporcional", "cancellation policy must cover pro-rata refunds");

for (const legacy of ["teste/index.html", "testar/index.html"]) {
  const html = htmlByPage.get(legacy) ?? "";
  expectIncludes(html, "http-equiv=\"refresh\"", `${legacy} must redirect`);
  expectIncludes(html, "../beta/", `${legacy} must redirect to beta`);
}

if (failures.length > 0) {
  console.error("Launch editorial checks failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log("Launch editorial checks passed.");
