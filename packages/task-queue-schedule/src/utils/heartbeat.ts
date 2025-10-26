import { getUniqueId } from "@block-kit/utils";

// https://docs.nestjs.com/fundamentals/lifecycle-events

const MEMORY_MAP: Record<string, number> = {};
const LOOP_TIME = 1000 * 10;
const ACTIVE_TIME_OUT = 1000 * 30;
const INSTANCE_ID = getUniqueId();

export const launchInstance = () => {
  const keep = () => {
    MEMORY_MAP[INSTANCE_ID] = Date.now();
    setTimeout(keep, LOOP_TIME);
  };
  keep();
  const res = clearInactiveInstances();
  console.log("Active Instance", res.active);
  console.log("Inactive Instance", res.inactive);
};

export const terminateInstance = () => {
  delete MEMORY_MAP[INSTANCE_ID];
};

export const getActiveInstances = () => {
  const entries = Object.entries(MEMORY_MAP);
  const actives: string[] = [];
  for (const [key, value] of entries) {
    if (Date.now() - Number(value) <= ACTIVE_TIME_OUT) {
      actives.push(key);
    }
  }
  return actives;
};

export const clearInactiveInstances = () => {
  const entries = Object.entries(MEMORY_MAP);
  const now = Date.now();
  const active: string[] = [];
  const inactive: string[] = [];
  for (const [key, value] of entries) {
    if (now - Number(value) > ACTIVE_TIME_OUT) {
      delete MEMORY_MAP[key];
      inactive.push(key);
      continue;
    }
    active.push(key);
  }
  return { active, inactive };
};
