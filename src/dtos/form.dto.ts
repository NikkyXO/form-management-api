import {
  //   IsNotEmpty,
  IsString,
  IsArray,
  ValidateNested,
  IsObject,
  IsEnum,
  IsUUID,
  IsBoolean,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { FieldType } from '../models/form.model';

class FormFieldDto {
  @ApiProperty()
  @IsString()
  name?: string;

  @ApiProperty({ enum: FieldType })
  @IsEnum(FieldType)
  type?: FieldType;

  @ApiProperty()
  @IsBoolean()
  required?: boolean;

  @ApiProperty({ type: [Object], example: [{ A: 'Tonero' }, { B: 'Bonero' }] })
  @IsObject({ each: true })
  options?: Record<string, any>[];
}

export class CreateFormDto {
  @ApiProperty()
  @IsString()
  title?: string;

  @ApiProperty()
  @IsString()
  description?: string;

  @ApiProperty({ type: [FormFieldDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FormFieldDto)
  fields?: FormFieldDto[];

  @ApiProperty({
    type: 'string',
    format: 'uuid',
    example: '97e065ba-fc74-412d-a976-ad3082c30e56',
  })
  @IsUUID()
  createdBy?: string;
}
