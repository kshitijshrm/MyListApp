import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Genre, ContentType } from '../../list/interfaces/content.interface';

export type MyListDocument = MyList & Document;

@Schema({
  timestamps: true,
  collection: 'my_list',
  toJSON: {
    transform: (_, ret) => {
      // Convert ObjectId to string
      ret.id = ret._id ? (ret._id.toString ? ret._id.toString() : ret._id) : ret._id;
      delete ret._id;
      delete ret.__v;
      delete ret.$__;
      delete ret.$isNew;

      // Handle Buffer _id if it exists
      if (ret.id && typeof ret.id === 'object' && ret.id.buffer) {
        ret.id = ret.id.buffer.toString('hex');
      }

      return ret;
    }
  },
  toObject: {
    transform: (_, ret) => {
      // Convert ObjectId to string
      ret.id = ret._id ? (ret._id.toString ? ret._id.toString() : ret._id) : ret._id;
      delete ret._id;
      delete ret.__v;
      delete ret.$__;
      delete ret.$isNew;

      // Handle Buffer _id if it exists
      if (ret.id && typeof ret.id === 'object' && ret.id.buffer) {
        ret.id = ret.id.buffer.toString('hex');
      }

      return ret;
    }
  }
})
export class MyList {
  @Prop({ required: true, index: true })
  userId: string;

  @Prop({ required: true })
  contentId: string;

  @Prop({ required: true, enum: ['movie', 'tvshow'] })
  contentType: ContentType;

  @Prop({ required: true })
  title: string;

  @Prop()
  description: string;

  @Prop({ type: [String], enum: ['Action', 'Comedy', 'Drama', 'Fantasy', 'Horror', 'Romance', 'SciFi'] })
  genres: Genre[];

  @Prop({ type: Date })
  addedAt: Date;
}

export const MyListSchema = SchemaFactory.createForClass(MyList);

// Create a compound index for userId and contentId to ensure no duplicates
MyListSchema.index({ userId: 1, contentId: 1 }, { unique: true });

// Create an index for userId and addedAt for efficient pagination
MyListSchema.index({ userId: 1, addedAt: -1 });
