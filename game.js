import Svg from 'svg.js';
import { Cell } from '@/Cell';
import {
  whileBack,
  whileForward,
  getRandomFromArray,
  sequenceNumbers
} from '@/utils';
import { BasicItem } from '@/BasicItem';
import { CELLS_COUNT, cellWidth } from '@/constants';

const getRandomCoords = (cells) => {
    const x = getRandomFromArray(Object.keys(cells));
    const y = getRandomFromArray(Object.keys(cells[0]));
    return {x, y};
}

const getRandomVacantCoords = (cells) => {
    let coords = getRandomCoords(cells);
    while (cells[coords.x][coords.y].placed) {
       coords = getRandomCoords(cells);
    }
    return coords;
}

export class Game {
  constructor({ root }) {
    this.cells = {};
    this.currentTurn = 1;
    this.focusedItem = null;
    this.pathCells = {};
    this.canvas = SVG(root).size(CELLS_COUNT * cellWidth, CELLS_COUNT * cellWidth);
    this._hoverCell = null;
    this.events = {};
    this.playableObjects = {};
    this.moveCell = null;
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

    this.placeRandom(BasicItem);
    this.placeRandom(BasicItem);
    this.placeRandom(BasicItem);
    this.placeRandom(BasicItem);
    this.placeRandom(BasicItem);
    this.placeRandom(BasicItem);
    const el = this.placeRandom(BasicItem);
    setTimeout(() => {
      el.scrollIntoView();
    }, 500);
  }

  on(eventName, cb) {
    if (!this.events[eventName]) {
      this.events[eventName] = [];
    }
    this.events[eventName].push(cb);
  }

  watchers(eventName, payload) {
    console.log('%c' + eventName, 'font-weight: bold');
    console.log('payload', payload);
    switch (eventName) {
      case 'NEXT_TURN':
        this.currentTurn++;
        break;
      case 'ITEM_FOCUSED':
        if (this.focusedItem && this.focusedItem.id !== payload.id && this.focusedItem.isFocused()) {
          this.focusedItem.toggleFocus();
        }
        this.focusedItem = payload;
        break;
    }

    const callbacks = this.events[eventName] || [];
    callbacks.forEach(cb => {
      try {
        cb(payload);
      } catch (err) {
        console.log('listener error', err);
      }
    });
  }

  onMouseMove(e) {
    const {pageX, pageY} = e;
    const x = Math.floor(pageX / cellWidth);
    const y = Math.floor(pageY / cellWidth);

    if (!this.hoverCell || (this.hoverCell && (this.hoverCell.x !== x || this.hoverCell.y !== y))) {
      this.hoverCell = this.cells[x][y];
    }
  }

  canMoveThroughCoords({x, y}) {
    return !this.cells[x][y].placed;
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
    // if (this.activeObj && focusedItem) {
    //   this.activeObj.toggleFocus(false);
    // }
    this.pathDestCoords = focused ? {x, y} : null;
    this.activeObj = obj;
    if (!this.pathDestCoords) {
      Object.keys(this.pathCells).forEach((key) => this.pathCells[key].togglePath(false));
      this.pathCells = {};
      this.activeObj = null;
    }
  }

  placeRandom(factory) {
    const {x, y} = getRandomVacantCoords(this.cells);
    const el = this.createPlayeableItem({x, y, factory});
    this.cells[x][y].placed = el;
    return el;
  }

  createPlayeableItem({x, y, factory}) {
    const el = new factory({x, y});
    this.playableObjects[el.id] = el;
    return el
  }

  redrawPathToCell(initCell) {
    if (!this.pathDestCoords || !this.activeObj) {
      return;
    }

    if (this.lastCell) {
      this.lastCell.toggleDestinationPoint(false);
    }

    this.lastCell = initCell;

    let iterators = [];
    const { x, y } = this.pathDestCoords;

    if (this.lastCell.x === +x && this.lastCell.y === +y) {
      return
    }

    this.lastCell.toggleDestinationPoint(true)

    let iteratorX = whileForward();
    if (x > initCell.x) {
      iteratorX = whileBack();
    }
    iteratorX.getterFn = (i) => this.cells[i][+y]
    iteratorX.begin = x;
    iteratorX.limit = initCell.x;
    iterators.push(iteratorX);

    let iteratorY = whileForward();
    if (y > initCell.y) {
      iteratorY = whileBack();
    }
    iteratorY.getterFn = (i) => this.cells[+initCell.x][i]
    iteratorY.begin = y;
    iteratorY.limit = initCell.y;
    iterators.push(iteratorY);

    const newPathCells = {};
    const lists = [[], []];
    console.log('before iterators', x, y, initCell.x, initCell.y, x > initCell.x, y > initCell.y);
    iterators.forEach((iterator, index) => {
      const {begin, limit} = iterator;
      // let stop = false;
      iterator({
        fn: (i) => {
          // if (stop) {
          //   return;
          // }
          console.log('inside iterator', i);
          const cell = iterator.getterFn(i);
          const cx = cell.x;
          const cy = cell.y;
          const cz = cell.z;
          console.log('iteration', i, cell)
          if (cx === +x && cy === +y) {
            return;
          }

          if (!this.activeObj.canMoveInto({x: cx, y: cy})) {
            // stop = true;
            return;
          }
          lists[index].push({cx, cy});

          if (!this.moveCell) {
            this.moveCell = {x: cx, y: cy};
          }

          cell.togglePath(true);
          const key = `${cx}${cy}`;
          if (!this.pathCells[key]) {
            this.pathCells[key] = cell;
          }
          newPathCells[key] = {x: cx, y: cy};
        },
        begin,
        limit
      });
    });

    lists.forEach((l, index) => {
      const key = index === 0 ? 'cx' : 'cy';
      l.sort((prev, next) => Math.abs(prev[key] - next[key]) > 0);
    });

    let el = null;
    if (lists[0].length) {
      if (lists[0].length < Math.abs(x - this.lastCell.x)) {
        el = lists[0][lists[0].length - 1];
      } else {
        el = lists[1][lists[1].length - 1];
      }
    }

    this.moveCell = null;
    if (el) {
      this.moveCell = {x: el.cx, y: el.cy};
    }

    Object.keys(this.pathCells).filter((key) => !newPathCells[key]).forEach(key => {
      this.pathCells[key].togglePath(false);
    });
  }

  turnOffPath() {
    Object.keys(this.pathCells).forEach(key => {
      this.pathCells[key].togglePath(false);
    });
  }

  getObjectsCell(obj) {
    const {x, y} = obj;
    return this.cells[x][y];
  }

  moveActiveObject() {
    if (!this.activeObj || !this.moveCell) {
      return
    }
    this.getObjectsCell(this.activeObj).placed = null;
    const {x, y} = this.moveCell;
    this.activeObj.moveTo({x, y});
    this.turnOffPath();
    this.moveCell = null;
  }
}

export let gameInstance = null;

export const createGameInstance = ({ root }) => {
  if (!gameInstance) {
    gameInstance = new Game({ root });
  }
  return gameInstance;
}
