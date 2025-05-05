import { Injectable, ConflictException, NotFoundException, Logger } from '@nestjs/common';
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
        // Transform the existing item manually
        const transformed = this.transformMongoDocument(existingItem);
        return transformed;
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

      // Option: Update the cache instead of just invalidating it
      const cacheKey = this.getCacheKey(userId);
      const cachedData = await this.cacheService.get<any>(cacheKey);

      if (cachedData && Array.isArray(cachedData.items)) {
        // Add the new item to the beginning of the array (since it's sorted by addedAt desc)
        const transformedNewItem = this.transformMongoDocument(savedItem.toObject());
        const updatedItems = [transformedNewItem, ...cachedData.items];

        // Update the cache with the new items list and total count
        const updatedCacheData = {
          items: updatedItems,
          total: updatedItems.length
        };

        await this.cacheService.set(cacheKey, updatedCacheData);
      }

      // Return the clean JSON object
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

    // Get the cache key
    const cacheKey = this.getCacheKey(userId);

    // Option 1: Invalidate the entire cache for this user
    await this.cacheService.del(cacheKey);

    // This prevents a cache miss on the next request
    const cachedData = await this.cacheService.get<any>(cacheKey);
    if (cachedData && cachedData.items) {
      // Filter out the deleted item
      const updatedItems = cachedData.items.filter(item => item.contentId !== contentId);
      // Update the cache with the new items list and total count
      const updatedCacheData = {
        items: updatedItems,
        total: updatedItems.length
      };
      await this.cacheService.set(cacheKey, updatedCacheData);
    }
  }

  async getMyList(userId: string, paginationDto: PaginationDto): Promise<PaginatedListResponseDto> {
    const { page = 1, limit = 20 } = paginationDto;
    const skip = (page - 1) * limit;

    // Try to get from cache first
    const cacheKey = this.getCacheKey(userId);
    const cachedData = await this.cacheService.get<any>(cacheKey);

    // Add cache validation - check if the cached data is valid
    const isCacheValid = cachedData &&
      Array.isArray(cachedData.items) &&
      typeof cachedData.total === 'number';

    Logger.log(`Cache status for ${userId}: ${isCacheValid ? 'VALID' : 'INVALID/MISSING'}`);
    if (isCacheValid) {
      Logger.log(`Using cached data with ${cachedData.items.length} items`);
    }

    if (isCacheValid) {
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

    Logger.log(`Fetching from database for ${userId}`);
    // If not in cache or cache is invalid, query the database
    const [items, total] = await Promise.all([
      this.myListModel.find({ userId })
        .sort({ addedAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean()
        .exec(),
      this.myListModel.countDocuments({ userId }).lean().exec()
    ]);

    Logger.log(`Database returned ${items.length} items out of ${total} total`);

    // Transform the items to ensure proper JSON format
    const transformedItems = items.map(item => this.transformMongoDocument(item));

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
      const transformedAllItems = allItems.map(item => this.transformMongoDocument(item));

      const cacheData = { items: transformedAllItems, total };
      await this.cacheService.set(cacheKey, cacheData);
      Logger.log(`Cached ${transformedAllItems.length} items for ${userId}`);
    }

    return response;
  }

  async isInMyList(userId: string, contentId: string): Promise<boolean> {
    const item = await this.myListModel.findOne({ userId, contentId }).exec();
    return !!item;
  }

  // Add this helper method to transform MongoDB documents
  private transformMongoDocument(doc: any): MyList {
    const transformed = { ...doc };

    // Convert _id to id
    if (doc._id) {
      transformed.id = doc._id.toString();
    }

    // Handle Buffer _id if it exists
    if (transformed.id && typeof transformed.id === 'object' && transformed.id.buffer) {
      transformed.id = transformed.id.buffer.toString('hex');
    }

    // Remove MongoDB-specific fields
    delete transformed._id;
    delete transformed.__v;

    return transformed as MyList;
  }
}
