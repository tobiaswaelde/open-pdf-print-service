import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { DataPayload } from '../../types/modules/data';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ENV } from '../../config/env';
import { CreateDataDto } from '../../types/modules/data/create-data.dto';

@Injectable()
export class DataService {
  public static readonly token = 'DATA_SERVICE';

  constructor(private db: PrismaService) {}

  /**
   * Create new data entry.
   * This method accepts any data type, serializes it to JSON, and stores it in the database.
   * @param {any} data The data to be stored, can be any type.
   * @returns {DataPayload} The created data entry.
   */
  public async create(data: CreateDataDto): Promise<DataPayload> {
    return this.db.data.create({ data });
  }

  /**
   * Find data by ID.
   *
   * If the data is marked for instant deletion, it will be deleted immediately.
   * @param {string} id The ID of the data to find.
   * @returns {DataPayload} The data.
   * @throws {NotFoundException} Data with id ${id} not found.
   */
  public async find(id: string): Promise<DataPayload> {
    // find data by ID
    const item = await this.db.data.findUnique({ where: { id: id } });
    if (!item) {
      throw new NotFoundException(`Data with id ${id} not found.`);
    }

    // check if the data is marked for instant deletion
    if (item.deleteAfterUse) {
      await this.delete(id);
    }

    return item;
  }

  /**
   * Delete data by ID.
   * @param {string} id The ID of the data to delete.
   * @return {Promise<DataPayload>} The deleted data.
   * @throws {NotFoundException} Data with id ${id} not found.
   */
  public async delete(id: string): Promise<DataPayload> {
    // find data by ID
    const item = await this.db.data.findUnique({ where: { id: id } });
    if (!item) {
      throw new NotFoundException(`Data with id ${id} not found.`);
    }

    // delete data
    await this.db.data.delete({ where: { id: id } });

    return item;
  }

  /**
   * Delete all data that is older than the configured retention period.
   * This method is scheduled to run every hour.
   */
  @Cron(CronExpression.EVERY_HOUR, { name: 'cleanup-data' })
  private async cleanup() {
    const now = new Date();
    const retentionPeriod = new Date(now.getTime() - ENV.DATA_KEEP_SECONDS * 1000);

    // delete all data that is older than the retention period
    await this.db.data.deleteMany({
      where: {
        createdAt: {
          lt: retentionPeriod,
        },
      },
    });
  }
}
