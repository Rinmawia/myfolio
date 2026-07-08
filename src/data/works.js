export const works = [
  {
    slug: 'nesh',
    number: '/01',
    title: 'NESH',
    year: '2026',
    roles: 'ART DIRECTION\nBRANDING\nUI/UX DESIGN\nDESIGN SYSTEM\nPRODUCT DESIGN',
    thumbnail:
      '/images/01/img_01.png',
    overview:
      'A product and brand system exploring clarity, speed, and a bold visual language across digital touchpoints.',
    description:
      'Homeowners needed quick, trustworthy access to local blue-collar services; workers lacked a reliable platform to find paid jobs. \nI Led UX research, UI design, and full branding for NESH (commissioned by Mizoram Youth Commission via Lailen Consultancy). Built a trust-focused visual identity, low-friction mobile UX, and a developer-first design system.',
    media: [
      { type: 'image', src: '/images/01/Thumbnail.png', alt: 'Screenshot 01' },
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
    thumbnail: '/images/02/img_03.png',
    overview:
      'Retail experience explorations for AI-assisted shopping, spanning interaction patterns, visual system updates, and prototyped flows.',
    description:
      'Amazon Australia Retail needs to increase purchases in the Books category across three distinct audience segments - Prime Members, Non-Prime Members, and Non‑Amazon Customers. I Art Directed, Designed and implemented an ADA (Amazon Display Ad) display format tailored to each segment to boost Books conversions by aligning messaging, incentives, and UI affordances with user intent. ',
    media: [
      { type: 'image', src: '/images/02/img_01.png', alt: 'Screenshot 01' },
      { type: 'image', src: '/images/02/img_02.png', alt: 'Screenshot 02' },
      { type: 'image', src: '/images/02/Thumbnail.png', alt: 'Screenshot 03' },
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
      '/images/03/img_01.png',
    overview:
      'An AI-driven concept exploring voice identity, generative visuals, and guided onboarding experiences.',
    description:
      'Nonverbal children often lack tools that let them communicate in ways that feel authentic to their individual personality, culture, and identity. Existing augmentative and alternative communication solutions tend to use generic, synthetic voices that erase nuance, leading to a sense of loss of self and limited social acceptance. We crafted visual direction, UX, and product design. Collaborated with engineers, speech scientists, and families to translate research into human-centered interactions, visuals, and motion that supported empathetic, confidence-building communication. Work recognised with a Webby Award 2026.',
    media: [
      { type: 'youtube', youtubeId: 'yAd_WTcAoeQ' },
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
      'Adobe Express aimed to expand its template library to better serve a global, diverse creator base. The challenge was to provide high-quality, scalable templates that feel timely and relevant across cultures, events, and skill levels. Led design and production, coordinating cross-functional teams to deliver a unified visual system and efficient production pipeline. Designed and produced 4,000+ premium, scalable templates across logos, marketing assets, and social media formats.',
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
      'Creative direction, layout exploration, and identity design for local EDM artist Fel, including development of a versatile logo unit and visual system for his upcoming album "HERLUM".',
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
