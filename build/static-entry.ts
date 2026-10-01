function escapeAttribute(value: string): string {
  return value.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')
}

/** A static root cannot read a visitor's language at build time. */
export function staticLocaleEntry(baseURL: string): string {
  const base = escapeAttribute(baseURL.replace(/\/$/, ''))
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Choose your language · Binzomah Cosmetics</title>
<script type="module" src="${base}/locale-redirect.js"></script>
<style>body{font:1.125rem system-ui,sans-serif;margin:0;min-height:100vh;display:grid;place-items:center;background:#f7f7f5;color:#111}main{text-align:center;padding:2rem}nav{display:flex;gap:1rem;justify-content:center}a{color:inherit;padding:1rem 2rem;border:1px solid;border-radius:.5rem}a:focus-visible{outline:3px solid #555;outline-offset:4px}</style></head>
<body><main><h1>Binzomah Cosmetics</h1><p>Choose your language <span lang="ar" dir="rtl">/ اختر لغتك</span></p>
<nav aria-label="Language"><a data-locale="en" href="${base}/en" lang="en">English</a><a data-locale="ar" href="${base}/ar" lang="ar" dir="rtl">العربية</a></nav>
</main></body></html>`
}
