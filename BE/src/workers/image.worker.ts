import { Worker } from 'bullmq';
import { redisConnection } from '../queue/redis';

import { PrismaClient } from '@prisma/client';

import sharp from 'sharp';
import path from 'path';

const prisma = new PrismaClient();

console.log('Image Worker Started');

new Worker(
  'image-processing',
  async (job) => {
    const jobId = job.data.jobId;
    const inputPath = job.data.filePath;

    try {
      await prisma.job.update({
        where: {
          id: jobId,
        },
        data: {
          status: 'PROCESSING',
        },
      });

      const outputPath = path.join(
        'uploads',
        'processed',
        `${jobId}.webp`,
      );

      await sharp(inputPath)
        .resize({
          width: 1280,
          height: 1280,
          fit: 'inside',
        })
        .webp({
          quality: 80,
        })
        .toFile(outputPath);

      await prisma.job.update({
        where: {
          id: jobId,
        },
        data: {
          status: 'COMPLETED',
          processedFile: outputPath,
        },
      });

      console.log(
        `Job ${jobId} completed`,
      );
    } catch (error) {
      await prisma.job.update({
        where: {
          id: jobId,
        },
        data: {
          status: 'FAILED',
          errorMessage:
            error instanceof Error
              ? error.message
              : 'Unknown Error',
        },
      });

      console.error(error);
    }
  },
  {
    connection: redisConnection,
  },
);