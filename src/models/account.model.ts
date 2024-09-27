import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

// import { IsEmail, isEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from 'src/types';
export type AccountDocument = Account & Document;

@Schema({
  timestamps: true,
  versionKey: undefined,
  toJSON: {
    getters: true,
    aliases: true,
    virtuals: true,
  },
})
export class Account extends BaseEntity {
  @ApiProperty({ type: String })
  @Prop({
    default: () => null,
  })
  phone: string;

  @ApiProperty({ type: String })
  @Prop({
    default: () => null,
  })
  email: string;

  @Prop({
    required: false,
    default: () => 'NG',
  })
  country: string;

  @Prop({
    text: true,
  })
  firstName: string;

  @Prop({
    text: true,
  })
  @ApiProperty()
  lastName: string;
}

export const AccountSchema = SchemaFactory.createForClass(Account);

AccountSchema.virtual('name').get(function (this: AccountDocument) {
  return [this.firstName, this.lastName].filter(Boolean).join(' ');
});
