import { Circle } from '@/Circle';
import { circleCellPos } from '@/factories';
import { gameInstance as game } from '@/game';

export class BasicItem extends Circle {

  constructor({level = 1, ...props}) {
    super(props);
    this.level = level;
  }

  toggleFocus() {
    super.toggleFocus();
    const eventName = this.focused ? 'ITEM_FOCUSED' : 'ITEM_UNFOCUSED'
    game.watchers(eventName, this);
    game.setMovePath(this);
  }

  moveTo({x, y, reversed}) {
    const stages = [
      { x, y: this.y },
      { x, y }
    ];

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