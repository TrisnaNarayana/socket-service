export interface UserDTO {
  id: string;
  email: string;
  name: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface JWTPayload {
  userId: string;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
  errors?: Record<string, string[]>;
}

export interface WSEventMessage<T = any> {
  event: string;
  payload: T;
  timestamp: string;
  senderId?: string;
}

export enum WSEventType {
  CONNECT = 'connection',
  DISCONNECT = 'disconnect',
  AUTHENTICATE = 'authenticate',
  PING = 'ping',
  PONG = 'pong',
  BROADCAST = 'broadcast',
  NOTIFICATION = 'notification',
  SUBSCRIBE = 'subscribe',
  UNSUBSCRIBE = 'unsubscribe',
  CUSTOM_EVENT = 'custom_event',
  ERROR = 'error',
}

export interface PublishEventTarget {
  type: 'GLOBAL' | 'ROOM' | 'USER';
  recipientId?: string;
  room?: string;
}

export interface PublishEventInput {
  projectId: string;
  eventName: string;
  target: PublishEventTarget;
  data: any;
}

export interface SubscribePayload {
  projectId: string;
  room: string;
}

export interface ClientDTO {
  id: string;
  name: string;
  email: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ApplicationDTO {
  id: string;
  clientId: string;
  appName: string;
  appSlug: string;
  apiToken: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  client?: ClientDTO;
}

