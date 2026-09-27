import React from 'react';
import { StyleSheet, View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRamoneTheme } from '@/context/theme-context';
import { DayCycleInfo } from '@/utils/cycle-calculator';

export interface SelectedDayCardProps {
  dayInfo: DayCycleInfo;
  onLogPress?: () => void;
}

export function SelectedDayCard({ dayInfo, onLogPress }: SelectedDayCardProps) {
  const { colors, shadows } = useRamoneTheme();

  const formattedFullDate = dayInfo.date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const getBadgeStyle = () => {
    if (dayInfo.isPeriod) {
      return {
        bg: colors.primaryLight,
        color: colors.primaryDark,
        label: `Cycle Day ${dayInfo.cycleDay} • Menstrual Phase`,
        icon: 'water',
      };
    }
    if (dayInfo.isOvulation) {
      return {
        bg: colors.secondaryLight,
        color: colors.secondary,
        label: `Cycle Day ${dayInfo.cycleDay} • Ovulation Peak`,
        icon: 'sparkles',
      };
    }
    if (dayInfo.isFertile) {
      return {
        bg: colors.secondaryLight,
        color: colors.secondary,
        label: `Cycle Day ${dayInfo.cycleDay} • Fertile Window`,
        icon: 'heart',
      };
    }
    return {
      bg: colors.background,
      color: colors.textSecondary,
      label: `Cycle Day ${dayInfo.cycleDay} • ${dayInfo.phase}`,
      icon: 'calendar',
    };
  };

  const badge = getBadgeStyle();

  return (
    <View style={[styles.card, { backgroundColor: colors.cardBackground, borderColor: colors.cardBorder, ...(shadows.card as object) }]}>
      <View style={styles.topRow}>
        <View style={styles.dateCol}>
          <Text style={[styles.dateTitle, { color: colors.textPrimary }]}>{formattedFullDate}</Text>
          <View style={[styles.phasePill, { backgroundColor: badge.bg }]}>
            <Ionicons name={badge.icon as any} size={12} color={badge.color} style={{ marginRight: 5 }} />
            <Text style={[styles.phaseText, { color: badge.color }]}>{badge.label}</Text>
          </View>
        </View>

        {onLogPress && (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Log symptoms for date"
            onPress={onLogPress}
            style={({ pressed }) => [
              styles.logBtn,
              {
                backgroundColor: pressed ? colors.primaryPressed : colors.primary,
                ...(shadows.primaryButton as object),
              },
              pressed && { transform: [{ scale: 0.96 }] },
            ]}>
            <Ionicons name="add" size={16} color="#FFFFFF" />
            <Text style={styles.logBtnText}>Log</Text>
          </Pressable>
        )}
      </View>

      <View style={[styles.metaRow, { borderTopColor: colors.divider }]}>
        <View style={styles.metaItem}>
          <Text style={[styles.metaLabel, { color: colors.textMuted }]}>PREGNANCY CHANCE</Text>
          <View style={styles.metaValueRow}>
            <View
              style={[
                styles.chanceDot,
                {
                  backgroundColor:
                    dayInfo.pregnancyChance === 'High'
                      ? colors.chanceHigh
                      : dayInfo.pregnancyChance === 'Medium'
                      ? colors.chanceMedium
                      : colors.chanceLow,
                },
              ]}
            />
            <Text style={[styles.metaValueText, { color: colors.textPrimary }]}>{dayInfo.pregnancyChance}</Text>
          </View>
        </View>

        <View style={[styles.metaDivider, { backgroundColor: colors.divider }]} />

        <View style={styles.metaItem}>
          <Text style={[styles.metaLabel, { color: colors.textMuted }]}>CYCLE PROGRESS</Text>
          <Text style={[styles.metaValueText, { color: colors.textPrimary }]}>Day {dayInfo.cycleDay} of 28</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 22,
    padding: 18,
    marginHorizontal: 20,
    marginBottom: 16,
    borderWidth: 1,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 14,
  },
  dateCol: { flex: 1 },
  dateTitle: { fontSize: 16, fontWeight: '800', marginBottom: 6 },
  phasePill: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  phaseText: { fontSize: 12, fontWeight: '700' },
  logBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 18,
    paddingVertical: 8,
    paddingHorizontal: 14,
    gap: 4,
  },
  logBtnText: { color: '#FFFFFF', fontSize: 13, fontWeight: '700' },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    paddingTop: 12,
  },
  metaItem: { flex: 1 },
  metaDivider: { width: 1, height: 28, marginHorizontal: 12 },
  metaLabel: { fontSize: 10, fontWeight: '700', letterSpacing: 0.8, marginBottom: 4 },
  metaValueRow: { flexDirection: 'row', alignItems: 'center' },
  chanceDot: { width: 7, height: 7, borderRadius: 3.5, marginRight: 6 },
  metaValueText: { fontSize: 14, fontWeight: '700' },
});
