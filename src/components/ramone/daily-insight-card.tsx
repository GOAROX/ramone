import React, { useState } from 'react';
import { StyleSheet, View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRamoneTheme } from '@/context/theme-context';

export interface DailyInsightCardProps {
  category?: string;
  title?: string;
  readTime?: string;
  snippet?: string;
  fullContent?: string;
}

export function DailyInsightCard({
  category = 'DAILY INSIGHT',
  title = 'Energy & Focus Are Peaking ⚡',
  readTime = '2 min read • Ramone Health & Wellness',
  snippet = 'As estrogen rises steadily in your follicular phase, dopamine and serotonin levels get a natural boost. This is your peak window for mental clarity and high stamina.',
  fullContent = 'During days 7–13 of your cycle, follicle-stimulating hormone (FSH) and estradiol climb. You might experience lighter sleep, more vibrant social energy, and enhanced metabolic rate. Tip: Pair complex tasks with resistance training for optimal recovery!',
}: DailyInsightCardProps) {
  const { colors, shadows } = useRamoneTheme();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <View style={[styles.cardContainer, { backgroundColor: colors.cardBackground, borderColor: colors.cardBorder, ...(shadows.card as object) }]}>
      <View style={styles.headerRow}>
        <View style={[styles.categoryPill, { backgroundColor: colors.secondaryLight }]}>
          <Ionicons name="bulb-outline" size={13} color={colors.secondary} style={styles.categoryIcon} />
          <Text style={[styles.categoryText, { color: colors.secondary }]}>{category}</Text>
        </View>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel={isBookmarked ? 'Remove Bookmark' : 'Bookmark Insight'}
          onPress={() => setIsBookmarked(!isBookmarked)}
          style={({ pressed }) => [styles.bookmarkButton, pressed && { opacity: 0.7 }]}>
          <Ionicons
            name={isBookmarked ? 'bookmark' : 'bookmark-outline'}
            size={18}
            color={isBookmarked ? colors.primary : colors.textMuted}
          />
        </Pressable>
      </View>

      <Text style={[styles.titleText, { color: colors.textPrimary }]}>{title}</Text>

      <Text style={[styles.contentText, { color: colors.textSecondary }]}>
        {isExpanded ? `${snippet}\n\n${fullContent}` : snippet}
      </Text>

      <View style={[styles.footerRow, { borderTopColor: colors.divider }]}>
        <Text style={[styles.readTimeText, { color: colors.textMuted }]}>{readTime}</Text>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel={isExpanded ? 'Show less' : 'Read more'}
          onPress={() => setIsExpanded(!isExpanded)}
          style={({ pressed }) => [styles.readMoreButton, pressed && { opacity: 0.7 }]}>
          <Text style={[styles.readMoreText, { color: colors.primary }]}>
            {isExpanded ? 'Show less' : 'Read more'}
          </Text>
          <Ionicons
            name={isExpanded ? 'chevron-up' : 'chevron-forward'}
            size={14}
            color={colors.primary}
          />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    borderRadius: 22,
    padding: 20,
    marginHorizontal: 20,
    marginTop: 12,
    marginBottom: 24,
    borderWidth: 1,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  categoryPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  categoryIcon: { marginRight: 5 },
  categoryText: { fontSize: 11, fontWeight: '700', letterSpacing: 0.6 },
  bookmarkButton: { padding: 4 },
  titleText: { fontSize: 18, fontWeight: '700', lineHeight: 24, marginBottom: 8 },
  contentText: { fontSize: 14, lineHeight: 21, marginBottom: 14 },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    paddingTop: 12,
  },
  readTimeText: { fontSize: 12, fontWeight: '500' },
  readMoreButton: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  readMoreText: { fontSize: 13, fontWeight: '700' },
});
