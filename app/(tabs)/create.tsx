import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '@/context/AuthContext';
import { useFeed } from '@/context/FeedContext';
import { Colors, Fonts, Radius, Spacing } from '@/constants/theme';

type Kind = 'recipe' | 'photo' | 'video';

const KINDS: { key: Kind; icon: keyof typeof Ionicons.glyphMap; title: string; desc: string }[] = [
  {
    key: 'recipe',
    icon: 'restaurant-outline',
    title: 'Рецепт',
    desc: 'Поделиться блюдом с шагами и советами',
  },
  {
    key: 'photo',
    icon: 'camera-outline',
    title: 'Фото',
    desc: 'Опубликовать красивую подачу',
  },
  {
    key: 'video',
    icon: 'videocam-outline',
    title: 'Видео готовки',
    desc: 'Добавить кадр из кулинарного ролика',
  },
];

export default function CreateScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { user } = useAuth();
  const { addPost } = useFeed();
  const [kind, setKind] = useState<Kind>('recipe');
  const [text, setText] = useState('');
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function pickFromLibrary() {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) {
      Alert.alert('Нужен доступ', 'Разрешите доступ к галерее, чтобы выбрать фото.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.85,
      allowsEditing: true,
      aspect: [4, 3],
    });
    if (!result.canceled && result.assets[0]) {
      setImageUri(result.assets[0].uri);
    }
  }

  async function takePhoto() {
    const perm = await ImagePicker.requestCameraPermissionsAsync();
    if (!perm.granted) {
      Alert.alert('Нужен доступ', 'Разрешите доступ к камере, чтобы сделать фото.');
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      quality: 0.85,
      allowsEditing: true,
      aspect: [4, 3],
    });
    if (!result.canceled && result.assets[0]) {
      setImageUri(result.assets[0].uri);
    }
  }

  async function onPublish() {
    if (!user) return;
    if (!text.trim()) {
      Alert.alert('Добавьте описание', 'Напишите, что вы готовите.');
      return;
    }
    if (!imageUri) {
      Alert.alert('Добавьте фото', 'Выберите фото из галереи или сделайте снимок.');
      return;
    }
    setBusy(true);
    try {
      await addPost({
        author: user.name,
        avatar: user.avatar,
        text: text.trim(),
        image: imageUri,
        isVideo: kind === 'video',
      });
      setText('');
      setImageUri(null);
      router.replace('/(tabs)');
    } catch {
      Alert.alert('Ошибка', 'Не удалось опубликовать пост');
    } finally {
      setBusy(false);
    }
  }

  return (
    <View style={[styles.screen, { paddingTop: insets.top + 8 }]}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <Ionicons name="close" size={28} color={Colors.text} />
        </Pressable>
        <Text style={styles.title}>Создать</Text>
        <Pressable
          style={[styles.postBtn, busy && styles.postBtnDisabled]}
          onPress={onPublish}
          disabled={busy}
        >
          {busy ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text style={styles.postText}>Опубликовать</Text>
          )}
        </Pressable>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120, paddingHorizontal: Spacing.lg }}
        keyboardShouldPersistTaps="handled"
      >
        <TextInput
          placeholder="Что вы готовите сегодня?"
          placeholderTextColor={Colors.textMuted}
          multiline
          style={styles.input}
          value={text}
          onChangeText={setText}
        />

        {imageUri ? (
          <View style={styles.previewWrap}>
            <Image source={{ uri: imageUri }} style={styles.preview} />
            <Pressable style={styles.removePhoto} onPress={() => setImageUri(null)}>
              <Ionicons name="close" size={18} color="#fff" />
            </Pressable>
          </View>
        ) : (
          <View style={styles.pickRow}>
            <Pressable style={styles.pickBtn} onPress={pickFromLibrary}>
              <Ionicons name="images-outline" size={22} color={Colors.primary} />
              <Text style={styles.pickText}>Галерея</Text>
            </Pressable>
            <Pressable style={styles.pickBtn} onPress={takePhoto}>
              <Ionicons name="camera-outline" size={22} color={Colors.primary} />
              <Text style={styles.pickText}>Камера</Text>
            </Pressable>
          </View>
        )}

        <Text style={styles.sectionLabel}>Тип публикации</Text>
        <View style={styles.options}>
          {KINDS.map((opt) => {
            const active = kind === opt.key;
            return (
              <Pressable
                key={opt.key}
                style={[styles.option, active && styles.optionActive]}
                onPress={() => setKind(opt.key)}
              >
                <View style={[styles.optionIcon, active && styles.optionIconActive]}>
                  <Ionicons
                    name={opt.icon}
                    size={22}
                    color={active ? '#fff' : Colors.primary}
                  />
                </View>
                <View style={styles.optionText}>
                  <Text style={styles.optionTitle}>{opt.title}</Text>
                  <Text style={styles.optionDesc}>{opt.desc}</Text>
                </View>
                {active && <Ionicons name="checkmark-circle" size={22} color={Colors.primary} />}
              </Pressable>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.lg,
    paddingHorizontal: Spacing.lg,
  },
  title: {
    fontFamily: Fonts.bold,
    fontSize: 18,
    color: Colors.text,
  },
  postBtn: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: Radius.full,
    minWidth: 120,
    alignItems: 'center',
  },
  postBtnDisabled: {
    opacity: 0.7,
  },
  postText: {
    fontFamily: Fonts.semibold,
    fontSize: 14,
    color: '#fff',
  },
  input: {
    fontFamily: Fonts.regular,
    fontSize: 17,
    color: Colors.text,
    minHeight: 100,
    textAlignVertical: 'top',
    marginBottom: Spacing.lg,
  },
  pickRow: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing.xl,
  },
  pickBtn: {
    flex: 1,
    height: 96,
    borderRadius: Radius.md,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  pickText: {
    fontFamily: Fonts.medium,
    fontSize: 13,
    color: Colors.primary,
  },
  previewWrap: {
    borderRadius: Radius.md,
    overflow: 'hidden',
    marginBottom: Spacing.xl,
    aspectRatio: 4 / 3,
    backgroundColor: Colors.border,
  },
  preview: {
    width: '100%',
    height: '100%',
  },
  removePhoto: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.overlay,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionLabel: {
    fontFamily: Fonts.semibold,
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: Spacing.md,
  },
  options: {
    gap: Spacing.sm,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    padding: Spacing.md,
    gap: Spacing.md,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  optionActive: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primarySoft,
  },
  optionIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionIconActive: {
    backgroundColor: Colors.primary,
  },
  optionText: {
    flex: 1,
  },
  optionTitle: {
    fontFamily: Fonts.semibold,
    fontSize: 15,
    color: Colors.text,
  },
  optionDesc: {
    fontFamily: Fonts.regular,
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
});
