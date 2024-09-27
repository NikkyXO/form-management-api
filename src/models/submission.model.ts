import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Form } from './form.model';
import { BaseEntity } from '../types';
import { ApiProperty } from '@nestjs/swagger';
import { Account } from './account.model';

export type SubmissionDocument = Submission & Document;

@Schema()
export class Submission extends BaseEntity {
  @Prop({ type: Types.ObjectId, ref: 'Form', required: true })
  @ApiProperty({ type: Form })
  form: Form;

  @Prop({ type: Object, required: true })
  @ApiProperty()
  responses: Record<string, any>;

  @Prop({ default: Date.now })
  @ApiProperty()
  submittedAt: Date;

  @ApiProperty()
  @Prop({ type: Types.ObjectId, ref: 'Account', required: true })
  account: Account;
}

export const SubmissionSchema = SchemaFactory.createForClass(Submission);
