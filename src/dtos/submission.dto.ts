import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class Responses {
  @ApiProperty()
  name: string;

  @ApiProperty()
  answers: any;
}

export class CreateSubmissionDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  formId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  accountId: string;

  @ApiProperty({ type: [Responses] })
  @IsNotEmpty()
  @IsArray()
  responses: Responses[];
}
