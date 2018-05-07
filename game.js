import Svg from 'svg.js';
import { Cell } from './Cell';
import {
  whileBack,
  whileForward,
  getRandomFromArray,
  sequenceNumbers
} from './utils';
import { Circle } from '@/Circle';
import { CELLS_COUNT, cellWidth } from './constants';


export class Game {
  constructor({ root }) {
    this.cells = {};
    this.pathCells = {};
    this.canvas = SVG(root).size(CELLS_COUNT * cellWidth, CELLS_COUNT * cellWidth);
  }

  init() {
    sequenceNumbers(CELLS_COUNT).forEach(x => {
      sequenceNumbers(CELLS_COUNT).forEach(y => {
        this.addCell(new Cell({x, y}));
      });
    });

    this.placeRandom(Circle);
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
    });

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

export let gameInstance = null;

export const createGameInstance = ({ root }) => {
  if (!gameInstance) {
    gameInstance = new Game({ root });
  }
  return gameInstance;
}
