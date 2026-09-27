import React, { useState } from 'react';
import {
  Modal,
  StyleSheet,
  View,
  Text,
  Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRamoneTheme } from '@/context/theme-context';

export interface EditPeriodModalProps {
  visible: boolean;
  onClose: () => void;
  cycleLength: number;
  periodLength: number;
  onSave: (cycleLen: number, periodLen: number) => void;
}

export function EditPeriodModal({
  visible,
  onClose,
  cycleLength: initialCycleLen = 28,
  periodLength: initialPeriodLen = 5,
  onSave,
}: EditPeriodModalProps) {
  const { colors, shadows } = useRamoneTheme();
  const [cycleLen, setCycleLen] = useState(initialCycleLen);
  const [periodLen, setPeriodLen] = useState(initialPeriodLen);

  const handleSave = () => {
    onSave(cycleLen, periodLen);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={[styles.dialogContainer, { backgroundColor: colors.cardBackground, ...(shadows.card as object) }]}>
          <View style={styles.header}>
            <View style={styles.titleRow}>
              <Ionicons name="calendar" size={22} color={colors.primary} style={{ marginRight: 8 }} />
              <Text style={[styles.title, { color: colors.textPrimary }]}>Edit Period & Cycle</Text>
            </View>
            <Pressable onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={22} color={colors.textMuted} />
            </Pressable>
          </View>

          <View style={styles.content}>
            <View style={styles.row}>
              <View>
                <Text style={[styles.label, { color: colors.textPrimary }]}>Period Length</Text>
                <Text style={[styles.sublabel, { color: colors.textMuted }]}>Typical days of bleeding</Text>
              </View>
              <View style={[styles.stepper, { backgroundColor: colors.background, borderColor: colors.cardBorder }]}>
                <Pressable onPress={() => setPeriodLen(Math.max(2, periodLen - 1))} style={styles.stepBtn}>
                  <Ionicons name="remove" size={18} color={colors.textPrimary} />
                </Pressable>
                <Text style={[styles.stepVal, { color: colors.textPrimary }]}>{periodLen} days</Text>
                <Pressable onPress={() => setPeriodLen(Math.min(10, periodLen + 1))} style={styles.stepBtn}>
                  <Ionicons name="add" size={18} color={colors.textPrimary} />
                </Pressable>
              </View>
            </View>

            <View style={[styles.row, { marginTop: 16 }]}>
              <View>
                <Text style={[styles.label, { color: colors.textPrimary }]}>Cycle Length</Text>
                <Text style={[styles.sublabel, { color: colors.textMuted }]}>Average days between periods</Text>
              </View>
              <View style={[styles.stepper, { backgroundColor: colors.background, borderColor: colors.cardBorder }]}>
                <Pressable onPress={() => setCycleLen(Math.max(21, cycleLen - 1))} style={styles.stepBtn}>
                  <Ionicons name="remove" size={18} color={colors.textPrimary} />
                </Pressable>
                <Text style={[styles.stepVal, { color: colors.textPrimary }]}>{cycleLen} days</Text>
                <Pressable onPress={() => setCycleLen(Math.min(45, cycleLen + 1))} style={styles.stepBtn}>
                  <Ionicons name="add" size={18} color={colors.textPrimary} />
                </Pressable>
              </View>
            </View>
          </View>

          <View style={styles.footer}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Save Cycle Settings"
              onPress={handleSave}
              style={({ pressed }) => [
                styles.saveButton,
                { backgroundColor: colors.primary, ...(shadows.primaryButton as object) },
                pressed && { opacity: 0.9 },
              ]}>
              <Text style={styles.saveButtonText}>Save Changes</Text>
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
    backgroundColor: 'rgba(44, 34, 41, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  dialogContainer: {
    width: '100%',
    maxWidth: 400,
    borderRadius: 24,
    padding: 22,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  titleRow: { flexDirection: 'row', alignItems: 'center' },
  title: { fontSize: 18, fontWeight: '700' },
  closeBtn: { padding: 4 },
  content: { marginBottom: 20 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  label: { fontSize: 15, fontWeight: '600' },
  sublabel: { fontSize: 12, marginTop: 2 },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 1,
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  stepBtn: {
    width: 32,
    height: 32,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepVal: {
    fontSize: 13,
    fontWeight: '700',
    minWidth: 58,
    textAlign: 'center',
  },
  footer: { marginTop: 4 },
  saveButton: {
    borderRadius: 22,
    paddingVertical: 13,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});
