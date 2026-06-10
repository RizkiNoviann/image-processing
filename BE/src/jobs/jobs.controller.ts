import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';

import { FileInterceptor } from '@nestjs/platform-express';

import { diskStorage } from 'multer';
import { extname } from 'path';

import { JobsService } from './jobs.service';

import type { Response } from 'express';

import {
  ApiTags,
  ApiOperation,
  ApiConsumes,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';

@ApiTags('Jobs')
@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @ApiOperation({
  summary: 'Upload image',
})
@ApiConsumes(
  'multipart/form-data',
)
@ApiBody({
  schema: {
    type: 'object',
    properties: {
      image: {
        type: 'string',
        format: 'binary',
      },
    },
  },
})

@Post('upload')
@UseInterceptors(
  FileInterceptor('image', {
    storage: diskStorage({
      destination: './uploads/original',

      filename: (req, file, callback) => {
        const uniqueName =
          Date.now() +
          '-' +
          Math.round(Math.random() * 1e9);

        callback(
          null,
          uniqueName +
            extname(file.originalname),
        );
      },
    }),

    fileFilter: (req, file, callback) => {
      const allowedTypes = [
        'image/jpeg',
        'image/png',
        'image/webp',
      ];

      if (
        !allowedTypes.includes(
          file.mimetype,
        )
      ) {
        return callback(
          new BadRequestException(
            'Only JPG, PNG, WEBP allowed',
          ),
          false,
        );
      }

      callback(null, true);
    },

    limits: {
      fileSize: 21 * 1024 * 1024,
    },
  }),
)
async uploadImage(
  @UploadedFile()
  file: Express.Multer.File,
) {
  return this.jobsService.uploadImage(
    file,
  );
}

@ApiOperation({
  summary: 'Get job status',
})
@ApiParam({
  name: 'id',
})

@Get(':id')
async getStatus(
  @Param('id') id: string,
) {
  return this.jobsService.getStatus(id);
}

@ApiOperation({
  summary:
    'Download processed image',
})
@ApiParam({
  name: 'id',
})

@Get(':id/download')
async download(
  @Param('id') id: string,
  @Res() res: Response,
) {
  return this.jobsService.download(
    id,
    res,
  );
}

}