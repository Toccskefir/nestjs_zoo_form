import { Body, Controller, Get, Post, Render } from '@nestjs/common';
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
  async index() {
    const [data] = await conn.execute('SELECT id, name, age, species FROM animals');
    return { title: 'Állatok', index: data };
  }

  @Get('/form')
  @Render('form')
  form() {
    return { title: 'Állat felvétele' };
  }

  @Post('/form')
  async formPost(@Body() newAnimal: NewAnimalDto) {
    const name: string = newAnimal.name;
    const age: number = newAnimal.age;
    const species: string = newAnimal.species;
    const [data] = await conn.execute('INSERT INTO animals (name, age, species) VALUES (?, ?, ?)', [name, age, species]);
    return {};
  }
}
