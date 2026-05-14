import { Radar, RadarChart as RechartsRadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { useTranslation } from 'react-i18next';
import type { Stats } from '../../types';
import { STAT_RANGES_SERIES } from '../../data/statRanges';

interface BeybladeStatRadarProps {
  stats: Stats;
}

export function BeybladeStatRadar({ stats }: BeybladeStatRadarProps) {
  const { t } = useTranslation();

  const data = [
    {
      subject: t('result.popup.attack'),
      value: Math.round((stats.attack / STAT_RANGES_SERIES.attack) * 100),
      raw: stats.attack,
      max: STAT_RANGES_SERIES.attack,
    },
    {
      subject: t('result.popup.defense'),
      value: Math.round((stats.defense / STAT_RANGES_SERIES.defense) * 100),
      raw: stats.defense,
      max: STAT_RANGES_SERIES.defense,
    },
    {
      subject: t('result.popup.stamina'),
      value: Math.round((stats.stamina / STAT_RANGES_SERIES.stamina) * 100),
      raw: stats.stamina,
      max: STAT_RANGES_SERIES.stamina,
    },
  ];

  return (
    <ResponsiveContainer width="100%" height={220}>
      <RechartsRadarChart data={data} cx="50%" cy="50%" outerRadius="75%">
        <PolarGrid stroke="#e5e7eb" />
        <PolarAngleAxis
          dataKey="subject"
          tick={{ fontSize: 12, fill: '#6b7280' }}
        />
        <PolarRadiusAxis
          angle={90}
          domain={[0, 100]}
          tick={{ fontSize: 10, fill: '#9ca3af' }}
          tickCount={5}
        />
        <Tooltip
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          formatter={((_: any, __: any, props: any) => {
            return `${props.payload.raw} / ${props.payload.max}`;
          }) as any}
        />
        <Radar
          dataKey="value"
          stroke="#6366f1"
          fill="#6366f1"
          fillOpacity={0.25}
          strokeWidth={2}
        />
      </RechartsRadarChart>
    </ResponsiveContainer>
  );
}
