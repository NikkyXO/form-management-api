import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { configuration } from './config';
import { UserSeederService } from './models/user-seeder.service';
import { FormService } from './services/form.service';
import { SubmissionService } from './services/submission.service';
import { Form, FormSchema } from './models/form.model';
import { Submission, SubmissionSchema } from './models/submission.model';
import { Account, AccountSchema } from './models/account.model';
import { SubmissionController } from './controllers/submission.controller';
import { FormController } from './controllers/form.controller';
import { UserService } from './services/user.service';
import { UserController } from './controllers/user.controller';

@Module({
  imports: [
    ConfigModule.forRoot(),
    // ConfigModule.forRoot({
    //   isGlobal: true,
    //   load: [configuration],
    //   envFilePath: '.env.fm',
    // }),
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
})
export class AppModule {
  constructor(private readonly userSeederService: UserSeederService) {}

  async onModuleInit() {
    await this.userSeederService.seed();
  }
}
