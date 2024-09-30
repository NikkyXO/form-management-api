
## Form Management System API
###  Description
<p><b>This project is a NestJS-based API for a Form Management System. It allows users to create, update, delete, and retrieve forms, as well as submit responses to these forms.
Features<b></p>

 - Form CRUD operations
 - Form response submission
 - Basic form validation
 - Error handling
 - Basic analytics (submission count)
 - API documentation using Swagger

### Prerequisites

 - Node.js (v16)
 - MongoDB
 - Docker (optional)


### Setup and Installation

#### Clone the repository:
```bash
  git clone https://github.com/NikkyXO/form-management-api.git
  cd form-management-api
```

#### Install dependencies:
```bash
$ npm install
``` 

#### Set up environment variables:
 - Create a .env file in the root directory and add the following:
 - Copy MONGODB_URI=mongodb://localhost/form-management

####  Start MongoDB:
 - Make sure your MongoDB server is running.
 - Run the application:
```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod



## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```





**The API will be available at http://localhost:3000.**

#### API Documentation
**Once the application is running, you can access the Swagger API documentation at: http://localhost:3000/api**
<p>
This provides a detailed overview of all available endpoints and allows you to test them directly from the browser.
</p>

#### Docker
To run the application using Docker:

####  Build the Docker image:
```bash
$ docker-compose up build
```

#### Run the container:
```bash
$ docker-compose up 
```


#### Contributing
<p>Contributions are welcome! Please feel free to submit a Pull Request.</p>

#### License
This project is licensed under the MIT License.



// DEADLINE: by September 30th, 2024

docker-compose up --build

docker-compose down



import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { Connection } from 'mongoose';
import { getConnectionToken } from '@nestjs/mongoose';

describe('Form Management System API (e2e)', () => {
  let app: INestApplication;
  let moduleFixture: TestingModule;
  let mongoConnection: Connection;

  beforeAll(async () => {
    moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    mongoConnection = moduleFixture.get<Connection>(getConnectionToken());
  });

  afterAll(async () => {
    await mongoConnection.dropDatabase();
    await mongoConnection.close();
    await app.close();
  });

  describe('Form Operations', () => {
    let formId: string;

    it('should create a new form', async () => {
      const response = await request(app.getHttpServer())
        .post('/forms')
        .send({
          title: 'Test Form',
          description: 'This is a test form',
          fields: [
            { name: 'name', type: 'text', required: true },
            { name: 'email', type: 'email', required: true },
            { name: 'age', type: 'number', required: false },
          ],
          createdBy: 'test@example.com',
        })
        .expect(201);

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
});