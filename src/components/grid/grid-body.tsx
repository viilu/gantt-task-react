import React, { ReactChild } from "react";
import { Task } from "../../types/public-types";
import { addToDate } from "../../helpers/date-helper";
import styles from "./grid.module.css";

export type GridBodyProps = {
  tasks: Task[];
  dates: Date[];
  svgWidth: number;
  rowHeight: number;
  columnWidth: number;
  todayColor: string;
  weekendColor: string;
  rtl: boolean;
};
export const GridBody: React.FC<GridBodyProps> = ({
  tasks,
  dates,
  rowHeight,
  svgWidth,
  columnWidth,
  todayColor,
  weekendColor,
  rtl,
}) => {
  let y = 0;
  const gridRows: ReactChild[] = [];
  const rowLines: ReactChild[] = [
    <line
      key="RowLineFirst"
      x="0"
      y1={0}
      x2={svgWidth}
      y2={0}
      className={styles.gridRowLine}
    />,
  ];
  for (const task of tasks) {
    gridRows.push(
      <rect
        key={"Row" + task.id}
        x="0"
        y={y}
        width={svgWidth}
        height={rowHeight}
        className={styles.gridRow}
      />
    );
    rowLines.push(
      <line
        key={"RowLine" + task.id}
        x="0"
        y1={y + rowHeight}
        x2={svgWidth}
        y2={y + rowHeight}
        className={styles.gridRowLine}
      />
    );
    y += rowHeight;
  }

  const now = new Date();
  let tickX = 0;
  const ticks: ReactChild[] = [];
  const weekends: ReactChild[] = [];
  let todayLine: ReactChild = <rect />;
  let todayCircle: ReactChild = <circle />;

  let span = 0
  if (dates.length > 1) {
    span = dates[1].valueOf() - dates[0].valueOf()
  }

  for (let i = 0; i < dates.length; i++) {
    const date = dates[i];
    ticks.push(
      <line
        key={date.getTime()}
        x1={tickX}
        y1={0}
        x2={tickX}
        y2={y}
        className={styles.gridTick}
      />
    );

    if (weekendColor !== "transparent" && dates[i + 1] && [0,6].includes(dates[i + 1].getDay())) {
      weekends.push(
        <rect
          key={"WeekendColumn" + i}
          x={tickX + columnWidth}
          y={0}
          width={columnWidth}
          height={y}
          fill={weekendColor}
        />
      );
    }

    if (
      (i + 1 !== dates.length &&
        date.getTime() < now.getTime() &&
        dates[i + 1].getTime() >= now.getTime()) ||
      // if current date is last
      (i !== 0 &&
        i + 1 === dates.length &&
        date.getTime() < now.getTime() &&
        addToDate(
          date,
          date.getTime() - dates[i - 1].getTime(),
          "millisecond"
        ).getTime() >= now.getTime())
    ) {
      const delta = date.valueOf() - now.valueOf()
      const adjustment = columnWidth / span * delta
      todayLine = (
        <rect
          x={tickX - adjustment}
          y={0}
          width={2}
          height={y}
          fill={todayColor}
        />
      );
      todayCircle = (
        <circle
          cx={tickX - adjustment + 1}
          cy={0}
          r={4}
          fill={todayColor}
        />
      );
    }
    // rtl for today
    if (
      rtl &&
      i + 1 !== dates.length &&
      date.getTime() >= now.getTime() &&
      dates[i + 1].getTime() < now.getTime()
    ) {
      const delta = date.valueOf() - now.valueOf()
      const adjustment = columnWidth / span * delta
      todayLine = (
        <rect
          x={tickX + columnWidth - adjustment}
          y={0}
          width={columnWidth}
          height={y}
          fill={todayColor}
        />
      );
      todayCircle = (
        <circle
          cx={tickX - adjustment + 1}
          cy={0}
          r={4}
          fill={todayColor}
        />
      );
    }

    tickX += columnWidth;
  }
  return (
    <g className="gridBody">
      <g className="rows">{gridRows}</g>
      <g className="rowLines">{rowLines}</g>
      <g className="ticks">{ticks}</g>
      <g className="weekends">{weekends}</g>
      <g className="todayLine">{todayLine}</g>
      <g className="todayCircle">{todayCircle}</g>
    </g>
  );
};
