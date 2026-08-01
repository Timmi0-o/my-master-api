import { Global, Module } from '@nestjs/common';
import { TEMPLATE_RENDERER_TOKEN } from '@shared/domain/templating';
import { HandlebarsTemplateRenderer } from './handlebars-template.renderer';

@Global()
@Module({
  providers: [
    {
      provide: TEMPLATE_RENDERER_TOKEN,
      useClass: HandlebarsTemplateRenderer,
    },
  ],
  exports: [TEMPLATE_RENDERER_TOKEN],
})
export class TemplatingModule {}
