import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Pressable,
  StatusBar,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRamoneTheme } from '@/context/theme-context';
import { RAMONE_VARIANTS, RamoneColorVariant } from '@/constants/color-variants';

export default function ExploreScreen() {
  const { variantId, colors, shadows, setVariant } = useRamoneTheme();
  const insets = useSafeAreaInsets();
  const topInset = Math.max(
    insets.top,
    Platform.OS === 'android' ? (StatusBar.currentHeight ?? 28) : 0
  );

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
          {/* Header */}
          <View style={styles.headerRow}>
            <View>
              <Text style={[styles.headerSubtitle, { color: colors.primary }]}>
                RAMONE • CUSTOMIZATION
              </Text>
              <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>
                Options & Themes
              </Text>
            </View>
            <View style={[styles.themeBadge, { backgroundColor: colors.primaryLight }]}>
              <Ionicons name="color-palette" size={20} color={colors.primary} />
            </View>
          </View>

          {/* Theme Selector Section */}
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
              Color Schemes & Paint Jobs
            </Text>
            <Text style={[styles.sectionSub, { color: colors.textMuted }]}>
              Select a custom color theme inspired by Ramone&apos;s iconic paint shop
            </Text>
          </View>

          <View style={styles.variantsGrid}>
            {RAMONE_VARIANTS.map((v: RamoneColorVariant) => {
              const isActive = v.id === variantId;
              return (
                <Pressable
                  key={v.id}
                  accessibilityRole="button"
                  accessibilityLabel={`Select theme ${v.name}`}
                  onPress={() => setVariant(v.id)}
                  style={({ pressed }) => [
                    styles.variantCard,
                    {
                      backgroundColor: colors.cardBackground,
                      borderColor: isActive ? colors.primary : colors.cardBorder,
                      borderWidth: isActive ? 2 : 1,
                      ...(shadows.card as object),
                    },
                    isActive && { backgroundColor: colors.primaryLighter },
                    pressed && { transform: [{ scale: 0.98 }] },
                  ]}>
                  <View style={styles.variantHeader}>
                    <Text style={styles.variantEmoji}>{v.emoji}</Text>
                    <View style={styles.variantTitleBox}>
                      <Text
                        style={[
                          styles.variantName,
                          { color: isActive ? colors.primaryDark : colors.textPrimary },
                          isActive && { fontWeight: '800' },
                        ]}>
                        {v.name}
                      </Text>
                      <Text style={[styles.variantDesc, { color: colors.textMuted }]}>
                        {v.description}
                      </Text>
                    </View>

                    {isActive ? (
                      <View style={[styles.checkCircle, { backgroundColor: colors.primary }]}>
                        <Ionicons name="checkmark" size={14} color="#FFFFFF" />
                      </View>
                    ) : (
                      <View style={[styles.uncheckCircle, { borderColor: colors.cardBorder }]} />
                    )}
                  </View>

                  {/* Swatch Previews */}
                  <View style={styles.swatchRow}>
                    <View style={styles.swatchItem}>
                      <View style={[styles.swatchCircle, { backgroundColor: v.primary }]} />
                      <Text style={[styles.swatchLabel, { color: colors.textSecondary }]}>
                        Primary ({v.primary})
                      </Text>
                    </View>

                    <View style={styles.swatchItem}>
                      <View style={[styles.swatchCircle, { backgroundColor: v.secondary }]} />
                      <Text style={[styles.swatchLabel, { color: colors.textSecondary }]}>
                        Accent ({v.secondary})
                      </Text>
                    </View>
                  </View>
                </Pressable>
              );
            })}
          </View>

          {/* About & Info Section */}
          <View style={[styles.infoCard, { backgroundColor: colors.cardBackground, borderColor: colors.cardBorder, ...(shadows.card as object) }]}>
            <View style={styles.infoRow}>
              <Ionicons name="sparkles-outline" size={20} color={colors.primary} />
              <Text style={[styles.infoTitle, { color: colors.textPrimary }]}>About Ramone</Text>
            </View>
            <Text style={[styles.infoBody, { color: colors.textSecondary }]}>
              Ramone is a modern, privacy-first cycle tracking assistant inspired by Flo. All data is kept locally on your device with high precision forecast algorithms.
            </Text>
          </View>
        </ScrollView>
      </View>
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
  scrollContent: { paddingHorizontal: 20 },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerSubtitle: { fontSize: 11, fontWeight: '700', letterSpacing: 1.2, marginBottom: 2 },
  headerTitle: { fontSize: 32, fontWeight: '800', letterSpacing: -0.5 },
  themeBadge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionHeader: { marginBottom: 14 },
  sectionTitle: { fontSize: 18, fontWeight: '800', marginBottom: 2 },
  sectionSub: { fontSize: 13 },
  variantsGrid: { gap: 12, marginBottom: 24 },
  variantCard: {
    borderRadius: 20,
    padding: 16,
  },
  variantHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  variantEmoji: { fontSize: 24, marginRight: 12 },
  variantTitleBox: { flex: 1 },
  variantName: { fontSize: 15, fontWeight: '700' },
  variantDesc: { fontSize: 12, marginTop: 2 },
  checkCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  uncheckCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    marginLeft: 8,
  },
  swatchRow: {
    flexDirection: 'row',
    gap: 16,
    borderTopWidth: 1,
    borderTopColor: '#EDE7ED',
    paddingTop: 10,
  },
  swatchItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  swatchCircle: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
  },
  swatchLabel: { fontSize: 11, fontWeight: '600' },
  infoCard: {
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
  },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  infoTitle: { fontSize: 16, fontWeight: '700' },
  infoBody: { fontSize: 13, lineHeight: 19 },
});
