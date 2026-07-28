import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Fonts, Radius, Spacing } from '@/constants/theme';
import type { ProfileMedia } from '@/data/mockData';

type Props = {
  items: ProfileMedia[];
};

export function MediaGrid({ items }: Props) {
  const columns = [0, 1, 2].map((col) => items.filter((_, i) => i % 3 === col));

  return (
    <View style={styles.grid}>
      {columns.map((col, colIndex) => (
        <View key={colIndex} style={styles.column}>
          {col.map((item) => (
            <Pressable key={item.id} style={[styles.cell, { height: item.height }]}>
              <Image source={{ uri: item.image }} style={styles.image} />
              <View style={styles.views}>
                {item.isVideo && (
                  <Ionicons name="play" size={10} color="#fff" style={{ marginRight: 2 }} />
                )}
                <Text style={styles.viewsText}>{item.views}</Text>
              </View>
            </Pressable>
          ))}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: Spacing.lg,
  },
  column: {
    flex: 1,
    gap: 8,
  },
  cell: {
    borderRadius: Radius.sm,
    overflow: 'hidden',
    backgroundColor: Colors.border,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  views: {
    position: 'absolute',
    left: 6,
    bottom: 6,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.45)',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: Radius.full,
  },
  viewsText: {
    fontFamily: Fonts.semibold,
    fontSize: 10,
    color: '#fff',
  },
});
