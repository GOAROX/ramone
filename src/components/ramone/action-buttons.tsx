import React from 'react';
import { StyleSheet, View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRamoneTheme } from '@/context/theme-context';

export interface ActionButtonsProps {
  onLogSymptoms?: () => void;
  onEditPeriod?: () => void;
  loggedSymptomsCount?: number;
}

export function ActionButtons({
  onLogSymptoms,
  onEditPeriod,
  loggedSymptomsCount = 0,
}: ActionButtonsProps) {
  const { colors, shadows } = useRamoneTheme();

  return (
    <View style={styles.container}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Log Symptoms"
        onPress={onLogSymptoms}
        style={({ pressed }) => [
          styles.primaryButton,
          {
            backgroundColor: pressed ? colors.primaryPressed : colors.primary,
            ...(shadows.primaryButton as object),
          },
          pressed && styles.pressed,
        ]}>
        <View style={styles.iconCircle}>
          <Ionicons name="add" size={18} color={colors.primaryDark} />
        </View>
        <Text style={styles.primaryButtonText}>Log Symptoms</Text>
        {loggedSymptomsCount > 0 && (
          <View style={styles.countBadge}>
            <Text style={[styles.countBadgeText, { color: colors.primary }]}>{loggedSymptomsCount}</Text>
          </View>
        )}
      </Pressable>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Edit Period"
        onPress={onEditPeriod}
        style={({ pressed }) => [
          styles.secondaryButton,
          {
            backgroundColor: pressed ? colors.primaryLighter : colors.cardBackground,
            borderColor: colors.coralBorder,
            ...(shadows.card as object),
          },
          pressed && styles.pressed,
        ]}>
        <Ionicons name="calendar-clear-outline" size={18} color={colors.primary} style={styles.secondaryIcon} />
        <Text style={[styles.secondaryButtonText, { color: colors.primary }]}>Edit Period</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    gap: 12,
    marginVertical: 10,
  },
  primaryButton: {
    flex: 1.2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 26,
  },
  pressed: {
    transform: [{ scale: 0.98 }],
    opacity: 0.92,
  },
  iconCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.1,
  },
  countBadge: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 1,
    marginLeft: 6,
  },
  countBadgeText: {
    fontSize: 11,
    fontWeight: '800',
  },
  secondaryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 26,
  },
  secondaryIcon: { marginRight: 6 },
  secondaryButtonText: {
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.1,
  },
});
