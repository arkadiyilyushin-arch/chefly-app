export type Story = {
  id: string;
  name: string;
  avatar: string;
  isMe?: boolean;
  hasNew?: boolean;
};

export type FeedPost = {
  id: string;
  author: string;
  avatar: string;
  timeAgo: string;
  text: string;
  image: string;
  isVideo?: boolean;
  likes: string;
  comments: string;
  shares: string;
  liked?: boolean;
};

export type ForumTopic = {
  id: string;
  title: string;
  category: string;
  author: string;
  avatar: string;
  replies: number;
  views: string;
  timeAgo: string;
  excerpt: string;
  pinned?: boolean;
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

export const stories: Story[] = [
  {
    id: 'me',
    name: 'Me',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop',
    isMe: true,
  },
  {
    id: '1',
    name: 'Cindy',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop',
    hasNew: true,
  },
  {
    id: '2',
    name: 'Abdullah',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop',
    hasNew: true,
  },
  {
    id: '3',
    name: 'Maya',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop',
    hasNew: true,
  },
  {
    id: '4',
    name: 'Kenji',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop',
    hasNew: true,
  },
  {
    id: '5',
    name: 'Sofia',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop',
  },
];

export const feedPosts: FeedPost[] = [
  {
    id: '1',
    author: 'Dolapo Abdul',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop',
    timeAgo: '1h ago',
    text: 'Forest mushroom risotto with aged parmesan and fresh thyme. Slow-cooked for that creamy restaurant texture — recipe in comments.',
    image: 'https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=800&h=600&fit=crop',
    isVideo: true,
    likes: '26K',
    comments: '1K',
    shares: '220',
    liked: true,
  },
  {
    id: '2',
    author: 'Elena Rossi',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&h=200&fit=crop',
    timeAgo: '3h ago',
    text: 'Sunday sourdough bake 🍞 72% hydration, 18h cold proof. The crumb on this one made my whole week.',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&h=600&fit=crop',
    likes: '18.4K',
    comments: '842',
    shares: '156',
  },
  {
    id: '3',
    author: 'Chef Marco',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&h=200&fit=crop',
    timeAgo: '5h ago',
    text: 'Seared scallops with lemon beurre blanc and microgreens. 90 seconds per side — no more, no less.',
    image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&h=600&fit=crop',
    isVideo: true,
    likes: '41K',
    comments: '2.1K',
    shares: '890',
    liked: true,
  },
  {
    id: '4',
    author: 'Aisha Khan',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop',
    timeAgo: '8h ago',
    text: 'Homemade pasta night! Fresh tagliatelle with wild garlic pesto and toasted pine nuts. Who else makes pasta from scratch?',
    image: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=800&h=600&fit=crop',
    likes: '9.2K',
    comments: '534',
    shares: '98',
  },
];

export const forumTopics: ForumTopic[] = [
  {
    id: '1',
    title: 'Best knives under $100 for home cooks?',
    category: 'Gear',
    author: 'Tom Baker',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop',
    replies: 48,
    views: '3.2K',
    timeAgo: '12m',
    excerpt: 'Looking for a solid chef knife that can handle daily prep without breaking the bank…',
    pinned: true,
  },
  {
    id: '2',
    title: 'How do you keep herbs fresh for a week?',
    category: 'Tips',
    author: 'Nina Park',
    avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=200&h=200&fit=crop',
    replies: 127,
    views: '8.1K',
    timeAgo: '1h',
    excerpt: 'Cilantro and basil always wilt on me. Share your storage hacks!',
  },
  {
    id: '3',
    title: 'Michelin techniques you use at home',
    category: 'Techniques',
    author: 'Chef Luis',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&h=200&fit=crop',
    replies: 89,
    views: '12K',
    timeAgo: '3h',
    excerpt: 'Sous-vide, confit, emulsion — which pro methods actually make sense in a home kitchen?',
  },
  {
    id: '4',
    title: 'Vegan desserts that impress meat-eaters',
    category: 'Recipes',
    author: 'Priya S.',
    avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=200&h=200&fit=crop',
    replies: 64,
    views: '5.4K',
    timeAgo: '5h',
    excerpt: 'Need showstoppers for a mixed dietary dinner party this weekend.',
  },
  {
    id: '5',
    title: 'Sourdough starter dying — help!',
    category: 'Baking',
    author: 'Jake M.',
    avatar: 'https://images.unsplash.com/photo-1463453091185-61582044d556?w=200&h=200&fit=crop',
    replies: 33,
    views: '2.8K',
    timeAgo: '7h',
    excerpt: 'Fed it rye flour twice and it still smells off. Rescue plan anyone?',
  },
  {
    id: '6',
    title: 'Restaurant openings this month 🍽️',
    category: 'News',
    author: 'Chefly News',
    avatar: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=200&h=200&fit=crop',
    replies: 21,
    views: '4.9K',
    timeAgo: '1d',
    excerpt: 'Roundup of new spots worth checking out — from tasting menus to casual ramen bars.',
    pinned: true,
  },
];

export const messages: Message[] = [
  {
    id: '1',
    name: 'Elena Rossi',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&h=200&fit=crop',
    lastMessage: 'Thanks for the sourdough tip! 🙌',
    timeAgo: '2m',
    unread: 2,
    online: true,
  },
  {
    id: '2',
    name: 'Chef Marco',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&h=200&fit=crop',
    lastMessage: 'Want to collab on a pasta video?',
    timeAgo: '18m',
    unread: 1,
    online: true,
  },
  {
    id: '3',
    name: 'Aisha Khan',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop',
    lastMessage: 'Sending you that pesto recipe now',
    timeAgo: '1h',
    online: false,
  },
  {
    id: '4',
    name: 'Baking Circle',
    avatar: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=200&h=200&fit=crop',
    lastMessage: 'Maya: Who\'s joining the challenge?',
    timeAgo: '3h',
    unread: 5,
  },
  {
    id: '5',
    name: 'Kenji Tanaka',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop',
    lastMessage: 'The ramen broth needs 12 more hours',
    timeAgo: 'Yesterday',
  },
  {
    id: '6',
    name: 'Sofia Mendes',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop',
    lastMessage: 'Loved your risotto post ❤️',
    timeAgo: 'Yesterday',
  },
];

export const currentUser = {
  name: 'Rokeeb Abdul',
  email: 'rokeeb@chefly.app',
  bio: 'Lifestyle creator / Lifelong home dasher.',
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
