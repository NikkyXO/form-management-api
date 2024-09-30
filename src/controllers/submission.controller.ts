import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateSubmissionDto } from '../dtos/submission.dto';
import { Submission } from '../models/submission.model';
import { SubmissionService } from '../services/submission.service';

@ApiTags('Submissions')
@Controller('submissions')
export class SubmissionController {
  constructor(private readonly submissionService: SubmissionService) {}

  @Post()
  @ApiOkResponse({ type: Submission })
  @ApiOperation({
    summary: 'To make submission for a Form',
  })
  async submitForm(
    @Body() createSubmissionDto: CreateSubmissionDto,
  ): Promise<Submission> {
    return this.submissionService.submitFormResponses(createSubmissionDto);
  }

  @Get('/:formId/:accountId')
  @ApiOperation({
    summary: 'To fetch user submission for a Form',
  })
  @ApiOkResponse({ type: Submission })
  async findByForm(
    @Param('formId') formId: string,
    @Param('accountId') accountId: string,
  ): Promise<Submission> {
    return this.submissionService.fetchUserFormSubmission(formId, accountId);
  }

  @Get('/:formId')
  @ApiOperation({
    summary: 'To fetch all Form submission',
  })
  @ApiOkResponse({ type: [Submission] })
  async findFormSubmissions(
    @Param('formId') formId: string,
  ): Promise<Submission[]> {
    return this.submissionService.fetchAllFormSubmission(formId);
  }

  @Get('')
  @ApiOkResponse({ type: [Submission] })
  @ApiOperation({
    summary: 'To fetch all existing submissions',
  })
  async findAllSubmissions(): Promise<Submission[]> {
    return this.submissionService.fetchAllSubmission();
  }
}
