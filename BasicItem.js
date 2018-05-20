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
    this.game.on('NEXT_TURN', () => {
      this.movePoints = 10;
    });
  }

  getRemainingMovePoints() {
    return this.movePoints;
  }

  hasPointsToMove({x, y}) {
    const distance = this.getDistance({x, y});
    return this.movePoints - distance >= 0;
  }

  moveTo({x, y, reversed}) {
    const stages = [
      { x, y: this.y },
      { x, y }
    ];

    const distance = this.getDistance({x, y});
    this.movePoints -= distance;
    this.movePoints = Math.max(this.movePoints, 0);

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
    this.game.setMovePath(this);
  }
};
