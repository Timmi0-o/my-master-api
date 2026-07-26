import { JSONSchemaType } from 'ajv';
import { BugReportDeviceType } from 'src/modules/bug-reports/domain/entities/bug-report';
import type { ICreateBugReportPayload } from './create-bug-report-payload.types';

const deviceInfoSchema = {
  type: 'object' as const,
  properties: {
    viewport: { type: 'string' as const, minLength: 1 },
    screen: { type: 'string' as const, minLength: 1 },
    devicePixelRatio: { type: 'string' as const, minLength: 1 },
    platform: { type: 'string' as const, minLength: 1 },
    language: { type: 'string' as const, minLength: 1 },
    timezone: { type: 'string' as const, minLength: 1 },
    touchSupport: { type: 'string' as const, minLength: 1 },
    userAgent: { type: 'string' as const, minLength: 1 },
  },
  required: [
    'viewport',
    'screen',
    'devicePixelRatio',
    'platform',
    'language',
    'timezone',
    'touchSupport',
    'userAgent',
  ] as const,
  additionalProperties: false as const,
};

export const createBugReportPayloadSchema: JSONSchemaType<ICreateBugReportPayload> =
  {
    type: 'object',
    properties: {
      title: { type: 'string', minLength: 3, maxLength: 200 },
      description: { type: 'string', minLength: 10, maxLength: 5000 },
      replyEmail: {
        type: 'string',
        nullable: true,
        maxLength: 254,
      },
      deviceType: {
        type: 'string',
        enum: Object.values(BugReportDeviceType),
      },
      pageUrl: { type: 'string', minLength: 1, maxLength: 2048 },
      appVersion: { type: 'string', minLength: 1, maxLength: 64 },
      locale: {
        type: 'string',
        nullable: true,
        maxLength: 32,
      },
      deviceInfo: deviceInfoSchema,
    },
    required: [
      'title',
      'description',
      'deviceType',
      'pageUrl',
      'appVersion',
      'deviceInfo',
    ],
    additionalProperties: false,
  };
