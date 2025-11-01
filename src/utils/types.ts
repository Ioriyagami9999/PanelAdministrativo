export type Post = {
  id: number;
  title: string;
  body: string;
  userId?: number;
  tags?: string[];
  reactions?: number;
};

export type LoginRequest = { username: string; password: string; };
export type LoginResponse = { token: string; username: string; };
export type User = { id:number; firstName:string; lastName:string; username:string; email:string; };
