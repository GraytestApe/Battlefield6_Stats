import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { dirname } from 'node:path'
import { dashboardDataSchema } from '../src/schema'

const __dirname = dirname(fileURLToPath(import.meta.url))
const dataFile = resolve(__dirname, '../data/api-data.json')

async function main() {
  const rawText = await readFile(dataFile, 'utf8')
  const rawJson: unknown = JSON.parse(rawText)
  const result = dashboardDataSchema.safeParse(rawJson)

  if (!result.success) {
    console.error('api-data.json failed schema validation:')
    console.error(result.error.format())
    process.exitCode = 1
    return
  }

  console.log('api-data.json passed schema validation.')
}

main().catch((error) => {
  console.error('Validation script failed:', error)
  process.exitCode = 1
})
