import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Workspaces')
@Controller('workspaces')
export class WorkspacesController {}
