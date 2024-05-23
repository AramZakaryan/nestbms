import { Module } from '@nestjs/common'
import { AuthService } from './auth.service'
import { UserModule } from '../user/user.module'
import { PassportModule } from '@nestjs/passport'

@Module({
  imports: [
    UserModule,
    // PassportModule,
    // JwtModule.registerAsync({
    //   imports: [ConfigModule],
    //   inject: [ConfigService],
    //   useFactory: (configService: ConfigService) => ({
    //     secret: configService.get('JWT_SECRET'),
    //     signOptions: { expiresIn: '30d' },
    //   }),
    // }),
  ],
  providers: [
    AuthService,
    // ,LocalStrategy, JwtStrategy
  ],
})
export class AuthModule {}
