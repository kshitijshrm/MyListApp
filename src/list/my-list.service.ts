import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MyList, MyListDocument } from '../database/schemas/my-list.schema';
import { AddToListDto } from './dto/add-to-list.dto';
import { PaginationDto } from './dto/pagination.dto';
import { PaginatedListResponseDto } from './dto/list-response.dto';
import { CacheService } from '../common/services/cache.service';

@Injectable()
export class MyListService {
  constructor(
    @InjectModel(MyList.name) private myListModel: Model<MyListDocument>,
    private cacheService: CacheService
  ) { }

  private getCacheKey(userId: string): string {
    return `mylist:${userId}`;
  }

  async addToList(userId: string, addToListDto: AddToListDto): Promise<MyList> {
    try {
      // Check if the item already exists in the user's list
      const existingItem = await this.myListModel.findOne({
        userId,
        contentId: addToListDto.contentId
      }).lean().exec();

      if (existingItem) {
        return existingItem;
      }

      // Create a new item
      const newItem = new this.myListModel({
        userId,
        ...addToListDto,
        addedAt: new Date()
      });

      const savedItem = await newItem.save();

      // Invalidate cache
      await this.cacheService.del(this.getCacheKey(userId));

      // Return the clean JSON object instead of the Mongoose document
      return savedItem.toJSON();
    } catch (error) {
      // Handle other errors that might occur
      if (error.code === 11000) { // Duplicate key error
        console.warn(`Duplicate key error for item ${addToListDto.contentId} in user ${userId}'s list`);

        // Find and return the existing item instead of throwing an error
        const existingItem = await this.myListModel.findOne({
          userId,
          contentId: addToListDto.contentId
        }).exec();

        return existingItem.toJSON();
      }
      throw error;
    }
  }

  async removeFromList(userId: string, contentId: string): Promise<void> {
    const result = await this.myListModel.deleteOne({ userId, contentId }).exec();

    if (result.deletedCount === 0) {
      throw new NotFoundException('Item not found in your list');
    }

    // Invalidate cache
    await this.cacheService.del(this.getCacheKey(userId));
  }

  async getMyList(userId: string, paginationDto: PaginationDto): Promise<PaginatedListResponseDto> {
    const { page = 1, limit = 20 } = paginationDto;
    const skip = (page - 1) * limit;

    // Try to get from cache first
    const cacheKey = this.getCacheKey(userId);
    const cachedData = await this.cacheService.get<PaginatedListResponseDto>(cacheKey);

    if (cachedData) {
      // If we have cached data, we can paginate in memory which is faster
      const start = skip;
      const end = skip + limit;
      const paginatedItems = cachedData.items.slice(start, end);

      return {
        items: paginatedItems,
        total: cachedData.total,
        page,
        limit,
        pages: Math.ceil(cachedData.total / limit)
      };
    }

    // If not in cache, query the database
    const [items, total] = await Promise.all([
      this.myListModel.find({ userId })
        .sort({ addedAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean()
        .exec(),
      this.myListModel.countDocuments({ userId }).lean().exec()
    ]);

    // Transform the items to ensure proper JSON format
    const transformedItems = items.map(item => {
      // Create a new object with id instead of _id
      const transformed = { ...item, id: item._id.toString() };
      delete transformed._id;
      delete transformed.__v;
      return transformed;
    });

    const response: PaginatedListResponseDto = {
      items: transformedItems as MyList[],
      total,
      page,
      limit,
      pages: Math.ceil(total / limit)
    };

    // Cache the full list for future requests
    if (total <= 100) { // Only cache if the list is reasonably small
      const allItems = await this.myListModel.find({ userId })
        .sort({ addedAt: -1 })
        .lean()
        .exec();

      // Transform all items for caching
      const transformedAllItems = allItems.map(item => {
        const transformed = { ...item, id: item._id.toString() };
        delete transformed._id;
        delete transformed.__v;
        return transformed;
      });

      const cacheData = { items: transformedAllItems, total };
      await this.cacheService.set(cacheKey, cacheData);
    }

    return response;
  }

  async isInMyList(userId: string, contentId: string): Promise<boolean> {
    const item = await this.myListModel.findOne({ userId, contentId }).exec();
    return !!item;
  }
}
