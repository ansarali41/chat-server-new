import { ApiProperty } from '@nestjs/swagger';

export class CreateChatResponse {
  @ApiProperty()
  id: number;

  @ApiProperty()
  first_id: number;

  @ApiProperty()
  second_id: number;

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
  isPublish: boolean;

  @ApiProperty()
  isRead: boolean;
}
