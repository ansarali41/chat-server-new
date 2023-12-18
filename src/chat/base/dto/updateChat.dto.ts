import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { ChatStatus } from 'src/lib/constant';

export class UpdateChatDto {
  @ApiProperty()
  status: ChatStatus;

  @ApiProperty()
  @IsOptional()
  receiver_id?: number;
}
