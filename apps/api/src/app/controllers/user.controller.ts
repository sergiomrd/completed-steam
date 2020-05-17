import { UserDto } from './../models/dto/user.dto';
import { DatabaseService } from './../services/database.service';
import { UserService } from './../services/user.service';
import { Controller, Get, Param, Query, Post, Body, Put } from '@nestjs/common';
import { map } from 'rxjs/operators';

@Controller('user')
export class UserController {
  
  constructor(private readonly userService: UserService, private readonly  databaseService: DatabaseService) {}
  @Get()
  getUserInSteam(@Query('id') id) {
    return this.userService.getUserInfo(id).pipe(
      map(response => {
        if (response && response.data){
          return response.data['response'];
        } 
      })
    );
  }

  @Get(':id')
  async getUserById(@Param('id') id) {
    return await this.databaseService.find(id);
  }

  @Post('create')
  async create(@Body() createUserDto: UserDto) {
    return await this.databaseService.create(createUserDto['body']);
  }

  @Put('update')
  async update(@Body() updateUserDto: UserDto) {
    return await this.databaseService.update(updateUserDto['body']);
  }

}
