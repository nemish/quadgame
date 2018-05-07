
export class ActiveObject {
  constructor({x, y, factoryMethod}) {
    this.elem = factoryMethod({x, y});
    this.x = x;
    this.y = y;
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
    if (this.focused) {
      return
    }
    this._animateOver();
  }

  _animateOver() {
    this.elem.animate({ease: '<', duration: 100}).attr({'fill-opacity': 0.9});
  }

  _animateOut() {
    this.elem.animate({ease: '<', duration: 100}).attr({'fill-opacity': 0.8});
  }

  onMouseOut() {
    if (this.focused) {
      return
    }
    this._animateOut();
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
    const {x, y} = this;
    const key = `${x}-${y}`;
    this.toggleFocus();
  }
}