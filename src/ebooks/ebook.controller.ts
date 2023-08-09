import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  HttpException,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { Ebook } from './ebook.schema';
import { EbookService } from './ebook.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('ebooks')
@UseGuards(JwtAuthGuard)
export class EbookController {
  constructor(private readonly ebookService: EbookService) {}

  @Post()
  create(@Body() ebook: Ebook) {
    return this.ebookService.create(ebook);
  }

  @Get()
  async findAll(@Query('search') search: string) {
    return this.ebookService.findAll(search);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ebookService.findOne(id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() ebook: Ebook) {
    const isRented = await this.ebookService.isEbookRented(id);

    if (isRented) {
      throw new HttpException(
        'Não é possível editar um eBook alugado',
        HttpStatus.FORBIDDEN,
      );
    }

    return this.ebookService.update(id, ebook);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const isRented = await this.ebookService.isEbookRented(id);

    if (isRented) {
      throw new HttpException(
        'Não é possível excluir um eBook alugado',
        HttpStatus.FORBIDDEN,
      );
    }

    return this.ebookService.remove(id);
  }

  @Post(':id/rent')
  async rentEbook(@Param('id') id: string) {
    const ebook = await this.ebookService.findById(id);

    if (!ebook) {
      throw new HttpException('Ebook não encontrado', HttpStatus.NOT_FOUND);
    }

    if (ebook.rented) {
      throw new HttpException('Ebook já está alugado', HttpStatus.BAD_REQUEST);
    }

    ebook.rented = true;
    await ebook.save();

    return { message: 'Ebook alugado com sucesso' };
  }
}
