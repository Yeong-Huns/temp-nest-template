import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Role } from './entities/role.entity';
import { CreateRoleRequestDto } from './dto/request/createRoleRequest.dto';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  async createRole(createRoleRequestDto: CreateRoleRequestDto) {
    return await this.roleRepository.save(createRoleRequestDto);
  }
}
