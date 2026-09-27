import React, { useState } from 'react';
import {
  Modal,
  StyleSheet,
  View,
  Text,
  Pressable,
  ScrollView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRamoneTheme } from '@/context/theme-context';

export interface SymptomItem {
  id: string;
  name: string;
  emoji: string;
  category: 'mood' | 'physical' | 'bleeding';
}

const AVAILABLE_SYMPTOMS: SymptomItem[] = [
  { id: 'cramps', name: 'Mild Cramps', emoji: '⚡', category: 'physical' },
  { id: 'headache', name: 'Headache', emoji: '🤕', category: 'physical' },
  { id: 'tender_breasts', name: 'Tender Breasts', emoji: '🌸', category: 'physical' },
  { id: 'bloating', name: 'Bloating', emoji: '🎈', category: 'physical' },
  { id: 'clear_skin', name: 'Glowing Skin', emoji: '✨', category: 'physical' },
  { id: 'fatigue', name: 'Fatigue', emoji: '🥱', category: 'physical' },

  { id: 'happy', name: 'Happy & Calm', emoji: '😊', category: 'mood' },
  { id: 'energetic', name: 'High Energy', emoji: '🔥', category: 'mood' },
  { id: 'productive', name: 'Super Focused', emoji: '🎯', category: 'mood' },
  { id: 'anxious', name: 'Anxious', emoji: '💭', category: 'mood' },
  { id: 'irritated', name: 'Irritable', emoji: '⚡', category: 'mood' },

  { id: 'spotting', name: 'Spotting', emoji: '💧', category: 'bleeding' },
  { id: 'light_bleeding', name: 'Light Bleeding', emoji: '🩸', category: 'bleeding' },
  { id: 'medium_bleeding', name: 'Medium Bleeding', emoji: '🩸🩸', category: 'bleeding' },
];

export interface LogSymptomsModalProps {
  visible: boolean;
  onClose: () => void;
  selectedIds: string[];
  onSave: (ids: string[]) => void;
}

