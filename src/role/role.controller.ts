import { Controller, Post } from '@nestjs/common';
import { RoleService } from './role.service';
import { CreateRoleRequestDto } from './dto/request/createRoleRequest.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Role } from './entities/role.entity';
import { Role as RoleGuard } from '../auth/decorator/role-based-access-control.decorator';
import { UserRole } from './enum/user-role';

@ApiTags('권한')
@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'role 생성',
    description: 'UserRole 에 해당하는 Role 을 생성한다. ',
  })
  @ApiResponse({
    status: 201,
    type: Role,
  })
  @ApiResponse({
    status: 400,
  })
  @RoleGuard(UserRole.ADMIN)
  @Post()
  createRole(createRoleDto: CreateRoleRequestDto) {
    return this.roleService.createRole(createRoleDto);
  }
}
