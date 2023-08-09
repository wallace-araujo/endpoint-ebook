import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Ebook } from './ebook.schema';

@Injectable()
export class EbookService {
  constructor(
    @InjectModel('Ebook') private readonly ebookModel: Model<Ebook>,
  ) {}

  async create(ebook: Ebook): Promise<Ebook> {
    const createdEbook = new this.ebookModel(ebook);
    return createdEbook.save();
  }

  async findAll(search: string): Promise<Ebook[]> {
    if (search) {
      return this.ebookModel.find({ title: { $regex: search, $options: 'i' } });
    } else {
      return this.ebookModel.find();
    }
  }

  async findOne(id: string): Promise<Ebook> {
    return this.ebookModel.findById(id).exec();
  }

  async update(id: string, ebook: Ebook): Promise<Ebook> {
    return this.ebookModel.findByIdAndUpdate(id, ebook, { new: true }).exec();
  }

  async remove(id: string): Promise<any> {
    return this.ebookModel.findByIdAndRemove(id).exec();
  }

  async isEbookRented(id: string): Promise<boolean> {
    const ebook = await this.ebookModel.findById(id).exec();
    if (!ebook) {
      return false;
    }
    return ebook.rented;
  }
  async findById(id: string): Promise<Ebook | null> {
    return this.ebookModel.findById(id).exec();
  }
}
