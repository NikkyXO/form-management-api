import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateFormDto } from '../dtos/form.dto';
import { ResponseDTO } from '../dtos/response.dto';
import { Form } from '../models/form.model';
import { FormService } from '../services/form.service';
import { UserService } from '../services/user.service';

@ApiTags('Forms')
@Controller('forms')
export class FormController {
  constructor(
    private readonly formService: FormService,
    private readonly userServide: UserService,
  ) {}

  @Post()
  async create(
    @Body() createFormDto: CreateFormDto,
  ): Promise<ResponseDTO<{ form: Form; message: string }>> {
    return await this.formService.create(createFormDto);
  }

  @Get()
  async findAll(): Promise<Form[]> {
    return this.formService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Form> {
    return this.formService.findOne(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateFormDto: CreateFormDto,
  ): Promise<Form> {
    return this.formService.update(id, updateFormDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<{ message: string }> {
    return this.formService.removeForm(id);
  }
}
