import { ActiveObject } from './ActiveObject';
import { createCircle, circleCellPos } from './factories';
import { gameInstance as game } from '@/game';

export class Circle extends ActiveObject {
  constructor({x, y, game}) {
    super({x, y, game, factoryMethod: createCircle});
  }
};