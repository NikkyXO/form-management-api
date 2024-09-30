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

    userId = users[0]._id.toString();
    accounts = users;
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Form Operations', () => {
    let formId: string;
    const newForm = {
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
    console.log({ userId });
    console.log({ accounts });

    it('should create a new form', async () => {
      const response = await request(app.getHttpServer())
        .post('/forms')
        .send(newForm)
        .expect(201);
      console.log({ newForm: response });
      expect(response.body).toHaveProperty('title');
      expect(response.body).toHaveProperty('_id');
      expect(response.body.title).toBe('Testing Form Creation');
      formId = response.body._id;
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
          createdBy: accounts[0]._id,
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
      const newForm = {
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
        .send(newForm);

      formId = response.body._id;
    });

    it('should submit a response to the form', async () => {
      const formResponses = [
        {
          name: 'Question1',
          answers: 'john@example.com',
        },
        {
          name: 'Question2',
          answers: 'john@example.com',
        },
        {
          name: 'Question3',
          answers: 'john@example.com',
        },
      ];
      const response = await request(app.getHttpServer())
        .post('/submissions')
        .send({
          formId: formId,
          responses: formResponses,
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
      expect(response.body[0].responses.name).toBe('Question1');
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
