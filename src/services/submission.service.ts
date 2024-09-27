import {
  Injectable,
  //   NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Submission, SubmissionDocument } from 'src/models/submission.model';
import { FormService } from './form.service';
import { CreateSubmissionDto } from 'src/dtos/submission.dto';

@Injectable()
export class SubmissionService {
  constructor(
    @InjectModel(Submission.name)
    private submissionModel: Model<SubmissionDocument>,
    private formService: FormService,
  ) {}

  async create(createSubmissionDto: CreateSubmissionDto): Promise<Submission> {
    try {
      const form = await this.formService.findOne(createSubmissionDto.formId);

      // Validate required fields
      for (const field of form.fields) {
        if (field.required && !createSubmissionDto.responses[field.name]) {
          throw new BadRequestException(`Field "${field.name}" is required`);
        }
      }

      const createdSubmission = new this.submissionModel({
        form: form._id,
        responses: createSubmissionDto.responses,
      });

      await this.formService.incrementSubmissionCount(form._id);

      return createdSubmission.save();
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  async findByForm(formId: string): Promise<Submission[]> {
    const form = await this.formService.findOne(formId);
    return this.submissionModel.find({ form: form._id }).exec();
  }

  async submitFormResponses(
    createSubmissionDto: CreateSubmissionDto,
  ): Promise<Submission> {
    try {
      const form = await this.formService.findOne(createSubmissionDto.formId);

      for (const field of form.fields) {
        if (field.required && !createSubmissionDto.responses[field.name]) {
          throw new BadRequestException(`Field "${field.name}" is required`);
        }
      }

      const existingSubmission = await this.submissionModel.findOne({
        form: form._id,
        account: createSubmissionDto.accountId,
      });
      if (existingSubmission) {
        existingSubmission.responses = {
          ...existingSubmission.responses,
          ...createSubmissionDto.responses, // Merge existing responses with new ones
        };
        existingSubmission.submittedAt = new Date();
        return existingSubmission.save();
      } else {
        const createdSubmission = new this.submissionModel({
          form: form._id,
          account: createSubmissionDto.accountId,
          responses: createSubmissionDto.responses,
          submittedAt: new Date(),
        });
        return createdSubmission.save();
      }
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  async fetchUserFormSubmission(
    formId: string,
    accountId: string,
  ): Promise<Submission> {
    return this.submissionModel
      .findOne({ form: formId, account: accountId })
      .exec();
  }

  async fetchAllFormSubmission(formId: string): Promise<Submission[]> {
    return this.submissionModel.find({ form: formId }).exec();
  }

  async fetchAllSubmission(): Promise<Submission[]> {
    return this.submissionModel.find().exec();
  }
}
