import { ActiveObject } from './ActiveObject';
import { createCircle } from './factories';
import { gameInstance as game } from '@/game';

export class Circle extends ActiveObject {
  constructor({x, y, game}) {
    super({x, y, game, factoryMethod: createCircle});
  }

  toggleFocus() {
    super.toggleFocus();
    game.drawMovablePath(this);
  }
};