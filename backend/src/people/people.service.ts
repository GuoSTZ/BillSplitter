import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Person } from './person.entity';
import { CreatePersonDto, UpdatePersonDto } from './dto/person.dto';

@Injectable()
export class PeopleService {
  constructor(
    @InjectRepository(Person)
    private peopleRepository: Repository<Person>,
  ) {}

  async findAll(userId: number): Promise<Person[]> {
    return this.peopleRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number, userId: number): Promise<Person> {
    const person = await this.peopleRepository.findOne({
      where: { id, userId },
    });
    
    if (!person) {
      throw new NotFoundException('人员不存在');
    }
    
    return person;
  }

  async create(createPersonDto: CreatePersonDto, userId: number): Promise<Person> {
    const person = this.peopleRepository.create({
      ...createPersonDto,
      userId,
    });
    
    return this.peopleRepository.save(person);
  }

  async update(id: number, updatePersonDto: UpdatePersonDto, userId: number): Promise<Person> {
    const person = await this.findOne(id, userId);
    
    Object.assign(person, updatePersonDto);
    
    return this.peopleRepository.save(person);
  }

  async remove(id: number, userId: number): Promise<void> {
    const person = await this.findOne(id, userId);
    await this.peopleRepository.remove(person);
  }
}