export type Story = {
  id: string;
  name: string;
  avatar: string;
  isMe?: boolean;
  hasNew?: boolean;
  postId?: string;
  image?: string;
  caption?: string;
};

export type PostComment = {
  id: string;
  author: string;
  avatar: string;
  text: string;
  timeAgo: string;
  likesCount?: number;
  liked?: boolean;
  replyTo?: string;
};

export type Recipe = {
  title: string;
  cookTimeMin: number;
  servings: number;
  difficulty: 'легко' | 'средне' | 'сложно';
  ingredients: string[];
  steps: string[];
};

export type FeedPost = {
  id: string;
  authorId: string;
  author: string;
  avatar: string;
  timeAgo: string;
  text: string;
  image: string;
  images?: string[];
  tags?: string[];
  isVideo?: boolean;
  videoUrl?: string;
  recipe?: Recipe;
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
  liked?: boolean;
  saved?: boolean;
  commentsList: PostComment[];
  hidden?: boolean;
  repostOf?: { id: string; author: string; authorId: string };
};

export type ChefProfile = {
  id: string;
  name: string;
  avatar: string;
  bio: string;
};

export type AppNotification = {
  id: string;
  type: 'like' | 'comment' | 'follow' | 'save' | 'post';
  title: string;
  body: string;
  timeAgo: string;
  read: boolean;
  postId?: string;
  createdAt: number;
};

export type NewsItem = {
  id: string;
  title: string;
  category: string;
  author: string;
  avatar: string;
  views: string;
  timeAgo: string;
  excerpt: string;
  pinned?: boolean;
  image?: string;
};

export type Message = {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  timeAgo: string;
  unread?: number;
  online?: boolean;
};

export type ProfileMedia = {
  id: string;
  image: string;
  views: string;
  isVideo?: boolean;
  height: number;
};

export const chefs: ChefProfile[] = [
  {
    id: 'chef_dolapo',
    name: 'Долапо Абдул',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop',
    bio: 'Авторские ризотто и сезонная кухня',
  },
  {
    id: 'chef_elena',
    name: 'Елена Росси',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&h=200&fit=crop',
    bio: 'Хлеб на закваске и домашняя выпечка',
  },
  {
    id: 'chef_marco',
    name: 'Шеф Марко',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&h=200&fit=crop',
    bio: 'Морепродукты и техника ресторана',
  },
  {
    id: 'chef_aisha',
    name: 'Аиша Хан',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop',
    bio: 'Паста, песто и ужины без суеты',
  },
];

export const stories: Story[] = [
  {
    id: 'me',
    name: 'Я',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop',
    isMe: true,
    caption: 'Ваша история на кухне',
  },
  {
    id: '1',
    name: 'Елена',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&h=200&fit=crop',
    hasNew: true,
    postId: '2',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&h=1200&fit=crop',
    caption: 'Рецепт дня: хлеб на закваске',
  },
  {
    id: '2',
    name: 'Марко',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&h=200&fit=crop',
    hasNew: true,
    postId: '3',
    image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&h=1200&fit=crop',
    caption: 'Гребешки за 15 минут',
  },
  {
    id: '3',
    name: 'Долапо',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop',
    hasNew: true,
    postId: '1',
    image: 'https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=800&h=1200&fit=crop',
    caption: 'Грибное ризотто — смотри рецепт',
  },
  {
    id: '4',
    name: 'Аиша',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop',
    hasNew: true,
    postId: '4',
    image: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=800&h=1200&fit=crop',
    caption: 'Тальятелле с песто из черемши',
  },
  {
    id: '5',
    name: 'София',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop',
    image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&h=1200&fit=crop',
    caption: 'Утренний бранч на кухне',
  },
];

