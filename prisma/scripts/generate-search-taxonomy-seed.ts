import 'dotenv/config';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { collectMasterCatalogTagsByCategory } from '../seeds/masters-catalog';
import { CURATED_SEARCH_TAXONOMY } from '../seeds/search-taxonomy/curated-search-taxonomy';
import {
  buildSearchTaxonomySeedEntries,
  type AbramovDictionary,
} from '../seeds/search-taxonomy/build-search-taxonomy';

function resolveDictionaryPath(): string {
  const candidates = [
    path.join(process.cwd(), '..', 'synonym_dictionary', 'dictionary.json'),
    path.join(process.cwd(), 'synonym_dictionary', 'dictionary.json'),
    path.join(__dirname, '../../../synonym_dictionary/dictionary.json'),
  ];

  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) {
      return candidate;
    }
  }

  throw new Error(
    `Abramov dictionary.json not found. Tried:\n${candidates.join('\n')}`,
  );
}

function main(): void {
  const dictionaryPath = resolveDictionaryPath();
  const dictionary = JSON.parse(
    fs.readFileSync(dictionaryPath, 'utf8'),
  ) as AbramovDictionary;

  const entries = buildSearchTaxonomySeedEntries({
    curated: CURATED_SEARCH_TAXONOMY,
    catalogTags: collectMasterCatalogTagsByCategory(),
    dictionary,
  });

  const outDir = path.join(__dirname, '../seeds/data');
  fs.mkdirSync(outDir, { recursive: true });

  const outPath = path.join(outDir, 'search-taxonomy.json');
  const payload = {
    generatedAt: new Date().toISOString(),
    source: {
      dictionary: path.relative(process.cwd(), dictionaryPath),
      author: dictionary.author ?? 'Н. Абрамов',
      title:
        dictionary.title ??
        'Словарь русских синонимов и сходных по смыслу выражений',
      license: 'MIT (synonym_dictionary)',
    },
    entries,
  };

  fs.writeFileSync(outPath, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');

  const aliasCount = entries.reduce(
    (sum, entry) => sum + entry.aliases.length,
    0,
  );
  console.log(
    `Wrote ${entries.length} canonical tags / ${aliasCount} aliases -> ${outPath}`,
  );
}

main();
