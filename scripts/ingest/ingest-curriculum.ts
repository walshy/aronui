// Must run before any import that reads process.env
import { config } from 'dotenv'
config({ path: '.env.local' })

import { readFileSync } from 'fs'
import { basename } from 'path'
import { extractChunks } from '../../src/lib/curriculum/chunking.js'
import { createAdminClient } from '../../src/lib/supabase/admin.js'

const FILES: Array<[path: string, yearLevel: number]> = [
  ['data/curriculum/raw/English–Yr7-Teaching-Sequence-.pdf',   7],
  ['data/curriculum/raw/English-Yr8-Teaching-Sequence-.pdf',   8],
  ['data/curriculum/raw/English-Yr9-Teaching-Sequence-.pdf',   9],
  ['data/curriculum/raw/English-Yr10-Teaching-Sequence-.pdf', 10],
]

const BATCH_SIZE = 20

async function ingestFile(filePath: string, yearLevel: number) {
  const supabase = createAdminClient()
  const sourceFile = basename(filePath)

  console.log(`\n── ${sourceFile} (Year ${yearLevel}) ──`)

  const buffer = readFileSync(filePath)
  const chunks = await extractChunks(buffer, yearLevel, sourceFile)
  console.log(`  Extracted: ${chunks.length} chunks`)

  // Idempotent: remove any existing rows for this source file before re-inserting
  const { error: delErr } = await supabase
    .from('curriculum_documents')
    .delete()
    .eq('source_file', sourceFile)
  if (delErr) throw new Error(`Delete failed: ${delErr.message}`)

  let inserted = 0
  for (let i = 0; i < chunks.length; i += BATCH_SIZE) {
    const batch = chunks.slice(i, i + BATCH_SIZE)
    const { error: insErr } = await supabase.from('curriculum_documents').insert(batch)
    if (insErr) throw new Error(`Insert failed at offset ${i}: ${insErr.message}`)
    inserted += batch.length
  }

  console.log(`  Inserted:  ${inserted} rows`)
}

async function main() {
  for (const [filePath, yearLevel] of FILES) {
    await ingestFile(filePath, yearLevel)
  }
  console.log('\nDone.')
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
