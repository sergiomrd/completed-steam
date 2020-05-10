import { UserService } from './../services/user.service';
import { Controller, Get, Param } from '@nestjs/common';
import { map } from 'rxjs/operators';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':name')
  getUserIdByName(@Param('name') name) {
    return this.userService.getUserSteamId(name).pipe(map(response => response.data['response']));
  }
}
