import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Account, AccountDocument } from '../models/account.model';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);
  constructor(
    @InjectModel(Account.name) private userModel: Model<AccountDocument>,
  ) {}

  async findAll(): Promise<Account[]> {
    return this.userModel.find().exec();
  }

  async findOne(id: string): Promise<Account> {
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new NotFoundException(`Users with ID ${id} not found`);
    }
    return user;
  }
}
