import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';
import { redisConnection } from './redis';

@Injectable()
export class QueueService {
  private imageQueue = new Queue(
    'image-processing',
    {
      connection: redisConnection,
    },
  );

  async addImageJob(
    jobId: string,
    filePath: string,
  ) {
    console.log(
      '================================',
    );
    console.log(
      'Job masuk queue:',
      jobId,
    );
    console.log(
      'File:',
      filePath,
    );
    console.log(
      '================================',
    );

    await this.imageQueue.add(
      'process-image',
      {
        jobId,
        filePath,
      },
    );
  }
}