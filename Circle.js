import { ActiveObject } from './ActiveObject';
import { createCircle, circleCellPos } from './factories';
import { gameInstance as game } from '@/game';

export class Circle extends ActiveObject {
  constructor({x, y, game}) {
    super({x, y, game, factoryMethod: createCircle});
  }

  toggleFocus() {
    super.toggleFocus();
    game.setMovePath(this);
  }

  moveTo({x, y, reversed}) {
    console.log('moveTo', x, y, reversed);
    const stages = [];
    if (reversed) {
      stages.push(
        { x: this.x, y },
        { x, y }
      );
    } else {
      stages.push(
        { x, y: this.y },
        { x, y }
      );
    }

    this.toggleFocus();
    stages.forEach(st => {
      const cx = circleCellPos({param: st.x});
      const cy = circleCellPos({param: st.y});
      this.elem
        .animate({ease: '>', duration: 200})
        .cx(cx)
        .cy(cy);
    });
    this.x = x;
    this.y = y;
  }
};