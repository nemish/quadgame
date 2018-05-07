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

const createCircle = ({x, y, exactWidth, fillOpacity}) => {
  const width = exactWidth || (cellWidth - (cellWidth / 2));
  return canvas.circle(width)
    .x(x * cellWidth + (cellWidth / 2) - (width / 2))
    .y(y * cellWidth + (cellWidth / 2) - (width / 2))
    .fill('#EC6533')
    .attr({ 'fill-opacity': fillOpacity });
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


const whileForward = () => ({fn, begin, val}) => {
  let i = begin;
  while (i <= val) {
    fn(i);
    i = i + 1;
  }
}

const whileBack = () => ({fn, begin, val}) => {
  let i = begin;
  while (i >= val) {
    fn(i);
    i = i - 1;
  }
}


class Game {
  constructor() {
    this.cells = {};
    this.pathCells = {};
  }

  addCell(cell) {
    const {x, y} = cell.getCoords();
    if (this.cells[x]) {
      this.cells[x][y] = cell;
    } else {
      this.cells[x] = {[y]: cell};
    }
  }

  drawMovablePath({x, y, focused}) {
    console.log('drawMovablePath', {x, y, focused});
    this.pathDestCoords = focused ? {x, y} : null;
    if (!this.pathDestCoords) {
      Object.keys(this.pathCells).forEach((key) => this.pathCells[key].togglePath(false));
      this.pathCells = {};
    }
  }

  placeRandom(factory) {
    const x = getRandomFromArray(Object.keys(this.cells));
    const y = getRandomFromArray(Object.keys(this.cells[0]));
    const el = new factory({x, y});
    setTimeout(() => {
      window.scroll(el.elem.x() - window.screen.width / 2, el.elem.y() - window.screen.height / 2)
    }, 500);
  }

  mouseOverCell(initCell) {
    if (this.lastCell) {
      this.lastCell.toggleDestinationPoint(false);
    }

    if (!this.pathDestCoords) {
      return;
    }

    this.lastCell = initCell;
    this.lastCell.toggleDestinationPoint(true)

    let iterators = [];
    const { x, y } = this.pathDestCoords;
    let iteratorX = whileForward();
    if (initCell.x > x) {
      iteratorX = whileBack();
    }
    iteratorX.getterFn = (i) => this.cells[i][y]
    iteratorX.reverse = () => {
      iteratorX.getterFn = (i) => this.cells[i][initCell.y]
    }
    iteratorX.begin = initCell.x;
    iteratorX.val = x;
    iterators.push(iteratorX);

    let iteratorY = whileForward();
    if (initCell.y > y) {
      iteratorY = whileBack();
    }
    iteratorY.getterFn = (i) => this.cells[initCell.x][i]
    iteratorY.reverse = () => {
      iteratorY.getterFn = (i) => this.cells[x][i]
    }
    iteratorY.begin = initCell.y;
    iteratorY.val = y;
    iterators.push(iteratorY);

    if (Math.abs(initCell.x - x) < Math.abs(initCell.y - y)) {
      iterators.forEach(iterator => iterator.reverse());
    }

    const newPathCells = {};
    iterators.forEach(iterator => {
      console.log(newPathCells);
      const {begin, val} = iterator;
      iterator({
        fn: (i) => {
          const cell = iterator.getterFn(i);

          cell.togglePath(true);
          const key = `${cell.x}${cell.y}`;
          if (!this.pathCells[key]) {
            this.pathCells[key] = cell;
          }
          newPathCells[key] = {x: cell.x, y: cell.y};
        },
        begin,
        val
      });
    })

    Object.keys(this.pathCells).filter((key) => !newPathCells[key]).forEach(key => {
      this.pathCells[key].togglePath(false);
    });
  }

  mouseOutCell() {
    if (!this.pathDestCoords) {
      return;
    }
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


class Circle extends ActiveObject {
  constructor({x, y}) {
    super({x, y, factoryMethod: createCircle});
  }

  toggleFocus() {
    super.toggleFocus();
    game.drawMovablePath(this);
  }
};


class Cell extends ActiveObject {
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


sequenceNumbers(CELLS_COUNT).forEach(x => {
  sequenceNumbers(CELLS_COUNT).forEach(y => {
    game.addCell(new Cell({x, y}));
  });
});

game.placeRandom(Circle);
