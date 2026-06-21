/**
 * CardVerse - User Configuration Data
 * Define all 3 business card users here.
 */

const CARDVERSE_CONFIG = {
  // MindAR targets file path (must be generated via MindAR compiler)
  targetsPath: 'assets/targets.mind?v=' + Date.now(),

  // Global theme settings
  theme: {
    background: '#050810',
    surface: '#0A0E1A',
    brandGradient: 'linear-gradient(135deg, #7C3AED, #06B6D4)',
  },

  // 3 users — index matches target image index in targets.mind
  users: [
    {
      index: 0,
      name: 'Agustian Putra Sukarya',
      title: 'Mahasiswa Teknologi Informasi',
      initial: 'A',
      accent: '#7C3AED',
      accentSecondary: '#06B6D4',
      gradientFrom: '#7C3AED',
      gradientTo: '#06B6D4',
      avatarStyle: 'violet-cyan',
      socials: {
        instagram: {
          url: 'https://instagram.com/agstn.ptz',
          label: '@agstn.ptz',
          icon: 'ig',
        },
        whatsapp: {
          url: 'https://wa.me/628881274259',
          label: '+62 888-127-4259',
          icon: 'wa',
        },
        linkedin: {
          url: 'https://linkedin.com/in/agustian-putra',
          label: 'agustian-putra',
          icon: 'li',
        },
      },
    },
    {
      index: 1,
      name: 'Bayu Syabana',
      title: 'Mahasiswa Teknologi Informasi',
      initial: 'B',
      accent: '#06B6D4',
      accentSecondary: '#7C3AED',
      gradientFrom: '#06B6D4',
      gradientTo: '#7C3AED',
      avatarStyle: 'cyan-violet',
      socials: {
        instagram: {
          url: 'https://instagram.com/bayusyabanaaaa_',
          label: '@bayusyabanaaaa_',
          icon: 'ig',
        },
        whatsapp: {
          url: 'https://wa.me/6285368048040',
          label: '+62 853-6804-8040',
          icon: 'wa',
        },
        linkedin: {
          url: 'https://linkedin.com/in/bayu-syabana',
          label: 'bayu-syabana',
          icon: 'li',
        },
      },
    },
    {
      index: 2,
      name: 'Sayyid Abdurrasyad',
      title: 'Mahasiswa Teknologi Informasi',
      initial: 'S',
      accent: '#E11D48',
      accentSecondary: '#F97316',
      gradientFrom: '#E11D48',
      gradientTo: '#F97316',
      avatarStyle: 'rose-orange',
      socials: {
        instagram: {
          url: 'https://instagram.com/syyidabdr_',
          label: '@syyidabdr_',
          icon: 'ig',
        },
        whatsapp: {
          url: 'https://wa.me/6289699719101',
          label: '+62 896-9971-9101',
          icon: 'wa',
        },
        linkedin: null, // No LinkedIn for this user
      },
    },
  ],
};

// Freeze config to prevent accidental mutation
Object.freeze(CARDVERSE_CONFIG);
