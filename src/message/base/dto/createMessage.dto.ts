import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsUrl,
  ValidateIf,
} from 'class-validator';

export class CreateMessageDto {
  @ApiProperty()
  @IsNotEmpty()
  readonly chat_id: number;

  @ApiProperty()
  @IsNotEmpty()
  readonly sender_id: number;

  @ApiProperty()
  @IsIn([0, 1, 2, 3, 4, 5])
  @IsNotEmpty()
  readonly type: number;

  @ApiProperty()
  readonly text?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsArray()
  @ValidateIf((obj) => obj.type >= 2 && obj.type <= 5)
  @IsUrl({}, { each: true })
  readonly urls?: string[];
}
