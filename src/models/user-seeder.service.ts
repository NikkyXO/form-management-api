import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { join } from 'path';
import * as fs from 'fs';
import { Model } from 'mongoose';
import { Account } from './account.model';

const baseDir = process.cwd();
const seederFilePath = join(baseDir, 'src/models/user.json');

@Injectable()
export class UserSeederService {
  private readonly logger = new Logger(UserSeederService.name);
  constructor(
    @InjectModel(Account.name)
    private userModel: Model<Account>,
  ) {}

  async seed() {
    this.logger.debug('Seeding initial currency data...');
    const filePath = seederFilePath;
    const jsonData = fs.readFileSync(filePath, 'utf-8');
    const userData = JSON.parse(jsonData);

    for (const data of userData) {
      const existingUser = await this.userModel.findOne({
        email: data.email,
      });

      if (!existingUser) {
        await this.userModel.create(data);
      }
    }

    this.logger.debug('Currency data seeding completed...');
  }
}
