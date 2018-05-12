import { Circle } from '@/Circle';
import { circleCellPos } from '@/factories';
import { gameInstance as game } from '@/game';

export class BasicItem extends Circle {

  constructor({level = 1, ...props}) {
    super(props);
    this.level = level;
    this.movePoints = 10;
  }

  toggleFocus() {
    super.toggleFocus();
    const eventName = this.focused ? 'ITEM_FOCUSED' : 'ITEM_UNFOCUSED'
    game.watchers(eventName, this);
    game.setMovePath(this);
  }

  canMoveInto({x, y}) {
    const distance = this.getDistance({x, y});
    return this.movePoints - distance > 0;
  }

  getDistance({x, y}) {
    return Math.abs(this.y - y) + Math.abs(this.x - x);
  }

  moveTo({x, y, reversed}) {
    console.log('object', this.id, 'moved from', this.x, this.y, 'to', x, y);
    const stages = [
      { x, y: this.y },
      { x, y }
    ];

    const distance = this.getDistance({x, y});
    this.movePoints -= distance;
    // if (this.movePoints <= 0) {
    //   this.events['MOVE_POINTS_EMPTY']
    // }

    stages.forEach(st => {
      const cx = circleCellPos({param: st.x});
      const cy = circleCellPos({param: st.y});
      this.elem
        .animate({ease: '>', duration: 300})
        .cx(cx)
        .cy(cy);
    });
    this.x = x;
    this.y = y;
    game.setMovePath(this);
  }
};