
export class ActiveObject {
  constructor({x, y, game, factoryMethod}) {
    this.elem = factoryMethod({x, y});
    this.x = x;
    this.y = y;
    this.game = game;
    this.elem.click(this.onClick.bind(this));
    this.elem.mouseover(this.onMouseOver.bind(this));
    this.elem.mouseout(this.onMouseOut.bind(this));
    this.focused = false;
  }

  getCoords() {
    const {x, y} = this;
    return {x, y};
  }

  onMouseOver() {
  }

  onMouseOut() {
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

  moveTo() {}
}