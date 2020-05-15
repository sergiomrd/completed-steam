import { User } from './../models/user.interface';

import { Model } from 'mongoose';
import { Injectable, Body} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UserDto } from './../models/dto/user.dto';

@Injectable()
export class DatabaseService {
  constructor(@InjectModel('User') private readonly userModel: Model<User>) {}

  async create(userDto: UserDto): Promise<User> {
    const createdUser = new this.userModel(userDto);
    return createdUser.save();
  }

  async find(id: string): Promise<User[]> {
      return this.userModel.find().exec();
  }

}
