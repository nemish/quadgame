import tinycolor from 'tinycolor2';
import { ActiveObject } from '@/ActiveObject';
import { CELL_COLOR, TEAM_COLOR_1, NEUTRAL_COLOR } from './constants';
import { createCircle, createCell, createNumber, createPlusSign } from './factories';
import { gameInstance as game } from '@/game';

export class Cell extends ActiveObject {
  constructor({x, y}) {
    super({x, y, game, factoryMethod: createCell});
    this.number = createNumber({x, y});
    this.game = game;
    this._prepareElements({x, y});
  }

  _prepareElements({x, y}) {
    const fill = this.game.getTeamColor();
    this.pathMarker = createCircle({x, y, ratio: 1.1, fillOpacity: 0, fill});
    this.destinationPoint = createCircle({x, y, exactWidth: 0, fillOpacity: 0.2, fill});
    this.actionPoint = this.destinationPoint;
    this.plusSign = createPlusSign({x, y, fillOpacity: 0.2, size: 20, fill});
    this.plusSign.hide();
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
      this.pathMarker.fill(this._getColor()).attr({'fill-opacity': 0.5});
    } else {
      this.pathMarker.attr({'fill-opacity': 0});
    }
  }

  setNextAction({action, actionName}) {
    if (!this.actionPoint.clicked) {
      const color = tinycolor(this._getColor()).darken().toString();
      this.actionPoint.clicked = true;
      console.log(this.actionPoint);
      this.actionPoint.fill(color);
      if (this.actionPoint.children) {
        this.actionPoint.children().forEach(el => {
          el.fill(color);
        });
      }
      return;
    }

    if (action) {
      this.offActionPoint();
      return action();
    }

    if (actionName) {
      const {x, y} = this;
      game.watchers(actionName, {x, y});
    }
    this.offActionPoint();
  }

  showActions() {
    this.actionsShowed = true;
  }

  _getColor() {
    return this.game.getTeamColor();
  }

  toggleActionPoint(actionName) {
    this.actionPointShow = !!actionName;
    if (this.actionPointShow) {
      if (actionName === 'BUILD_STATIC_ITEM') {
        this.actionPoint = this.plusSign;
        this.actionPoint.show();
      } else {
        this.actionPoint = this.destinationPoint;
        this.actionPoint.radius(12);
      }
      this.actionPoint.fill(this._getColor());
      this.actionPoint.actionName = actionName;
      this.actionPoint.click(() => this.setNextAction({actionName}))
    } else {
      this.offActionPoint();
    }
  }

  offActionPoint() {
    if (this.actionPoint.actionName === 'BUILD_STATIC_ITEM') {
      this.actionPoint.hide();
    } else {
      this.actionPoint.radius(0);
    }
    this.actionPoint.fill(this._getColor()).clicked = false;
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