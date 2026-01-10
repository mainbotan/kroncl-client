import type { ComponentType } from 'react';

export type IconComponent = ComponentType<IconProps>;

import Auto from '@/assets/ui-kit/icons/auto';
import { IconProps } from '@/assets/ui-kit/icons/types';
import Business from '@/assets/ui-kit/icons/business';
import Dev from '@/assets/ui-kit/icons/dev';
import Shop from '@/assets/ui-kit/icons/shop';
import Wallet from '@/assets/ui-kit/icons/wallet';
import Coffee from '@/assets/ui-kit/icons/coffee';
import Food from '@/assets/ui-kit/icons/food';
import Barbershop from '@/assets/ui-kit/icons/barbershop';
import Flower from '@/assets/ui-kit/icons/flower';
import Health from '@/assets/ui-kit/icons/health';

export const iconConfig: IconComponent[] = [
  Auto,
  Business,
  Dev,
  Shop,
  Wallet,
  Coffee,
  Food,
  Barbershop,
  Flower,
  Health
];