import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsObject, IsString } from 'class-validator';

export class CreateSubmissionDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  formId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  accountId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsArray()
  responses: Record<string, any>[];
}
