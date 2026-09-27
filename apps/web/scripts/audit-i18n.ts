import fs from 'node:fs';
import path from 'node:path';

const LOCALES_DIR = path.resolve(import.meta.dirname, '../src/locales');
const SRC_DIR = path.resolve(import.meta.dirname, '../src');
const SOURCE_LANG = 'en';

type NestedRecord = { [key: string]: string | NestedRecord };

function flattenKeys(obj: NestedRecord, prefix = ''): string[] {
  const keys: string[] = [];
  for (const [k, v] of Object.entries(obj)) {
    const full = prefix ? `${prefix}.${k}` : k;
    if (typeof v === 'object' && v !== null) {
      keys.push(...flattenKeys(v as NestedRecord, full));
    } else {
      keys.push(full);
    }
  }
  return keys;
}

function loadNamespace(lang: string, ns: string): NestedRecord | null {
  const filePath = path.join(LOCALES_DIR, lang, `${ns}.json`);
  if (!fs.existsSync(filePath)) return null;
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
}

function getLanguages(): string[] {
  return fs
    .readdirSync(LOCALES_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name);
}

function getNamespaces(lang: string): string[] {
  return fs
    .readdirSync(path.join(LOCALES_DIR, lang))
    .filter((f) => f.endsWith('.json'))
    .map((f) => f.replace('.json', ''));
}

function collectSourceKeys(): Map<string, Set<string>> {
  const used = new Map<string, Set<string>>();
  const tCallPattern = /\bt\(\s*['"]([^'"]+)['"]/g;
  const nsPattern = /useTranslation\(\s*['"]([^'"]+)['"]\s*\)/g;

  function walk(dir: string) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        if (entry.name === 'node_modules' || entry.name === 'locales' || entry.name === 'i18n')
          continue;
        walk(full);
      } else if (/\.(tsx?|jsx?)$/.test(entry.name) && !entry.name.endsWith('.d.ts')) {
        const content = fs.readFileSync(full, 'utf-8');

        let fileNs = 'common';
        const nsMatch = nsPattern.exec(content);
        if (nsMatch) fileNs = nsMatch[1];
        nsPattern.lastIndex = 0;

        let match: RegExpExecArray | null;
        while ((match = tCallPattern.exec(content)) !== null) {
          const key = match[1];
          const colonIdx = key.indexOf(':');
          let ns: string;
          let actualKey: string;
          if (colonIdx > 0) {
            ns = key.slice(0, colonIdx);
            actualKey = key.slice(colonIdx + 1);
          } else {
            ns = fileNs;
            actualKey = key;
          }
          if (!used.has(ns)) used.set(ns, new Set());
          used.get(ns)!.add(actualKey);
        }
        tCallPattern.lastIndex = 0;
      }
    }
  }

  walk(SRC_DIR);
  return used;
}

let exitCode = 0;
const languages = getLanguages();
const sourceNamespaces = getNamespaces(SOURCE_LANG);

const sourceKeys = new Map<string, string[]>();
for (const ns of sourceNamespaces) {
  const data = loadNamespace(SOURCE_LANG, ns);
  if (data) sourceKeys.set(ns, flattenKeys(data));
}

console.log(`Source language: ${SOURCE_LANG}`);
console.log(`Languages: ${languages.join(', ')}`);
console.log(`Namespaces: ${sourceNamespaces.join(', ')}\n`);

console.log('=== Key parity (each locale vs English) ===\n');

for (const lang of languages) {
  if (lang === SOURCE_LANG) continue;

  const langNs = getNamespaces(lang);
  const missingNs = sourceNamespaces.filter((ns) => !langNs.includes(ns));
  const extraNs = langNs.filter((ns) => !sourceNamespaces.includes(ns));

  if (missingNs.length) {
    console.log(`  [${lang}] missing namespaces: ${missingNs.join(', ')}`);
    exitCode = 1;
  }
  if (extraNs.length) {
    console.log(`  [${lang}] extra namespaces: ${extraNs.join(', ')}`);
    exitCode = 1;
  }

  for (const ns of sourceNamespaces) {
    const enKeys = sourceKeys.get(ns) ?? [];
    const data = loadNamespace(lang, ns);
    if (!data) continue;
    const langKeys = flattenKeys(data);

    const missing = enKeys.filter((k) => !langKeys.includes(k));
    const extra = langKeys.filter((k) => !enKeys.includes(k));

    if (missing.length) {
      console.log(`  [${lang}/${ns}] missing ${missing.length} keys: ${missing.join(', ')}`);
      exitCode = 1;
    }
    if (extra.length) {
      console.log(`  [${lang}/${ns}] extra ${extra.length} keys: ${extra.join(', ')}`);
      exitCode = 1;
    }
  }
}

if (exitCode === 0) {
  console.log('  All locales match English. No missing or extra keys.\n');
} else {
  console.log();
}

console.log('=== Usage audit (source code vs English keys) ===\n');

const usedKeys = collectSourceKeys();

for (const ns of sourceNamespaces) {
  const defined = new Set(sourceKeys.get(ns) ?? []);
  const used = usedKeys.get(ns) ?? new Set();

  const usedButMissing = [...used].filter((k) => !defined.has(k));
  const definedButUnused = [...defined].filter((k) => !used.has(k));

  if (usedButMissing.length) {
    console.log(`  [${ns}] used in code but missing from English: ${usedButMissing.join(', ')}`);
    exitCode = 1;
  }
  if (definedButUnused.length) {
    console.log(`  [${ns}] defined in English but not found in code: ${definedButUnused.join(', ')}`);
  }
}

if (exitCode === 0 && !usedKeys.size) {
  console.log('  No t() calls found in source files.\n');
} else {
  console.log();
}

process.exit(exitCode);
