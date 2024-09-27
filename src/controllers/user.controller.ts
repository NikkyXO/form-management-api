import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Account } from '../models/account.model';
import { UserService } from '../services/user.service';

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('user/:userId')
  async findById(@Param('userId') userId: string): Promise<Account> {
    return this.userService.findOne(userId);
  }

  @Get()
  async fetchAll(): Promise<Account[]> {
    return this.userService.findAll();
  }
}
