import { ApiProperty } from '@nestjs/swagger';

export class CreateChatDto {
  @ApiProperty()
  readonly asset_id: number;

  @ApiProperty()
  readonly topic_id: number;

  @ApiProperty()
  readonly topic: string;

  @ApiProperty()
  readonly receiver_id: number;
}
