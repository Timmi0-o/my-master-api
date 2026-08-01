import { readFileSync, existsSync } from 'fs';
import path from 'path';
import Handlebars from 'handlebars';
import type { ITemplateRenderer } from '@shared/domain/templating';

const TEMPLATE_ROOT_CANDIDATES = [
  path.join(__dirname, '..', 'mailer', 'templates'),
  path.join(
    process.cwd(),
    'src',
    'modules',
    'shared',
    'infrastructure',
    'mailer',
    'templates',
  ),
  path.join(
    process.cwd(),
    'dist',
    'modules',
    'shared',
    'infrastructure',
    'mailer',
    'templates',
  ),
];

function resolveTemplatesRoot(): string {
  for (const candidate of TEMPLATE_ROOT_CANDIDATES) {
    if (existsSync(candidate)) {
      return candidate;
    }
  }
  return TEMPLATE_ROOT_CANDIDATES[0];
}

export class HandlebarsTemplateRenderer implements ITemplateRenderer {
  private readonly templatesRoot: string;
  private readonly fileCache = new Map<string, HandlebarsTemplateDelegate>();
  private readonly stringCache = new Map<string, HandlebarsTemplateDelegate>();

  constructor() {
    this.templatesRoot = resolveTemplatesRoot();
    Handlebars.registerHelper('eq', (a: unknown, b: unknown) => a === b);
  }

  renderFile(
    templateRelativePath: string,
    data: Record<string, unknown>,
  ): string {
    const normalized = templateRelativePath.replace(/^\.?[/\\]/, '');
    let compiled = this.fileCache.get(normalized);
    if (!compiled) {
      const absolutePath = path.join(this.templatesRoot, normalized);
      const source = readFileSync(absolutePath, 'utf8');
      compiled = Handlebars.compile(source, { noEscape: false });
      this.fileCache.set(normalized, compiled);
    }
    return compiled(data);
  }

  renderString(template: string, data: Record<string, unknown>): string {
    let compiled = this.stringCache.get(template);
    if (!compiled) {
      compiled = Handlebars.compile(template, { noEscape: false });
      this.stringCache.set(template, compiled);
    }
    return compiled(data);
  }
}
