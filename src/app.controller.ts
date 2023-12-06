import { Controller, Get, Render } from '@nestjs/common';
import { AppService } from './app.service';
import * as mysql from 'mysql2';
import { NewAnimalDto } from './newAnimalDto';

const conn = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'zoo_test',
}).promise();

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Render('index')
  index() {
    return { message: 'Welcome to the homepage' };
  }
}
