import { useMemo, useState } from 'react';
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
import type { Recipe } from '@/data/mockData';

type Kind = 'recipe' | 'photo' | 'video';

const KINDS: { key: Kind; icon: keyof typeof Ionicons.glyphMap; title: string; desc: string }[] = [
  {
    key: 'recipe',
    icon: 'restaurant-outline',
    title: 'Рецепт',
    desc: 'Ингредиенты, шаги и время готовки',
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
    desc: 'Ролик с процессом или подачей',
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
  const [recipeTitle, setRecipeTitle] = useState('');
  const [cookTime, setCookTime] = useState('30');
  const [servings, setServings] = useState('2');
  const [ingredients, setIngredients] = useState('');
  const [steps, setSteps] = useState('');
  const [extraImages, setExtraImages] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const TAG_OPTIONS = ['быстро', 'завтрак', 'ужин', 'веган', 'выпечка'];

  async function pickFromLibrary() {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) {
      Alert.alert('Нужен доступ', 'Разрешите доступ к галерее.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: kind === 'video' ? ['videos', 'images'] : ['images'],
      quality: 0.85,
      allowsEditing: true,
      aspect: [4, 3],
    });
    if (!result.canceled && result.assets[0]) {
      const uri = result.assets[0].uri;
      if (!imageUri) setImageUri(uri);
      else if (extraImages.length < 4) setExtraImages((prev) => [...prev, uri]);
      else setImageUri(uri);
    }
  }

  async function takePhoto() {
    const perm = await ImagePicker.requestCameraPermissionsAsync();
    if (!perm.granted) {
      Alert.alert('Нужен доступ', 'Разрешите доступ к камере.');
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

  const recipePreview: Recipe | undefined = useMemo(() => {
    if (kind !== 'recipe') return undefined;
    const ings = ingredients
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);
    const st = steps
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);
    if (!recipeTitle.trim() || ings.length === 0 || st.length === 0) return undefined;
    return {
      title: recipeTitle.trim(),
      cookTimeMin: Number(cookTime) || 30,
      servings: Number(servings) || 2,
      difficulty: 'средне',
      ingredients: ings,
      steps: st,
    };
  }, [kind, recipeTitle, cookTime, servings, ingredients, steps]);

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
    if (kind === 'recipe' && !recipePreview) {
      Alert.alert('Заполните рецепт', 'Нужны название, ингредиенты и шаги (каждый с новой строки).');
      return;
    }
    setBusy(true);
    try {
      const images = [imageUri, ...extraImages];
      await addPost({
        authorId: user.id,
        author: user.name,
        avatar: user.avatar,
        text: text.trim(),
        image: imageUri,
        images: images.length > 1 ? images : undefined,
        tags: selectedTags.length ? selectedTags : undefined,
        isVideo: kind === 'video',
        videoUrl:
          kind === 'video'
            ? 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4'
            : undefined,
        recipe: recipePreview,
      });
      setText('');
      setImageUri(null);
      setExtraImages([]);
      setSelectedTags([]);
      setRecipeTitle('');
      setIngredients('');
      setSteps('');
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
          <View>
            <View style={styles.previewWrap}>
              <Image source={{ uri: imageUri }} style={styles.preview} />
              <Pressable
                style={styles.removePhoto}
                onPress={() => {
                  if (extraImages.length) {
                    setImageUri(extraImages[0]);
                    setExtraImages(extraImages.slice(1));
                  } else setImageUri(null);
                }}
              >
                <Ionicons name="close" size={18} color="#fff" />
              </Pressable>
            </View>
            {extraImages.length > 0 && (
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 12 }}>
                {extraImages.map((uri) => (
                  <Image key={uri} source={{ uri }} style={styles.thumb} />
                ))}
              </ScrollView>
            )}
            {kind !== 'video' && extraImages.length < 4 && (
              <Pressable style={styles.addMore} onPress={pickFromLibrary}>
                <Ionicons name="add" size={18} color={Colors.primary} />
                <Text style={styles.addMoreText}>Ещё фото в карусель</Text>
              </Pressable>
            )}
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

        <Text style={styles.sectionLabel}>Теги</Text>
        <View style={styles.tagRow}>
          {TAG_OPTIONS.map((t) => {
            const on = selectedTags.includes(t);
            return (
              <Pressable
                key={t}
                style={[styles.tagChip, on && styles.tagChipOn]}
                onPress={() =>
                  setSelectedTags((prev) =>
                    on ? prev.filter((x) => x !== t) : [...prev, t]
                  )
                }
              >
                <Text style={[styles.tagChipText, on && styles.tagChipTextOn]}>{t}</Text>
              </Pressable>
            );
          })}
        </View>

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
                  <Ionicons name={opt.icon} size={22} color={active ? '#fff' : Colors.primary} />
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

        {kind === 'recipe' && (
          <View style={styles.recipeForm}>
            <Text style={styles.sectionLabel}>Карточка рецепта</Text>
            <TextInput
              style={styles.field}
              placeholder="Название блюда"
              placeholderTextColor={Colors.textMuted}
              value={recipeTitle}
              onChangeText={setRecipeTitle}
            />
            <View style={styles.row2}>
              <TextInput
                style={[styles.field, styles.half]}
                placeholder="Минуты"
                placeholderTextColor={Colors.textMuted}
                keyboardType="number-pad"
                value={cookTime}
                onChangeText={setCookTime}
              />
              <TextInput
                style={[styles.field, styles.half]}
                placeholder="Порции"
                placeholderTextColor={Colors.textMuted}
                keyboardType="number-pad"
                value={servings}
                onChangeText={setServings}
              />
            </View>
            <TextInput
              style={[styles.field, styles.area]}
              placeholder={'Ингредиенты — каждый с новой строки\nнапример:\n200 г риса\n1 луковица'}
              placeholderTextColor={Colors.textMuted}
              multiline
              value={ingredients}
              onChangeText={setIngredients}
            />
            <TextInput
              style={[styles.field, styles.area]}
              placeholder={'Шаги — каждый с новой строки'}
              placeholderTextColor={Colors.textMuted}
              multiline
              value={steps}
              onChangeText={setSteps}
            />
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.lg,
    paddingHorizontal: Spacing.lg,
  },
  title: { fontFamily: Fonts.bold, fontSize: 18, color: Colors.text },
  postBtn: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: Radius.full,
    minWidth: 120,
    alignItems: 'center',
  },
  postBtnDisabled: { opacity: 0.7 },
  postText: { fontFamily: Fonts.semibold, fontSize: 14, color: '#fff' },
  input: {
    fontFamily: Fonts.regular,
    fontSize: 17,
    color: Colors.text,
    minHeight: 80,
    textAlignVertical: 'top',
    marginBottom: Spacing.lg,
  },
  pickRow: { flexDirection: 'row', gap: Spacing.md, marginBottom: Spacing.xl },
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
  pickText: { fontFamily: Fonts.medium, fontSize: 13, color: Colors.primary },
  previewWrap: {
    borderRadius: Radius.md,
    overflow: 'hidden',
    marginBottom: Spacing.xl,
    aspectRatio: 4 / 3,
    backgroundColor: Colors.border,
  },
  preview: { width: '100%', height: '100%' },
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
  thumb: {
    width: 64,
    height: 64,
    borderRadius: 10,
    marginRight: 8,
    backgroundColor: Colors.border,
  },
  addMore: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: Spacing.xl,
  },
  addMoreText: { fontFamily: Fonts.medium, fontSize: 13, color: Colors.primary },
  tagRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: Spacing.xl },
  tagChip: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: Radius.full,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  tagChipOn: { backgroundColor: Colors.primarySoft, borderColor: Colors.primary },
  tagChipText: { fontFamily: Fonts.medium, fontSize: 13, color: Colors.textSecondary },
  tagChipTextOn: { color: Colors.primary, fontFamily: Fonts.semibold },
  sectionLabel: {
    fontFamily: Fonts.semibold,
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: Spacing.md,
  },
  options: { gap: Spacing.sm, marginBottom: Spacing.xl },
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
  optionActive: { borderColor: Colors.primary, backgroundColor: Colors.primarySoft },
  optionIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionIconActive: { backgroundColor: Colors.primary },
  optionText: { flex: 1 },
  optionTitle: { fontFamily: Fonts.semibold, fontSize: 15, color: Colors.text },
  optionDesc: {
    fontFamily: Fonts.regular,
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  recipeForm: { gap: Spacing.md },
  field: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: Spacing.md,
    paddingVertical: 12,
    fontFamily: Fonts.regular,
    fontSize: 15,
    color: Colors.text,
  },
  area: { minHeight: 100, textAlignVertical: 'top' },
  row2: { flexDirection: 'row', gap: Spacing.md },
  half: { flex: 1 },
});
