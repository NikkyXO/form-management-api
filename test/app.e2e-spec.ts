import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { UserService } from '../src/services/user.service';
import { FieldType } from '../src/models/form.model';
import { Account } from '../src/models/account.model';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let moduleFixture: TestingModule;
  let userService: UserService;
  let userId: string;
  let accounts: Account[];
  let newForm: any;
  let formId: string;

  beforeAll(async () => {
    moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    userService = moduleFixture.get<UserService>(UserService);
    const users = await userService.findAll();

    if (users.length === 0) {
      throw new Error(
        'No users found in the database. Make sure seeding is working correctly.',
      );
    }
    userId = users[0]._id;
    accounts = users;
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Form Operations', () => {
    it('should create a new form', async () => {
      newForm = {
        title: 'Testing Form Creation',
        description: 'This is a test form',
        fields: [
          {
            name: 'Question1',
            type: FieldType.TEXT,
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
            type: FieldType.TEXT,
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
            type: FieldType.TEXT,
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
      };

      const response = await request(app.getHttpServer())
        .post('/forms')
        .send(newForm)
        .expect(201);
      const data = response.body.data;
      expect(response.body.success).toBe(true);
      expect(data.title).toBe('Testing Form Creation');
      formId = response.body.data['_id'];
    });

    it('should retrieve the created form', async () => {
      const response = await request(app.getHttpServer())
        .get(`/forms/${formId}`)
        .expect(200);
      expect(response.body._id).toBe(formId);
      expect(response.body.title).toBe('Testing Form Creation');
    });

    it('should update the form', async () => {
      const response = await request(app.getHttpServer())
        .put(`/forms/${formId}`)
        .send({
          title: 'Updated Test Form',
          description: 'This is an updated test form',
          fields: [
            {
              name: 'Q1',
              type: FieldType.TEXT,
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
            { name: 'Q2', type: FieldType.CHECKBOX, required: true },
            {
              name: 'Q3',
              type: FieldType.CHECKBOX,
              required: true,
              options: [],
            },
          ],
          createdBy: userId,
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
    it('should submit a response to the form', async () => {
      const formResponses = [
        {
          name: 'Q1',
          answers: 'john@example.com',
        },
        {
          name: 'Q2',
          answers: 'john@example.com',
        },
        {
          name: 'Q3',
          answers: 'john@example.com',
        },
      ];
      const response = await request(app.getHttpServer())
        .post('/submissions')
        .send({
          formId: formId,
          responses: formResponses,
          accountId: userId,
        })
        .expect(201);
      expect(response.body).toHaveProperty('_id');
      expect(response.body.form).toBe(formId);
    });

    it('should retrieve submissions for a form', async () => {
      const response = await request(app.getHttpServer())
        .get(`/submissions/${formId}`)
        .expect(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });
});
