import { ActiveObject } from './ActiveObject';
import { createQuad } from './factories';
import { gameInstance as game } from '@/game';

export class Quad extends ActiveObject {
  constructor({x, y, game}) {
    super({x, y, game, factoryMethod: createQuad});
  }
};