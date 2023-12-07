import { Body, Controller, Get, Post, Render, Res } from '@nestjs/common';
import { AppService } from './app.service';
import * as mysql from 'mysql2';
import { NewAnimalDto } from './newAnimalDto';
import { Response } from 'express';

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
    return { title: 'Állat felvétele', errors: [] };
  }

  @Post('/form')
  @Render('form')
  async formPost(@Body() newAnimal: NewAnimalDto, @Res() res: Response) {
    const errors: string[] = [];
    if (newAnimal.name.trim() === '') {
      errors.push('Adja meg az állat nevét!');
    }
    if (newAnimal.age <= 0 || isNaN(newAnimal.age)) {
      errors.push('Az állat életkora legalább 1 év kell legyen!');
    }

    if (errors.length > 0) {
      res.render('form', { title: 'Állat felvétele', errors });
    } else {
      const name: string = newAnimal.name;
      const age: number = newAnimal.age;
      const species: string = newAnimal.species;
      const [data] = await conn.execute('INSERT INTO animals (name, age, species) VALUES (?, ?, ?)', [name, age, species]);
      res.redirect('/');
    }
  }
}
