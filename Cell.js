import { ActiveObject } from '@/ActiveObject';
import { CELL_COLOR } from './constants';
import { createCircle, createCell, createNumber } from './factories';
import { gameInstance as game } from '@/game';

export class Cell extends ActiveObject {
  constructor({x, y}) {
    super({x, y, factoryMethod: createCell});
    this.number = createNumber({x, y});
    this.pathMarker = createCircle({x, y, exactWidth: 8, fillOpacity: 0});
    this.destinationPoint = createCircle({x, y, exactWidth: 16, fillOpacity: 0});
  }

  _animateOver() {
    this.number.animate({ease: '<', duration: 100}).attr({'fill-opacity': 0.2});
    game.mouseOverCell(this);
  }

  onMouseOut() {
    if (this.focused) {
      return
    }
    this.number.animate({ease: '<', duration: 100}).attr({'fill-opacity': 0});
    game.mouseOutCell(this);
  }

  toggleFocus() {
    if (this.focused) {
      this.elem.animate({ease: '>', duration: 200}).fill(CELL_COLOR);
      this.number.animate({ease: '>', duration: 200}).fill(NUMBER_COLOR).attr({'fill-opacity': 0.2});
    } else {
      this.elem.animate({ease: '>', duration: 200}).fill('#4599C6');
      this.number.animate({ease: '>', duration: 200}).fill('#fff').attr({'fill-opacity': 0.9});
    }
    this.focused = !this.focused;
  }

  togglePath(show) {
    if (show) {
      this.pathMarker.attr({'fill-opacity': 0.5});
    } else {
      this.pathMarker.attr({'fill-opacity': 0});
    }
  }

  toggleDestinationPoint(show) {
    if (show) {
      this.destinationPoint.attr({'fill-opacity': 0.5});
    } else {
      this.destinationPoint.attr({'fill-opacity': 0});
    }
  }
}