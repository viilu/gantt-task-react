import React, { useState } from "react";
import { BarTask } from "../../types/bar-task";
import { Link } from "../../types/public-types";

type ArrowProps = {
  taskFrom: BarTask;
  taskTo: BarTask;
  rowHeight: number;
  taskHeight: number;
  arrowIndent: number;
  rtl: boolean;
  onClickLine?: (tasks: BarTask[]) => void;
};
export const Arrow: React.FC<ArrowProps> = ({
  taskFrom,
  taskTo,
  rowHeight,
  taskHeight,
  arrowIndent,
  rtl,
  onClickLine,
}) => {
  let path: string;
  let trianglePoints: string;
  const strokeWidthDefault = "1.5";
  const [strokeWidth, setStrokeWidth] = useState<string>(strokeWidthDefault);
  
  if (rtl) {
    [path, trianglePoints] = drownPathAndTriangleRTL(
      taskFrom,
      taskTo,
      rowHeight,
      taskHeight,
      arrowIndent
    );
  } else {
    [path, trianglePoints] = drownPathAndTriangle(
      taskFrom,
      taskTo,
      rowHeight,
      taskHeight,
      arrowIndent
    );
  }

  const clickLine = () => {
    if (onClickLine) {
      onClickLine([taskFrom, taskTo]);
    }
  }

  return (
    <g className="arrow" 
      stroke={strokeWidth}
      onMouseEnter={() => setStrokeWidth("2")} 
      onMouseLeave={() => setStrokeWidth(strokeWidthDefault)} 
      onClick={clickLine}>
      <path strokeWidth={strokeWidth} d={path} fill="none" />
      <polygon points={trianglePoints} />
    </g>
  );
};

const arrowToStart  = (
    taskTo: BarTask,
    taskToEndPosition: number,
  ) => {
  return `${taskTo.x1},${taskToEndPosition} 
  ${taskTo.x1 - 5},${taskToEndPosition - 5} 
  ${taskTo.x1 - 5},${taskToEndPosition + 5}`;
}

const arrowToEnd  = (
  task: BarTask,
  taskToEndPosition: number,
) => {
  return `${task.x2},${taskToEndPosition} 
  ${task.x2 + 5},${taskToEndPosition + 5} 
  ${task.x2 + 5},${taskToEndPosition - 5}`;
}

const drownPathAndTriangle = (
  taskFrom: BarTask,
  taskTo: BarTask,
  rowHeight: number,
  taskHeight: number,
  arrowIndent: number
) => {
  const indexCompare = taskFrom.index > taskTo.index ? -1 : 1;
  const taskToEndPosition = taskTo.y + taskHeight / 2;
  const taskFromEndPosition = taskFrom.x2 + arrowIndent * 2;
  const taskFromHorizontalOffsetValue =
    taskFromEndPosition < taskTo.x1 ? "" : `H ${taskTo.x1 - arrowIndent}`;
  const taskToHorizontalOffsetValue =
    taskFromEndPosition > taskTo.x1
      ? arrowIndent
      : taskTo.x1 - taskFrom.x2 - arrowIndent;

  const endToStartPath = () => {
    return `M ${taskFrom.x2} ${taskFrom.y + taskHeight / 2} 
    h ${arrowIndent} 
    v ${(indexCompare * rowHeight) / 2} 
    ${taskFromHorizontalOffsetValue}
    V ${taskToEndPosition} 
    h ${taskToHorizontalOffsetValue}`;
  }
  
  const startToEndPath = () => {
    return `M ${taskFrom.x1} ${taskFrom.y + taskHeight / 2} 
    h ${-arrowIndent} 
    v ${(indexCompare * rowHeight) / 2} 
    H ${taskTo.x2 + arrowIndent}
    V ${taskToEndPosition} 
    h ${-arrowIndent}`;
  }
  
  const endToEndPath = () => {
    return `M ${taskFrom.x2} ${taskFrom.y + taskHeight / 2} 
    h ${arrowIndent} 
    v ${(indexCompare * rowHeight) / 2} 
    ${taskFromEndPosition > taskTo.x2 + arrowIndent + 10 ? "" : `H ${taskTo.x2 + arrowIndent}`}
    V ${taskToEndPosition} 
    h ${taskFromEndPosition < taskTo.x2
      ? -arrowIndent
      : taskTo.x1 - taskFrom.x2 - arrowIndent}`;
  }
  
  const startToStartPath = () => {
    return `M ${taskFrom.x1} ${taskFrom.y + taskHeight / 2} 
    h ${-arrowIndent} 
    v ${(indexCompare * rowHeight) / 2} 
    ${taskFromHorizontalOffsetValue}
    V ${taskToEndPosition} 
    h ${taskFromEndPosition > taskTo.x1
      ? arrowIndent
      : taskTo.x2 - taskFrom.x1 - arrowIndent}`;
  }

  // default endToStart
  let trianglePoints = arrowToStart(taskTo, taskToEndPosition);
  let path = endToStartPath();

  if (taskTo?.links) {
  const startToEnd = taskTo?.links.find((link: Link) => link.type === "StartToEnd");
  const endToEnd = taskTo?.links.find((link: Link) => link.type === "EndToEnd");
  const startToStart = taskTo?.links.find((link: Link) => link.type === "StartToStart");

  if (startToEnd) {
    trianglePoints = arrowToEnd(taskTo, taskToEndPosition);
    path = startToEndPath();
  }

  if (endToEnd) {
    trianglePoints = arrowToEnd(taskTo, taskToEndPosition);
    path = endToEndPath();
  }

  if (startToStart) {
    trianglePoints = arrowToStart(taskTo, taskToEndPosition);
    path = startToStartPath();
  }

  }

  return [path, trianglePoints];
};

const drownPathAndTriangleRTL = (
  taskFrom: BarTask,
  taskTo: BarTask,
  rowHeight: number,
  taskHeight: number,
  arrowIndent: number
) => {
  const indexCompare = taskFrom.index > taskTo.index ? -1 : 1;
  const taskToEndPosition = taskTo.y + taskHeight / 2;
  const taskFromEndPosition = taskFrom.x1 - arrowIndent * 2;
  const taskFromHorizontalOffsetValue =
    taskFromEndPosition > taskTo.x2 ? "" : `H ${taskTo.x2 + arrowIndent}`;
  const taskToHorizontalOffsetValue =
    taskFromEndPosition < taskTo.x2
      ? -arrowIndent
      : taskTo.x2 - taskFrom.x1 + arrowIndent;

  const path = `M ${taskFrom.x1} ${taskFrom.y + taskHeight / 2} 
  h ${-arrowIndent} 
  v ${(indexCompare * rowHeight) / 2} 
  ${taskFromHorizontalOffsetValue}
  V ${taskToEndPosition} 
  h ${taskToHorizontalOffsetValue}`;

  const trianglePoints = `${taskTo.x2},${taskToEndPosition} 
  ${taskTo.x2 + 5},${taskToEndPosition + 5} 
  ${taskTo.x2 + 5},${taskToEndPosition - 5}`;
  return [path, trianglePoints];
};
