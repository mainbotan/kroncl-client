export interface BarChartData {
  label: string;
  value: number;
  id?: string | number;
}

export interface BarChartProps {
  data: BarChartData[];
  width?: number | string;
  height?: number;
  barColor?: string;
  hoverColor?: string;
  showGrid?: boolean;
  showValues?: boolean;
  xAxisLabel?: string;
  yAxisLabel?: string;
  className?: string;
  baseFontSize?: number;
}