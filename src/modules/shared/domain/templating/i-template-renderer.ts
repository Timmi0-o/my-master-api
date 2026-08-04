export interface ITemplateRenderer {
  renderFile(
    templateRelativePath: string,
    data: Record<string, unknown>,
  ): string;
  renderString(template: string, data: Record<string, unknown>): string;
}

export const TEMPLATE_RENDERER_TOKEN = Symbol('TEMPLATE_RENDERER_TOKEN');
