/**
 * One-shot prod seed for SearchCanonicalTag / SearchSynonym only.
 * Usage (inside app container):
 *   node prisma/scripts/seed-search-taxonomy-prod.mjs
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@prisma/client'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const normalize = (value) =>
	value.trim().toLowerCase().replaceAll('ё', 'е')

const connectionString = process.env.DATABASE_URL
if (!connectionString) {
	throw new Error('DATABASE_URL is required')
}

const filePath = path.join(__dirname, '../seeds/data/search-taxonomy.json')
if (!fs.existsSync(filePath)) {
	throw new Error(`Missing ${filePath}`)
}

const raw = JSON.parse(fs.readFileSync(filePath, 'utf8'))
const entries = raw.entries
if (!Array.isArray(entries) || entries.length === 0) {
	throw new Error(`search-taxonomy.json has no entries: ${filePath}`)
}

const prisma = new PrismaClient({
	adapter: new PrismaPg({ connectionString }),
})

let canonicalCount = 0
let synonymCount = 0

try {
	for (const entry of entries) {
		const canonicalValue = normalize(entry.value)
		const canonical = await prisma.searchCanonicalTag.upsert({
			where: { value: canonicalValue },
			create: {
				value: canonicalValue,
				category: entry.category,
			},
			update: {
				category: entry.category,
			},
		})
		canonicalCount += 1

		const aliases = [
			...new Set(
				(entry.aliases ?? [])
					.map(normalize)
					.filter((alias) => alias && alias !== canonicalValue),
			),
		]

		for (const alias of aliases) {
			await prisma.searchSynonym.upsert({
				where: { alias },
				create: {
					alias,
					canonicalTagId: canonical.id,
				},
				update: {
					canonicalTagId: canonical.id,
				},
			})
			synonymCount += 1
		}
	}

	const [tagsTotal, synonymsTotal] = await Promise.all([
		prisma.searchCanonicalTag.count(),
		prisma.searchSynonym.count(),
	])

	console.log(
		`search taxonomy seed done: upserted ${canonicalCount} canonicals, ${synonymCount} synonyms; totals tags=${tagsTotal} synonyms=${synonymsTotal}`,
	)
} finally {
	await prisma.$disconnect()
}
