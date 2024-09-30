import { Controller, Get, Param } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Account } from '../models/account.model';
import { UserService } from '../services/user.service';

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('user/:userId')
  @ApiOperation({
    summary: 'To fetch a User by Id',
  })
  async findById(@Param('userId') userId: string): Promise<Account> {
    return this.userService.findOne(userId);
  }

  @Get()
  @ApiOperation({
    summary: 'To fetch all seeded users',
  })
  async fetchAll(): Promise<Account[]> {
    return this.userService.findAll();
  }
}
