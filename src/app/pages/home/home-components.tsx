import { FC, useEffect, useRef, useState } from 'react';
import useI18 from '../../../i18n/hooks';
import * as echarts from 'echarts';
import { windowResizeObserver } from '../../../services/global.services';

import './home.scss';

export const DayTransactionVolume: FC = () => {
  const transactionVolume = useI18('transactionVolume');
  const box = useRef<HTMLDivElement>(null);
  const myChart = useRef<echarts.ECharts>();
  const [data, setData] = useState<{time: string, volume: string}[]>([]);

  useEffect(() => {
    if (myChart.current) {
      const xAxisArr: string[] = [];
      const seriesArr: string[] = [];
      data.forEach(item => {
        xAxisArr.push(item.time);
        seriesArr.push(item.volume);
      });
      myChart.current.setOption({
        tooltip: {
          padding: [2, 5],
          formatter: `{b}<br />${transactionVolume}: {c}`
        },
        xAxis: {
          data: xAxisArr,
        },
        series: [{
          data: seriesArr,
        }],
      });
    }
  }, [data, transactionVolume]);

  useEffect(() => {
    if (!box.current) return;
    myChart.current = echarts.init(box.current);
    myChart.current.setOption({
      xAxis: {
        type: 'category',
        boundaryGap: false,
      },
      tooltip: {
        trigger: 'axis',
      },
      yAxis: {
        type: 'value',
        splitNumber: 3,
      },
      series: [{
        type: 'line',
        lineStyle: {
          color: '#1da390',
          width: 2,
        },
        areaStyle: {
          color: '#1da390',
          opacity: 0.1,
        },
        smooth: true,
        symbol: 'none',
      }],
      grid: {
        top: 10,
        bottom: 20,
        right: 20,
        left: 40,
      }
    });
    setData([
      { time: '00:01', volume: '46.8' },
      { time: '00:02', volume: '48.7' },
      { time: '00:03', volume: '49.6' },
      { time: '00:04', volume: '46.5' },
      { time: '00:05', volume: '53.4' },
      { time: '00:06', volume: '86.3' },
      { time: '00:07', volume: '46.2' },
    ]);
    windowResizeObserver.subscribe(() => myChart.current?.resize());
  }, []);
  return <div ref={box} className="chain_view_box"></div>
};

export const TokenPledgeRate: FC<{ pledgeRate: number }> = ({ pledgeRate }) => {
  const box = useRef<HTMLDivElement>(null);
  const myChart = useRef<echarts.ECharts>();

  useEffect(() => {
    if (!box.current) return;
    if (!myChart.current) {
      myChart.current = echarts.init(box.current);
    }
    myChart.current.setOption({
      grid: {
        top: 0,
        left: 0,
        width: 0,
        bottom: 0,
      },
      series: [{
        type: 'gauge',
        startAngle: 90,
        endAngle: -270,
        pointer: {
          show: false
        },
        progress: {
          show: true,
          overlap: false,
          clip: false,
          itemStyle: {
            color: '#00b464',
            backgroundColor: '#edf0f2'
          }
        },
        axisLine: {
          lineStyle: {
            width: 2,
          }
        },
        splitLine: {
          show: false,
          distance: 0,
          length: 10
        },
        axisTick: {
          show: false
        },
        axisLabel: {
          show: false,
          distance: 50
        },
        data: [{
          value: pledgeRate,
          title: {
            offsetCenter: ['0', '0']
          },
          detail: {
            offsetCenter: ['0', '0']
          }
        }],
        title: {
          fontSize: 12
        },
        detail: {
          width: 50,
          fontSize: 12,
          color: '#878e9f',
          formatter: '{value}%'
        }
      }]
    });
    windowResizeObserver.subscribe(() => myChart.current?.resize());
  }, [pledgeRate]);
  return (
    <div ref={box} className="chain_info_view_rate"></div>
  );
};