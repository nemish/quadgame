import shortid from 'shortid';

export class ActiveObject {
  constructor({x, y, game, factoryMethod}) {
    this.id = shortid();
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
    const clone = this.elem.clone().cx(16).cy(16);
    clone.width(16);
    return `<svg height='32' width='32'>${clone.svg()}</svg>`;
  }

  scrollIntoView() {
    window.scrollTo({
      left: this.elem.x() - window.innerWidth / 2,
      top: this.elem.y() - window.innerHeight / 2,
      behavior: "smooth"
    });
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
  toggleFocus() {
    if (this.focused) {
      this.elem.animate({ease: '>', duration: 200}).stroke({width: 0});
    } else {
      this.elem.animate({ease: '>', duration: 200}).stroke({width: 2, color: '#333'});
    }
    this.focused = !this.focused;
  }

  onClick() {
    this.toggleFocus();
  }
}