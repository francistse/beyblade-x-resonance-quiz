import { Radar, RadarChart as RechartsRadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { useTranslation } from 'react-i18next';
import type { Stats } from '../../types';
import { STAT_RANGES_SERIES } from '../../data/statRanges';

interface RadarChartProps {
  userStats: Stats;
  beybladeStats: Stats;
  /** Compact chart for dark card backgrounds (share image / result card). */
  variant?: 'default' | 'onDark';
}

export function RadarChart({ userStats, beybladeStats, variant = 'default' }: RadarChartProps) {
  const { t } = useTranslation();
  const onDark = variant === 'onDark';

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

  const chartHeight = onDark ? 200 : 300;
  const outerRadius = onDark ? '70%' : '75%';

  return (
    <ResponsiveContainer width="100%" height={chartHeight}>
      <RechartsRadarChart data={data} cx="50%" cy="50%" outerRadius={outerRadius}>
        <PolarGrid stroke={onDark ? 'rgba(255,255,255,0.22)' : '#e5e7eb'} />
        <PolarAngleAxis
          dataKey="subject"
          tick={{ fontSize: onDark ? 11 : 13, fill: onDark ? '#ffffff' : '#374151' }}
        />
        <PolarRadiusAxis
          angle={90}
          domain={[0, 100]}
          tick={{ fontSize: onDark ? 9 : 10, fill: onDark ? 'rgba(255,255,255,0.7)' : '#9ca3af' }}
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
          contentStyle={
            onDark
              ? { background: 'rgba(15,23,42,0.95)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 8, color: '#fff' }
              : undefined
          }
        />
        <Radar
          name={t('result.radar.user')}
          dataKey="user"
          stroke={onDark ? '#93c5fd' : '#3B82F6'}
          fill={onDark ? '#93c5fd' : '#3B82F6'}
          fillOpacity={onDark ? 0.35 : 0.2}
          strokeWidth={2}
        />
        <Radar
          name={t('result.radar.beyblade')}
          dataKey="beyblade"
          stroke={onDark ? '#6ee7b7' : '#10B981'}
          fill={onDark ? '#6ee7b7' : '#10B981'}
          fillOpacity={onDark ? 0.35 : 0.2}
          strokeWidth={2}
        />
        <Legend wrapperStyle={onDark ? { color: '#ffffff', fontSize: 12 } : undefined} />
      </RechartsRadarChart>
    </ResponsiveContainer>
  );
}
