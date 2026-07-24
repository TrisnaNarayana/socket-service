import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string().email('Email tidak valid'),
  password: z.string().min(6, 'Password minimal 6 karakter'),
  name: z.string().min(2, 'Nama minimal 2 karakter'),
  role: z.enum(['ADMIN', 'USER']).default('USER'),
});

export const loginSchema = z.object({
  email: z.string().email('Email tidak valid'),
  password: z.string().min(1, 'Password wajib diisi'),
});

export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token wajib diisi'),
});

export const wsAuthSchema = z.object({
  token: z.string().min(1, 'Token JWT wajib disediakan'),
});

export const wsMessageSchema = z.object({
  event: z.string().min(1, 'Event name wajib diisi'),
  payload: z.any(),
});

export const publishEventTargetSchema = z.object({
  type: z.enum(['GLOBAL', 'ROOM', 'USER']),
  recipientId: z.string().optional(),
  room: z.string().optional(),
});

export const publishEventSchema = z.object({
  projectId: z.string().min(1, 'projectId wajib diisi'),
  eventName: z.string().min(1, 'eventName wajib diisi'),
  target: publishEventTargetSchema,
  data: z.any(),
});

export const subscribeSchema = z.object({
  projectId: z.string().min(1, 'projectId wajib diisi'),
  room: z.string().min(1, 'room wajib diisi'),
});

export const createClientSchema = z.object({
  name: z.string().min(2, 'Nama client minimal 2 karakter'),
  email: z.string().email('Email tidak valid'),
});

export const createAppSchema = z.object({
  clientId: z.string().min(1, 'clientId wajib diisi'),
  appName: z.string().min(2, 'Nama aplikasi minimal 2 karakter'),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type RefreshTokenInput = z.infer<typeof refreshTokenSchema>;
export type WSAuthInput = z.infer<typeof wsAuthSchema>;
export type WSMessageInput = z.infer<typeof wsMessageSchema>;
export type PublishEventSchemaInput = z.infer<typeof publishEventSchema>;
export type SubscribeSchemaInput = z.infer<typeof subscribeSchema>;
export type CreateClientInput = z.infer<typeof createClientSchema>;
export type CreateAppInput = z.infer<typeof createAppSchema>;


