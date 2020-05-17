import { EncryptService } from './encrypt.service';
import { User } from './../models/user.interface';

import { Model } from 'mongoose';
import { Injectable, Body} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UserDto } from './../models/dto/user.dto';

@Injectable()
export class DatabaseService {
  constructor(@InjectModel('User') private readonly userModel: Model<User>, private encryptService: EncryptService) {}

  async create(userDto: UserDto): Promise<User> {
    // const exist = this.find
    userDto.steamid = this.encryptService.decrypt(userDto.steamid);
    const createdUser = new this.userModel(userDto);
    return createdUser.save();
  }

  async find(id: string): Promise<User> {
    return this.userModel.findOne({steamid: this.encryptService.decrypt(id)});
  };

}
