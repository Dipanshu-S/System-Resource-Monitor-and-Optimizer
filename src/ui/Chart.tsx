import { useMemo } from 'react';
import { BaseChart } from './BaseChart';

export type ChartProps = {
    data: number[];
    maxDataPoints: number;
    selectedView: 'CPU' | 'RAM' | 'STORAGE';
  };

  export const COLOR_MAP = {
    CPU: {
      stroke: '#5DD4EE',
      fill: '#8ED6FF',
    },
    RAM: {
      stroke: '#E99311',
      fill: '#FFC107',
    },
    STORAGE: {
      stroke: '#1ACF4D',
      fill: '#66BB6A',
    },
  };

export function Chart(props: ChartProps) {
  const color = useMemo(
    () => COLOR_MAP[props.selectedView],
    [props.selectedView]
  );
  const preparedData = useMemo( () => {
    const points = props.data.map((point) => ({value:point * 100}));
    return [
      ...points,
      ...Array.from({length: props.maxDataPoints - points.length}).map(
        item => ({value: undefined})
      ),
    ];
  },  [props.data, props.maxDataPoints]);

    return (
      <BaseChart data={preparedData} fill={color.fill} stroke={color.stroke} />
    );
}