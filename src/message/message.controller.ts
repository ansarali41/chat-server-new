import {
  Body,
  Controller,
  Delete,
  NotAcceptableException,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Req } from '@nestjs/common/decorators';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { HttpStatusCode } from 'axios';
import { Request } from 'express';
import { AUTHORIZATION } from 'src/lib/constant';
import { AuthGuard } from 'src/user/auth.guard';
import { CreateMessageDto } from './base/dto/createMessage.dto';
import { Message } from './base/entity/message.entity';
import { CreateMessageResponse } from './base/swagger-ui/create-message-response';
import { MessageService } from './message.service';
import { UpdateMessageDto } from './base/dto/updateMessaage.dto';

@ApiTags('Message')
@UseGuards(AuthGuard)
@Controller('message')
@ApiBearerAuth(AUTHORIZATION)
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  //@UseGuards(new RoleGuard('message.create'))
  @Post()
  @ApiOperation({
    summary: 'Create',
  })
  @ApiCreatedResponse({
    status: 201,
    description: `{"message": "New message is created."}`,
    type: CreateMessageResponse,
  })
  @ApiUnauthorizedResponse({
    status: 401,
    description: `{statusCode": 401,
    "message": "Authorization header is missing or token is not inserted",
    "error": "Unauthorized}`,
  })
  async createMessage(
    @Body() createMessageDto: CreateMessageDto,
    @Req() request: Request,
  ) {
    try {
      const userId = request['authUser'].id;
      const { business_id, app_id } = request['authUser'];

      const message = await this.messageService.createMessage(
        createMessageDto,
        userId,
        business_id,
        app_id,
      );

      return {
        statusCode: HttpStatusCode.Created,
        message: 'New message is created.',
        data: message,
      };
    } catch (error) {
      throw error;
    }
  }

  // @UseGuards(RoleGuard('message.view'))
  @Post('findOne')
  @ApiOperation({
    summary: 'Get one',
  })
  @ApiCreatedResponse({
    status: 200,
    description: `{"message": "Success"}`,
    type: CreateMessageResponse,
  })
  @ApiUnauthorizedResponse({
    status: 401,
    description: `{statusCode": 401,
    "message": "Authorization header is missing or token is not inserted",
    "error": "Unauthorized"}`,
  })
  @ApiNotFoundResponse({
    status: 401,
    description: `{statusCode": 401,
    "message": "Sorry, we were unable to find the chat with the provided information. Please double-check the information you entered and try again. If you continue to experience issues, please contact our support team for assistance.",
    "error": "Not found"}`,
  })
  async findOneMessage(@Body() body: Message, @Req() request: Request) {
    try {
      const { business_id, app_id } = request['authUser'];

      const message = await this.messageService.findOneMessageWithMedia({
        ...body,
        app_id,
        business_id,
      });

      return {
        statusCode: HttpStatusCode.Ok,
        message: 'success',
        data: message,
      };
    } catch (error) {
      throw error;
    }
  }

  //@UseGuards(RoleGuard('message.view-all'))
  @Post('/all')
  @ApiOperation({
    summary: 'Get all',
  })
  @ApiCreatedResponse({
    status: 200,
    description: `{"message": "Success"}`,
    type: [CreateMessageResponse],
  })
  @ApiUnauthorizedResponse({
    status: 401,
    description: `{statusCode": 401,
    "message": "Authorization header is missing or token is not inserted",
    "error": "Unauthorized}`,
  })
  @ApiQuery({ name: 'offset', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  // @ApiQuery({ name: 'start_date', required: false, type: String })
  // @ApiQuery({ name: 'end_date', required: false, type: String })
  async findAllMessages(
    @Body() body: Message,
    @Req() request: Request,
    @Query('offset') offset = 0,
    @Query('limit') limit = 20,
    // @Query('start_date') startDate?: string,
    // @Query('end_date') endDate?: string,
  ) {
    const { business_id, app_id } = request['authUser'];

    try {
      const res = await this.messageService.findAllMessages(
        body,
        offset,
        limit,
        business_id,
        app_id,
      );

      return {
        statusCode: HttpStatusCode.Ok,
        message: 'success',
        total_items: res.total,
        data: res.data,
      };
    } catch (error) {
      throw error;
    }
  }

  //@UseGuards(new RoleGuard('message.edit'))
  @Put('update/:id')
  @ApiOperation({
    summary: 'Update isRead status',
  })
  @ApiCreatedResponse({
    status: 200,
    description: `{"message": "Your chat has been updated successfully"}`,
    type: CreateMessageResponse,
  })
  @ApiBadRequestResponse({
    status: 400,
    description: `{statusCode": 401,
    "message": "Chat with id 1 is not found",
    "error": "Bad Request}`,
  })
  @ApiUnauthorizedResponse({
    status: 401,
    description: `{statusCode": 400,
    "message": "Authorization header is missing or token is not inserted",
    "error": "Unauthorized}`,
  })
  async update(
    @Param('id') id: number,
    @Body() body: UpdateMessageDto,
    @Req() request: Request,
  ) {
    try {
      // const userId = request['authUser'].id;
      const { business_id, app_id } = request['authUser'];
      // const userToken = request.headers['authorization'];

      const result = await this.messageService.update(
        id,
        app_id,
        business_id,
        body,
      );

      if (result.affected === 0) {
        throw new NotFoundException(
          `Chat with appId ${app_id}, businessId ${business_id}`,
        );
      }
      if (result.affected >= 1) {
        return {
          statusCode: HttpStatusCode.Ok,
          message: 'Chat Updated Successfully!',
        };
      }
      return true;
    } catch (error) {
      throw error;
    }
  }

  //@UseGuards(RoleGuard('message.delete'))
  @Delete('delete/:id')
  @ApiOperation({
    summary: 'Soft delete',
  })
  @ApiCreatedResponse({
    status: 200,
    description: `{"message": "Your Chat has been deleted successfully"}`,
  })
  @ApiBadRequestResponse({
    status: 400,
    description: `{statusCode": 401,
    "message": "Chat with id 1 is not found",
    "error": "Bad Request}`,
  })
  @ApiUnauthorizedResponse({
    status: 401,
    description: `{statusCode": 400,
    "message": "Authorization header is missing or token is not inserted",
    "error": "Unauthorized}`,
  })
  async soft_delete(@Param('id') id: number, @Req() request: Request) {
    try {
      const userId = request['authUser'].id;
      const { business_id } = request['authUser'];

      const res = await this.messageService.soft_delete(
        id,
        business_id,
        userId,
      );

      if (res.isDeleted) {
        return {
          statusCode: HttpStatusCode.Ok,
          message: 'Message deleted Successfully!',
        };
      }
      return {
        statusCode: HttpStatusCode.BadRequest,
        message: 'Message deletion unsuccessful!',
      };
    } catch (error) {
      throw error;
    }
  }

  //@UseGuards(RoleGuard('message.delete'))
  @Delete('hard/delete/:id')
  @ApiOperation({
    summary: 'hard delete',
  })
  @ApiCreatedResponse({
    status: 200,
    description: `{"message": "Your message has been deleted successfully"}`,
  })
  @ApiBadRequestResponse({
    status: 400,
    description: `{statusCode": 401,
    "message": "Chat with id 1 is not found",
    "error": "Bad Request}`,
  })
  @ApiUnauthorizedResponse({
    status: 401,
    description: `{statusCode": 400,
    "message": "Authorization header is missing or token is not inserted",
    "error": "Unauthorized}`,
  })
  async hardDelete(@Param('id') id: number, @Req() request: Request) {
    try {
      // const userId = request['authUser'].id;
      const { business_id, app_id } = request['authUser'];

      const result = await this.messageService.hardDelete(
        id,
        business_id,
        app_id,
      );

      if (result.affected === 0) {
        throw new NotAcceptableException('Chat not found or already deleted');
      } else if (result.affected >= 1) {
        return {
          statusCode: HttpStatusCode.Ok,
          message: 'Chat deleted Successfully!',
        };
      }
    } catch (error) {
      throw error;
    }
  }
}
