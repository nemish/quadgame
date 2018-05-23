import { CELL_COLOR, NUMBER_COLOR, TEAM_COLOR_1, TEAM_COLOR_2, CELL_WIDTH, rectWidth } from './constants';
import { gameInstance } from '@/game';


export const circleCellPos = ({param}) => param * CELL_WIDTH + (CELL_WIDTH / 2)

export const createCircle = ({x, y, exactWidth=null, ratio=2, fillOpacity, fill=TEAM_COLOR_1}) => {
  const width = exactWidth === null ? (CELL_WIDTH - (CELL_WIDTH / ratio)) : exactWidth;
  const circle = gameInstance.canvas.circle(width)
    .radius(width / 2)
    .cx(circleCellPos({param: x, width}))
    .cy(circleCellPos({param: y, width}))
    .fill(fill)
    .attr({ 'fill-opacity': fillOpacity });
  circle.width = width;
  return circle;
}

export const createQuad = ({root=gameInstance.canvas, x, y, width=rectWidth, height=rectWidth, radius=8, fill=TEAM_COLOR_1}) => {
  return root.rect(width, height)
    .cx(circleCellPos({param: x, width}))
    .cy(circleCellPos({param: y, height}))
    .radius(radius)
    .fill(fill)
    .attr({ 'fill-opacity': 0.8 });
}

export const createPlusSign = ({x, y, size, fill}) => {
  const group = gameInstance.canvas.group();
  group.add(createQuad({radius: 0, x, y, fill, width: size, height: size - (size / 1.5)}))
  group.add(createQuad({radius: 0, x, y, fill, width: size - (size / 1.5), height: size}))
  return group;
}

export const createCell = ({x, y}) => {
  return gameInstance.canvas.rect(CELL_WIDTH, CELL_WIDTH)
    .x(x * CELL_WIDTH).y(y * CELL_WIDTH)
    .stroke({width: 1, color: '#3B91AA', opacity: 0.1})
    .fill(CELL_COLOR);
}

export const createNumber = ({x, y}) => {
  return gameInstance.canvas.text(`${y}-${x}`)
    .x(x * CELL_WIDTH + 4).y(y * CELL_WIDTH + 12)
    .font({
      family: 'Helvetica',
      size: 8
    }).fill(NUMBER_COLOR).attr({'fill-opacity': 0});
}
