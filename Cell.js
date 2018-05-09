import { ActiveObject } from '@/ActiveObject';
import { CELL_COLOR, NUMBER_COLOR, CIRCLE_COLOR } from './constants';
import { createCircle, createCell, createNumber } from './factories';
import { gameInstance as game } from '@/game';

export class Cell extends ActiveObject {
  constructor({x, y}) {
    super({x, y, factoryMethod: createCell});
    this.number = createNumber({x, y});
    this.pathMarker = createCircle({x, y, exactWidth: 8, fillOpacity: 0});
    this.destinationPoint = createCircle({x, y, exactWidth: 0, fillOpacity: 0.2});
    this.destinationPoint.mouseover(this.onMouseOver.bind(this));
    this.destinationPointShow = false;
  }

  // onMouseOver() {
  //   this._toggleNumber(true);
  //   game.redrawPathToCell(this);
  // }

  _toggleNumber(show) {
    this.number.animate({ease: '<', duration: 100}).attr({'fill-opacity': show ? 0.2 : 0});
  }

  // onMouseOut() {
  //   this._toggleNumber(false);
  // }

  toggleHover(hover) {
    this._toggleNumber(hover);
    if (hover) {
      game.redrawPathToCell(this);
    }
  }

  toggleFocus() {
    // if (this.focused) {
    //   this.elem.animate({ease: '>', duration: 200}).fill(CELL_COLOR);
    //   this.number.animate({ease: '>', duration: 200}).fill(NUMBER_COLOR).attr({'fill-opacity': 0.2});
    // } else {
    //   this.elem.animate({ease: '>', duration: 200}).fill('#4599C6');
    //   this.number.animate({ease: '>', duration: 200}).fill('#fff').attr({'fill-opacity': 0.9});
    // }
    this.focused = !this.focused;
  }

  togglePath(show) {
    if (show && !this.destinationPointShow) {
      this.pathMarker.attr({'fill-opacity': 0.5});
    } else {
      this.pathMarker.attr({'fill-opacity': 0});
    }
  }

  setNextAction() {
    this.destinationPoint.clicked = !this.destinationPoint.clicked;
    if (this.destinationPoint.clicked) {
      this.destinationPoint.fill(NUMBER_COLOR);
    } else {
      game.moveActiveObject();
      // this.offDestinationPoint();
    }
  }

  showActions() {
    this.actionsShowed = true;
  }

  toggleDestinationPoint(show) {
    this.destinationPointShow = show;
    if (this.destinationPointShow) {
      this.destinationPoint.radius(12);
      this.destinationPoint.click(this.setNextAction.bind(this))
    } else {
      this.offDestinationPoint();
    }
  }

  offDestinationPoint() {
    this.destinationPoint.radius(0).fill(CIRCLE_COLOR).clicked = false;
    this.destinationPoint.off('click');
  }

  onClick() {
    super.onClick();
    if (this.destinationPointShow) {
      this.setNextAction();
    }
  }
}