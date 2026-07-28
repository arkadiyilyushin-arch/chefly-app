import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Avatar } from './Avatar';
import { Colors, Fonts, Spacing } from '@/constants/theme';
import type { Message } from '@/data/mockData';

type Props = {
  message: Message;
};

export function MessageRow({ message }: Props) {
  return (
    <Pressable style={styles.row}>
      <View>
        <Avatar uri={message.avatar} size={54} />
        {message.online && <View style={styles.online} />}
      </View>

      <View style={styles.content}>
        <View style={styles.top}>
          <Text style={styles.name} numberOfLines={1}>
            {message.name}
          </Text>
          <Text style={[styles.time, message.unread ? styles.timeUnread : null]}>
            {message.timeAgo}
          </Text>
        </View>
        <View style={styles.bottom}>
          <Text
            style={[styles.preview, message.unread ? styles.previewUnread : null]}
            numberOfLines={1}
          >
            {message.lastMessage}
          </Text>
          {!!message.unread && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{message.unread}</Text>
            </View>
          )}
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
  },
  online: {
    position: 'absolute',
    right: 2,
    bottom: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.success,
    borderWidth: 2,
    borderColor: Colors.surface,
  },
  content: {
    flex: 1,
    gap: 4,
  },
  top: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  name: {
    flex: 1,
    fontFamily: Fonts.semibold,
    fontSize: 15,
    color: Colors.text,
  },
  time: {
    fontFamily: Fonts.regular,
    fontSize: 12,
    color: Colors.textSecondary,
  },
  timeUnread: {
    color: Colors.primary,
    fontFamily: Fonts.semibold,
  },
  bottom: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  preview: {
    flex: 1,
    fontFamily: Fonts.regular,
    fontSize: 13,
    color: Colors.textSecondary,
  },
  previewUnread: {
    color: Colors.text,
    fontFamily: Fonts.medium,
  },
  badge: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  badgeText: {
    fontFamily: Fonts.bold,
    fontSize: 11,
    color: '#fff',
  },
});
