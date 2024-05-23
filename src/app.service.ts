import { Injectable } from '@nestjs/common'

@Injectable()
export class AppService {
  getHello(): string {
    return `Welcome to Book Management System Api!
      Please go to path 'docs' for documentations`
  }
}
