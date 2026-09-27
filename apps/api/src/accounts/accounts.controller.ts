import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Connected Accounts')
@Controller('accounts')
export class AccountsController {}
