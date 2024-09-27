import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FormController } from './controllers/form.controller';
import { SubmissionController } from './controllers/submission.controller';
import { UserController } from './controllers/user.controller';
import { UserSeederService } from './models/user-seeder.service';
import { FormService } from './services/form.service';
import { SubmissionService } from './services/submission.service';
import { UserService } from './services/user.service';
import { FieldType, Form, FormSchema } from './models/form.model';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { configuration } from './config';
import { MongooseModule } from '@nestjs/mongoose';
import { Submission, SubmissionSchema } from './models/submission.model';
import { Account, AccountSchema } from './models/account.model';
import mongoose from 'mongoose';

describe('AppController', () => {
  let appController: AppController;
  let formController: FormController;
  let submissionController: SubmissionController;
  let userController: UserController;
  let userId;
  let formId: string;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [
        // ConfigModule.forRoot(),
        ConfigModule.forRoot({
          isGlobal: true,
          load: [configuration],
          envFilePath: '.env.fm',
        }),
        MongooseModule.forFeature([
          { name: Submission.name, schema: SubmissionSchema },
          { name: Form.name, schema: FormSchema },
          { name: Account.name, schema: AccountSchema },
        ]),
        MongooseModule.forRootAsync({
          imports: [ConfigModule],
          useFactory: async (configService: ConfigService) => ({
            uri: configService.get<string>('mongoDBURI'),
          }),
          inject: [ConfigService],
        }),
      ],
      controllers: [
        AppController,
        SubmissionController,
        FormController,
        UserController,
      ],
      providers: [
        AppService,
        FormService,
        SubmissionService,
        UserSeederService,
        UserService,
      ],
    }).compile();

    appController = app.get<AppController>(AppController);
    formController = app.get<FormController>(FormController);
    submissionController = app.get<SubmissionController>(SubmissionController);
    userController = app.get<UserController>(UserController);

    const users = await userController.fetchAll();
    if (users.length === 0) {
      throw new Error(
        'No users found in the database. Make sure seeding is working correctly.',
      );
    }
    userId = users[0]._id.toString();
  });
  afterAll(async () => {
    await mongoose.disconnect();
  });

  describe('Form Operations', () => {
    it('should create a new form', async () => {
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
      const response = (await formController.create(newForm)) as any;
      expect(response.data).toHaveProperty('title');

      expect(response.data).toHaveProperty('title');
      expect(response.data).toHaveProperty('_id');
      expect(response.message).toEqual('Form successfully created');
      formId = response.data._id;
    });

    it('should retrieve the created form', async () => {
      const response = await formController.findOne(formId);
      expect(response._id).toBe(formId);
      expect(response.title).toBe('Testing Form Creation');
    });

    it('should update the form', async () => {
      const response = await formController.update(formId, {
        title: 'new title',
        description: 'new description',
      });
      expect(response.description).toBe('new description');
      expect(response.title).toBe('new title');
    });

    it('should list all forms', async () => {
      const response = await formController.findAll();
      expect(response.length).toBeGreaterThan(0);
    });
  });

  describe('Submit Form Operations', () => {
    const responses = [
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
    it('should submit a response to the form', async () => {
      const response = await submissionController.submitForm({
        formId,
        responses,
        accountId: userId,
      });
      expect(response).toHaveProperty('account');

      expect(response.account).toBe(userId);
      expect(response.responses).toBe(responses);
      expect(response.form).toBe(formId);
    });

    it('should retrieve  all submissions for the form', async () => {
      const response = await submissionController.findFormSubmissions(formId);
      expect(Array.isArray(response)).toBe(true);
      expect(response[0].responses.length).toBeGreaterThan(0);
    });

    it('should retrieve  user submissions for the form', async () => {
      const response = await submissionController.findByForm(formId, userId);
      console.log({ response });
      expect(response).toHaveProperty('form');
      expect(response).toHaveProperty('responses');
      expect(response).toHaveProperty('account');
    });
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(appController.getHello()).toBe('Hello World!');
    });
  });
});
