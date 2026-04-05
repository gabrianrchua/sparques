import type { Response } from 'express';

export type AuthNoneLocals = Record<string, never>;

export interface AuthOptionalLocals {
  username?: string;
}

export interface AuthRequiredLocals {
  username: string;
}

export type NoAuthResponse = Response<unknown, AuthNoneLocals>;
export type OptionalAuthResponse = Response<unknown, AuthOptionalLocals>;
export type RequiredAuthResponse = Response<unknown, AuthRequiredLocals>;
