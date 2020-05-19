import { EncryptService } from './encrypt.service';
import { User } from './../models/user.interface';

import { Model } from 'mongoose';
import { Injectable, Body, Logger} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UserDto } from './../models/dto/user.dto';

@Injectable()
export class DatabaseService {
  constructor(@InjectModel('User') private readonly userModel: Model<User>, private encryptService: EncryptService) {}
  private readonly logger = new Logger(DatabaseService.name);
  async create(userDto: UserDto): Promise<User> {
    // userDto.steamid = this.encryptService.decrypt(userDto.steamid);
    const createdUser = new this.userModel(userDto);
    return createdUser.save();
  }

  async update(userDto: UserDto): Promise<User> {
    const decryptedId = this.encryptService.decrypt(userDto.steamid);
    return this.userModel.updateOne({steamid: decryptedId}, {completedGames: userDto.completedGames});
  }

  async find(id: string) {
    id = this.encryptService.decrypt(id);
    this.logger.log(`Trying to find user with id: ${id}`)
    return this.userModel.findOne({steamid: id});
  };

}
