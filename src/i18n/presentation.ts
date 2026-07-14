export type Lang = 'en' | 'ro'

export type PillarCopy = {
  id: 'help' | 'connect' | 'events'
  title: string
  kicker: string
  subtitle: string
  overview: string
  image: string
  points: { text: string; icon: string }[]
}

type PresentationCopy = {
  join: string
  openApp: string
  translateTo: string
  heroEyebrow: string
  heroLead: string
  joinFamily: string
  enterCommunity: string
  learnMore: string
  comingSoonLabel: string
  comingSoonAndroid: string
  comingSoonIos: string
  endorsedBy: string
  needEyebrow: string
  needTitle: string
  needBody1: string
  needBody2: string
  pillarsEyebrow: string
  pillarsTitle: string
  pillarsLead: string
  modelEyebrow: string
  modelTitle: string
  modelBody: string
  ideaModalTitle: string
  ideaModalBody: string[]
  contribModalTitle: string
  contribModalBody: string[]
  modelModalClose: string
  closeEyebrow: string
  closeTitle: string
  closeLead: string
  consulate: string
  patriarchate: string
  verse: string
  verseCite: string
  monthlyHelp: string
  volunteer: string
  footer: string
  pillars: PillarCopy[]
}

const pillarImages = {
  help: '/presentation/pillars/help-bg.jpeg',
  connect: '/presentation/pillars/connect-bg.jpeg',
  events: '/presentation/pillars/events-bg.jpeg',
} as const

const pillarIcons = {
  help: [
    '/presentation/pillars/s4-i2.png',
    '/presentation/pillars/s4-i3.png',
    '/presentation/pillars/s4-i4.png',
    '/presentation/pillars/s4-i5.png',
    '/presentation/pillars/s4-i6.png',
  ],
  connect: [
    '/presentation/pillars/s5-i2.png',
    '/presentation/pillars/s5-i3.png',
    '/presentation/pillars/s5-i4.png',
    '/presentation/pillars/s5-i5.png',
    '/presentation/pillars/s5-i6.png',
  ],
  events: [
    '/presentation/pillars/s6-i2.png',
    '/presentation/pillars/s6-i3.png',
    '/presentation/pillars/s6-i4.png',
    '/presentation/pillars/s6-i5.png',
    '/presentation/pillars/s6-i6.png',
  ],
} as const

