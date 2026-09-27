import React, { useState, useMemo } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  StatusBar,
  Platform,
  Pressable,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useRamoneTheme } from '@/context/theme-context';
import {
  getReferencePeriodStart,
  getMonthCalendarGrid,
  getCycleInfoForDate,
  getFuturePredictedCycles,
  DayCycleInfo,
} from '@/utils/cycle-calculator';
import { CalendarView } from '@/components/ramone/calendar-view';
import { SelectedDayCard } from '@/components/ramone/selected-day-card';
import { FutureTimelineList } from '@/components/ramone/future-timeline-list';
import { LogSymptomsModal } from '@/components/ramone/log-symptoms-modal';

export default function CalendarScreen() {
  const { colors, shadows } = useRamoneTheme();
  const insets = useSafeAreaInsets();
  const topInset = Math.max(
    insets.top,
    Platform.OS === 'android' ? (StatusBar.currentHeight ?? 28) : 0
  );

  const today = useMemo(() => new Date(), []);
  const [viewDate, setViewDate] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [cycleLength] = useState(28);
  const [periodLength] = useState(5);

  const [isLogModalVisible, setIsLogModalVisible] = useState(false);
  const [loggedSymptomsByDate, setLoggedSymptomsByDate] = useState<Record<string, string[]>>({});

  const refPeriodStart = useMemo(() => {
    return getReferencePeriodStart(today, 14);
  }, [today]);

  const calendarDays = useMemo(() => {
    return getMonthCalendarGrid(
      viewDate.getFullYear(),
      viewDate.getMonth(),
      refPeriodStart,
      cycleLength,
      periodLength
    );
  }, [viewDate, refPeriodStart, cycleLength, periodLength]);

  const selectedDayInfo: DayCycleInfo = useMemo(() => {
    return getCycleInfoForDate(
      selectedDate,
      refPeriodStart,
      cycleLength,
      periodLength
    );
  }, [selectedDate, refPeriodStart, cycleLength, periodLength]);

  const futureMilestones = useMemo(() => {
    return getFuturePredictedCycles(
      refPeriodStart,
      cycleLength,
      periodLength,
      6
    );
  }, [refPeriodStart, cycleLength, periodLength]);

  const handlePrevMonth = () => {
    const prev = new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1);
    setViewDate(prev);
  };

  const handleNextMonth = () => {
    const next = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1);
    setViewDate(next);
  };

  const handleJumpToToday = () => {
    const t = new Date();
    setViewDate(t);
    setSelectedDate(t);
  };

  const handleSelectDay = (dayInfo: DayCycleInfo) => {
    setSelectedDate(dayInfo.date);
    if (!dayInfo.isCurrentMonth) {
      setViewDate(new Date(dayInfo.date.getFullYear(), dayInfo.date.getMonth(), 1));
    }
  };

  const handleSelectMilestoneMonth = (milestoneDate: Date) => {
    setViewDate(new Date(milestoneDate.getFullYear(), milestoneDate.getMonth(), 1));
    setSelectedDate(milestoneDate);
  };

  const selectedDateKey = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}`;
  const currentSelectedSymptoms = loggedSymptomsByDate[selectedDateKey] || [];

  const handleSaveSymptoms = (newIds: string[]) => {
    setLoggedSymptomsByDate((prev) => ({
      ...prev,
      [selectedDateKey]: newIds,
    }));
  };

  return (
    <View style={[styles.rootContainer, { backgroundColor: colors.background }]}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent={Platform.OS === 'android'}
      />

      <View style={styles.centeredWrapper}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={[
            styles.scrollContent,
            {
              paddingTop: topInset + 8,
              paddingBottom: insets.bottom + 90,
            },
          ]}
          showsVerticalScrollIndicator={false}>
          <View style={styles.headerRow}>
            <View>
              <Text style={[styles.headerSubtitle, { color: colors.primary }]}>RAMONE • CYCLE FORECAST</Text>
              <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Calendar</Text>
            </View>

            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Back to Today"
              onPress={() => router.navigate('/')}
              style={({ pressed }) => [
                styles.todayButton,
                {
                  backgroundColor: colors.cardBackground,
                  borderColor: colors.cardBorder,
                  ...(shadows.card as object),
                },
                pressed && { opacity: 0.8 },
              ]}>
              <Ionicons name="today-outline" size={16} color={colors.primary} />
              <Text style={[styles.todayButtonText, { color: colors.primary }]}>Today</Text>
            </Pressable>
          </View>

          <CalendarView
            currentDate={viewDate}
            onPrevMonth={handlePrevMonth}
            onNextMonth={handleNextMonth}
            onJumpToToday={handleJumpToToday}
            days={calendarDays}
            selectedDate={selectedDate}
            onSelectDay={handleSelectDay}
          />

          <SelectedDayCard
            dayInfo={selectedDayInfo}
            onLogPress={() => setIsLogModalVisible(true)}
          />

          <FutureTimelineList
            milestones={futureMilestones}
            onSelectMilestoneMonth={handleSelectMilestoneMonth}
          />
        </ScrollView>
      </View>

      <LogSymptomsModal
        visible={isLogModalVisible}
        onClose={() => setIsLogModalVisible(false)}
        selectedIds={currentSelectedSymptoms}
        onSave={handleSaveSymptoms}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  rootContainer: { flex: 1 },
  centeredWrapper: {
    flex: 1,
    width: '100%',
    maxWidth: 600,
    alignSelf: 'center',
  },
  scrollView: { flex: 1 },
  scrollContent: { paddingHorizontal: 0 },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 8,
  },
  headerSubtitle: { fontSize: 11, fontWeight: '700', letterSpacing: 1.2, marginBottom: 2 },
  headerTitle: { fontSize: 32, fontWeight: '800', letterSpacing: -0.5 },
  todayButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    gap: 6,
  },
  todayButtonText: { fontSize: 13, fontWeight: '700' },
});
