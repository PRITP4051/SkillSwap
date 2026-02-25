export const categories = [
    { id: 'tech', name: 'Technology & Coding', icon: '💻', count: 124 },
    { id: 'design', name: 'UI/UX Design', icon: '🎨', count: 86 },
    { id: 'languages', name: 'Languages', icon: '🌍', count: 95 },
    { id: 'business', name: 'Business & Marketing', icon: '📈', count: 62 },
    { id: 'music', name: 'Music & Audio', icon: '🎵', count: 41 },
    { id: 'fitness', name: 'Fitness & Health', icon: '🏃‍♂️', count: 38 },
];

export const skills = [
    {
        id: 1,
        title: 'Full Stack React Development',
        user: 'Alex Johnson',
        avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026024d',
        level: 'Advanced',
        location: 'Remote',
        category: 'tech',
        wantsInReturn: ['Spanish', 'UI Design'],
        rating: 4.8,
    },
    {
        id: 2,
        title: 'Figma Prototyping Masterclass',
        user: 'Sarah Lee',
        avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d',
        level: 'Advanced',
        location: 'New York, NY',
        category: 'design',
        wantsInReturn: ['Python', 'SEO'],
        rating: 4.9,
    },
    {
        id: 3,
        title: 'Conversational Spanish',
        user: 'Carlos Ruiz',
        avatar: 'https://i.pravatar.cc/150?u=a04258114e29026702d',
        level: 'Native',
        location: 'Remote',
        category: 'languages',
        wantsInReturn: ['React', 'Node.js'],
        rating: 5.0,
    },
    {
        id: 4,
        title: 'Social Media Marketing 101',
        user: 'Emily Chen',
        avatar: 'https://i.pravatar.cc/150?img=47',
        level: 'Intermediate',
        location: 'London, UK',
        category: 'business',
        wantsInReturn: ['Video Editing'],
        rating: 4.6,
    },
    {
        id: 5,
        title: 'Beginner Guitar Lessons',
        user: 'Marcus Wright',
        avatar: 'https://i.pravatar.cc/150?img=11',
        level: 'Intermediate',
        location: 'Remote',
        category: 'music',
        wantsInReturn: ['Web Development', 'Photography'],
        rating: 4.7,
    }
];

export const mockUser = {
    id: 'u1',
    name: 'Jane Doe',
    handle: '@janedoe',
    avatar: 'https://i.pravatar.cc/150?img=5',
    bio: 'Frontend developer passionate about building accessible user interfaces. Looking to trade React knowledge for UX design skills.',
    location: 'San Francisco, CA',
    joinedDate: 'Oct 2023',
    skillsOffered: [
        { id: 101, title: 'React Basics', level: 'Advanced' },
        { id: 102, title: 'CSS Animations', level: 'Intermediate' }
    ],
    skillsWanted: [
        { id: 201, title: 'UX Research', level: 'Beginner' },
        { id: 202, title: 'Figma Auto-layout', level: 'Intermediate' }
    ],
    stats: {
        swapsCompleted: 4,
        rating: 4.9,
        reviews: 12
    }
};

export const swapRequests = [
    {
        id: 'req1',
        type: 'incoming',
        user: { name: 'Sarah Lee', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d' },
        offering: 'Figma Prototyping Masterclass',
        requesting: 'React Basics',
        status: 'pending',
        date: '2 hours ago',
        message: 'Hi Jane! I loved your portfolio. Would love to swap my Figma skills for some React basics.'
    },
    {
        id: 'req2',
        type: 'incoming',
        user: { name: 'Marcus Wright', avatar: 'https://i.pravatar.cc/150?img=11' },
        offering: 'Beginner Guitar Lessons',
        requesting: 'CSS Animations',
        status: 'accepted',
        date: '3 days ago',
        message: 'Let me know if you are interested in some guitar lessons!'
    },
    {
        id: 'req3',
        type: 'sent',
        user: { name: 'Carlos Ruiz', avatar: 'https://i.pravatar.cc/150?u=a04258114e29026702d' },
        offering: 'React Basics',
        requesting: 'Conversational Spanish',
        status: 'pending',
        date: '1 day ago',
        message: 'Hola Carlos. I need help practicing for my trip next month.'
    }
];

export const initialUsers = [
    mockUser,
    {
        id: 'u2',
        name: 'Carlos Ruiz',
        handle: '@carlosr',
        avatar: 'https://i.pravatar.cc/150?u=a04258114e29026702d',
        bio: 'Native Spanish speaker and language enthusiast. Looking to learn React while helping others learn Spanish.',
        location: 'Remote',
        joinedDate: 'Jan 2024',
        skillsOffered: [
            { id: 103, title: 'Conversational Spanish', level: 'Native' }
        ],
        skillsWanted: [
            { id: 203, title: 'React', level: 'Beginner' },
            { id: 204, title: 'Node.js', level: 'Beginner' }
        ],
        stats: {
            swapsCompleted: 2,
            rating: 5.0,
            reviews: 3
        }
    }
];