export const presentationCopy: Record<Lang, PresentationCopy> = {
  en: {
    join: 'Join',
    openApp: 'Open app',
    translateTo: 'RO',
    heroEyebrow: 'Faith · Community · Hope',
    heroLead: 'A ministry serving the Romanian Orthodox community around the world.',
    joinFamily: 'Join the Trinity family',
    enterCommunity: 'Enter community',
    learnMore: 'Learn more',
    comingSoonLabel: 'Mobile apps',
    comingSoonAndroid: 'Android — Coming soon',
    comingSoonIos: 'iOS — Coming soon',
    endorsedBy:
      'Endorsed by the Romanian Consulate in Los Angeles & the Romanian Patriarchate',
    needEyebrow: 'The need',
    needTitle: 'Bridging the gap for Romanian Orthodox faithful',
    needBody1:
      'Over one million Romanians call the United States home. Many face the quiet ache of spiritual disconnection — far from ancestral parishes, navigating life in a new land while striving to pass on the beauty of Orthodox faith and Romanian culture to their children.',
    needBody2:
      'Trinity was born to answer this call: a living bridge of faith, practical help, and authentic community for the diaspora.',
    pillarsEyebrow: 'Introducing Trinity',
    pillarsTitle: 'Three pillars. One sacred mission.',
    pillarsLead:
      'Rooted in the Holy Trinity and the rich tradition of the Romanian Orthodox Church, Trinity offers a holistic ministry of presence, compassion, and celebration for Romanians across America.',
    modelEyebrow: 'Our model',
    modelTitle: 'Sustainable ministry through monthly micro-contribution',
    modelBody:
      'Trinity is sustained by the community’s monthly micro-contributions—a shared commitment of care. It is built for spread good—not personal glory: Each gift quietly supports help, compassion, and practical programs so families and neighbors across the diaspora can grow stronger together.',
    ideaModalTitle: 'The idea of Trinity',
    ideaModalBody: [
      'Trinity is a faith-rooted community ministry for Romanian Orthodox people wherever they live in the world. It exists to answer a quiet, widespread need: many families are far from ancestral parishes, carrying the weight of a new land while longing to keep Orthodox faith, Romanian language, and living community close to their children.',
      'The name Trinity points to the heart of Christian life—unity in love—and to a simple promise: no one in the diaspora should have to walk alone. Trinity builds a living bridge between home and host country, between parish and family, between those who can give help and those who need it.',
      'That bridge rests on three pillars. Help means compassion in action: emergency aid, pastoral care, support for new immigrants, youth mentorship, and confidential guidance in life’s hardest moments. Connect means belonging: small faith groups, prayer companionship, mentorship across generations, and cultural heritage kept alive. Events means celebration: liturgy and feast days, festivals, learning, youth retreats, and gatherings that renew joy and shared memory.',
      'Trinity is sustained by the community’s monthly micro-contributions—a shared commitment of care. It is built to spread good, not personal glory. Each gift quietly supports practical programs so families and neighbors across the diaspora can grow stronger together, with dignity and without spectacle.',
      'Looking ahead, Trinity also includes a digital home—web today, and Android and iOS apps coming soon—so parish news, mutual help, messages, and community life can travel with people wherever they are.',
      'In short, Trinity is presence, compassion, and celebration made practical: a ministry of shared responsibility, trusting that where two or three are gathered in Christ’s name, He is in the midst of them.',
    ],
    contribModalTitle: 'How monthly micro-contribution works',
    contribModalBody: [
      'A small monthly gift from many people creates steady support for families, parishes, and neighbors who need help.',
      'Contributions are guided by compassion—not recognition—so help reaches people with dignity and care.',
      'Your monthly share helps fund practical aid, pastoral presence, community connection, and events that keep faith and culture alive across the diaspora.',
      'When you are ready, you can join the Trinity family and begin offering monthly help.',
    ],
    modelModalClose: 'Close',
    closeEyebrow: 'Endorsed & trusted',
    closeTitle: 'Building legacy together',
    closeLead: 'Trinity is honored to serve under the blessing and endorsement of:',
    consulate: 'Romanian Consulate\nin Los Angeles',
    patriarchate: 'The Romanian\nPatriarchate',
    verse:
      '“Where two or three are gathered in My name, there I am in the midst of them.”',
    verseCite: '— Matthew 18:20',
    monthlyHelp: 'Offer monthly help',
    volunteer: 'Volunteer · Partner with us',
    footer: 'Trinity Ministry · Romanian Orthodox Diaspora · Los Angeles, California',
    pillars: [
      {
        id: 'help',
        title: 'Help',
        kicker: 'Pillar one',
        subtitle: 'Compassion in Action',
        overview:
          'Tangible compassion and practical support for families and individuals in need.',
        image: pillarImages.help,
        points: [
          {
            text: 'Emergency financial assistance & charitable aid',
            icon: pillarIcons.help[0],
          },
          {
            text: 'Family counseling and pastoral care',
            icon: pillarIcons.help[1],
          },
          {
            text: 'New immigrant integration support',
            icon: pillarIcons.help[2],
          },
          {
            text: 'Youth mentorship & educational resources',
            icon: pillarIcons.help[3],
          },
          {
            text: "Confidential guidance through life's transitions",
            icon: pillarIcons.help[4],
          },
        ],
      },
      {
        id: 'connect',
        title: 'Connect',
        kicker: 'Pillar two',
        subtitle: 'A Family Away From Home',
        overview:
          'Authentic relationships, spiritual networks, and a true sense of belonging.',
        image: pillarImages.connect,
        points: [
          {
            text: 'Parish-based & online small faith groups',
            icon: pillarIcons.connect[0],
          },
          {
            text: 'Intergenerational mentorship programs',
            icon: pillarIcons.connect[1],
          },
          {
            text: 'Prayer chains & spiritual companionship',
            icon: pillarIcons.connect[2],
          },
          {
            text: 'Cultural & linguistic heritage initiatives',
            icon: pillarIcons.connect[3],
          },
          {
            text: 'Dedicated digital platform for the diaspora',
            icon: pillarIcons.connect[4],
          },
        ],
      },
      {
        id: 'events',
        title: 'Events',
        kicker: 'Pillar three',
        subtitle: 'Celebrating Faith & Heritage',
        overview:
          'Vibrant celebrations of faith, culture, and the joy of Orthodox life together.',
        image: pillarImages.events,
        points: [
          {
            text: 'Holy Liturgy & major feast day services',
            icon: pillarIcons.events[0],
          },
          {
            text: 'Romanian cultural festivals & traditions',
            icon: pillarIcons.events[1],
          },
          {
            text: 'Educational workshops & faith lectures',
            icon: pillarIcons.events[2],
          },
          {
            text: 'Youth retreats and family gatherings',
            icon: pillarIcons.events[3],
          },
          {
            text: 'Annual charity galas & outreach events',
            icon: pillarIcons.events[4],
          },
        ],
      },
    ],
  },
  ro: {
    join: 'Alătură-te',
    openApp: 'Deschide aplicația',
    translateTo: 'EN',
    heroEyebrow: 'Credință · Comunitate · Speranță',
    heroLead:
      'O misiune care slujește comunitatea ortodoxă română din întreaga lume.',
    joinFamily: 'Alătură-te familiei Trinity',
    enterCommunity: 'Intră în comunitate',
    learnMore: 'Află mai mult',
    comingSoonLabel: 'Aplicații mobile',
    comingSoonAndroid: 'Android — În curând',
    comingSoonIos: 'iOS — În curând',
    endorsedBy:
      'Susținută de Consulatul României din Los Angeles și de Patriarhia Română',
    needEyebrow: 'Nevoia',
    needTitle: 'Punte peste distanță pentru credincioșii ortodocși români',
    needBody1:
      'Peste un milion de români își au casa în Statele Unite. Mulți simt durerea tăcută a îndepărtării duhovnicești — departe de parohiile străbune, navigând viața într-un pământ nou și dorind să transmită copiilor frumusețea credinței ortodoxe și a culturii române.',
    needBody2:
      'Trinity s-a născut ca răspuns la această chemare: o punte vie de credință, ajutor practic și comunitate autentică pentru diasporă.',
    pillarsEyebrow: 'Prezentăm Trinity',
    pillarsTitle: 'Trei piloni. O misiune sfântă.',
    pillarsLead:
      'Înrădăcinată în Sfânta Treime și în tradiția bogată a Bisericii Ortodoxe Române, Trinity oferă o misiune holistă de prezență, compasiune și sărbătoare pentru români din America și din întreaga lume.',
    modelEyebrow: 'Modelul nostru',
    modelTitle: 'Misiune durabilă prin micro-contribuție lunară',
    modelBody:
      'Trinity este susținută de micro-contribuțiile lunare ale comunității—un angajament comun de grijă. Este zidită pentru a răspândi binele, nu pentru slavă personală: Fiecare dar sprijină în tăcere ajutorul, compasiunea și programele practice, ca familiile și vecinii din diasporă să crească împreună mai puternici.',
    ideaModalTitle: 'Ideea proiectului Trinity',
    ideaModalBody: [
      'Trinity este o misiune comunitară înrădăcinată în credință, pentru oamenii ortodocși români oriunde trăiesc în lume. Ea răspunde unei nevoi tăcute și răspândite: multe familii sunt departe de parohiile străbune, purtând greutatea unui pământ nou și dorind să țină aproape de copii credința ortodoxă, limba română și o comunitate vie.',
      'Numele Trinity arată spre inima vieții creștine—unitatea în iubire—și spre o făgăduință simplă: nimeni din diasporă nu ar trebui să umble singur. Trinity zidește o punte vie între casă și țara gazdă, între parohie și familie, între cei care pot oferi ajutor și cei care au nevoie de el.',
      'Această punte se sprijină pe trei piloni. Ajutorul înseamnă compasiune în faptă: sprijin de urgență, grijă pastorală, integrarea noilor imigranți, mentorat pentru tineri și îndrumare confidențială în clipele grele. Legăturile înseamnă apartenență: grupuri mici de credință, însoțire în rugăciune, mentorat între generații și moștenire culturală ținută vie. Evenimentele înseamnă sărbătoare: Liturghie și praznice, festivaluri, învățătură, retrageri pentru tineri și întâlniri care reînnoiesc bucuria și memoria comună.',
      'Trinity este susținută de micro-contribuțiile lunare ale comunității—un angajament comun de grijă. Este zidită pentru a răspândi binele, nu pentru slavă personală. Fiecare dar sprijină în tăcere programe practice, ca familiile și vecinii din diasporă să crească împreună mai puternici, cu demnitate și fără spectacol.',
      'În viitor, Trinity va avea și o casă digitală—web acum, iar aplicațiile Android și iOS în curând—ca veștile de parohie, ajutorul reciproc, mesajele și viața comunității să călătorească odată cu oamenii, oriunde ar fi.',
      'Pe scurt, Trinity este prezență, compasiune și sărbătoare făcute practice: o misiune a răspunderii împărtășite, încredințată că unde sunt doi sau trei adunați în numele lui Hristos, El este în mijlocul lor.',
    ],
    contribModalTitle: 'Cum funcționează micro-contribuția lunară',
    contribModalBody: [
      'Un dar lunar mic din partea multora creează sprijin statornic pentru familii, parohii și vecini aflați în nevoie.',
      'Contribuțiile sunt călăuzite de compasiune—nu de recunoaștere—ca ajutorul să ajungă la oameni cu demnitate și grijă.',
      'Partea ta lunară ajută la finanțarea ajutorului practic, a prezenței pastorale, a legăturilor comunitare și a evenimentelor care țin vii credința și cultura în diasporă.',
      'Când ești gata, te poți alătura familiei Trinity și începe să oferi ajutor lunar.',
    ],
    modelModalClose: 'Închide',
    closeEyebrow: 'Susținută & demnă de încredere',
    closeTitle: 'Zidim moștenire împreună',
    closeLead: 'Trinity are onoarea de a sluji sub binecuvântarea și susținerea:',
    consulate: 'Consulatul României\ndin Los Angeles',
    patriarchate: 'Patriarhia\nRomână',
    verse:
      '„Că unde sunt doi sau trei, adunați în numele Meu, acolo sunt și Eu în mijlocul lor.”',
    verseCite: '— Matei 18:20',
    monthlyHelp: 'Oferă ajutor lunar',
    volunteer: 'Voluntariat · Parteneriat',
    footer: 'Trinity Ministry · Diaspora ortodoxă română · Los Angeles, California',
    pillars: [
      {
        id: 'help',
        title: 'Ajutor',
        kicker: 'Pilonul unu',
        subtitle: 'Compasiune în faptă',
        overview:
          'Compasiune concretă și sprijin practic pentru familii și persoane aflate în nevoie.',
        image: pillarImages.help,
        points: [
          {
            text: 'Asistență financiară de urgență și ajutor caritabil',
            icon: pillarIcons.help[0],
          },
          {
            text: 'Consiliere familială și grijă pastorală',
            icon: pillarIcons.help[1],
          },
          {
            text: 'Sprijin pentru integrarea noilor imigranți',
            icon: pillarIcons.help[2],
          },
          {
            text: 'Mentorat pentru tineri și resurse educaționale',
            icon: pillarIcons.help[3],
          },
          {
            text: 'Îndrumare confidențială în momentele de cumpănă ale vieții',
            icon: pillarIcons.help[4],
          },
        ],
      },
      {
        id: 'connect',
        title: 'Legături',
        kicker: 'Pilonul doi',
        subtitle: 'O familie departe de casă',
        overview:
          'Relații autentice, rețele duhovnicești și un adevărat sentiment de apartenență.',
        image: pillarImages.connect,
        points: [
          {
            text: 'Grupuri mici de credință, parohiale și online',
            icon: pillarIcons.connect[0],
          },
          {
            text: 'Programe de mentorat între generații',
            icon: pillarIcons.connect[1],
          },
          {
            text: 'Lanțuri de rugăciune și însoțire duhovnicească',
            icon: pillarIcons.connect[2],
          },
          {
            text: 'Inițiative pentru moștenirea culturală și lingvistică',
            icon: pillarIcons.connect[3],
          },
          {
            text: 'Platformă digitală dedicată diasporei',
            icon: pillarIcons.connect[4],
          },
        ],
      },
      {
        id: 'events',
        title: 'Evenimente',
        kicker: 'Pilonul trei',
        subtitle: 'Sărbătorind credința și moștenirea',
        overview:
          'Sărbători vii ale credinței, culturii și bucuriei vieții ortodoxe împreună.',
        image: pillarImages.events,
        points: [
          {
            text: 'Sfânta Liturghie și slujbele marilor sărbători',
            icon: pillarIcons.events[0],
          },
          {
            text: 'Festivaluri și tradiții culturale românești',
            icon: pillarIcons.events[1],
          },
          {
            text: 'Ateliere educative și conferințe de credință',
            icon: pillarIcons.events[2],
          },
          {
            text: 'Retrageri pentru tineri și întâlniri de familie',
            icon: pillarIcons.events[3],
          },
          {
            text: 'Gale caritabile anuale și evenimente de misiune',
            icon: pillarIcons.events[4],
          },
        ],
      },
    ],
  },
}

const STORAGE_KEY = 'trinity-presentation-lang'

export function getStoredLang(): Lang {
  try {
    const v = localStorage.getItem(STORAGE_KEY)
    if (v === 'ro' || v === 'en') return v
  } catch {
    /* ignore */
  }
  return 'en'
}

export function storeLang(lang: Lang) {
  try {
    localStorage.setItem(STORAGE_KEY, lang)
  } catch {
    /* ignore */
  }
}
