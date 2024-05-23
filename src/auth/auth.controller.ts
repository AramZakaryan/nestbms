import { Controller, UseGuards, Request, Post } from '@nestjs/common'
import { AuthService } from './auth.service'
import { LocalAuthGuard } from './guards/local-auth.guard'

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req: any) {
    return req.user
    // return this.authService.login(req.user)
  }
  //
  // @UseGuards(JwtAuthGuard)
  // @Get('lala')
  // async() {
  //   return 'uraaa'
  // }
}
