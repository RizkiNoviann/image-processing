import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { QueueService } from '../queue/queue.service';
import { Response} from 'express';

@Injectable()
export class JobsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly queue: QueueService,
  ) {}

  async uploadImage(
    file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException(
        'File is required',
      );
    }

    const job = await this.prisma.job.create({
      data: {
        originalFile: file.path,
        status: 'PENDING',
      },
    });

    await this.queue.addImageJob(
      job.id,
      file.path,
    );

    return {
      jobId: job.id,
      status: job.status,
    };
  }

  async getStatus(id: string) {
    const job =
      await this.prisma.job.findUnique({
        where: {
          id,
        },
      });

    if (!job) {
      throw new BadRequestException(
        'Job not found',
      );
    }

    return {
      id: job.id,
      status: job.status,
      processedFile:
        job.processedFile,
      errorMessage:
        job.errorMessage,
      createdAt: job.createdAt,
      updatedAt: job.updatedAt,
    };
  }

  async download(
  id: string,
  res: Response,
) {
  const job =
    await this.prisma.job.findUnique({
      where: {
        id,
      },
    });

  if (!job) {
    throw new NotFoundException(
      'Job not found',
    );
  }

  if (
    job.status !== 'COMPLETED'
  ) {
    throw new BadRequestException(
      'Image is not ready',
    );
  }

  if (!job.processedFile) {
    throw new NotFoundException(
      'Processed file not found',
    );
  }

  return res.download(
    job.processedFile,
  );
}
}