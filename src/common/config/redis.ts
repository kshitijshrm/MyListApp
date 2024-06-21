import { ClusterOptions } from 'ioredis';

const host = process.env['REDIS_CLUSTER_HOST'] as string;
const hostsString = (process.env['REDIS_CLUSTER_MULTI_HOST'] as string) || host;
const password = process.env['REDIS_CLUSTER_PASSWORD'] as string;
const port = parseInt(process.env['REDIS_CLUSTER_PORT'] as string, 10);
const retryCount = parseInt(process.env['REDIS_RETRIES'] as string, 10) || 3;
const namespace = process.env['f_redis_namespace'];

export const redisClusterHosts = hostsString.split(',').map((host) => ({
  host: host.trim(),
  port: port,
}));

export const redisClusterOptions: ClusterOptions = {
  redisOptions: {
    password: password,
    maxRetriesPerRequest: retryCount,
    tls:
      process.env['f_stage'] != 'local'
        ? {
            servername: host,
            minVersion: 'TLSv1.2',
            rejectUnauthorized: false,
          }
        : undefined,
  },
  slotsRefreshTimeout: 10000,
  slotsRefreshInterval: 50000,
};

if (namespace) {
  redisClusterOptions.keyPrefix = namespace;
}
