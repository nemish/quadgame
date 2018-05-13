import { Circle } from '@/Circle';
import { circleCellPos } from '@/factories';
import { gameInstance as game } from '@/game';

export class BasicItem extends Circle {

  constructor({level = 1, ...props}) {
    super(props);
    this.level = level;
    this.movePoints = 10;
    this.radius = this.elem.width / 2;
    this.elem.radius(this.radius);
    game.on('NEXT_TURN', () => {
      this.movePoints = 10;
    });
  }

  _loopAnimation() {
    const animateForward = () => this.elem.animate({ease: '<', duration: 500}).radius(this.radius + 4).after(animateBack)
    const animateBack = () => this.elem.animate({ease: '>', duration: 500}).radius(this.radius).after(animateForward)
    animateForward();
  }

  toggleFocus() {
    super.toggleFocus();
    const eventName = this.focused ? 'ITEM_FOCUSED' : 'ITEM_UNFOCUSED';
    if (this.focused) {
      this._loopAnimation();
    } else {
      this.elem.stop();
      this.toggleStroke(false);
      this.elem.radius(this.radius);
    }
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
    if (this.movePoints <= 0) {
      game.watchers('MOVE_POINTS_EMPTY', item);
    }

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