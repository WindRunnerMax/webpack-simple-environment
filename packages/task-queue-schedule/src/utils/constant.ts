/**
 * Redis 自增锁 LUA 脚本
 * - KEYS[1]: 锁的键名
 * - ARGV[1]: 最大任务数 MaxTask
 * @example ioredis.eval(LUA_SCRIPT, 1, LOCK_KEY, MAX_TASK);
 */
export const INCR_LOCK_LUA = `
  local current = redis.call("GET", KEYS[1])

  if not current then
    current = 0
  else
    current = tonumber(current)
  end

  if current >= tonumber(ARGV[1]) then
    return -1
  end

  local new_count = redis.call("INCR", KEYS[1])
  return new_count
`;

/**
 * Redis 自减锁 LUA 脚本
 * - KEYS[1]: 锁的键名
 * @example ioredis.eval(LUA_SCRIPT, 1, LOCK_KEY);
 */
export const DESC_LOCK_LUA = `
  local current = redis.call("GET", KEYS[1])
  
  if not current then
    return 0
  end

  current = tonumber(current)
  if current <= 0 then
    return 0
  end

  local new_count = redis.call("DECR", KEYS[1])
  return new_count
`;
