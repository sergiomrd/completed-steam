import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema, MongoUserRepository, USER_REPOSITORY_TOKEN } from '../user';
import { CryptoJsEncryptionAdapter, ENCRYPTION_SERVICE_TOKEN } from '../security';
import * as dotenv from 'dotenv';
dotenv.config();

const MONGO_URI =
  process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/completed-steam';

@Module({
  imports: [
    MongooseModule.forRoot(MONGO_URI),
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }])
  ],
  providers: [
    MongoUserRepository,
    CryptoJsEncryptionAdapter,
    {
      provide: USER_REPOSITORY_TOKEN,
      useExisting: MongoUserRepository
    },
    {
      provide: ENCRYPTION_SERVICE_TOKEN,
      useExisting: CryptoJsEncryptionAdapter
    }
  ],
  exports: [
    MongoUserRepository,
    CryptoJsEncryptionAdapter,
    USER_REPOSITORY_TOKEN,
    ENCRYPTION_SERVICE_TOKEN
  ]
})
export class DatabaseModule {}