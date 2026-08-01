import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Avatar } from './Avatar';
import { Colors, Fonts, Spacing } from '@/constants/theme';
import type { Story } from '@/data/mockData';

type Props = {
  stories: Story[];
  onOpen: (index: number) => void;
};

export function StoriesRow({ stories, onOpen }: Props) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}
    >
      {stories.map((story, index) => (
        <Pressable key={story.id} style={styles.item} onPress={() => onOpen(index)}>
          <View>
            <Avatar
              uri={story.avatar}
              size={64}
              ring={!!story.hasNew || !!story.isMe}
              ringColor={story.isMe ? Colors.border : Colors.primary}
            />
            {story.isMe && (
              <View style={styles.addBadge}>
                <Ionicons name="add" size={12} color="#fff" />
              </View>
            )}
          </View>
          <Text style={styles.name} numberOfLines={1}>
            {story.name}
          </Text>
        </Pressable>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    gap: Spacing.md,
  },
  item: {
    alignItems: 'center',
    width: 68,
  },
  name: {
    marginTop: 6,
    fontSize: 12,
    fontFamily: Fonts.medium,
    color: Colors.text,
    textAlign: 'center',
  },
  addBadge: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.surface,
  },
});