export const feedPosts: FeedPost[] = [
  {
    id: '1',
    authorId: 'chef_dolapo',
    author: 'Долапо Абдул',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop',
    timeAgo: '1ч назад',
    text: 'Ризотто с лесными грибами — спасибо @Елена Росси за идею с тимьяном. Долго варил до кремовой текстуры.',
    image: 'https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=800&h=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1432139555190-58575bd5c8a0?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=600&fit=crop',
    ],
    tags: ['ужин'],
    isVideo: true,
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    recipe: {
      title: 'Грибное ризотто',
      cookTimeMin: 40,
      servings: 2,
      difficulty: 'средне',
      ingredients: [
        '200 г арборио',
        '300 г лесных грибов',
        '1 луковица',
        '80 г пармезана',
        'тимьян, масло, бульон',
      ],
      steps: [
        'Обжарьте грибы до золотистой корочки, отложите.',
        'Пассеруйте лук, добавьте рис, прогрейте 1–2 минуты.',
        'Вливайте горячий бульон половником, постоянно помешивая.',
        'В конце вмешайте масло, пармезан, тимьян и грибы.',
      ],
    },
    likesCount: 26000,
    commentsCount: 3,
    sharesCount: 220,
    liked: true,
    commentsList: [
      {
        id: 'c1',
        author: 'Елена Росси',
        avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&h=200&fit=crop',
        text: 'Выглядит как в ресторане! Сколько минут помешивал?',
        timeAgo: '40 мин',
        likesCount: 12,
      },
      {
        id: 'c2',
        author: 'Шеф Марко',
        avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&h=200&fit=crop',
        text: 'Тимьян в конце — правильный ход 🔥',
        timeAgo: '25 мин',
        likesCount: 8,
        replyTo: 'Елена Росси',
      },
      {
        id: 'c3',
        author: 'Майя',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop',
        text: 'Сохранила, попробую на выходных!',
        timeAgo: '10 мин',
        likesCount: 3,
      },
    ],
  },
  {
    id: '2',
    authorId: 'chef_elena',
    author: 'Елена Росси',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&h=200&fit=crop',
    timeAgo: '3ч назад',
    text: 'Воскресная выпечка на закваске 🍞 Гидратация 72%, холодный брожение 18 часов.',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&h=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1549931319-a545dcf3bc73?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1586444248902-2f64eddc13df?w=800&h=600&fit=crop',
    ],
    tags: ['выпечка', 'завтрак'],
    recipe: {
      title: 'Хлеб на закваске',
      cookTimeMin: 60,
      servings: 1,
      difficulty: 'сложно',
      ingredients: ['500 г муки', '360 мл воды', '100 г закваски', '10 г соли'],
      steps: [
        'Смешайте муку, воду и закваску, дайте постоять 30 минут.',
        'Добавьте соль, вымесите и уберите в холодильник на 18 часов.',
        'Сформируйте батон, расстойка 1–2 часа.',
        'Выпекайте в разогретой до 230°C духовке 35–40 минут.',
      ],
    },
    likesCount: 18400,
    commentsCount: 2,
    sharesCount: 156,
    commentsList: [
      {
        id: 'c4',
        author: 'Кенджи',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop',
        text: 'Какую муку используешь?',
        timeAgo: '2ч',
      },
      {
        id: 'c5',
        author: 'София',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop',
        text: 'Корка просто космос 😍',
        timeAgo: '1ч',
      },
    ],
  },
  {
    id: '3',
    authorId: 'chef_marco',
    author: 'Шеф Марко',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&h=200&fit=crop',
    timeAgo: '5ч назад',
    text: 'Обжаренные гребешки с лимонным соусом. Челлендж недели — отметьте @Шеф Марко, когда повторите.',
    image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&h=600&fit=crop',
    tags: ['быстро', 'ужин'],
    isVideo: true,
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    recipe: {
      title: 'Гребешки с лимонным соусом',
      cookTimeMin: 15,
      servings: 2,
      difficulty: 'легко',
      ingredients: ['8 гребешков', '50 г масла', 'лимон', 'микрозелень', 'соль, перец'],
      steps: [
        'Просушите гребешки и посолите.',
        'Разогрейте сковороду до сильного жара.',
        'Обжарьте по 90 секунд с каждой стороны.',
        'Полейте лимонным маслом, украсьте микрозеленью.',
      ],
    },
    likesCount: 41000,
    commentsCount: 2,
    sharesCount: 890,
    liked: true,
    commentsList: [
      {
        id: 'c6',
        author: 'Аиша Хан',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop',
        text: 'Сковорода чугунная?',
        timeAgo: '4ч',
      },
      {
        id: 'c7',
        author: 'Долапо Абдул',
        avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop',
        text: 'Классика. Снял на заметки.',
        timeAgo: '3ч',
      },
    ],
  },
  {
    id: '4',
    authorId: 'chef_aisha',
    author: 'Аиша Хан',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop',
    timeAgo: '8ч назад',
    text: 'Вечер домашней пасты! Свежая тальятелле с песто из черемши и кедровыми орехами.',
    image: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=800&h=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=800&h=600&fit=crop',
    ],
    tags: ['ужин', 'веган'],
    recipe: {
      title: 'Тальятелле с песто',
      cookTimeMin: 50,
      servings: 3,
      difficulty: 'средне',
      ingredients: [
        '300 г муки',
        '3 яйца',
        'черемша',
        'кедровые орехи',
        'пармезан, масло',
      ],
      steps: [
        'Замесите тесто из муки и яиц, дайте отдохнуть 30 минут.',
        'Раскатайте и нарежьте тальятелле.',
        'Смелите песто из черемши, орехов, сыра и масла.',
        'Отварите пасту 2–3 минуты, смешайте с песто.',
      ],
    },
    likesCount: 9200,
    commentsCount: 1,
    sharesCount: 98,
    commentsList: [
      {
        id: 'c8',
        author: 'Елена Росси',
        avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&h=200&fit=crop',
        text: 'Я! Без машинки, только скалка 💪',
        timeAgo: '6ч',
      },
    ],
  },
];
export const newsItems: NewsItem[] = [
  {
    id: '1',
    title: 'В Москве открылся новый ресторан с авторской кухней',
    category: 'Рестораны',
    author: 'Chefly Новости',
    avatar: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=200&h=200&fit=crop',
    views: '12K',
    timeAgo: '12 мин',
    excerpt:
      'Шеф из Мишленовского ресторана запускает камерное пространство на 40 мест в центре столицы.',
    pinned: true,
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=500&fit=crop',
  },
  {
    id: '2',
    title: 'Тренд сезона: ферментированные овощи на каждом столе',
    category: 'Тренды',
    author: 'Анна Кулинарова',
    avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=200&h=200&fit=crop',
    views: '8.1K',
    timeAgo: '1ч',
    excerpt:
      'Кимчи, квашеная капуста и маринованные томаты возвращаются в меню топ-заведений и дома.',
  },
  {
    id: '3',
    title: 'Конкурс молодых поваров: приём заявок до конца месяца',
    category: 'События',
    author: 'Редакция Chefly',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&h=200&fit=crop',
    views: '5.4K',
    timeAgo: '3ч',
    excerpt:
      'Победители получат стажировку у шефов и грант на открытие собственного проекта.',
    pinned: true,
  },
  {
    id: '4',
    title: 'Как изменились цены на продукты для ресторанов в 2026',
    category: 'Рынок',
    author: 'Игорь Смирнов',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop',
    views: '9.2K',
    timeAgo: '5ч',
    excerpt:
      'Разбор ключевых позиций: масло, рыба, сыры и зелень. Что подорожало сильнее всего.',
  },
  {
    id: '5',
    title: 'Новый гайд: 10 блюд, которые стоит попробовать этой весной',
    category: 'Рецепты',
    author: 'Мария Печёнова',
    avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=200&h=200&fit=crop',
    views: '15K',
    timeAgo: '7ч',
    excerpt:
      'От лёгких салатов до сезонных десертов — подборка от шефов-редакторов Chefly.',
  },
  {
    id: '6',
    title: 'FoodTech: доставка ингредиентов для домашнего ресторана',
    category: 'Технологии',
    author: 'Chefly Новости',
    avatar: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=200&h=200&fit=crop',
    views: '4.9K',
    timeAgo: '1д',
    excerpt:
      'Стартапы предлагают наборы под конкретные рецепты с точной граммовкой и инструкцией.',
  },
];

