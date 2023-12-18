import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatModule } from './chat/chat.module';
import { Chat } from './chat/base/entity/chat.entity';
import { ChatGatewayModule } from './chat-gateway/chat-gateway.module';
import { Message } from './message/base/entity/message.entity';
import { MessageModule } from './message/message.module';
import { MessageMedia } from './message/base/entity/message-media.entity';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [Chat, Message, MessageMedia],
      synchronize: true,
      dropSchema: false,
    }),
    ChatModule,
    ChatGatewayModule,
    MessageModule,
  ],
})
export class AppModule {}
