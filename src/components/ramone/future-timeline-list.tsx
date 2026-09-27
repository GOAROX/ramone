import React from 'react';
import { StyleSheet, View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRamoneTheme } from '@/context/theme-context';
import { PredictedCycleMilestone } from '@/utils/cycle-calculator';

export interface FutureTimelineListProps {
  milestones: PredictedCycleMilestone[];
  onSelectMilestoneMonth: (date: Date) => void;
}

export function FutureTimelineList({
  milestones,
  onSelectMilestoneMonth,
}: FutureTimelineListProps) {
  const { colors, shadows } = useRamoneTheme();
  const upcoming = milestones.slice(1, 5);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={[styles.sectionSubtitle, { color: colors.primary }]}>FUTURE PREDICTIONS</Text>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Predicted Cycle Timelines</Text>
        </View>
        <Ionicons name="time-outline" size={20} color={colors.primary} />
      </View>

      <View style={styles.list}>
        {upcoming.map((item, index) => {
          const monthName = item.periodStartDate.toLocaleDateString('en-US', { month: 'short' });
          const periodStartDay = item.periodStartDate.getDate();
          const periodEndDay = item.periodEndDate.getDate();
          const fertileStartDay = item.fertileStartDate.getDate();
          const fertileEndDay = item.fertileEndDate.getDate();
          const ovulationMonth = item.ovulationDate.toLocaleDateString('en-US', { month: 'short' });
          const ovulationDay = item.ovulationDate.getDate();
          const isNextCycle = index === 0;

          return (
            <Pressable
              key={index}
              onPress={() => onSelectMilestoneMonth(item.periodStartDate)}
              style={({ pressed }) => [
                styles.cycleCard,
                {
                  backgroundColor: colors.cardBackground,
                  borderColor: isNextCycle ? colors.primaryLight : colors.cardBorder,
                  ...(shadows.card as object),
                },
                pressed && { opacity: 0.8 },
              ]}>
              <View style={styles.cycleHeaderRow}>
                <View style={styles.cycleTitleGroup}>
                  <Text style={[styles.cycleTitle, { color: colors.textPrimary }]}>
                    {isNextCycle ? 'Next Cycle' : `Cycle in ${item.periodStartDate.toLocaleDateString('en-US', { month: 'long' })}`}
                  </Text>
                  <Text style={[styles.cycleDates, { color: colors.textMuted }]}>
                    Starts {monthName} {periodStartDay}
                  </Text>
                </View>

                {item.daysUntilPeriod > 0 && (
                  <View style={[
                    styles.countdownPill,
                    {
                      backgroundColor: isNextCycle ? colors.primaryLight : colors.background,
                      borderColor: colors.cardBorder,
                    },
                  ]}>
                    <Text style={[
                      styles.countdownText,
                      { color: isNextCycle ? colors.primaryDark : colors.textSecondary },
                    ]}>
                      In {item.daysUntilPeriod} days
                    </Text>
                  </View>
                )}
              </View>

              <View style={[styles.detailGrid, { backgroundColor: colors.background }]}>
                <View style={styles.detailBox}>
                  <View style={styles.detailIconRow}>
                    <View style={[styles.microDot, { backgroundColor: colors.primary }]} />
                    <Text style={[styles.detailLabel, { color: colors.textMuted }]}>Period</Text>
                  </View>
                  <Text style={[styles.detailValue, { color: colors.textPrimary }]}>
                    {monthName} {periodStartDay}–{periodEndDay}
                  </Text>
                </View>

                <View style={styles.detailBox}>
                  <View style={styles.detailIconRow}>
                    <View style={[styles.microDot, { backgroundColor: colors.secondary }]} />
                    <Text style={[styles.detailLabel, { color: colors.textMuted }]}>Fertile</Text>
                  </View>
                  <Text style={[styles.detailValue, { color: colors.textPrimary }]}>
                    {monthName} {fertileStartDay}–{fertileEndDay}
                  </Text>
                </View>

                <View style={styles.detailBox}>
                  <View style={styles.detailIconRow}>
                    <Ionicons name="sparkles" size={10} color={colors.secondary} style={{ marginRight: 3 }} />
                    <Text style={[styles.detailLabel, { color: colors.textMuted }]}>Ovulation</Text>
                  </View>
                  <Text style={[styles.detailValue, { color: colors.textPrimary }]}>
                    {ovulationMonth} {ovulationDay}
                  </Text>
                </View>
              </View>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginHorizontal: 20, marginBottom: 30 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionSubtitle: { fontSize: 11, fontWeight: '700', letterSpacing: 1, marginBottom: 2 },
  sectionTitle: { fontSize: 20, fontWeight: '800' },
  list: { gap: 12 },
  cycleCard: { borderRadius: 20, padding: 16, borderWidth: 1 },
  cycleHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cycleTitleGroup: { gap: 2 },
  cycleTitle: { fontSize: 16, fontWeight: '700' },
  cycleDates: { fontSize: 12 },
  countdownPill: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
    borderWidth: 1,
  },
  countdownText: { fontSize: 12, fontWeight: '700' },
  detailGrid: {
    flexDirection: 'row',
    borderRadius: 14,
    padding: 10,
    justifyContent: 'space-between',
  },
  detailBox: { flex: 1, alignItems: 'center' },
  detailIconRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  microDot: { width: 6, height: 6, borderRadius: 3, marginRight: 4 },
  detailLabel: { fontSize: 11, fontWeight: '700' },
  detailValue: { fontSize: 12, fontWeight: '700' },
});
