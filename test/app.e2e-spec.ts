import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { Connection } from 'mongoose';
import { AppModule } from './../src/app.module';
import { getConnectionToken } from '@nestjs/mongoose';
import { UserService } from '../src/services/user.service';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let moduleFixture: TestingModule;
  let mongoConnection: Connection;
  let userService: UserService;
  let userId: string;

  beforeAll(async () => {
    moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    console.log({ moduleFixture });

    app = moduleFixture.createNestApplication();
    await app.init();

    mongoConnection = moduleFixture.get<Connection>(getConnectionToken());

    userService = moduleFixture.get<UserService>(UserService);
    const users = await userService.findAll();
    if (users.length === 0) {
      throw new Error(
        'No users found in the database. Make sure seeding is working correctly.',
      );
    }
    userId = users[0]._id.toString();
  });

  afterAll(async () => {
    // await mongoConnection.dropDatabase();
    await mongoConnection.close();
    await app.close();
  });

  describe('Form Operations', () => {
    let formId: string;

    it('should create a new form', async () => {
      const response = await request(app.getHttpServer())
        .post('/forms')
        .send({
          title: 'Testing Form Creation',
          description: 'This is a test form',
          fields: [
            {
              name: 'Question1',
              type: 'text',
              required: true,
              options: [
                {
                  A: 'Tonero',
                },
                {
                  B: 'Bonero',
                },
              ],
            },
            {
              name: 'Question2',
              type: 'text',
              required: false,
              options: [
                {
                  A: 'Build',
                },
                {
                  B: 'Cement',
                },
              ],
            },
            {
              name: 'Question3',
              type: 'dropdown',
              required: false,
              options: [
                {
                  A: ['Temple', 'following', 'Indie'],
                },
                {
                  B: { place: 'lokoja' },
                },
              ],
            },
          ],
          createdBy: userId,
        })
        .expect(201);

      expect(response.body).toHaveProperty('title');
      expect(response.body).toHaveProperty('_id');
      expect(response.body.title).toBe('Test Form');
      formId = response.body._id;
    });

    it('should retrieve the created form', async () => {
      const response = await request(app.getHttpServer())
        .get(`/forms/${formId}`)
        .expect(200);

      expect(response.body._id).toBe(formId);
      expect(response.body.title).toBe('Test Form');
    });

    it('should update the form', async () => {
      const response = await request(app.getHttpServer())
        .put(`/forms/${formId}`)
        .send({
          title: 'Updated Test Form',
          description: 'This is an updated test form',
          fields: [
            { name: 'name', type: 'text', required: true },
            { name: 'email', type: 'email', required: true },
            { name: 'age', type: 'number', required: true },
          ],
          createdBy: 'test@example.com',
        })
        .expect(200);

      expect(response.body.title).toBe('Updated Test Form');
      expect(response.body.fields[2].required).toBe(true);
    });

    it('should list all forms', async () => {
      const response = await request(app.getHttpServer())
        .get('/forms')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });
  });

  describe('Submission Operations', () => {
    let formId: string;

    beforeAll(async () => {
      // Create a form for submissions
      const response = await request(app.getHttpServer())
        .post('/forms')
        .send({
          title: 'Submission Test Form',
          description: 'This is a test form for submissions',
          fields: [
            { name: 'name', type: 'text', required: true },
            { name: 'email', type: 'email', required: true },
          ],
          createdBy: 'test@example.com',
        });

      formId = response.body._id;
    });

    it('should submit a response to the form', async () => {
      const response = await request(app.getHttpServer())
        .post('/submissions')
        .send({
          formId: formId,
          responses: {
            name: 'John Doe',
            email: 'john@example.com',
          },
        })
        .expect(201);

      expect(response.body).toHaveProperty('_id');
      expect(response.body.form).toBe(formId);
    });

    it('should retrieve submissions for a form', async () => {
      const response = await request(app.getHttpServer())
        .get(`/submissions/form/${formId}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body[0].responses.name).toBe('John Doe');
    });

    it('should fail to submit an invalid response', async () => {
      await request(app.getHttpServer())
        .post('/submissions')
        .send({
          formId: formId,
          responses: {
            name: 'Jane Doe',
            // Missing required email field
          },
        })
        .expect(400);
    });
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });
});
