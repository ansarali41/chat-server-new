import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateChatDto } from './base/dto/createChat.dto';
import { Chat } from './base/entity/chat.entity';
import { ChatStatus } from 'src/lib/constant';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Chat)
    private chatRepository: Repository<Chat>,
  ) {}

  async createChat(
    createChatDto: CreateChatDto,
    userId: number,
    business_id: number,
    app_id: number,
  ): Promise<Chat> {
    try {
      // client TODO:!new chat ,if same asset ,topic_id ,topic, status: pending,
      //1st find the chat if exist

      const chat = await this.chatRepository.findOne({
        where: {
          ...createChatDto,
          sender_id: userId,
          status: ChatStatus.PENDING,
          business_id: business_id,
          app_id: app_id,
        },
      });

      if (chat) {
        return chat;
      }

      // if chat not exit then create the chat
      const newChatObj = await this.chatRepository.create({
        ...createChatDto,
        sender_id: userId,
        user_id: userId, //client id
        business_id: business_id,
        app_id: app_id,
        createdBy: userId,
      });
      return await this.chatRepository.save(newChatObj);
    } catch (error) {
      throw error;
    }
  }

  async findOneChat(options: any) {
    try {
      const chat = await this.chatRepository.findOne({
        where: { ...options, isDeleted: false },
      });

      if (!chat) {
        throw new NotFoundException(`Chat Not found`);
      }

      return chat;
    } catch (error) {
      throw error;
    }
  }

  async findOneChatWithBody(options: any) {
    try {
      const chat = await this.chatRepository.findOne({
        where: { ...options, isDeleted: 0 },
      });

      if (!chat) {
        throw new NotFoundException(`Chat Not found`);
      }

      return chat;
    } catch (error) {
      throw error;
    }
  }

  // async findUserChats(): Promise<Chat[]> {
  //   return await this.chatRepository.find();
  // }

  async findAllChats(
    options: Chat,
    offset: number,
    limit: number,
    business_id: number,
    app_id: number,
  ) {
    const [results, total] = await this.chatRepository.findAndCount({
      where: {
        ...options,
        business_id,
        app_id,
        isDeleted: false,
      },
      skip: offset,
      take: limit,
      order: {
        createdAt: 'DESC',
      },
    });
    return {
      results,
      total,
    };
  }

  async update(
    id: number,
    app_id: number,
    business_id: number,
    body: any,
    userId: number,
  ): Promise<any> {
    try {
      // chat status update
      return await this.chatRepository
        .createQueryBuilder()
        .update()
        .set({ ...body, updatedAt: new Date(), updatedBy: userId })
        .where('id = :id', { id: id })
        .andWhere('app_id = :app_id', { app_id: app_id })
        .andWhere('business_id = :business_id', { business_id: business_id })
        .andWhere('isDeleted = :isDeleted', { isDeleted: false })
        .execute();
    } catch (error) {
      throw error;
    }
  }

  // TODO: hard delete (with message)
  async soft_delete(
    chatId: number,
    businessId: number,
    appId: number,
    userId: number,
  ): Promise<any> {
    try {
      const chat = await this.findOneChat({
        id: chatId,
        business_id: businessId,
        app_id: appId,
        isDeleted: 0,
      });

      if (!chat) {
        throw new NotFoundException(
          `Chat with Business ID ${businessId}, and App ID ${appId} not found`,
        );
      }

      // TODO: also delete all messages and message media of this chat

      chat.isDeleted = true;
      chat.deletedAt = new Date();
      chat.updatedBy = userId;
      chat.updatedAt = new Date();
      chat.deletedBy = userId;

      return await this.chatRepository.save(chat);
    } catch (error) {
      throw error;
    }
  }

  async hardDelete(
    chatId: number,
    businessId: number,
    appId: number,
  ): Promise<any> {
    try {
      const chat = await this.findOneChat({
        id: chatId,
        business_id: businessId,
        app_id: appId,
      });

      if (!chat) {
        throw new NotFoundException(
          `Chat with Business ID ${businessId}, and App ID ${appId} not found`,
        );
      }

      // TODO: hard delete (with messages and message media)
      return await this.chatRepository.delete({
        id: chatId,
        business_id: businessId,
        app_id: appId,
      });
    } catch (error) {
      throw error;
    }
  }
}
