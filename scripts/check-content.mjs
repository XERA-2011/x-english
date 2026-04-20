import {readdirSync, readFileSync, statSync, existsSync} from 'node:fs';
import {resolve, dirname, extname} from 'node:path';

const ROOT = process.cwd();
const TARGET_DIRS = ['docs', 'src/pages'];
const MARKDOWN_EXTS = new Set(['.md', '.mdx']);
const LOCAL_EXT_CANDIDATES = ['.md', '.mdx', '.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp', '.ico'];

const files = [];
for (const dir of TARGET_DIRS) {
  walk(resolve(ROOT, dir), files);
}

const errors = [];

for (const file of files) {
  const raw = readFileSync(file, 'utf8');
  const normalized = raw.replace(/\r\n/g, '\n');
  const hasFrontMatterTitle = /^---\n[\s\S]*?\ntitle:\s*.+\n[\s\S]*?\n---\n?/m.test(normalized);
  const body = stripFrontMatter(normalized);
  const hasH1 = /^#\s+\S+/m.test(body);

  if (!hasFrontMatterTitle && !hasH1) {
    errors.push(`${relative(file)}: missing top-level title (front matter title or H1).`);
  }

  const links = [...normalized.matchAll(/!?\[[^\]]*]\(([^)\s]+)(?:\s+"[^"]*")?\)/g)];
  for (const match of links) {
    const target = match[1].trim();
    if (isExternalOrAnchor(target)) {
      continue;
    }

    const clean = target.split('#')[0].split('?')[0];
    if (!clean) {
      continue;
    }

    const sourceDir = dirname(file);
    if (!isResolvable(sourceDir, clean)) {
      errors.push(`${relative(file)}: unresolved local link "${target}".`);
    }
  }
}

if (errors.length > 0) {
  console.error('Content quality check failed:\n');
  for (const err of errors) {
    console.error(`- ${err}`);
  }
  process.exit(1);
}

console.log(`Content quality check passed (${files.length} files checked).`);

function walk(dir, bucket) {
  if (!existsSync(dir)) {
    return;
  }
  for (const entry of readdirSync(dir)) {
    const fullPath = resolve(dir, entry);
    const stat = statSync(fullPath);
    if (stat.isDirectory()) {
      walk(fullPath, bucket);
      continue;
    }
    if (MARKDOWN_EXTS.has(extname(fullPath))) {
      bucket.push(fullPath);
    }
  }
}

function stripFrontMatter(content) {
  if (!content.startsWith('---\n')) {
    return content;
  }
  const end = content.indexOf('\n---\n', 4);
  if (end === -1) {
    return content;
  }
  return content.slice(end + 5);
}

function isExternalOrAnchor(target) {
  return (
    target.startsWith('#') ||
    target.startsWith('/') ||
    target.startsWith('http://') ||
    target.startsWith('https://') ||
    target.startsWith('mailto:') ||
    target.startsWith('tel:')
  );
}

function isResolvable(sourceDir, target) {
  const base = resolve(sourceDir, target);
  if (existsSync(base)) {
    return true;
  }

  if (!extname(base)) {
    for (const ext of LOCAL_EXT_CANDIDATES) {
      if (existsSync(`${base}${ext}`)) {
        return true;
      }
    }
    for (const ext of MARKDOWN_EXTS) {
      if (existsSync(resolve(base, `index${ext}`))) {
        return true;
      }
    }
  }

  return false;
}

function relative(absPath) {
  return absPath.replace(`${ROOT}/`, '');
}
