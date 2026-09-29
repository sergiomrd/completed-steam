import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<UserDbModel>;

@Schema({ collection: 'users', timestamps: false })
export class UserDbModel {
  @Prop({ required: true, unique: true })
  steamid!: string;

  @Prop({ type: [String], default: [] })
  completedGames!: string[];

  @Prop()
  creationDate!: string;

  @Prop()
  modificationDate!: string;
}

export const UserSchema = SchemaFactory.createForClass(UserDbModel);
