import Svg from 'svg.js';
import { Cell } from '@/Cell';
import {
  whileBack,
  whileForward,
  getRandomFromArray,
  sequenceNumbers
} from '@/utils';
import { BasicItem } from '@/BasicItem';
import { StaticItem } from '@/StaticItem';
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
    this.activeObj = null;
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
    const el = this.placeRandom(StaticItem);
    console.log('INITIALIZE', this.cells)
    setTimeout(() => {
      el.scrollIntoView();
    }, 500);
  }

  /**
   * setInterval(this.tick.bind(this), 500);
   * Cleanup method
   */
  tick() {
    const placedCoors = {};
    Object.keys(this.playableObjects).forEach(key => {
      const obj = this.playableObjects[key];
      const { x, y } = obj;
      if (!placedCoors[x]) {
        placedCoors[x] = {};
      }
      placedCoors[x][y] = true;
    });

    this._cellsForEach(cell => {
        if (cell.placed && !(placedCoors[cell.x] && placedCoors[cell.x][cell.y])) {
            cell.freeFromItem();
        }
    });
  }

  _cellsForEach(fn) {
    Object.keys(this.cells).forEach(key => {
      Object.keys(this.cells[key]).forEach(innerKey => {
        return this.cells[key][innerKey];
      });
    });
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
      case 'MOVE':
        this.moveActiveObject();
        break;
      case 'BUILD_STATIC_ITEM':
        const {x, y} = payload;
        const factory = this.focusedItem.getFactory();
        this.placeInCoords({x, y}, {factory});
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
    console.log(this.cells[x][y],{x, y});
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
    this.pathDestCoords = focused ? {x, y} : null;
    this.activeObj = obj;
    if (!this.pathDestCoords) {
      Object.keys(this.pathCells).forEach((key) => this.pathCells[key].togglePath(false));
      this.pathCells = {};
      this.activeObj = null;
    }
  }

  placeInCoords({x, y}, {factory}) {
    const el = this.createPlayeableItem({x, y, factory});
    console.log('placeInCoords', x,y);
    this.cells[x][y].placed = el;
    return el;
  }

  placeRandom(factory) {
    const {x, y} = getRandomVacantCoords(this.cells);
    const el = this.createPlayeableItem({x, y, factory});

    console.log('placeRandom', x,y);
    this.cells[x][y].placed = el;
    return el;
  }

  createPlayeableItem({x, y, factory}) {
    const el = new factory({x, y, game: this});
    this.playableObjects[el.id] = el;
    return el;
  }

  _handleStaticItem(cell) {
    const {x, y} = cell;

    this._handleLastCell(cell);
    if (!this.activeObj || !this.activeObj.canHandleCell({x, y})) {
      console.log('NO! canHandleCell', this.activeObj)
      return;
    }
    const actionName = this.activeObj.getActionName(cell);
    console.log('canHandleCell', this.activeObj.getActionName(cell));
    cell.toggleActionPoint(actionName);
  }

  _handleLastCell(cell) {
    if (this.lastCell) {
      this.lastCell.toggleActionPoint();
    }

    this.lastCell = cell;

  }

  redrawPathToCell(initCell) {
    console.log('redrawPathToCell', this.activeObj && this.activeObj.isStatic());
    if (this.activeObj && this.activeObj.isStatic()) {
        return this._handleStaticItem(initCell);
    }

    if (!this.pathDestCoords || !this.activeObj || this.activeObj.isStatic()) {
      return;
    }

    this._handleLastCell(initCell);
    this.lastCell.toggleActionPoint(this.activeObj.getActionName(this.lastCell));

    let iterators = [];
    const { x, y } = this.pathDestCoords;

    if (this.lastCell.x === +x && this.lastCell.y === +y) {
      return
    }


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
    console.log('%c ++++++  BEFORE ITERATORS ++++++', 'color: #ff06d5; font-weight: bold;', x, y, initCell.x, initCell.y, x > initCell.x, y > initCell.y);
    let stop = false;
    iterators.forEach((iterator, index) => {
      const {begin, limit} = iterator;
      iterator({
        fn: (i) => {
          if (stop) {
            return;
          }
          const cell = iterator.getterFn(i);
          const cx = cell.x;
          const cy = cell.y;
          const cz = cell.z;
          // console.log('iteration', i, cell)
          if (cx === +x && cy === +y) {
            return;
          }
          console.log('inside iterator', i, stop, cx, cy);

          if (!this.canMoveInto({x: cx, y: cy})) {
            console.log('canMoveInto inside');
            stop = true;
            return;
          }
          lists[index].push({cx, cy});

          cell.togglePath(true);
          const key = `${cx}${cy}`;
          if (!this.pathCells[key]) {
            this.pathCells[key] = cell;
          }
          newPathCells[key] = {x: cx, y: cy};
          // console.log(newPathCells, this.pathCells);
        },
        begin,
        limit
      });
    });
    console.log('%c ++++++  AFTER ITERATORS ++++++', 'color: #cc06d5; font-weight: bold;', x, y, initCell.x, initCell.y, x > initCell.x, y > initCell.y);

    const sortedLists = [];
    lists.forEach((l, index) => {
      const key = index === 0 ? 'cx' : 'cy';
      sortedLists.push(l.sort((prev, next) => {
        return +prev[key] - +next[key];
      }));
    });

    const index = y < this.lastCell.y ? sortedLists[1].length - 1 : 0;
    const el = sortedLists[1][index] || sortedLists[0][0];

    this.moveCell = null;
    if (el) {
      this.moveCell = {x: el.cx, y: el.cy};
    }

    Object.keys(this.pathCells).filter((key) => !newPathCells[key]).forEach(key => {
      this.pathCells[key].togglePath(false);
    });
  }

  canMoveInto({x, y}) {
    return this.canMoveThroughCoords({x, y}) && this.activeObj.hasPointsToMove({x, y});
  }


  turnOffPath() {
    Object.keys(this.pathCells).forEach(key => {
      this.pathCells[key].togglePath(false);
    });
  }

  getObjectsCell(obj) {
    const {x, y} = obj;
    console.log('getObjectsCell', x, y, this.cells[x][y])
    return this.cells[x][y];
  }

  moveActiveObject() {
    console.log('moveActiveObject', this.activeObj, this.moveCell);
    if (!this.activeObj || !this.moveCell) {
      return
    }
    this.getObjectsCell(this.activeObj).freeFromItem();
    const {x, y} = this.moveCell;
    this.activeObj.moveTo({x, y});
    this.turnOffPath();
    this.cells[x][y].placed = this.activeObj;
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
