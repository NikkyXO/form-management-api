import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateFormDto } from '../dtos/form.dto';
import { Form, FormDocument } from '../models/form.model';
import { UserService } from './user.service';
import { ResponseDTO, successfulResponse } from '../dtos/response.dto';

@Injectable()
export class FormService {
  private readonly logger = new Logger(FormService.name);
  constructor(
    @InjectModel(Form.name) private formModel: Model<FormDocument>,
    private readonly userService: UserService,
  ) {}

  async create(
    createFormDto: CreateFormDto,
  ): Promise<ResponseDTO<{ data: Form; message: string }>> {
    try {
      const creator = await this.userService.findOne(createFormDto.createdBy);
      if (!creator) {
        throw new BadRequestException(
          `creator with id: ${createFormDto.createdBy} doesn't exist`,
        );
      }
      const createdForm = new this.formModel(createFormDto);
      console.log({ createdForm });
      await createdForm.save();
      return successfulResponse({
        data: createdForm,
        message: `Form successfully created`,
      });
    } catch (err) {
      console.log(err.message);
      throw new UnprocessableEntityException(err.message);
    }
  }

  async findAll(): Promise<Form[]> {
    try {
      return await this.formModel.find().exec();
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async findOne(id: string): Promise<Form> {
    try {
      return await this.formModel.findById(id).exec();
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async update(id: string, updateFormDto: CreateFormDto): Promise<Form> {
    try {
      const updatedForm = await this.formModel
        .findByIdAndUpdate(id, updateFormDto, { new: true })
        .exec();
      if (!updatedForm) {
        throw new NotFoundException(`Form with ID "${id}" not found`);
      }
      return updatedForm;
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  async removeForm(id: string): Promise<{ message: string }> {
    try {
      const deletedForm = await this.formModel.deleteOne({ id });
      if (!deletedForm) {
        throw new NotFoundException(`Form with ID "${id}" not found`);
      }
      return { message: 'message successfully deleted ' };
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  async incrementSubmissionCount(id: string): Promise<void> {
    await this.formModel
      .findByIdAndUpdate(id, { $inc: { submissionCount: 1 } })
      .exec();
  }
}
