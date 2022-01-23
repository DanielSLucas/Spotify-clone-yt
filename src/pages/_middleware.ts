import { getToken } from 'next-auth/jwt';
import { NextMiddleware, NextResponse } from 'next/server';

export const middleware: NextMiddleware = async req => {
  const token = await getToken({
    req: req as any,
    secret: process.env.JWT_SECRET as string,
  });

  const { pathname } = req.nextUrl;

  if (pathname.includes('/api/auth') || token) {
    return NextResponse.next();
  }

  if (!token && pathname !== '/login') {
    return NextResponse.redirect('/login');
  }
};
