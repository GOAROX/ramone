import React from 'react';
import { StyleSheet, View, Text, ScrollView, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRamoneTheme } from '@/context/theme-context';

export interface LoggedSymptomsBarProps {
  selectedSymptoms: string[];
  onOpenLog: () => void;
  onRemoveSymptom?: (id: string) => void;
}

const SYMPTOM_LABELS: Record<string, { label: string; emoji: string }> = {
  cramps: { label: 'Mild Cramps', emoji: '⚡' },
  headache: { label: 'Headache', emoji: '🤕' },
  tender_breasts: { label: 'Tender Breasts', emoji: '🌸' },
  bloating: { label: 'Bloating', emoji: '🎈' },
  clear_skin: { label: 'Glowing Skin', emoji: '✨' },
  fatigue: { label: 'Fatigue', emoji: '🥱' },
  happy: { label: 'Happy & Calm', emoji: '😊' },
  energetic: { label: 'High Energy', emoji: '🔥' },
  productive: { label: 'Super Focused', emoji: '🎯' },
  anxious: { label: 'Anxious', emoji: '💭' },
  irritated: { label: 'Irritable', emoji: '⚡' },
  spotting: { label: 'Spotting', emoji: '💧' },
  light_bleeding: { label: 'Light Bleeding', emoji: '🩸' },
  medium_bleeding: { label: 'Medium Bleeding', emoji: '🩸🩸' },
};

export function LoggedSymptomsBar({
  selectedSymptoms,
  onOpenLog,
  onRemoveSymptom,
}: LoggedSymptomsBarProps) {
  const { colors, shadows } = useRamoneTheme();

  if (selectedSymptoms.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Log today's symptoms"
          onPress={onOpenLog}
          style={({ pressed }) => [
            styles.emptyBar,
            { backgroundColor: colors.cardBackground, borderColor: colors.cardBorder },
            pressed && { opacity: 0.8 },
          ]}>
          <Ionicons name="add-circle-outline" size={18} color={colors.primary} style={{ marginRight: 6 }} />
          <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
            No symptoms logged yet today — <Text style={[styles.emptyHighlight, { color: colors.primary }]}>tap to log</Text>
          </Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.textMuted }]}>LOGGED TODAY</Text>
        <Pressable onPress={onOpenLog}>
          <Text style={[styles.editAction, { color: colors.primary }]}>Edit</Text>
        </Pressable>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollList}>
        {selectedSymptoms.map((id) => {
          const item = SYMPTOM_LABELS[id] || { label: id, emoji: '✨' };
          return (
            <View key={id} style={[styles.chip, { backgroundColor: colors.cardBackground, borderColor: colors.cardBorder, ...(shadows.card as object) }]}>
              <Text style={styles.chipEmoji}>{item.emoji}</Text>
              <Text style={[styles.chipText, { color: colors.textPrimary }]}>{item.label}</Text>
              {onRemoveSymptom && (
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={`Remove ${item.label}`}
                  onPress={() => onRemoveSymptom(id)}
                  style={styles.chipRemove}>
                  <Ionicons name="close-circle" size={14} color={colors.textMuted} />
                </Pressable>
              )}
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginHorizontal: 20, marginTop: 8, marginBottom: 4 },
  emptyContainer: { marginHorizontal: 20, marginTop: 6, marginBottom: 4 },
  emptyBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderStyle: 'dashed',
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  emptyText: { fontSize: 12, fontWeight: '500' },
  emptyHighlight: { fontWeight: '700' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: { fontSize: 11, fontWeight: '700', letterSpacing: 0.8 },
  editAction: { fontSize: 12, fontWeight: '700' },
  scrollList: { gap: 8, paddingVertical: 2 },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 16,
    paddingVertical: 6,
    paddingLeft: 10,
    paddingRight: 8,
  },
  chipEmoji: { fontSize: 13, marginRight: 5 },
  chipText: { fontSize: 12, fontWeight: '600' },
  chipRemove: { marginLeft: 6, padding: 2 },
});
