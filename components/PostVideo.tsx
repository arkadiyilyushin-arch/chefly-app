import { useEffect } from 'react';
import { useEvent } from 'expo';
import { useVideoPlayer, VideoView } from 'expo-video';
import { Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Radius } from '@/constants/theme';

type Props = {
  uri: string;
  active?: boolean;
};

export function PostVideo({ uri, active = false }: Props) {
  const player = useVideoPlayer(uri, (p) => {
    p.loop = true;
    p.muted = true;
  });
  const { isPlaying } = useEvent(player, 'playingChange', { isPlaying: player.playing });

  useEffect(() => {
    if (active) player.play();
    else player.pause();
  }, [active, player]);

  return (
    <View style={styles.wrap}>
      <VideoView
        style={styles.video}
        player={player}
        contentFit="cover"
        nativeControls={false}
        fullscreenOptions={{ enable: true }}
      />
      <Pressable
        style={[styles.play, active && isPlaying && styles.playHidden]}
        onPress={() => {
          if (isPlaying) player.pause();
          else player.play();
        }}
      >
        <Ionicons
          name={isPlaying ? 'pause' : 'play'}
          size={26}
          color="#fff"
          style={!isPlaying ? { marginLeft: 3 } : undefined}
        />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: '100%',
    height: '100%',
    backgroundColor: Colors.border,
    borderRadius: Radius.md,
    overflow: 'hidden',
  },
  video: {
    width: '100%',
    height: '100%',
  },
  play: {
    position: 'absolute',
    alignSelf: 'center',
    top: '40%',
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.overlay,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.45)',
  },
  playHidden: {
    opacity: 0.35,
  },
});
