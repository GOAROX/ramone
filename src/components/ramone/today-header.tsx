import React, { useMemo } from 'react';
import { StyleSheet, View, Text, Pressable, Platform, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRamoneTheme } from '@/context/theme-context';

interface TodayHeaderProps {
  onCalendarPress?: () => void;
  selectedDate?: Date;
  onSelectDate?: (date: Date) => void;
}

export function TodayHeader({
  onCalendarPress,
  selectedDate = new Date(),
  onSelectDate,
}: TodayHeaderProps) {
  const { colors, shadows } = useRamoneTheme();
  const insets = useSafeAreaInsets();
  const topInset = Math.max(
    insets.top,
    Platform.OS === 'android' ? (StatusBar.currentHeight ?? 28) : 0
  );

  const formattedMonthYear = useMemo(() => {
    return selectedDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  }, [selectedDate]);

  const weekDays = useMemo(() => {
    const today = new Date();
    const days = [];
    for (let i = -3; i <= 3; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      days.push({
        date: d,
        dayName: d.toLocaleDateString('en-US', { weekday: 'narrow' }),
        dayNumber: d.getDate(),
        isToday: d.toDateString() === today.toDateString(),
        isSelected: d.toDateString() === selectedDate.toDateString(),
        isFertile: i >= -1 && i <= 3,
        isPeriod: i <= -7 && i >= -11,
      });
    }
    return days;
  }, [selectedDate]);

  return (
    <View style={[styles.container, { paddingTop: topInset + 8 }]}>
      <View style={styles.topRow}>
        <View style={styles.titleContainer}>
          <Text style={[styles.monthSubtitle, { color: colors.primary }]}>
            RAMONE • {formattedMonthYear.toUpperCase()}
          </Text>
          <Text style={[styles.title, { color: colors.textPrimary }]}>Today</Text>
        </View>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Open Calendar"
          onPress={onCalendarPress}
          hitSlop={{ top: 14, bottom: 14, left: 14, right: 14 }}
          style={({ pressed }) => [
            styles.iconButton,
            {
              backgroundColor: colors.cardBackground,
              borderColor: colors.cardBorder,
              ...(shadows.card as object),
            },
            pressed && { backgroundColor: colors.primaryLighter, transform: [{ scale: 0.94 }] },
          ]}>
          <Ionicons name="calendar-outline" size={22} color={colors.primary} />
          <View style={styles.calendarBadge}>
            <Text style={[styles.calendarBadgeText, { color: colors.primary }]}>
              {selectedDate.getDate()}
            </Text>
          </View>
        </Pressable>
      </View>

      <View style={[styles.weekStrip, { backgroundColor: colors.cardBackground, borderColor: colors.cardBorder, ...(shadows.card as object) }]}>
        {weekDays.map((item, index) => (
          <Pressable
            key={index}
            onPress={() => onSelectDate?.(item.date)}
            style={({ pressed }) => [
              styles.dayCell,
              item.isSelected && { backgroundColor: colors.primaryLighter },
              pressed && { opacity: 0.75 },
            ]}>
            <Text style={[
              styles.dayName,
              { color: item.isSelected ? colors.primary : colors.textMuted },
              item.isSelected && { fontWeight: '700' },
            ]}>
              {item.dayName}
            </Text>

            <View style={[
              styles.dayNumberContainer,
              item.isSelected && { backgroundColor: colors.primary },
              !item.isSelected && item.isToday && { borderWidth: 1.5, borderColor: colors.primary },
            ]}>
              <Text style={[
                styles.dayNumber,
                { color: item.isSelected ? '#FFFFFF' : item.isToday ? colors.primary : colors.textPrimary },
                (item.isSelected || item.isToday) && { fontWeight: '800' },
              ]}>
                {item.dayNumber}
              </Text>
            </View>

            <View style={styles.indicatorContainer}>
              {item.isFertile ? (
                <View style={[styles.dot, { backgroundColor: colors.secondary }]} />
              ) : item.isPeriod ? (
                <View style={[styles.dot, { backgroundColor: colors.primary }]} />
              ) : (
                <View style={styles.dot} />
              )}
            </View>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: 20, paddingBottom: 16 },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    minHeight: 50,
  },
  titleContainer: { gap: 2, justifyContent: 'center' },
  monthSubtitle: { fontSize: 11, fontWeight: '700', letterSpacing: 1.2 },
  title: { fontSize: 34, fontWeight: '800', letterSpacing: -0.5 },
  iconButton: {
    width: 46,
    height: 46,
    borderRadius: 23,
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  calendarBadge: { position: 'absolute', top: 15, justifyContent: 'center', alignItems: 'center' },
  calendarBadgeText: { fontSize: 8, fontWeight: '800' },
  weekStrip: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 6,
    borderWidth: 1,
  },
  dayCell: { flex: 1, alignItems: 'center', paddingVertical: 4, borderRadius: 14 },
  dayName: { fontSize: 12, fontWeight: '600', marginBottom: 6 },
  dayNumberContainer: { width: 32, height: 32, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
  dayNumber: { fontSize: 14, fontWeight: '600' },
  indicatorContainer: { height: 6, justifyContent: 'center', alignItems: 'center', marginTop: 4 },
  dot: { width: 5, height: 5, borderRadius: 2.5 },
});
