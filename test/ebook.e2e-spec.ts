import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { INestApplication } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import * as request from 'supertest';

describe('EbooksController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, MongooseModule.forRoot('mongodb://localhost/test')],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/ebooks (POST)', () => {
    return request(app.getHttpServer())
      .post('/ebooks')
      .send({
        title: 'Test Ebook',
        description: 'Testing ebook creation',
        rented: false,
      })
      .expect(201);
  });

  it('/ebooks (GET)', async () => {
    const createdEbook = await request(app.getHttpServer())
      .post('/ebooks')
      .send({
        title: 'Test Ebook',
        description: 'Testing ebook creation',
        rented: false,
      });

    const response = await request(app.getHttpServer()).get('/ebooks');
    const ebooks = response.body;

    expect(response.status).toBe(200);
    expect(ebooks).toContainEqual(createdEbook.body);
  });

  it('/ebooks/:id (GET)', async () => {
    const createdEbook = await request(app.getHttpServer())
      .post('/ebooks')
      .send({
        title: 'Test Ebook',
        description: 'Testing ebook creation',
        rented: false,
      });

    return request(app.getHttpServer())
      .get(`/ebooks/${createdEbook.body._id}`)
      .expect(200);
  });

  it('/ebooks/:id (PUT)', async () => {
    const createdEbook = await request(app.getHttpServer())
      .post('/ebooks')
      .send({
        title: 'Test Ebook',
        description: 'Testing ebook creation',
        rented: false,
      });

    return request(app.getHttpServer())
      .put(`/ebooks/${createdEbook.body._id}`)
      .send({
        title: 'Updated Ebook',
        description: 'Updated description',
        rented: true,
      })
      .expect(200);
  });

  it('/ebooks/:id (DELETE)', async () => {
    const createdEbook = await request(app.getHttpServer())
      .post('/ebooks')
      .send({
        title: 'Test Ebook',
        description: 'Testing ebook creation',
        rented: false,
      });

    return request(app.getHttpServer())
      .delete(`/ebooks/${createdEbook.body._id}`)
      .expect(200);
  });
});
