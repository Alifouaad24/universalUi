import { brandSet, flagSet, freeSet } from '@coreui/icons';

import { signet } from './signet';
import { logo } from './logo';

export const iconSubset = {
  ...freeSet,
  ...brandSet,
  ...flagSet,
  logo,
  signet,
};

export const IconSubset = Object.fromEntries(
  Object.keys(iconSubset).map((name) => [name, name])
) as { [K in keyof typeof iconSubset]: K };

export type IconSubset = keyof typeof iconSubset;