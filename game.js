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
    this._hoverCell = null;
  }

  get hoverCell() {
    return this._hoverCell;
  }

  set hoverCell(cell) {
    if (this._hoverCell !== cell) {
      if (this._hoverCell) {
        this._hoverCell.toggleHover(false);
      }
      this._hoverCell = cell;
      this._hoverCell.toggleHover(true);
    }
  }

  init() {
    sequenceNumbers(CELLS_COUNT).forEach(x => {
      sequenceNumbers(CELLS_COUNT).forEach(y => {
        this.addCell(new Cell({x, y}));
      });
    });
    this.canvas.mousemove(this.onMouseMove.bind(this));

    this.placeRandom(Circle);
  }

  onMouseMove(e) {
    const {pageX, pageY} = e;
    const x = Math.floor(pageX / cellWidth);
    const y = Math.floor(pageY / cellWidth);

    if (!this.hoverCell || (this.hoverCell && (this.hoverCell.x !== x || this.hoverCell.y !== y))) {
      this.hoverCell = this.cells[x][y];
    }
  }

  addCell(cell) {
    const {x, y} = cell.getCoords();
    if (this.cells[x]) {
      this.cells[x][y] = cell;
    } else {
      this.cells[x] = {[y]: cell};
    }
  }

  setMovePath(obj) {
    const {x, y, focused} = obj;
    this.pathDestCoords = focused ? {x, y} : null;
    this.activeObj = obj;
    if (!this.pathDestCoords) {
      Object.keys(this.pathCells).forEach((key) => this.pathCells[key].togglePath(false));
      this.pathCells = {};
      this.activeObj = null;
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

  redrawPathToCell(initCell) {
    if (this.lastCell) {
      this.lastCell.toggleDestinationPoint(false);
    }

    if (!this.pathDestCoords) {
      return;
    }

    this.lastCell = initCell;

    let iterators = [];
    const { x, y } = this.pathDestCoords;

    if (this.lastCell.x === +x && this.lastCell.y === +y) {
      return
    }

    this.lastCell.toggleDestinationPoint(true)

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

    const newPathCells = {};
    iterators.forEach(iterator => {
      const {begin, val} = iterator;
      iterator({
        fn: (i) => {
          const cell = iterator.getterFn(i);
          if (cell.x === +x && cell.y === +y) {
            return;
          }

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

  moveActiveObject() {
    if (!this.activeObj) {
      return
    }
    const {x, y} = this.lastCell;
    this.activeObj.moveTo({x, y});
  }
}

export let gameInstance = null;

export const createGameInstance = ({ root }) => {
  if (!gameInstance) {
    gameInstance = new Game({ root });
  }
  return gameInstance;
}
