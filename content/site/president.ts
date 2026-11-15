type MessagePart = string | { strong: string } | { emphasis: string }

const welcome = 'Welcome to the Indian Nuclear Physics Association (INPA). Our purpose is to advance nuclear physics in India by bringing together colleagues across universities, colleges, research institutes, national laboratories and industry.'

const paragraphs: readonly (readonly MessagePart[])[] = [
  [`${welcome} We want to make it easier for a student to find a research group, for an experimental team to find a facility, and for colleagues with complementary expertise to undertake work together.`],
  [
    { strong: 'We must stop the decline of nuclear physics teaching in India.' },
    ' Many universities and IITs offer no dedicated course in nuclear physics. Where courses are available, they are sometimes taught by faculty whose expertise lies in other areas. I am particularly concerned by the trend towards reducing nuclear physics offerings. Institutions should reverse this trend by restoring courses that have been dropped, introducing them where they are absent, and ensuring that students learn from faculty with expertise in the subject.',
  ],
  [
    { strong: 'Recruiting young faculty and researchers in low-energy nuclear physics should be a national priority.' },
    ' The field remains underrepresented across the IISERs, NISER, IITs and NITs. I urge these institutions to make it an explicit priority in their recruitment plans. Young faculty need the laboratory support and access to national facilities that will allow them to build research groups, develop courses and give students a route from the classroom into research.',
  ],
  [
    'One ambition I have long held is to see a ',
    { strong: 'research and training reactor established at an IIT or a university in India' },
    '. It could give students first-hand experience in reactor physics, neutron measurements and instrumentation. By welcoming students and researchers from other institutions, the host institution could make it a shared national facility for education and research.',
  ],
  [
    'I also believe that India should establish a ',
    { strong: 'National Centre for Nuclear Sciences' },
    '. The Centre would bring theorists and experimentalists together to develop questions, design measurements and interpret results. Its remit should span fundamental nuclear physics and applications in energy, medicine and materials science. Developed in partnership with universities and national laboratories, it could train researchers and support experiments that individual institutions would find difficult to undertake on their own.',
  ],
  [
    { strong: 'INPA has a responsibility to help make the SHANTI Act, 2025, a success.' },
    ' As India’s nuclear sector grows, it will need scientists, engineers and technical personnel with practical experience. Through our developing links with the nuclear industry, INPA can help employers, academic institutions and national laboratories identify the skills they need and design training together. Reactor physics, radiation detection, instrumentation and radiation protection are areas where this collaboration can give students practical experience and help working professionals develop the expertise needed for the safe and peaceful use of nuclear technology.',
  ],
  [
    'Through the ',
    { strong: 'National Nuclear Physics Initiative (NNPI)' },
    ', we are drawing on the recommendations of ',
    { emphasis: 'Mega Science Vision–2035' },
    ' to identify priorities for joint action. The ',
    { strong: 'Nuclear Physics Landscape of India' },
    ' on this website helps colleagues find research groups and facilities. It can also help us identify gaps in research and training and see where institutions could pool their resources.',
  ],
  [
    'I am grateful for the wide support INPA has received from senior colleagues and younger members of our community alike. They have given their time and ideas to build this website, strengthen ',
    { emphasis: 'Nuclear Horizons' },
    ' and develop the ',
    { strong: 'INPA Young Scientist Colloquium' },
    '. I especially value what the colloquium makes possible. Younger researchers can present their work and discuss it with colleagues across the country.',
  ],
  ['I invite you to use this website and help it grow. Share your group’s work, tell us about a training opportunity, or bring us a proposal for collaboration. If you are a student considering a career in nuclear physics, I hope you will find people here whose work interests you and feel encouraged to get in touch.'],
]

export const presidentContent = {
  title: 'President’s Message',
  name: 'Prof. Ashok Kumar Jain',
  role: 'President, Indian Nuclear Physics Association',
  description: 'Prof. Ashok Kumar Jain addresses INPA’s priorities for nuclear physics education, training, research and collaboration in India.',
  portrait: { src: '/images/president-ashok-kumar-jain.webp', width: 630, height: 792 },
  greeting: 'Dear Colleagues and Friends,',
  welcome,
  paragraphs,
  to: '/about/presidents-message',
} as const
