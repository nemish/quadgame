import { CELL_COLOR, NUMBER_COLOR, CIRCLE_COLOR, cellWidth, rectWidth } from './constants';
import { gameInstance } from '@/game';


export const circleCellPos = ({param}) => param * cellWidth + (cellWidth / 2)

export const createCircle = ({x, y, exactWidth=null, ratio=2, fillOpacity}) => {
  const width = exactWidth === null ? (cellWidth - (cellWidth / ratio)) : exactWidth;
  const circle = gameInstance.canvas.circle(width)
    .radius(width / 2)
    .cx(circleCellPos({param: x, width}))
    .cy(circleCellPos({param: y, width}))
    .fill(CIRCLE_COLOR)
    .attr({ 'fill-opacity': fillOpacity });
  circle.width = width;
  return circle;
}

export const createQuad = ({root=gameInstance.canvas, x, y, width=rectWidth, height=rectWidth, radius=8}) => {
  return root.rect(width, height)
    .cx(circleCellPos({param: x, width}))
    .cy(circleCellPos({param: y, height}))
    .radius(radius)
    .fill('#EC6533')
    .attr({ 'fill-opacity': 0.8 });
}

export const createPlusSign = ({x, y, size}) => {
  const group = gameInstance.canvas.group();
  group.add(createQuad({radius: 0, x, y, width: size, height: size - (size / 1.5)}))
  group.add(createQuad({radius: 0, x, y, width: size - (size / 1.5), height: size}))
  return group;
}

export const createCell = ({x, y}) => {
  return gameInstance.canvas.rect(cellWidth, cellWidth)
    .x(x * cellWidth).y(y * cellWidth)
    .stroke({width: 1, color: '#3B91AA', opacity: 0.1})
    .fill(CELL_COLOR);
}

export const createNumber = ({x, y}) => {
  return gameInstance.canvas.text(`${y}-${x}`)
    .x(x * cellWidth + 4).y(y * cellWidth + 12)
    .font({
      family: 'Helvetica',
      size: 8
    }).fill(NUMBER_COLOR).attr({'fill-opacity': 0});
}
