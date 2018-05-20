import { Quad } from './Quad';
import { createQuad } from './factories';
import { gameInstance as game } from '@/game';

export class StaticItem extends Quad {
  constructor({level = 1, ...props}) {
    super(props);
    this.level = level;
    this.actionPoints = level / 5 * 10;
    this.game.on('NEXT_TURN', () => {
      this.actionPoints = 10;
    });
  }

  isStatic() {
    return true;
  }

  canHandleCell({x, y}) {
    return Math.abs(x - this.x) <= 1 && Math.abs(y - this.y) <= 1;
  }

  getActionName(cell) {
    if (cell.placed) {
      return
    }
    return 'BUILD_STATIC_ITEM';
  }

};