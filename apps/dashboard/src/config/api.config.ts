export const getApiUrl = () => {
  if (typeof window !== 'undefined') {
    const { hostname, protocol, port } = window.location;
    if (hostname !== 'localhost' && hostname !== '127.0.0.1') {
      return `${protocol}//${window.location.host}/api`;
    }
    return `${protocol}//${hostname}:4000/api`;
  }
  return 'http://localhost:4000/api';
};

export const getWsUrl = () => {
  if (typeof window !== 'undefined') {
    const { hostname, protocol } = window.location;
    if (hostname !== 'localhost' && hostname !== '127.0.0.1') {
      const wsProtocol = protocol === 'https:' ? 'wss:' : 'ws:';
      return `${wsProtocol}//${window.location.host}/ws`;
    }
    return `ws://${hostname}:4001`;
  }
  return 'ws://localhost:4001';
};
