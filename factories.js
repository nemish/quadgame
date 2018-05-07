import { CELL_COLOR, NUMBER_COLOR, cellWidth, rectWidth } from './constants';
import { gameInstance } from '@/game';

export const createCircle = ({x, y, exactWidth, fillOpacity}) => {
  const width = exactWidth || (cellWidth - (cellWidth / 2));
  return gameInstance.canvas.circle(width)
    .x(x * cellWidth + (cellWidth / 2) - (width / 2))
    .y(y * cellWidth + (cellWidth / 2) - (width / 2))
    .fill('#EC6533')
    .attr({ 'fill-opacity': fillOpacity });
}

export const createQuad = ({x, y}) => {
  return gameInstance.canvas.rect(rectWidth, rectWidth)
    .x(x * cellWidth + 4)
    .y(y * cellWidth + 4)
    .radius(8)
    .fill('#EC6533')
    .attr({ 'fill-opacity': 0.8 });
}

export const createCell = ({x, y}) => {
  return gameInstance.canvas.rect(cellWidth, cellWidth)
    .x(x * cellWidth).y(y * cellWidth)
    .stroke({width: 1, color: '#3B91AA', opacity: 0.1})
    .fill(CELL_COLOR);
}

export const createNumber = ({x, y}) => {
  return gameInstance.canvas.text(`${y}-${x}`)
    .x(x * cellWidth + 4).y(y * cellWidth + 4)
    .font({
      family: 'Helvetica',
      size: 8
    }).fill(NUMBER_COLOR).attr({'fill-opacity': 0});
}
