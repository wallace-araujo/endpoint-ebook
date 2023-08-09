import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EbookController } from './ebook.controller';
import { EbookSchema } from './ebook.schema';
import { EbookService } from './ebook.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Ebook', schema: EbookSchema }]),
  ],
  controllers: [EbookController],
  providers: [EbookService],
})
export class EbooksModule {}
