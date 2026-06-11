/**
 * Curriculum ingestion script — outline only.
 *
 * Run with:  npx tsx scripts/ingest/ingest-curriculum.ts
 * Requires:  NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local
 *
 * When documents are ready to ingest, implement each step below.
 */

import { createClient } from '@supabase/supabase-js'
import type { Database, CurriculumDocumentInsert } from '../../src/types/database'

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient<Database>(supabaseUrl, serviceRoleKey)

// ---------------------------------------------------------------------------
// Step 1 — Locate source files
// ---------------------------------------------------------------------------
// Place raw curriculum PDFs/Word docs inside scripts/ingest/source-documents/
// (this folder is .gitignored — documents are not committed to the repo)
//
// Example file naming convention:
//   english-year-7-8-reading.pdf
//   english-year-9-10-writing.pdf

async function getSourceFiles(): Promise<string[]> {
  // TODO: Use fs.readdirSync('scripts/ingest/source-documents') to list files
  throw new Error('Not implemented — add source documents first')
}

// ---------------------------------------------------------------------------
// Step 2 — Parse / chunk each document
// ---------------------------------------------------------------------------
// Extract text from PDFs using a library such as `pdf-parse` or `pdfjs-dist`.
// Chunk the extracted text at a meaningful boundary (e.g., one chunk per
// curriculum achievement objective or sub-element).
//
// Each chunk becomes one row in curriculum_documents.

async function parseDocument(_filePath: string): Promise<CurriculumDocumentInsert[]> {
  // TODO:
  // 1. Read file buffer
  // 2. Extract text (pdf-parse, pdfjs-dist, or mammoth for .docx)
  // 3. Split into chunks aligned with NZ curriculum structure
  // 4. Map each chunk to CurriculumDocumentInsert shape:
  //    { subject, year_level, phase, strand, element, sub_element,
  //      title, content, source_file, page_number, metadata }
  throw new Error('Not implemented')
}

// ---------------------------------------------------------------------------
// Step 3 — Upsert into Supabase
// ---------------------------------------------------------------------------
// Use upsert (or insert with onConflict) so the script is re-runnable.
// Conflict target: (source_file, page_number, title) — adjust as needed.

async function upsertDocuments(rows: CurriculumDocumentInsert[]): Promise<void> {
  const BATCH_SIZE = 100

  for (let i = 0; i < rows.length; i += BATCH_SIZE) {
    const batch = rows.slice(i, i + BATCH_SIZE)

    const { error } = await supabase
      .from('curriculum_documents')
      .upsert(batch, { onConflict: 'source_file, title' })

    if (error) {
      console.error(`Batch ${i / BATCH_SIZE + 1} failed:`, error.message)
      throw error
    }

    console.log(`Inserted batch ${i / BATCH_SIZE + 1} (${batch.length} rows)`)
  }
}

// ---------------------------------------------------------------------------
// Step 4 — Verify search vector population
// ---------------------------------------------------------------------------

async function verifyIngestion(): Promise<void> {
  const { count, error } = await supabase
    .from('curriculum_documents')
    .select('id', { count: 'exact', head: true })

  if (error) throw error
  console.log(`Verification: ${count} curriculum_documents rows present`)
}

// ---------------------------------------------------------------------------
// Entrypoint
// ---------------------------------------------------------------------------

async function main() {
  console.log('Starting curriculum ingestion...')

  const files = await getSourceFiles()
  console.log(`Found ${files.length} source file(s)`)

  const allRows: CurriculumDocumentInsert[] = []

  for (const file of files) {
    console.log(`Parsing: ${file}`)
    const rows = await parseDocument(file)
    allRows.push(...rows)
  }

  console.log(`Parsed ${allRows.length} chunks — upserting...`)
  await upsertDocuments(allRows)
  await verifyIngestion()

  console.log('Ingestion complete.')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
