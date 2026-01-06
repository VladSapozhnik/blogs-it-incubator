import { Response } from 'express';

export class CookieAdapter {
  setRefreshCookie(res: Response, token: string) {
    res.cookie('refreshToken', token, {
      httpOnly: true,
      secure: true,
      maxAge: 20_000,
    });
  }
  clearRefreshCookie(res: Response) {
    res.clearCookie('refreshToken');
  }
}
