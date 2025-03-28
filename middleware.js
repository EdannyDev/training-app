import { NextResponse } from 'next/server';

export function middleware(req) {
  console.log('Headers:', req.headers);
  
  const allowedIps = ['10.147.20.13', '10.147.20.174'];
  const clientIp = req.ip || req.headers.get('x-forwarded-for');
  console.log('Client IP:', clientIp);

  if (!allowedIps.includes(clientIp)) {
    return new NextResponse('Acceso denegado', { status: 403 });
  }

  return NextResponse.next();
}