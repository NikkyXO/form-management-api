import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document } from 'mongoose';
import { BaseEntity } from 'src/types';

export enum FieldType {
  TEXT = 'text',
  DROPDOWN = 'dropdown',
  CHECKBOX = 'checkbox',
  //   MCQ = 'mcq',
}

export type FormDocument = Form & Document;

@Schema({
  timestamps: true,
  versionKey: undefined,
  toJSON: {
    getters: true,
    aliases: true,
    virtuals: true,
  },
})
export class FormField {
  @ApiProperty()
  @Prop({ required: true })
  name: string;

  @Prop({
    required: true,
    enum: Object.values(FieldType),
  })
  @ApiProperty()
  type: string;

  @Prop({ default: false })
  @ApiProperty()
  required: boolean;

  @Prop()
  @ApiProperty()
  options?: Record<string, any>[];
}

@Schema()
export class Form extends BaseEntity {
  @Prop({ required: true })
  @ApiProperty()
  title: string;

  @Prop()
  description: string;

  @Prop({ type: [FormField], required: true })
  @ApiProperty({ type: [FormField] })
  fields: FormField[];

  @Prop({ required: true })
  @ApiProperty()
  createdBy: string;

  @Prop({ default: 0 })
  @ApiProperty()
  submissionCount: number;

  @Prop({ type: Object, required: false })
  @ApiProperty()
  metadata: Record<string, any>;
}

export const FormSchema = SchemaFactory.createForClass(Form);
