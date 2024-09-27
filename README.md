
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
$ docker-compose --build
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
