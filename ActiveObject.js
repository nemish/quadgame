import shortid from 'shortid';
import { gameInstance } from '@/game';

let nextId = 1;

export class ActiveObject {
  constructor({x, y, game, team, factoryMethod}) {
    this.id = ++nextId;
    this.team = team;
    this.factoryMethod = factoryMethod;
    this.game = game || gameInstance;
    this.elem = factoryMethod({x, y, fill: this.game.getTeamColor(this.team)});
    this.x = x;
    this.y = y;
    this.elem.click(this.onClick.bind(this));
    this.elem.mouseover(this.onMouseOver.bind(this));
    this.elem.mouseout(this.onMouseOut.bind(this));
    this.focused = false;
  }

  getTeam() {
    return this.team;
  }

  getNormalizedSvgStr() {
    const svg = this._getSvg();
    return this._wrapSvg(svg);
  }

  _getSvg() {
    const clone = this.elem.clone().cx(8).cy(8);
    this._prepareClone(clone);
    clone.width(16);
    const svg = clone.svg();
    clone.remove();
    return svg;
  }

  _prepareClone(clone) {
    return clone.stroke({width: 0});
  }

  _wrapSvg(svg) {
    return `<svg height='16' width='16'>${svg}</svg>`;
  }

  getDistance({x, y}) {
    return Math.abs(this.y - y) + Math.abs(this.x - x);
  }

  scrollIntoView() {
    window.scrollTo({
      left: this.elem.x() - window.innerWidth / 2,
      top: this.elem.y() - window.innerHeight / 2,
      behavior: "smooth"
    });
  }

  focusInView() {
    this.scrollIntoView();
    if (!this.focused) {
      this.toggleFocus();
    }
  }

  /** Abstract */
  onMouseOver() {}

  onMouseOut() {}

  moveTo() {}
  /** **/

  getCoords() {
    const {x, y} = this;
    return {x, y};
  }

  getActionName() {
    return 'MOVE';
  }

  isFocused() {
    return this.focused;
  }

  getFactory() {
    return this.constructor;
  }

  toggleFocus() {
    if (this.focused) {
      this.toggleStroke(false);
    } else {
      this.toggleStroke(true);
    }
    this.focused = !this.focused;

    const eventName = this.focused ? 'ITEM_FOCUSED' : 'ITEM_UNFOCUSED';
    this.game.watchers(eventName, this);
    this.game.setMovePath(this);
  }

  isStatic() {
    return false
  }


  toggleStroke(show) {
    return this.elem.animate({ease: '>', duration: 200}).stroke({width: show ? 5 : 0, color: '#333'});
  }

  onClick() {
    if (this.team && this.game.getCurrentTeam().id !== this.team) {
      return
    }
    this.toggleFocus();
  }
}