export function LogSymptomsModal({
  visible,
  onClose,
  selectedIds,
  onSave,
}: LogSymptomsModalProps) {
  const { colors, shadows } = useRamoneTheme();
  const [currentSelected, setCurrentSelected] = useState<string[]>(selectedIds);
  const [prevSelected, setPrevSelected] = useState<string[]>(selectedIds);

  if (prevSelected !== selectedIds) {
    setPrevSelected(selectedIds);
    setCurrentSelected(selectedIds);
  }

  const toggleSymptom = (id: string) => {
    if (currentSelected.includes(id)) {
      setCurrentSelected(currentSelected.filter((item) => item !== id));
    } else {
      setCurrentSelected([...currentSelected, id]);
    }
  };

  const handleSave = () => {
    onSave(currentSelected);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={[styles.sheetContainer, { backgroundColor: colors.cardBackground, ...(shadows.heroCircle as object) }]}>
          <View style={styles.handleBar} />

          <View style={[styles.header, { borderBottomColor: colors.divider }]}>
            <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Log Symptoms</Text>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Close"
              onPress={onClose}
              style={({ pressed }) => [styles.closeBtn, pressed && { opacity: 0.6 }]}>
              <Ionicons name="close" size={24} color={colors.textPrimary} />
            </Pressable>
          </View>

          <ScrollView
            style={styles.scrollContent}
            contentContainerStyle={styles.scrollInner}
            showsVerticalScrollIndicator={false}>
            <Text style={[styles.sectionTitle, { color: colors.primary }]}>PHYSICAL & BODY</Text>
            <View style={styles.chipsRow}>
              {AVAILABLE_SYMPTOMS.filter((s) => s.category === 'physical').map((s) => {
                const isSelected = currentSelected.includes(s.id);
                return (
                  <Pressable
                    key={s.id}
                    onPress={() => toggleSymptom(s.id)}
                    style={({ pressed }) => [
                      styles.chip,
                      { backgroundColor: colors.background, borderColor: colors.cardBorder },
                      isSelected && { backgroundColor: colors.primaryLight, borderColor: colors.primary },
                      pressed && { opacity: 0.8 },
                    ]}>
                    <Text style={styles.chipEmoji}>{s.emoji}</Text>
                    <Text
                      style={[
                        styles.chipText,
                        { color: colors.textSecondary },
                        isSelected && { color: colors.primaryDark, fontWeight: '700' },
                      ]}>
                      {s.name}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            <Text style={[styles.sectionTitle, { color: colors.primary }]}>MOOD & ENERGY</Text>
            <View style={styles.chipsRow}>
              {AVAILABLE_SYMPTOMS.filter((s) => s.category === 'mood').map((s) => {
                const isSelected = currentSelected.includes(s.id);
                return (
                  <Pressable
                    key={s.id}
                    onPress={() => toggleSymptom(s.id)}
                    style={({ pressed }) => [
                      styles.chip,
                      { backgroundColor: colors.background, borderColor: colors.cardBorder },
                      isSelected && { backgroundColor: colors.primaryLight, borderColor: colors.primary },
                      pressed && { opacity: 0.8 },
                    ]}>
                    <Text style={styles.chipEmoji}>{s.emoji}</Text>
                    <Text
                      style={[
                        styles.chipText,
                        { color: colors.textSecondary },
                        isSelected && { color: colors.primaryDark, fontWeight: '700' },
                      ]}>
                      {s.name}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            <Text style={[styles.sectionTitle, { color: colors.primary }]}>BLEEDING & SPOTTING</Text>
            <View style={styles.chipsRow}>
              {AVAILABLE_SYMPTOMS.filter((s) => s.category === 'bleeding').map((s) => {
                const isSelected = currentSelected.includes(s.id);
                return (
                  <Pressable
                    key={s.id}
                    onPress={() => toggleSymptom(s.id)}
                    style={({ pressed }) => [
                      styles.chip,
                      { backgroundColor: colors.background, borderColor: colors.cardBorder },
                      isSelected && { backgroundColor: colors.primaryLight, borderColor: colors.primary },
                      pressed && { opacity: 0.8 },
                    ]}>
                    <Text style={styles.chipEmoji}>{s.emoji}</Text>
                    <Text
                      style={[
                        styles.chipText,
                        { color: colors.textSecondary },
                        isSelected && { color: colors.primaryDark, fontWeight: '700' },
                      ]}>
                      {s.name}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </ScrollView>

          <View style={[styles.footer, { borderTopColor: colors.divider }]}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Save Symptoms"
              onPress={handleSave}
              style={({ pressed }) => [
                styles.saveButton,
                { backgroundColor: colors.primary, ...(shadows.primaryButton as object) },
                pressed && { opacity: 0.9, transform: [{ scale: 0.99 }] },
              ]}>
              <Text style={styles.saveButtonText}>
                Save Logged ({currentSelected.length})
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(44, 34, 41, 0.45)',
    justifyContent: 'flex-end',
  },
  sheetContainer: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    maxHeight: '80%',
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
  },
  handleBar: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#E0D4DC',
    alignSelf: 'center',
    marginTop: 10,
    marginBottom: 6,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  headerTitle: { fontSize: 20, fontWeight: '700' },
  closeBtn: { padding: 4 },
  scrollContent: { paddingHorizontal: 20 },
  scrollInner: { paddingVertical: 14, gap: 12 },
  sectionTitle: { fontSize: 11, fontWeight: '700', letterSpacing: 0.8, marginTop: 8 },
  chipsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 8 },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 14,
    gap: 6,
  },
  chipEmoji: { fontSize: 15 },
  chipText: { fontSize: 13, fontWeight: '600' },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 12,
    borderTopWidth: 1,
  },
  saveButton: {
    borderRadius: 24,
    paddingVertical: 14,
    alignItems: 'center',
  },
  saveButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
});
