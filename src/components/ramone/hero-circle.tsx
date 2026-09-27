import React from 'react';
import { StyleSheet, View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRamoneTheme } from '@/context/theme-context';

export interface HeroCircleProps {
  cycleDay?: number;
  totalDays?: number;
  phaseName?: string;
  pregnancyChance?: 'Low' | 'Medium' | 'High';
  daysUntilNextPeriod?: number;
  onPress?: () => void;
}

export function HeroCircle({
  cycleDay = 12,
  totalDays = 28,
  phaseName = 'Follicular Phase',
  pregnancyChance = 'Medium',
  daysUntilNextPeriod = 16,
  onPress,
}: HeroCircleProps) {
  const { colors, shadows } = useRamoneTheme();

  const getChanceColor = () => {
    switch (pregnancyChance) {
      case 'High':
        return colors.chanceHigh;
      case 'Medium':
        return colors.chanceMedium;
      case 'Low':
      default:
        return colors.chanceLow;
    }
  };

  return (
    <View style={styles.outerContainer}>
      <View style={[styles.haloRing, { backgroundColor: colors.primaryLighter }]}>
        <View style={[styles.middleRing, { borderColor: colors.primaryLight }]}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Cycle ${cycleDay}, ${phaseName}, ${pregnancyChance} chance of getting pregnant`}
            onPress={onPress}
            style={({ pressed }) => [
              styles.circleButton,
              {
                backgroundColor: colors.cardBackground,
                borderColor: colors.primaryLight,
                ...(shadows.heroCircle as object),
              },
              pressed && styles.circlePressed,
            ]}>
            <View style={[styles.phasePill, { backgroundColor: colors.primaryLight, borderColor: colors.primaryLighter }]}>
              <Ionicons name="sparkles" size={13} color={colors.primaryDark} style={styles.phaseIcon} />
              <Text style={[styles.phaseText, { color: colors.primaryDark }]}>{phaseName}</Text>
            </View>

            <View style={styles.dayContainer}>
              <Text style={[styles.dayCountText, { color: colors.textPrimary }]}>Day {cycleDay}</Text>
              <Text style={[styles.cycleSubtext, { color: colors.textMuted }]}>of {totalDays} days</Text>
            </View>

            <Text style={[styles.periodCountdown, { color: colors.primary }]}>
              Period in {daysUntilNextPeriod} days
            </Text>

            <View style={[styles.chanceBadge, { backgroundColor: colors.background, borderColor: colors.cardBorder }]}>
              <View style={[styles.chanceIndicatorDot, { backgroundColor: getChanceColor() }]} />
              <Text style={[styles.chanceText, { color: colors.textSecondary }]}>
                {pregnancyChance} — chance of pregnancy
              </Text>
            </View>
          </Pressable>
        </View>
      </View>

      <View style={styles.tickIndicatorContainer} pointerEvents="none">
        <View style={[styles.tickMarker, styles.tickTop, { backgroundColor: colors.primary }]} />
        <View style={[styles.tickMarker, styles.tickRight, { backgroundColor: colors.primary }]} />
        <View style={[styles.tickMarker, styles.tickBottom, { backgroundColor: colors.primary }]} />
        <View style={[styles.tickMarker, styles.tickLeft, { backgroundColor: colors.primary }]} />
      </View>
    </View>
  );
}

const CIRCLE_SIZE = 264;

const styles = StyleSheet.create({
  outerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 12,
    position: 'relative',
  },
  haloRing: {
    width: CIRCLE_SIZE + 28,
    height: CIRCLE_SIZE + 28,
    borderRadius: (CIRCLE_SIZE + 28) / 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  middleRing: {
    width: CIRCLE_SIZE + 14,
    height: CIRCLE_SIZE + 14,
    borderRadius: (CIRCLE_SIZE + 14) / 2,
    borderWidth: 2,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  circleButton: {
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 30,
    paddingHorizontal: 22,
    borderWidth: 2,
  },
  circlePressed: {
    transform: [{ scale: 0.985 }],
    opacity: 0.96,
  },
  phasePill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 16,
    borderWidth: 1,
  },
  phaseIcon: { marginRight: 6 },
  phaseText: { fontSize: 13, fontWeight: '700', letterSpacing: 0.2 },
  dayContainer: { alignItems: 'center', marginTop: 2 },
  dayCountText: { fontSize: 44, fontWeight: '800', letterSpacing: -1 },
  cycleSubtext: { fontSize: 13, fontWeight: '500', marginTop: -2 },
  periodCountdown: { fontSize: 13, fontWeight: '600' },
  chanceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 14,
    borderWidth: 1,
  },
  chanceIndicatorDot: { width: 7, height: 7, borderRadius: 3.5, marginRight: 7 },
  chanceText: { fontSize: 11, fontWeight: '600' },
  tickIndicatorContainer: {
    position: 'absolute',
    width: CIRCLE_SIZE + 28,
    height: CIRCLE_SIZE + 28,
  },
  tickMarker: { position: 'absolute', borderRadius: 2 },
  tickTop: { top: 4, left: '50%', marginLeft: -2, width: 4, height: 8 },
  tickRight: { right: 4, top: '50%', marginTop: -2, width: 8, height: 4 },
  tickBottom: { bottom: 4, left: '50%', marginLeft: -2, width: 4, height: 8 },
  tickLeft: { left: 4, top: '50%', marginTop: -2, width: 8, height: 4 },
});
