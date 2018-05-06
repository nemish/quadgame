import Svg from 'svg.js';
import './app.styl';

const div = document.createElement('div', {id: 'app'});
div.setAttribute('id', 'app');
document.body.appendChild(div);


const CELLS_COUNT = 30;
const INITIAL_COORDS = {
  x: 0,
  y: 0
};
let cellWidth = 64;
let rectWidth = cellWidth - 8;

const getRandomFromArray = (arr) => arr[Math.floor(Math.random() * arr.length)]

const sequenceNumbers = (length) => Array.from({ length }, (v, k) => k)

const createCircle = ({x, y}) => {
  const width = cellWidth - (cellWidth / 2);
  return canvas.circle(width)
    .x(x * cellWidth + width / 2)
    .y(y * cellWidth + width / 2)
    .fill('#EC6533')
    .attr({ 'fill-opacity': 0.8 });
}

const createQuad = ({x, y}) => {
  return canvas.rect(rectWidth, rectWidth)
    .x(x * cellWidth + 4)
    .y(y * cellWidth + 4)
    .radius(8)
    .fill('#EC6533')
    .attr({ 'fill-opacity': 0.8 });
}

const createCell = ({x, y}) => {
  return canvas.rect(cellWidth, cellWidth)
    .x(x * cellWidth).y(y * cellWidth)
    .stroke({width: 1, color: '#3B91AA', opacity: 0.1})
    .fill(CELL_COLOR);
}

const NUMBER_COLOR = '#09486A';
const CELL_COLOR = '#DFEDF1';

const createNumber = ({x, y}) => {
  return canvas.text(`${y}-${x}`)
    .x(x * cellWidth + 4).y(y * cellWidth + 4)
    .font({
      family: 'Helvetica',
      size: 8
    }).fill(NUMBER_COLOR).attr({'fill-opacity': 0});
}

const canvas = SVG('app').size(CELLS_COUNT * cellWidth, CELLS_COUNT * cellWidth);


class Game {
  constructor() {
    this.cells = {};
  }

  addCell(cell) {
    const {x, y} = cell.getCoords();
    if (this.cells[x]) {
      this.cells[x][y] = cell;
    } else {
      this.cells[x] = {[y]: cell};
    }
  }

  placeRandom(factoryMethod) {
    const x = getRandomFromArray(Object.keys(this.cells));
    const y = getRandomFromArray(Object.keys(this.cells[0]));
    const el = new ActiveObject({x, y, factoryMethod});
    setTimeout(() => {
      window.scroll(el.elem.x() - window.screen.width / 2, el.elem.y() - window.screen.height / 2)
    }, 500);
  }
}

const game = new Game();

class ActiveObject {
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
    this.elem.animate({ease: '<', duration: 100}).attr({'fill-opacity': 0.9});
  }

  onMouseOut() {
    if (this.focused) {
      return
    }
    this.elem.animate({ease: '<', duration: 100}).attr({'fill-opacity': 0.8});
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


class Cell {
  constructor({x, y}) {
    this.cell = createCell({x, y});
    this.number = createNumber({x, y});
    this.x = x;
    this.y = y;
    this.cell.click(this.onClick.bind(this));
    this.cell.mouseover(this.onMouseOver.bind(this));
    this.cell.mouseout(this.onMouseOut.bind(this));
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
    this.number.animate({ease: '<', duration: 100}).attr({'fill-opacity': 0.2});
  }

  onMouseOut() {
    if (this.focused) {
      return
    }
    this.number.animate({ease: '<', duration: 100}).attr({'fill-opacity': 0});
  }

  toggleFocus() {
    if (this.focused) {
      this.cell.animate({ease: '>', duration: 200}).fill(CELL_COLOR);
      this.number.animate({ease: '>', duration: 200}).fill(NUMBER_COLOR).attr({'fill-opacity': 0.2});
    } else {
      this.cell.animate({ease: '>', duration: 200}).fill('#4599C6');
      this.number.animate({ease: '>', duration: 200}).fill('#fff').attr({'fill-opacity': 0.9});
    }
    this.focused = !this.focused;
  }

  onClick() {
    const {x, y} = this;
    const key = `${x}-${y}`;
    this.toggleFocus();
  }
}


sequenceNumbers(CELLS_COUNT).forEach(x => {
  sequenceNumbers(CELLS_COUNT).forEach(y => {
    game.addCell(new Cell({x, y}));
  });
});

game.placeRandom(createCircle);
