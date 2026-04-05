import type { Response } from 'express';

export type AuthNoneLocals = Record<string, never>;

export interface AuthOptionalLocals {
  username?: string;
}

export interface AuthRequiredLocals {
  username: string;
}

export type NoAuthResponse<T = unknown> = Response<T, AuthNoneLocals>;
export type OptionalAuthResponse<T = unknown> = Response<T, AuthOptionalLocals>;
export type RequiredAuthResponse<T = unknown> = Response<T, AuthRequiredLocals>;
