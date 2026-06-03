export const works = [
  {
    slug: 'nesh',
    number: '/01',
    title: 'NESH',
    year: '2026',
    roles: 'ART DIRECTION\nBRANDING\nUI/UX DESIGN\nDESIGN SYSTEM\nPRODUCT DESIGN',
    thumbnail:
      '/images/01/Thumbnail.png',
    overview:
      'A product and brand system exploring clarity, speed, and a bold visual language across digital touchpoints.',
    description:
      'Led end-to-end full branding and UI/UX design for NESH, an integrated product and brand platform that unites two core user personas. I developed a cohesive brand identity from the ground up, built a scalable design system with developer-first documentation, and delivered a unified digital experience that balances bold visual language with seamless functionality.',
    media: [
      { type: 'image', src: '/images/01/img_01.png', alt: 'Screenshot 01' },
      { type: 'image', src: '/images/01/img_02.png', alt: 'Screenshot 02' },
      { type: 'image', src: '/images/01/img_03.png', alt: 'Screenshot 03' },
      { type: 'image', src: '/images/01/img_04.png', alt: 'Screenshot 04' },
      { type: 'image', src: '/images/01/img_05.png', alt: 'Screenshot 05' },
      { type: 'image', src: '/images/01/img_06.png', alt: 'Screenshot 06' },
      { type: 'image', src: '/images/01/img_07.png', alt: 'Screenshot 07' },
      { type: 'image', src: '/images/01/img_08.png', alt: 'Screenshot 08' },
      { type: 'image', src: '/images/01/img_09.png', alt: 'Screenshot 09' },
    ]
  },
  {
    slug: 'amazon-retail-au',
    number: '/02',
    title: 'AMAZON RETAIL AU',
    year: '2025-2026',
    roles: 'AI DESIGN\nDESIGN SYSTEM\nART DIRECTION',
    thumbnail: '/images/02/Thumbnail.png',
    overview:
      'Retail experience explorations for AI-assisted shopping, spanning interaction patterns, visual system updates, and prototyped flows.',
    description:
      'Implement ADA display format aimed at boosting purchases in the Books category among Prime Members, Non-Prime Members, and Non-Amazon Customers for Amazon Australia Retail.',
    media: [
      { type: 'image', src: '/images/02/img_01.png', alt: 'Screenshot 01' },
      { type: 'image', src: '/images/02/img_02.png', alt: 'Screenshot 02' },
      { type: 'image', src: '/images/02/img_03.png', alt: 'Screenshot 03' },
      { type: 'image', src: '/images/02/img_04.png', alt: 'Screenshot 04' }
    ]
  },
  {
    slug: 'my-first-voice',
    number: '/03',
    title: 'MY FIRST VOICE',
    year: '2025',
    roles: 'AI INNOVATION\nVISUAL DESIGN\nART DIRECTION',
    thumbnail:
      '/images/03/Thumbnail.png',
    overview:
      'An AI-driven concept exploring voice identity, generative visuals, and guided onboarding experiences.',
    description:
      'Empowering nonverbal children to find their voice through groundbreaking AI speech technology. This human-centered platform translates each child’s unique vocalizations into personalized, authentic speech that preserves their individual personality, cultural heritage, and natural identity—ensuring no child has to compromise who they are to be heard.',
    media: [
      { type: 'youtube', youtubeId: 'yAd_WTcAoeQ' },
      { type: 'image', src: '/images/03/img_01.png', alt: 'Screenshot 01' },
      { type: 'video', src: '/images/03/video_01.mp4', alt: 'Screenshot 01' },
      { type: 'image', src: '/images/03/img_02.png', alt: 'Screenshot 02' },
    ]
  },
  {
    slug: 'adobe-express',
    number: '/04',
    title: 'ADOBE EXPRESS',
    year: '2024',
    roles: 'ART DIRECTION\nVISUAL DESIGN\nASSET AT SCALE',
    thumbnail:
      '/images/04/Thumbnail.png',
    overview:
      'Visual system work and asset direction for scalable templates and brand-forward content creation.',
    description:
      'Led design and production of over 4,000 premium, scalable templates for Adobe Express, spanning logo creation, marketing assets, and social media content—tailored for global events, seasonal campaigns, and everyday brand occasions to empower creators of all skill levels.',
    media: [
      { type: 'image', src: '/images/04/img_01.png', alt: 'Screenshot 01' },
      { type: 'image', src: '/images/04/img_02.png', alt: 'Screenshot 02' },
      { type: 'image', src: '/images/04/img_03.png', alt: 'Screenshot 03' },
      { type: 'image', src: '/images/04/img_04.png', alt: 'Screenshot 04' }
    ]
  },
  {
    slug: 'fela',
    number: '/05',
    title: 'FEL. HERLUM',
    year: '2026',
    roles: 'PERSONAL BRANDING\nVISUAL DESIGN\nART DIRECTION',
    thumbnail:
      '/images/05/Thumbnail.png',
    overview:
      'A personal brand system including identity exploration, typography direction, and key layouts.',
    description:
      'Creative direction, layout exploration, and Identity design for a local EDM Artist - Fel. Where we also explored the logo unit for his upcoming album "HERLUM".',
    media: [
      { type: 'image', src: '/images/05/img_01.png', alt: 'Screenshot 01' },
      { type: 'image', src: '/images/05/img_02.png', alt: 'Screenshot 02' },
      { type: 'image', src: '/images/05/img_03.png', alt: 'Screenshot 03' },
      { type: 'image', src: '/images/05/img_04.png', alt: 'Screenshot 04' },
      { type: 'image', src: '/images/05/img_05.png', alt: 'Screenshot 05' }
    ]
  }
]

export const getWorkBySlug = (slug) => works.find((w) => w.slug === slug)
