import { environment } from '@env/environment';

export type Network = 'MainNet' | 'TestNet';

export const NETWORK: Network = environment.network as Network;
