import { NextResponse } from 'next/server';

export function middleware(req) {
  const allowedIps = ['10.147.20.13', '10.147.20.174'];
  const clientIp = req.ip || req.headers.get('x-forwarded-for');

  if (!allowedIps.includes(clientIp)) {
    return new NextResponse('Acceso denegado', { status: 403 });
  }

  return NextResponse.next();
}