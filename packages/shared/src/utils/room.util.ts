export const buildScopedRoomName = (appId: string | undefined, room: string): string => {
  if (!room) return '';
  // If room is already scoped, return as is
  if (room.startsWith('app:')) return room;
  const tenantScope = appId ? appId.replace(/[^a-zA-Z0-9_-]/g, '_') : 'global';
  return `app:${tenantScope}:${room}`;
};
