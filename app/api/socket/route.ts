import { NextApiResponseServerIo } from '@/lib/types';
import { Server as NetServer } from 'http';
import { Server as ServerIO } from 'socket.io';
import { NextApiRequest } from 'next';

export const dynamic = 'force-dynamic'
export const dynamicParams = true
export const revalidate = false
export const fetchCache = 'auto'
export const runtime = 'nodejs'
export const preferredRegion = 'auto'
export const maxDuration = 5

type socketRouteParams = {
  fileId: string;
};

export  async function GET(req: Request, res: NextApiResponseServerIo) {
  if (!res.socket.server.io) {
    const path = '/api/socket/io';
    const httpServer: NetServer = res.socket.server as any;
    const io = new ServerIO(httpServer, {
      path,
      addTrailingSlash: false,
    });
    io.on('connection', (s) => {
      s.on('create-room', (fileId) => {
        s.join(fileId);
      });
      s.on('send-changes', (deltas, fileId) => {
        console.log('CHANGE');
        s.to(fileId).emit('receive-changes', deltas, fileId);
      });
      s.on('send-cursor-move', (range, fileId, cursorId) => {
        s.to(fileId).emit('receive-cursor-move', range, fileId, cursorId);
      });
    });
    res.socket.server.io = io;
  }
  res.end();
};
