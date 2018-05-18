import shortid from 'shortid';

let nextId = 1;

export class ActiveObject {
  constructor({x, y, game, factoryMethod}) {
    this.id = ++nextId;
    this.elem = factoryMethod({x, y});
    this.x = x;
    this.y = y;
    this.game = game;
    this.elem.click(this.onClick.bind(this));
    this.elem.mouseover(this.onMouseOver.bind(this));
    this.elem.mouseout(this.onMouseOut.bind(this));
    this.focused = false;
  }

  getNormalizedSvgStr() {
    const clone = this.elem.clone().cx(8).cy(8);
    clone.width(16);
    const svg = clone.svg();
    clone.remove();
    return `<svg height='16' width='16'>${clone.svg()}</svg>`;
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

  isFocused() {
    return this.focused;
  }

  toggleFocus() {
    if (this.focused) {
      this.toggleStroke(false);
    } else {
      this.toggleStroke(true);
    }
    this.focused = !this.focused;
  }

  toggleStroke(show) {
    return this.elem.animate({ease: '>', duration: 200}).stroke({width: show ? 2 : 0, color: '#333'});
  }

  onClick() {
    this.toggleFocus();
  }
}