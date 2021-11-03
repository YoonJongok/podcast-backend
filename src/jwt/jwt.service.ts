import { Inject, Injectable } from '@nestjs/common';
import { CONFIG_OPTIONS } from './jwt.constants';
import * as jwt from 'jsonwebtoken';
import { JwtModuleOptions } from './jwt.interfaces';
@Injectable()
export class JwtService {
  constructor(
    @Inject(CONFIG_OPTIONS) private readonly options: JwtModuleOptions,
  ) {}
  sign(userId: number): string {
    try {
      return jwt.sign({ id: userId }, this.options.privateKey);
    } catch (error) {}
  }

  verify(token: string) {
    try {
      return jwt.verify(token, this.options.privateKey);
    } catch (error) {}
  }
}
