import { ApiProperty } from '@nestjs/swagger';

export class UpdateMessageDto {
  @ApiProperty()
  isRead: boolean;
}
