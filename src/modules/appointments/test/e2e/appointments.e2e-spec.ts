import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, VersioningType } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from 'src/app.module';
import { ResponseInterceptor } from 'src/modules/shared/infrastructure/interceptors/response.interceptor';

const describeE2e = process.env.DATABASE_URL ? describe : describe.skip;

describeE2e('Appointments (e2e)', () => {
  let app: INestApplication<App> | undefined;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.enableVersioning({ type: VersioningType.URI, prefix: 'v' });
    app.useGlobalInterceptors(new ResponseInterceptor());
    await app.init();
  });

  afterAll(async () => {
    await app?.close();
  });

  it('GET /v1/master-profiles responds with envelope', () => {
    return request(app!.getHttpServer())
      .get('/v1/master-profiles')
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveProperty('result');
        expect(res.body.error).toBeNull();
      });
  });
});
