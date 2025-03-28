import { NextResponse } from 'next/server';

export function middleware(req) {
  const allowedIps = [
    '10.147.20.13',
    '10.147.20.174',
  ];

  const clientIp = req.ip;
  if (!allowedIps.includes(clientIp)) {
    return new Response('Acceso denegado', { status: 403 });
  }
  return NextResponse.next();
}