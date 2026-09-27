import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  StatusBar,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useRamoneTheme } from '@/context/theme-context';
import { TodayHeader } from '@/components/ramone/today-header';
import { HeroCircle } from '@/components/ramone/hero-circle';
import { ActionButtons } from '@/components/ramone/action-buttons';
import { LoggedSymptomsBar } from '@/components/ramone/logged-symptoms-bar';
import { DailyInsightCard } from '@/components/ramone/daily-insight-card';
import { LogSymptomsModal } from '@/components/ramone/log-symptoms-modal';
import { EditPeriodModal } from '@/components/ramone/edit-period-modal';

export default function TodayScreen() {
  const { colors } = useRamoneTheme();
  const insets = useSafeAreaInsets();

  // Cycle state
  const [cycleDay, setCycleDay] = useState(12);
  const [totalCycleDays, setTotalCycleDays] = useState(28);
  const [periodLength, setPeriodLength] = useState(5);
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Logged symptoms state
  const [loggedSymptoms, setLoggedSymptoms] = useState<string[]>([
    'energetic',
    'clear_skin',
  ]);

  // Modal visibility
  const [isLogModalVisible, setIsLogModalVisible] = useState(false);
  const [isEditPeriodModalVisible, setIsEditPeriodModalVisible] = useState(false);

  // Derive phase and pregnancy chance based on cycleDay
  const getCycleDetails = (day: number) => {
    if (day <= periodLength) {
      return {
        phase: 'Menstrual Phase',
        chance: 'Low' as const,
        countdown: totalCycleDays - day + 1,
      };
    } else if (day < 14) {
      return {
        phase: 'Follicular Phase',
        chance: day >= 10 ? ('Medium' as const) : ('Low' as const),
        countdown: totalCycleDays - day + 1,
      };
    } else if (day <= 16) {
      return {
        phase: 'Ovulation Phase',
        chance: 'High' as const,
        countdown: totalCycleDays - day + 1,
      };
    } else {
      return {
        phase: 'Luteal Phase',
        chance: 'Low' as const,
        countdown: totalCycleDays - day + 1,
      };
    }
  };

  const currentDetails = getCycleDetails(cycleDay);

  const handleSelectDate = (date: Date) => {
    setSelectedDate(date);
    const today = new Date();
    const diffTime = date.getTime() - today.getTime();
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
    const simulatedDay = Math.min(
      totalCycleDays,
      Math.max(1, 12 + diffDays)
    );
    setCycleDay(simulatedDay);
  };

  const handleRemoveSymptom = (id: string) => {
    setLoggedSymptoms((prev) => prev.filter((s) => s !== id));
  };

  const handleSaveCycleSettings = (newCycleLen: number, newPeriodLen: number) => {
    setTotalCycleDays(newCycleLen);
    setPeriodLength(newPeriodLen);
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
            { paddingBottom: insets.bottom + 85 },
          ]}
          showsVerticalScrollIndicator={false}>
          <TodayHeader
            selectedDate={selectedDate}
            onSelectDate={handleSelectDate}
            onCalendarPress={() => router.push('/calendar')}
          />

          <HeroCircle
            cycleDay={cycleDay}
            totalDays={totalCycleDays}
            phaseName={currentDetails.phase}
            pregnancyChance={currentDetails.chance}
            daysUntilNextPeriod={currentDetails.countdown}
            onPress={() => setIsLogModalVisible(true)}
          />

          <ActionButtons
            loggedSymptomsCount={loggedSymptoms.length}
            onLogSymptoms={() => setIsLogModalVisible(true)}
            onEditPeriod={() => setIsEditPeriodModalVisible(true)}
          />

          <LoggedSymptomsBar
            selectedSymptoms={loggedSymptoms}
            onOpenLog={() => setIsLogModalVisible(true)}
            onRemoveSymptom={handleRemoveSymptom}
          />

          <DailyInsightCard
            category="DAILY INSIGHT"
            title="Energy & Focus Are Peaking ⚡"
            readTime="2 min read • Ramone Health & Wellness"
            snippet="As estrogen rises steadily in your follicular phase, dopamine and serotonin levels get a natural boost. This is your peak window for mental clarity and high stamina."
            fullContent="During days 7–13 of your cycle, follicle-stimulating hormone (FSH) and estradiol climb. You might experience lighter sleep, more vibrant social energy, and enhanced metabolic rate. Tip: Pair complex tasks with resistance training for optimal recovery!"
          />
        </ScrollView>
      </View>

      <LogSymptomsModal
        visible={isLogModalVisible}
        onClose={() => setIsLogModalVisible(false)}
        selectedIds={loggedSymptoms}
        onSave={(newIds) => setLoggedSymptoms(newIds)}
      />

      <EditPeriodModal
        visible={isEditPeriodModalVisible}
        onClose={() => setIsEditPeriodModalVisible(false)}
        cycleLength={totalCycleDays}
        periodLength={periodLength}
        onSave={handleSaveCycleSettings}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
  },
  centeredWrapper: {
    flex: 1,
    width: '100%',
    maxWidth: 600,
    alignSelf: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {},
});
