import { ActiveObject } from './ActiveObject';
import { createQuad } from './factories';
import { gameInstance as game } from '@/game';

export class Quad extends ActiveObject {
  constructor({x, y, game}) {
    super({x, y, game, factoryMethod: createQuad});
  }
  _prepareClone(clone) {
    const cl = super._prepareClone(clone);
    cl
      .cx(8)
      .cy(8)
      .x(0)
      .y(0)
      .width(16)
      .height(16)
      .radius(2)
    return cl;
  }

};