import { ActiveObject } from './ActiveObject';
import { createCircle, circleCellPos } from './factories';
import { gameInstance as game } from '@/game';

export class Circle extends ActiveObject {
  constructor(props) {
    super({factoryMethod: createCircle, ...props});
  }

  _prepareClone(clone) {
    const cl = super._prepareClone(clone);
    cl
      .cx(8)
      .cy(8)
      .width(16)
    return cl;
  }
};