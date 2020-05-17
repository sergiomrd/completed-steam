import { UserSchema } from './../models/schemas/user.schema';
import { DatabaseService } from './../services/database.service';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EncryptService } from '../services/encrypt.service';

@Module({
imports: [
MongooseModule.forRoot('mongodb+srv://marodiense:OrKg86Iwmgvxo99G@completed-steam-2qxtl.azure.mongodb.net/completed-steam?retryWrites=true&w=majority'), 
MongooseModule.forFeature([{ name: 'User', schema: UserSchema }])],
  providers: [ DatabaseService, EncryptService],
  exports: [ DatabaseService],
})
export class DatabaseModule {}