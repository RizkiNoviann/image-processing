import { Worker } from 'bullmq';
import { redisConnection } from '../queue/redis';

import { PrismaClient } from '@prisma/client';

import sharp from 'sharp';
import path from 'path';

const prisma = new PrismaClient();

console.log(
  '================================',
);
console.log(
  'Image Worker Started',
);
console.log(
  '================================',
);

new Worker(
  'image-processing',

  async (job) => {
    const jobId = job.data.jobId;
    const inputPath =
      job.data.filePath;

    try {
      console.log('');
      console.log(
        'Worker mulai:',
        jobId,
      );

      await prisma.job.update({
        where: {
          id: jobId,
        },
        data: {
          status:
            'PROCESSING',
        },
      });

      console.log(
        'Status -> PROCESSING',
      );

      console.log(
        'Menunggu 10 detik...',
      );

      await new Promise(
        (resolve) =>
          setTimeout(
            resolve,
            10000,
          ),
      );

      console.log(
        'Resize gambar...',
      );

      const outputPath =
        path.join(
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

      console.log(
        'Resize selesai',
      );

      console.log(
        'Convert WebP selesai',
      );

      await prisma.job.update({
        where: {
          id: jobId,
        },
        data: {
          status:
            'COMPLETED',
          processedFile:
            outputPath,
        },
      });

      console.log(
        'Status -> COMPLETED',
      );

      console.log(
        'Job selesai:',
        jobId,
      );

      console.log(
        '================================',
      );
    } catch (error) {
      console.log(
        'Status -> FAILED',
      );

      console.log(
        'Job gagal:',
        jobId,
      );

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

      console.log(
        '================================',
      );
    }
  },

  {
    connection:
      redisConnection,
  },
);