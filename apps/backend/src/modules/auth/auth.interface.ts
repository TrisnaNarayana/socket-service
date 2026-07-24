import { UserDTO } from '@vms/shared';

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponse {
  user: UserDTO;
  tokens: TokenPair;
}
