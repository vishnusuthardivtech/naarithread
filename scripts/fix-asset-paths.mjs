import { readFile, writeFile } from 'node:fs/promises'
import { glob } from 'node:fs/promises'
import path from 'node:path'

const projectRoot = process.cwd()

const replacements = [
  [/best seller(?=\/)/gi, 'best-seller'],
  [/best seller(?=\\)/gi, 'best-seller'],
  [/featured lehengas(?=\/)/gi, 'featured'],
  [/featured lehengas(?=\\)/gi, 'featured'],
  [/featured-lehengas(?=\/)/gi, 'featured'],
  [/featured-lehengas(?=\\)/gi, 'featured'],
  [/\/assets\/icon\//g, '/images/icons/'],
  [/\/assets\/banner\//g, '/images/banner/'],
  [/\/assets\/signature\//g, '/images/signature/'],
  [/\/assets\/best-seller\//g, '/images/best-seller/'],
  [/\/assets\/featured\//g, '/images/featured/'],
  [/\/assets\/featured-lehengas\//g, '/images/featured/'],
  [/\/assets\/ChatGPT Image Jan 6, 2026, 11_31_50 AM\.png/g, '/images/logo/naarithread-logo.png'],
  [/assets\\\\/g, 'assets/'],
]

const eligibleExtensions = new Set(['.js', '.jsx', '.ts', '.tsx', '.css', '.html', '.json'])

let updatedFiles = 0

for await (const entry of glob('src/**/*', { cwd: projectRoot })) {
  const extension = path.extname(entry)
  if (!eligibleExtensions.has(extension)) {
    continue
  }

  const filePath = path.join(projectRoot, entry)
  const original = await readFile(filePath, 'utf8')
  let next = original

  for (const [pattern, replacement] of replacements) {
    next = next.replace(pattern, replacement)
  }

  if (next !== original) {
    await writeFile(filePath, next, 'utf8')
    updatedFiles += 1
    console.log(`updated ${entry}`)
  }
}

console.log(`done: ${updatedFiles} file(s) updated`)
