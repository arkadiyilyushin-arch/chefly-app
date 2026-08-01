import { useEffect, useState } from 'react';
import { useEvent } from 'expo';
import { useNetworkState } from 'expo-network';
import { useVideoPlayer, VideoView } from 'expo-video';
import { Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSocial } from '@/context/SocialContext';
import { Colors, Radius } from '@/constants/theme';

type Props = {
  uri: string;
  active?: boolean;
  forcePlay?: boolean;
};

export function PostVideo({ uri, active = false, forcePlay = false }: Props) {
  const { prefs } = useSocial();
  const network = useNetworkState();
  const onWifi = network.type === 'WIFI' || network.type === 'ETHERNET';
  const allowAutoplay = forcePlay || !prefs.wifiOnlyAutoplay || onWifi;
  const [muted, setMuted] = useState(prefs.muteByDefault);

  const player = useVideoPlayer(uri, (p) => {
    p.loop = true;
    p.muted = prefs.muteByDefault;
  });
  const { isPlaying } = useEvent(player, 'playingChange', { isPlaying: player.playing });

  useEffect(() => {
    player.muted = muted;
  }, [muted, player]);

  useEffect(() => {
    setMuted(prefs.muteByDefault);
  }, [prefs.muteByDefault]);

  useEffect(() => {
    if (active && allowAutoplay) player.play();
    else player.pause();
  }, [active, allowAutoplay, player]);

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
      {!allowAutoplay && active ? (
        <View style={styles.wifiHint} pointerEvents="none">
          <Ionicons name="wifi-outline" size={14} color="#fff" />
        </View>
      ) : null}
      <Pressable style={styles.mute} onPress={() => setMuted((v) => !v)}>
        <Ionicons name={muted ? 'volume-mute' : 'volume-high'} size={16} color="#fff" />
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
    opacity: 0.25,
  },
  wifiHint: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: Colors.overlay,
    borderRadius: 12,
    padding: 6,
  },
  mute: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.overlay,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
