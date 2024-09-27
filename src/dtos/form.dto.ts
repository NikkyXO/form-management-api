import {
  IsNotEmpty,
  IsString,
  IsArray,
  ValidateNested,
  IsObject,
  IsEnum,
  IsUUID,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { FieldType } from 'src/models/form.model';

class FormFieldDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ enum: FieldType })
  @IsNotEmpty()
  @IsEnum(FieldType)
  type: FieldType;

  @ApiProperty({ type: [Object], example: [{ A: 'Tonero' }, { B: 'Bonero' }] })
  @IsObject({ each: true })
  options?: Record<string, any>[];
}

export class CreateFormDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty({ type: [FormFieldDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FormFieldDto)
  fields: FormFieldDto[];

  @ApiProperty({
    type: 'string',
    format: 'uuid',
    example: '97e065ba-fc74-412d-a976-ad3082c30e56',
  })
  @IsNotEmpty()
  @IsUUID()
  createdBy: string;
}
