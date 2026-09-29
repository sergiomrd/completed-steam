import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IUserRepository, User } from '../../domain';
import { UserDocument } from '../schemas/user.schema';

@Injectable()
export class MongoUserRepository implements IUserRepository {
  private readonly logger = new Logger(MongoUserRepository.name);

  constructor(
    @InjectModel('User')
    private readonly userModel: Model<UserDocument>
  ) {}

  async find(steamId: string): Promise<User | null> {
    this.logger.log(`Searching user with steamId: ${steamId}`);
    const doc = await this.userModel.findOne({ steamid: steamId }).exec();
    if (!doc) return null;
    return {
      id: doc._id?.toString(),
      steamid: doc.steamid,
      completedGames: doc.completedGames || [],
      creationDate: doc.creationDate,
      modificationDate: doc.modificationDate
    };
  }

  async create(user: User): Promise<User> {
    this.logger.log(`Creating user with steamId: ${user.steamid}`);
    const created = new this.userModel(user);
    const doc = await created.save();
    return {
      id: doc._id?.toString(),
      steamid: doc.steamid,
      completedGames: doc.completedGames || [],
      creationDate: doc.creationDate,
      modificationDate: doc.modificationDate
    };
  }

  async update(user: User): Promise<User | null> {
    this.logger.log(`Updating user with steamId: ${user.steamid}`);
    const now = new Date().toISOString();
    const doc = await this.userModel.findOneAndUpdate(
      { steamid: user.steamid },
      {
        $set: {
          completedGames: user.completedGames,
          modificationDate: user.modificationDate || now
        }
      },
      { new: true }
    ).exec();

    if (!doc) return null;
    return {
      id: doc._id?.toString(),
      steamid: doc.steamid,
      completedGames: doc.completedGames || [],
      creationDate: doc.creationDate,
      modificationDate: doc.modificationDate
    };
  }
}
