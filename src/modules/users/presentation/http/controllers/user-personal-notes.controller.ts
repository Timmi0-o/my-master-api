import { Controller, Get, Put, UseGuards } from '@nestjs/common';
import { AuthenticatedUser } from '@modules/auth/presentation/decorators/authenticated-user.decorator';
import { JwtAuthGuard } from '@modules/auth/presentation/guards/jwt-auth.guard';
import { Authorize } from '@modules/authorization/presentation/decorators/authorize.decorator';
import { AuthorizeGuard } from '@modules/authorization/presentation/guards/authorize.guard';
import { GetUserPersonalNoteByReferenceUseCase } from '@modules/users/application/use-cases/user-personal-note/get-user-personal-note-by-reference.use-case';
import { UpsertUserPersonalNoteUseCase } from '@modules/users/application/use-cases/user-personal-note/upsert-user-personal-note.use-case';
import { referenceUserIdParamSchema } from '@modules/users/presentation/http/validation/schemas/reference-user-id-param.schema';
import type { IReferenceUserIdParamPayload } from '@modules/users/presentation/http/validation/schemas/reference-user-id-param.types';
import { upsertUserPersonalNotePayloadSchema } from '@modules/users/presentation/http/validation/schemas/upsert-user-personal-note-payload.schema';
import type { IUpsertUserPersonalNotePayload } from '@modules/users/presentation/http/validation/schemas/upsert-user-personal-note-payload.types';
import type { IGetMetadata } from '@shared/domain/decorators/i-get-metadata';
import type { ISessionUser } from '@shared/domain/i-session-user';
import { GetMetadata } from '@shared/presentation/decorators/get-metadata';
import { HttpBody, HttpParams } from '@shared/presentation/http/decorators';
import { payloadToGetUserPersonalNoteByReferenceInput } from '../mappers/user-personal-note/payload-to-get-user-personal-note-by-reference-input';
import { payloadToUpsertUserPersonalNoteInput } from '../mappers/user-personal-note/payload-to-upsert-user-personal-note-input';
import { mapGetUserPersonalNoteByReferenceHttpResponse } from '../response/map-get-user-personal-note-by-reference-response';
import { mapUserPersonalNoteHttpResponse } from '../response/map-user-personal-note-http-response';

@Controller({ path: 'user-personal-notes', version: '1' })
@UseGuards(JwtAuthGuard, AuthorizeGuard)
@Authorize({ kind: 'authenticated' })
export class UserPersonalNotesController {
  constructor(
    private readonly getUserPersonalNoteByReferenceUseCase: GetUserPersonalNoteByReferenceUseCase,
    private readonly upsertUserPersonalNoteUseCase: UpsertUserPersonalNoteUseCase,
  ) {}

  @Get('by-reference/:referenceUserId')
  async getByReference(
    @HttpParams(referenceUserIdParamSchema, {
      errorMessage: 'Некорректный идентификатор пользователя',
    })
    params: IReferenceUserIdParamPayload,
    @AuthenticatedUser() user: ISessionUser,
    @GetMetadata() metadata: IGetMetadata,
  ) {
    const input = payloadToGetUserPersonalNoteByReferenceInput(
      params.referenceUserId,
      user,
      metadata.isStaffUser,
    );
    const item =
      await this.getUserPersonalNoteByReferenceUseCase.execute(input);
    return mapGetUserPersonalNoteByReferenceHttpResponse(item);
  }

  @Put()
  async upsert(
    @HttpBody(upsertUserPersonalNotePayloadSchema, {
      errorMessage: 'Некорректный payload личной заметки',
    })
    payload: IUpsertUserPersonalNotePayload,
    @AuthenticatedUser() user: ISessionUser,
    @GetMetadata() metadata: IGetMetadata,
  ) {
    const input = payloadToUpsertUserPersonalNoteInput(
      payload,
      user,
      metadata.isStaffUser,
    );
    const item = await this.upsertUserPersonalNoteUseCase.execute(input);
    return mapUserPersonalNoteHttpResponse(item);
  }
}
