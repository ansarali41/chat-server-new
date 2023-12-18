import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ChatService } from 'src/chat/chat.service';
import { MessageTypes } from 'src/lib/constant';
import { Repository } from 'typeorm';
import { CreateMessageDto } from './base/dto/createMessage.dto';
import { MessageMedia } from './base/entity/message-media.entity';
import { Message } from './base/entity/message.entity';
import { UpdateMessageDto } from './base/dto/updateMessaage.dto';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(Message)
    private messageRepository: Repository<Message>,
    @InjectRepository(MessageMedia)
    private messageMediaRepository: Repository<MessageMedia>,
    private readonly chatService: ChatService,
  ) {}

  async createMessage(
    createMessageDto: CreateMessageDto,
    userId: number,
    business_id: number,
    app_id: number,
  ): Promise<any> {
    try {
      //1st find the chat if exist and is resolved
      await this.chatService.findOneChat({
        id: createMessageDto.chat_id,
        business_id,
        app_id,
        // status: ChatStatus.RESOLVED,
      });

      // if chat exist then create message
      const newMessageObj = await this.messageRepository.create({
        ...createMessageDto,
        business_id: business_id,
        app_id: app_id,
        createdBy: userId,
      });
      const newMessage = await this.messageRepository.save(newMessageObj);

      // create media column based on message type

      let messagesWithMedia = [];
      if (
        createMessageDto.type == MessageTypes.MEDIA ||
        createMessageDto.type == MessageTypes.FILE ||
        createMessageDto.type == MessageTypes.AUDIO
      ) {
        // create media column based on url length
        messagesWithMedia = await Promise.all(
          createMessageDto?.urls?.map(async (url) => {
            const newMediaObj = await this.messageMediaRepository.create({
              ...createMessageDto,
              message_id: newMessage.id,
              url: url,
              business_id: business_id,
              app_id: app_id,
              createdBy: userId,
            });
            const newMessageWithMessage =
              await this.messageMediaRepository.save(newMediaObj);
            return { ...newMessageWithMessage };
          }),
        );
      }

      return {
        ...newMessage,
        media_data: messagesWithMedia,
      };
    } catch (error) {
      throw error;
    }
  }

  async findOneMessageWithMedia(options: any) {
    try {
      const message = await this.messageRepository.findOne({
        where: { ...options, isDeleted: false },
      });
      if (!message) {
        throw new NotFoundException(`Message Not found`);
      }

      const messageWithMedia = await this.messageMediaRepository.find({
        where: {
          chat_id: message.chat_id,
          message_id: message.id,
          isDeleted: false,
        },
      });

      return { ...message, media_data: messageWithMedia };
    } catch (error) {
      throw error;
    }
  }

  async findOneMessage(options: any) {
    try {
      const message = await this.messageRepository.findOne({
        where: { ...options, isDeleted: false },
      });
      if (!message) {
        throw new NotFoundException(`Message Not found`);
      }

      return message;
    } catch (error) {
      throw error;
    }
  }

  async findAllMessages(
    options: Message,
    offset: number,
    limit: number,
    business_id: number,
    app_id: number,
  ) {
    try {
      const [results, total] = await this.messageRepository.findAndCount({
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

      // return the messages with media data
      let messagesWithMedia = [];
      if (results.length) {
        messagesWithMedia = await Promise.all(
          results.map(async (message) => {
            const data = await this.messageMediaRepository.find({
              where: {
                message_id: message.id,
                chat_id: message.chat_id,
                isDeleted: false,
              },
            });

            return { ...message, media_data: data };
          }),
        );
      }

      return { data: messagesWithMedia, total };
    } catch (error) {
      throw error;
    }
  }

  async update(
    id: number,
    app_id: number,
    business_id: number,
    body: UpdateMessageDto,
  ): Promise<any> {
    try {
      return await this.messageRepository
        .createQueryBuilder()
        .update()
        .set({ ...body })
        .where('id = :id', { id: id })
        .andWhere('app_id = :app_id', { app_id: app_id })
        .andWhere('business_id = :business_id', { business_id: business_id })
        .andWhere('isDeleted = :isDeleted', { isDeleted: false })
        .execute();
    } catch (error) {
      throw error;
    }
  }

  async soft_delete(
    chatId: number,
    businessId: number,
    userId: number,
  ): Promise<any> {
    try {
      const message = await this.findOneMessageWithMedia({
        id: chatId,
        business_id: businessId,
        isDeleted: false,
      });

      message.isDeleted = true;
      message.deletedAt = new Date();
      message.deletedBy = userId;

      // deleting the message media
      if (message?.media_data?.length) {
        message.media_data?.map(async (mediaMessage) => {
          mediaMessage.isDeleted = true;
          mediaMessage.deletedAt = new Date();
          mediaMessage.deletedBy = userId;
          await this.messageMediaRepository.save(mediaMessage);
        });
      }

      return await this.messageRepository.save(message);
    } catch (error) {
      throw error;
    }
  }

  async hardDelete(
    messageId: number,
    businessId: number,
    appId: number,
  ): Promise<any> {
    try {
      await this.findOneMessage({
        id: messageId,
        business_id: businessId,
        app_id: appId,
      });

      // message media delete
      await this.messageMediaRepository.delete({
        message_id: messageId,
        business_id: businessId,
        app_id: appId,
      });

      // message  delete
      return await this.messageRepository.delete({
        id: messageId,
        business_id: businessId,
        app_id: appId,
      });
    } catch (error) {
      throw error;
    }
  }
}