export const messages: Message[] = [
  {
    id: '1',
    name: 'Елена Росси',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&h=200&fit=crop',
    lastMessage: 'Спасибо за совет по закваске! 🙌',
    timeAgo: '2 мин',
    unread: 2,
    online: true,
  },
  {
    id: '2',
    name: 'Шеф Марко',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&h=200&fit=crop',
    lastMessage: 'Давай снимем совместное видео про пасту?',
    timeAgo: '18 мин',
    unread: 1,
    online: true,
  },
  {
    id: '3',
    name: 'Аиша Хан',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop',
    lastMessage: 'Сейчас пришлю рецепт песто',
    timeAgo: '1ч',
    online: false,
  },
  {
    id: '4',
    name: 'Кружок выпечки',
    avatar: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=200&h=200&fit=crop',
    lastMessage: 'Майя: Кто идёт на челлендж?',
    timeAgo: '3ч',
    unread: 5,
  },
  {
    id: '5',
    name: 'Кенджи Танака',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop',
    lastMessage: 'Булёну для рамена нужно ещё 12 часов',
    timeAgo: 'Вчера',
  },
  {
    id: '6',
    name: 'София Мендес',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop',
    lastMessage: 'Обожаю твой пост с ризотто ❤️',
    timeAgo: 'Вчера',
  },
];

export const currentUser = {
  name: 'Рокиб Абдул',
  email: 'rokeeb@chefly.app',
  bio: 'Лайфстайл-креатор / Вечный домашний повар.',
  avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
  posts: '400',
  followers: '136.7K',
  following: '600',
  likes: '4.8M',
};

export const profileMedia: ProfileMedia[] = [
  {
    id: '1',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=500&fit=crop',
    views: '220K',
    isVideo: true,
    height: 160,
  },
  {
    id: '2',
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=400&fit=crop',
    views: '1.2M',
    isVideo: true,
    height: 140,
  },
  {
    id: '3',
    image: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400&h=500&fit=crop',
    views: '89K',
    height: 170,
  },
  {
    id: '4',
    image: 'https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=400&h=400&fit=crop',
    views: '340K',
    isVideo: true,
    height: 145,
  },
  {
    id: '5',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=500&fit=crop',
    views: '512K',
    height: 165,
  },
  {
    id: '6',
    image: 'https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?w=400&h=400&fit=crop',
    views: '98K',
    isVideo: true,
    height: 150,
  },
  {
    id: '7',
    image: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=400&h=500&fit=crop',
    views: '76K',
    height: 155,
  },
  {
    id: '8',
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=400&fit=crop',
    views: '2.1M',
    isVideo: true,
    height: 140,
  },
  {
    id: '9',
    image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=500&fit=crop',
    views: '445K',
    height: 175,
  },
];
