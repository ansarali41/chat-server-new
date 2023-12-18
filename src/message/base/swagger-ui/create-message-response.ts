import { ApiProperty } from '@nestjs/swagger';

export class CreateMessageResponse {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  text: string;

  @ApiProperty()
  type: string;

  @ApiProperty()
  app_id: number;

  @ApiProperty()
  business_id: number;

  @ApiProperty()
  user_id: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  createdBy: number;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  updatedBy: number;

  @ApiProperty()
  isDeleted: number;

  @ApiProperty()
  deletedAt: Date;

  @ApiProperty()
  deletedBy: number;

  @ApiProperty()
  isRead: boolean;
}
