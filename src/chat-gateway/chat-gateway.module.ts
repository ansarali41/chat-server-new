import { Module } from '@nestjs/common';
import { ChatGatewayService } from './chat-gateway.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot()],
  providers: [ChatGatewayService],
  controllers: [],
})
export class ChatGatewayModule {}
