import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { CreateSubmissionDto } from 'src/dtos/submission.dto';
import { Submission } from 'src/models/submission.model';
import { SubmissionService } from 'src/services/submission.service';

@ApiTags('Submissions')
@Controller('submissions')
export class SubmissionController {
  constructor(private readonly submissionService: SubmissionService) {}

  @Post()
  @ApiOkResponse({ type: Submission })
  async submitForm(
    @Body() createSubmissionDto: CreateSubmissionDto,
  ): Promise<Submission> {
    return this.submissionService.submitFormResponses(createSubmissionDto);
  }

  @Get('/:formId/:accountId')
  @ApiOkResponse({ type: Submission })
  async findByForm(
    @Param('formId') formId: string,
    @Param('accountId') accountId: string,
  ): Promise<Submission> {
    return this.submissionService.fetchUserFormSubmission(formId, accountId);
  }

  @Get('/:formId')
  @ApiOkResponse({ type: [Submission] })
  async findFormSubmissions(
    @Param('formId') formId: string,
  ): Promise<Submission[]> {
    return this.submissionService.fetchAllFormSubmission(formId);
  }

  @Get('')
  @ApiOkResponse({ type: [Submission] })
  async findAllSubmissions(): Promise<Submission[]> {
    return this.submissionService.fetchAllSubmission();
  }
}
