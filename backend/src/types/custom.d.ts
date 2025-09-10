// custom added fields to express request object

declare namespace Express {
  export interface Request {
    username?: string;
  }
}
