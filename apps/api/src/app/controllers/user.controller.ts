import { UserService } from './../services/user.service';
import { Controller, Get, Param, Query } from '@nestjs/common';
import { map } from 'rxjs/operators';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  getUserById(@Query('id') id) {
    return this.userService.getUserInfo(id).pipe(map(response => response.data['response']));
  }

  @Get(':name')
  getUserIdByName(@Param('name') name) {
    return this.userService.getUserSteamId(name).pipe(map(response => response.data['response']));
  }
}
