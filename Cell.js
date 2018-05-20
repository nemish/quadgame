import { ActiveObject } from '@/ActiveObject';
import { CELL_COLOR, NUMBER_COLOR, CIRCLE_COLOR } from './constants';
import { createCircle, createCell, createNumber, createPlusSign } from './factories';
import { gameInstance as game } from '@/game';

export class Cell extends ActiveObject {
  constructor({x, y}) {
    super({x, y, game, factoryMethod: createCell});
    this.number = createNumber({x, y});
    this.pathMarker = createCircle({x, y, ratio: 1.1, fillOpacity: 0});
    this.game = game;
    this.destinationPoint = createCircle({x, y, exactWidth: 0, fillOpacity: 0.2});
    this.actionPoint = this.destinationPoint;
    this.plusSign = createPlusSign({x, y, width: 0, height: 10});
    this.actionPointShow = false;
  }

  _toggleNumber(show) {
    this.number.animate({ease: '<', duration: 100}).attr({'fill-opacity': show ? 0.2 : 0});
  }

  freeFromItem() {
    this.placed = null;
  }

  toggleHover(hover) {
    this._toggleNumber(hover);
    if (hover) {
      game.redrawPathToCell(this);
    }
  }

  toggleFocus() {
    this.focused = !this.focused;
  }

  togglePath(show) {
    if (show && !this.actionPointShow) {
      this.pathMarker.attr({'fill-opacity': 0.5});
    } else {
      this.pathMarker.attr({'fill-opacity': 0});
    }
  }

  setNextAction({action, actionName}) {
    this.actionPoint.clicked = !this.actionPoint.clicked;
    if (this.actionPoint.clicked) {
      this.actionPoint.fill(NUMBER_COLOR);
    } else {
      if (action) {
        return action();
      }
      if (actionName) {
        const {x, y} = this.actionPoint;
        game.watchers(actionName, {x, y});
      }
    }
  }

  showActions() {
    this.actionsShowed = true;
  }

  toggleActionPoint(actionName) {
    this.actionPointShow = !!actionName;
    if (this.actionPointShow) {
      if (actionName === 'plus') {
        this.actionPoint = this.plusSign;
        this.actionPoint.width(20);
      } else {
        this.actionPoint = this.destinationPoint;
        this.actionPoint.radius(12);
      }
      this.actionPoint.actionName = actionName;
      this.actionPoint.click(() => this.setNextAction({actionName}))
    } else {
      this.offDestinationPoint();
    }
  }

  offDestinationPoint() {
    if (this.actionPoint.actionName === 'plus') {
      this.actionPoint.height(0);
    } else {
      this.actionPoint.radius(0);
    }
    this.actionPoint.fill(CIRCLE_COLOR).clicked = false;
    this.actionPoint.off('click');
  }

  onClick() {
    super.onClick();
    if (this.actionPointShow) {
      const { actionName } = this.actionPoint;
      this.setNextAction({actionName});
    }
  }
}