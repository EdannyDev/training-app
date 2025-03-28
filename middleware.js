import { NextResponse } from 'next/server';

export function middleware(req) {
  console.log('Headers:', req.headers);
  
  // Obtener la IP real desde el encabezado 'x-forwarded-for'
  const forwardedFor = req.headers.get('x-forwarded-for');
  const clientIp = forwardedFor ? forwardedFor.split(',')[0] : req.ip;
  console.log('Client IP:', clientIp);

  const allowedIps = ['10.147.20.13', '10.147.20.174'];
  
  if (!allowedIps.includes(clientIp)) {
    return new NextResponse('Acceso denegado', { status: 403 });
  }

  return NextResponse.next();
}