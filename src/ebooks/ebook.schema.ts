import { Schema, Document } from 'mongoose';

export interface Ebook extends Document {
  title: string;
  description: string;
  rented: boolean;
}

export const EbookSchema = new Schema<Ebook>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  rented: { type: Boolean, default: false },
});
