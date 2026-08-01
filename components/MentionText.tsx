import { StyleSheet, Text, type TextStyle } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Fonts } from '@/constants/theme';
import { parseMentions } from '@/utils/mentions';

type Props = {
  text: string;
  style?: TextStyle;
  numberOfLines?: number;
};

export function MentionText({ text, style, numberOfLines }: Props) {
  const router = useRouter();
  const parts = parseMentions(text);

  return (
    <Text style={style} numberOfLines={numberOfLines}>
      {parts.map((p, i) =>
        p.type === 'mention' ? (
          <Text
            key={`${p.chefId}_${i}`}
            style={styles.mention}
            onPress={() => router.push(`/chef/${p.chefId}` as any)}
          >
            {p.value}
          </Text>
        ) : (
          <Text key={`t_${i}`}>{p.value}</Text>
        )
      )}
    </Text>
  );
}

const styles = StyleSheet.create({
  mention: {
    fontFamily: Fonts.semibold,
    color: Colors.primary,
  },
});
