import { JSONSchemaType } from 'ajv';
import { idSchema } from '@shared/presentation/http/validation/schemas/common.schemas';
import type {
  ICallAnswerPayload,
  ICallIdPayload,
  ICallOfferPayload,
  IInviteCallPayload,
} from './call-payload.types';

export const inviteCallPayloadSchema: JSONSchemaType<IInviteCallPayload> = {
  type: 'object',
  properties: {
    chatId: idSchema,
    media: { type: 'string', enum: ['audio', 'video'] },
  },
  required: ['chatId', 'media'],
  additionalProperties: false,
};

export const callIdPayloadSchema: JSONSchemaType<ICallIdPayload> = {
  type: 'object',
  properties: {
    callId: idSchema,
  },
  required: ['callId'],
  additionalProperties: false,
};

export const callOfferPayloadSchema: JSONSchemaType<ICallOfferPayload> = {
  type: 'object',
  properties: {
    callId: idSchema,
    sdp: {
      type: 'object',
      properties: {
        type: {
          type: 'string',
          enum: ['offer', 'answer', 'pranswer', 'rollback'],
        },
        sdp: { type: 'string', nullable: true },
      },
      required: ['type'],
      additionalProperties: true,
    },
  },
  required: ['callId', 'sdp'],
  additionalProperties: false,
};

export const callAnswerPayloadSchema: JSONSchemaType<ICallAnswerPayload> = {
  type: 'object',
  properties: {
    callId: idSchema,
    sdp: {
      type: 'object',
      properties: {
        type: {
          type: 'string',
          enum: ['offer', 'answer', 'pranswer', 'rollback'],
        },
        sdp: { type: 'string', nullable: true },
      },
      required: ['type'],
      additionalProperties: true,
    },
  },
  required: ['callId', 'sdp'],
  additionalProperties: false,
};

export const callIcePayloadSchema = {
  type: 'object',
  properties: {
    callId: idSchema,
    candidate: {
      anyOf: [
        { type: 'null' },
        {
          type: 'object',
          additionalProperties: true,
        },
      ],
    },
  },
  required: ['callId', 'candidate'],
  additionalProperties: false,
} as const;
