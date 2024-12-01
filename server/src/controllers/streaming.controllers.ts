import { UPLOAD_VIDEO_DIR } from '@/constants/dir';
import { HttpStatusCode } from '@/constants/enums';
import { NextFunction, Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import mime from 'mime';

export const streamingVideoController = (req: Request, res: Response, next: NextFunction) => {
  const range = req.headers.range!;
  if (!range) {
    res.status(HttpStatusCode.BadRequest).send('Range is require');
    return;
  }
  const { name } = req.params;
  const videoPath = path.resolve(UPLOAD_VIDEO_DIR, name);

  //dung luong video
  const videoSize = fs.statSync(videoPath).size;

  //dung luong video cho moi phan doan stream
  const chunkSize = 10 ** 6; //1MB

  //gia tri byte bat dau tu header range
  const start = Number(range?.replace(/\D/g, ''));

  //gia tri byte ket thuc, neu vuot qua dung luong video thi lay gia tri vide size
  const end = Math.min(start + chunkSize - 1, videoSize - 1);

  //dung luong thuc te cho moi doan video stream, thuong se la chunkSzie
  const contentLength = end - start + 1;
  const contentType = mime.getType(videoPath) || 'video/*';

  const headers = {
    'Content-Range': `bytes ${start} - ${end}/${videoSize}`,
    'Accept-Ranges': 'bytes',
    'Content-Length': contentLength,
    'Content-Type': contentType
  };

  res.writeHead(HttpStatusCode.PartialContent, headers);
  const videoStreams = fs.createReadStream(videoPath, { start, end });
  videoStreams.pipe(res);

  videoStreams.on('error', (error) => {
    console.error('Stream error:', error);
    if (!res.headersSent) {
      res.status(HttpStatusCode.InternalServerError).send('Stream error');
    }
  });
};
