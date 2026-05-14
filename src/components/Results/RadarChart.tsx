import { Radar, RadarChart as RechartsRadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { useTranslation } from 'react-i18next';
import type { Stats } from '../../types';
import { STAT_RANGES_SERIES } from '../../data/statRanges';

interface RadarChartProps {
  userStats: Stats;
  beybladeStats: Stats;
}

export function RadarChart({ userStats, beybladeStats }: RadarChartProps) {
  const { t } = useTranslation();

  const data = [
    {
      subject: t('result.popup.attack'),
      user: Math.round((userStats.attack * 100 / STAT_RANGES_SERIES.attack) * 100) / 100,
      beyblade: Math.round((beybladeStats.attack / STAT_RANGES_SERIES.attack) * 10000) / 100,
      userRaw: Math.round(userStats.attack * 100),
      beybladeRaw: beybladeStats.attack,
      max: STAT_RANGES_SERIES.attack,
    },
    {
      subject: t('result.popup.defense'),
      user: Math.round((userStats.defense * 100 / STAT_RANGES_SERIES.defense) * 100) / 100,
      beyblade: Math.round((beybladeStats.defense / STAT_RANGES_SERIES.defense) * 10000) / 100,
      userRaw: Math.round(userStats.defense * 100),
      beybladeRaw: beybladeStats.defense,
      max: STAT_RANGES_SERIES.defense,
    },
    {
      subject: t('result.popup.stamina'),
      user: Math.round((userStats.stamina * 100 / STAT_RANGES_SERIES.stamina) * 100) / 100,
      beyblade: Math.round((beybladeStats.stamina / STAT_RANGES_SERIES.stamina) * 10000) / 100,
      userRaw: Math.round(userStats.stamina * 100),
      beybladeRaw: beybladeStats.stamina,
      max: STAT_RANGES_SERIES.stamina,
    },
  ];

  return (
    <ResponsiveContainer width="100%" height={300}>
      <RechartsRadarChart data={data} cx="50%" cy="50%" outerRadius="75%">
        <PolarGrid stroke="#e5e7eb" />
        <PolarAngleAxis
          dataKey="subject"
          tick={{ fontSize: 13, fill: '#374151' }}
        />
        <PolarRadiusAxis
          angle={90}
          domain={[0, 100]}
          tick={{ fontSize: 10, fill: '#9ca3af' }}
          tickCount={5}
        />
        <Tooltip
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          formatter={((_: any, name: any, props: any) => {
            if (name === 'user') {
              return `${props.payload.userRaw} / ${props.payload.max}`;
            }
            return `${props.payload.beybladeRaw} / ${props.payload.max}`;
          }) as any}
        />
        <Radar
          name={t('result.radar.user')}
          dataKey="user"
          stroke="#3B82F6"
          fill="#3B82F6"
          fillOpacity={0.2}
          strokeWidth={2}
        />
        <Radar
          name={t('result.radar.beyblade')}
          dataKey="beyblade"
          stroke="#10B981"
          fill="#10B981"
          fillOpacity={0.2}
          strokeWidth={2}
        />
        <Legend />
      </RechartsRadarChart>
    </ResponsiveContainer>
  );
}
