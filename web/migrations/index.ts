import * as migration_20260814_135455_initial from './20260814_135455_initial';

export const migrations = [
  {
    up: migration_20260814_135455_initial.up,
    down: migration_20260814_135455_initial.down,
    name: '20260814_135455_initial'
  },
];
