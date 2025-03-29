import { NextResponse } from 'next/server';

export function middleware(req) {
  console.log('Headers:', req.headers);
  const clientIp = req.socket.remoteAddress; // Usamos la IP directa
  console.log('Client IP:', clientIp);

  const allowedIps = ['10.147.20.13', '10.147.20.174']; // Asegúrate de tener las IPs correctas de ZeroTier

  if (!allowedIps.includes(clientIp)) {
    return new NextResponse('Acceso denegado', { status: 403 });
  }

  return NextResponse.next();
}