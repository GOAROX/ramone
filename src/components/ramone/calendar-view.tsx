import React from 'react';
import { StyleSheet, View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRamoneTheme } from '@/context/theme-context';
import { DayCycleInfo } from '@/utils/cycle-calculator';

export interface CalendarViewProps {
  currentDate: Date;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onJumpToToday: () => void;
  days: DayCycleInfo[];
  selectedDate: Date;
  onSelectDay: (day: DayCycleInfo) => void;
}

const WEEK_DAYS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

export function CalendarView({
  currentDate,
  onPrevMonth,
  onNextMonth,
  onJumpToToday,
  days,
  selectedDate,
  onSelectDay,
}: CalendarViewProps) {
  const { colors, shadows } = useRamoneTheme();

  const monthYearString = currentDate.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  const isCurrentMonth =
    currentDate.getMonth() === new Date().getMonth() &&
    currentDate.getFullYear() === new Date().getFullYear();

  return (
    <View style={[styles.card, { backgroundColor: colors.cardBackground, borderColor: colors.cardBorder, ...(shadows.card as object) }]}>
      <View style={styles.navHeader}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Previous month"
          onPress={onPrevMonth}
          hitSlop={12}
          style={({ pressed }) => [
            styles.navBtn,
            { backgroundColor: colors.background, borderColor: colors.cardBorder },
            pressed && { backgroundColor: colors.primaryLight, transform: [{ scale: 0.95 }] },
          ]}>
          <Ionicons name="chevron-back" size={20} color={colors.textPrimary} />
        </Pressable>

        <View style={styles.monthTitleWrapper}>
          <Text style={[styles.monthTitle, { color: colors.textPrimary }]}>{monthYearString}</Text>
          {!isCurrentMonth && (
            <Pressable
              onPress={onJumpToToday}
              style={({ pressed }) => [
                styles.todayJumpPill,
                { backgroundColor: colors.primaryLight },
                pressed && { opacity: 0.7 },
              ]}>
              <Text style={[styles.todayJumpText, { color: colors.primary }]}>Today</Text>
            </Pressable>
          )}
        </View>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Next month"
          onPress={onNextMonth}
          hitSlop={12}
          style={({ pressed }) => [
            styles.navBtn,
            { backgroundColor: colors.background, borderColor: colors.cardBorder },
            pressed && { backgroundColor: colors.primaryLight, transform: [{ scale: 0.95 }] },
          ]}>
          <Ionicons name="chevron-forward" size={20} color={colors.textPrimary} />
        </Pressable>
      </View>

      <View style={styles.weekdayRow}>
        {WEEK_DAYS.map((wd, idx) => (
          <View key={idx} style={styles.weekdayCell}>
            <Text style={[styles.weekdayText, { color: colors.textMuted }]}>{wd}</Text>
          </View>
        ))}
      </View>

      <View style={styles.grid}>
        {days.map((dayInfo, idx) => {
          const isSelected =
            dayInfo.date.toDateString() === selectedDate.toDateString();

          return (
            <Pressable
              key={idx}
              onPress={() => onSelectDay(dayInfo)}
              style={({ pressed }) => [styles.dayCell, pressed && { opacity: 0.75 }]}>
              <View
                style={[
                  styles.dayInner,
                  dayInfo.isPeriod && { backgroundColor: colors.primaryLight },
                  dayInfo.isFertile && !dayInfo.isPeriod && { backgroundColor: colors.secondaryLight },
                  dayInfo.isToday && { borderWidth: 2, borderColor: colors.primary },
                  isSelected && { borderWidth: 2, borderColor: colors.textPrimary, backgroundColor: colors.background },
                ]}>
                <Text
                  style={[
                    styles.dayText,
                    { color: colors.textPrimary },
                    !dayInfo.isCurrentMonth && { color: '#D4CBD1' },
                    dayInfo.isPeriod && { color: colors.primaryDark, fontWeight: '800' },
                    dayInfo.isFertile && !dayInfo.isPeriod && { color: colors.secondary, fontWeight: '700' },
                    dayInfo.isToday && { color: colors.primary, fontWeight: '800' },
                    isSelected && { color: colors.textPrimary, fontWeight: '900' },
                  ]}>
                  {dayInfo.dayOfMonth}
                </Text>

                {dayInfo.isCurrentMonth && (
                  <View style={styles.dotRow}>
                    {dayInfo.isOvulation ? (
                      <Ionicons name="sparkles" size={8} color={colors.secondary} />
                    ) : dayInfo.isPeriod ? (
                      <View style={[styles.miniDot, { backgroundColor: colors.primary }]} />
                    ) : dayInfo.isFertile ? (
                      <View style={[styles.miniDot, { backgroundColor: colors.secondary }]} />
                    ) : null}
                  </View>
                )}
              </View>
            </Pressable>
          );
        })}
      </View>

      <View style={[styles.legendRow, { borderTopColor: colors.divider }]}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: colors.primary }]} />
          <Text style={[styles.legendText, { color: colors.textSecondary }]}>Period</Text>
        </View>

        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: colors.secondaryLight, borderWidth: 1, borderColor: colors.secondary }]} />
          <Text style={[styles.legendText, { color: colors.textSecondary }]}>Fertile</Text>
        </View>

        <View style={styles.legendItem}>
          <Ionicons name="sparkles" size={10} color={colors.secondary} style={{ marginRight: 4 }} />
          <Text style={[styles.legendText, { color: colors.textSecondary }]}>Ovulation</Text>
        </View>

        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { borderWidth: 1.5, borderColor: colors.primary, backgroundColor: 'transparent' }]} />
          <Text style={[styles.legendText, { color: colors.textSecondary }]}>Today</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 24,
    padding: 18,
    marginHorizontal: 20,
    marginTop: 12,
    marginBottom: 16,
    borderWidth: 1,
  },
  navHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  navBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  monthTitleWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  monthTitle: { fontSize: 19, fontWeight: '800' },
  todayJumpPill: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  todayJumpText: { fontSize: 11, fontWeight: '700' },
  weekdayRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
    paddingHorizontal: 2,
  },
  weekdayCell: { flex: 1, alignItems: 'center' },
  weekdayText: { fontSize: 11, fontWeight: '700', letterSpacing: 0.5 },
  grid: { flexDirection: 'row', flexWrap: 'wrap' },
  dayCell: {
    width: '14.28%',
    aspectRatio: 1,
    padding: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayInner: {
    width: '100%',
    height: '100%',
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  dayText: { fontSize: 14, fontWeight: '600' },
  dotRow: {
    position: 'absolute',
    bottom: 3,
    height: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  miniDot: { width: 4, height: 4, borderRadius: 2 },
  legendRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopWidth: 1,
    marginTop: 14,
    paddingTop: 12,
  },
  legendItem: { flexDirection: 'row', alignItems: 'center' },
  legendDot: { width: 8, height: 8, borderRadius: 4, marginRight: 5 },
  legendText: { fontSize: 11, fontWeight: '600' },
});
