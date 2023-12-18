import {
  Body,
  Controller,
  NotAcceptableException,
  NotFoundException,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Delete, Put, Req } from '@nestjs/common/decorators';
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
import { CreateChatDto } from './base/dto/createChat.dto';
import { UpdateChatDto } from './base/dto/updateChat.dto';
import { Chat } from './base/entity/chat.entity';
import { CreateChatResponse } from './base/swagger-ui/create-chat-response';
import { ChatService } from './chat.service';

@ApiTags('Chat')
@UseGuards(AuthGuard)
@Controller('chat')
@ApiBearerAuth(AUTHORIZATION)
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  //@UseGuards(new RoleGuard('chat.add'))
  @Post()
  @ApiOperation({
    summary: 'Create',
  })
  @ApiCreatedResponse({
    status: 201,
    description: `{"message": "New chat is created."}`,
    type: CreateChatResponse,
  })
  @ApiUnauthorizedResponse({
    status: 401,
    description: `{statusCode": 401,
    "message": "Authorization header is missing or token is not inserted",
    "error": "Unauthorized}`,
  })
  async createChat(
    @Body() createChatDto: CreateChatDto,
    @Req() request: Request,
  ) {
    try {
      const userId = request['authUser'].id;
      const { business_id, app_id } = request['authUser'];

      const chat = await this.chatService.createChat(
        createChatDto,
        userId,
        business_id,
        app_id,
      );

      return {
        statusCode: HttpStatusCode.Created,
        message: 'New Chat is created.',
        data: chat,
      };
    } catch (error) {
      throw error;
    }
  }

  // @UseGuards(RoleGuard('chat.details'))
  @Post('findOne')
  @ApiOperation({
    summary: 'Get one',
  })
  @ApiCreatedResponse({
    status: 200,
    description: `{"message": "Success"}`,
    type: CreateChatResponse,
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
  async findOneChat(@Body() body: Chat, @Req() request: Request) {
    try {
      const { business_id, app_id } = request['authUser'];

      const chat = await this.chatService.findOneChatWithBody({
        ...body,
        app_id,
        business_id,
      });

      return {
        statusCode: HttpStatusCode.Ok,
        message: 'success',
        data: chat,
      };
    } catch (error) {
      throw error;
    }
  }

  //@UseGuards(RoleGuard('chat.all'))
  @Post('/all')
  @ApiOperation({
    summary: 'Get all',
  })
  @ApiCreatedResponse({
    status: 200,
    description: `{"message": "Success"}`,
    type: [CreateChatResponse],
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
  async findAllChats(
    @Body() body: Chat,
    @Req() request: Request,
    @Query('offset') offset = 0,
    @Query('limit') limit = 20,
    // @Query('start_date') startDate?: string,
    // @Query('end_date') endDate?: string,
  ) {
    const { business_id, app_id } = request['authUser'];

    try {
      const chats = await this.chatService.findAllChats(
        body,
        offset,
        limit,
        business_id,
        app_id,
      );

      return {
        statusCode: HttpStatusCode.Ok,
        message: 'success',
        total_items: chats.total,
        data: chats.results,
      };
    } catch (error) {
      throw error;
    }
  }

  //@UseGuards(new RoleGuard('chat.edit'))
  @Put('update/:id')
  @ApiOperation({
    summary: 'Update chat',
  })
  @ApiCreatedResponse({
    status: 200,
    description: `{"message": "Your chat has been updated successfully"}`,
    type: CreateChatResponse,
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
    @Body() updateChatDto: UpdateChatDto,
    @Req() request: Request,
  ) {
    try {
      const userId = request['authUser'].id;
      const { business_id, app_id } = request['authUser'];
      // const userToken = request.headers['authorization'];

      const result = await this.chatService.update(
        id,
        app_id,
        business_id,
        updateChatDto,
        userId,
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
    } catch (error) {
      throw error;
    }
  }

  //@UseGuards(RoleGuard('chat.delete'))
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
  async softDelete(@Param('id') id: number, @Req() request: Request) {
    try {
      const userId = request['authUser'].id;
      const { business_id, app_id } = request['authUser'];

      const res = await this.chatService.soft_delete(
        id,
        business_id,
        app_id,
        userId,
      );
      if (res.isDeleted) {
        return {
          statusCode: HttpStatusCode.Ok,
          message: 'Chat deleted Successfully!',
        };
      }
      return {
        statusCode: HttpStatusCode.BadRequest,
        message: 'Chat deletion unsuccessful!',
      };
    } catch (error) {
      throw error;
    }
  }

  //@UseGuards(RoleGuard('chat.delete'))
  @Delete('hard/delete/:id')
  @ApiOperation({
    summary: 'hard delete',
  })
  @ApiCreatedResponse({
    status: 200,
    description: `{"message": "Your chat has been deleted successfully"}`,
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

      const result = await this.chatService.hardDelete(id, business_id, app_id);

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
