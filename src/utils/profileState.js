export const COMPANY_INFO = {
  name: 'Nusantara Project Creative',
  shortName: 'NPC',
  domain: 'id.nusantaraprojectcreative',
  website: 'https://nusantaraprojectcreative.com',
  websiteDisplay: 'nusantaraprojectcreative.com',
  companyEmail: 'contact@nusantaraprojectcreative.com',
  address:
    'Jl. Radio III No. 3, Kramat Pela, Kebayoran Baru, Jakarta Selatan 12130',
  street: 'Jl. Radio III No. 3, Kramat Pela, Kebayoran Baru',
  city: 'Jakarta Selatan',
  province: 'DKI Jakarta',
  postalCode: '12130',
  country: 'Indonesia',
  mapsUrl:
    'https://www.google.com/maps/search/?api=1&query=Jl.+Radio+III+No.+3,+Kramat+Pela,+Kebayoran+Baru,+Jakarta+Selatan+12130',
  logoUrl: '/logo-npc.png',
};

export const EXECUTIVES = {
  ceo: {
    slug: 'ceo',
    route: '/ceo',
    publicUrl: 'https://id.nusantaraprojectcreative/ceo',
    fullName: 'ATHAILLAH BAGAS R',
    firstName: 'Athaillah',
    middleName: 'Bagas',
    lastName: 'R',
    nameSuffix: '',
    relatedName: 'CEO Nusantara Project Creative',
    jobTitle: 'Chief Executive Officer',
    shortRole: 'CEO',
    badgeText: 'Executive Leadership • CEO',
    accentColor: '#f59e0b',
    accentSecondary: '#d97706',
    glowColor: 'rgba(245, 158, 11, 0.28)',
    bgTheme:
      'radial-gradient(circle at 50% 0%, #2b1d0c 0%, #0a0e17 58%, #05070c 100%)',
    bannerGradient:
      'linear-gradient(135deg, #f59e0b 0%, #b45309 48%, #0f172a 100%)',
    phones: ['+62 811-111-068', '+62 811-3654-232'],
    emailBusiness: 'atha@nusantaraprojectcreative.com',
    emailPersonal: 'contact@nusantaraprojectcreative.com',
    website: 'nusantaraprojectcreative.com',
    address:
      'Jl. Radio III No. 3, Kramat Pela, Kebayoran Baru, Jakarta Selatan 12130',
  },
  director: {
    slug: 'director',
    route: '/director',
    publicUrl: 'https://id.nusantaraprojectcreative/director',
    fullName: 'YANUAR ADENAN, M.H.',
    firstName: 'Yanuar',
    middleName: '',
    lastName: 'Adenan',
    nameSuffix: 'M.H.',
    relatedName: 'Director Nusantara Project Creative',
    jobTitle: 'Director',
    shortRole: 'DIRECTOR',
    badgeText: 'Board of Directors • NPC',
    accentColor: '#38bdf8',
    accentSecondary: '#2563eb',
    glowColor: 'rgba(56, 189, 248, 0.26)',
    bgTheme:
      'radial-gradient(circle at 50% 0%, #0c2b45 0%, #091122 58%, #050811 100%)',
    bannerGradient:
      'linear-gradient(135deg, #38bdf8 0%, #1d4ed8 52%, #0f172a 100%)',
    phones: ['+62 811-113-456', '+62 811-113-7001'],
    emailBusiness: 'bobby@nusantaraprojectcreative.com',
    emailPersonal: 'contact@nusantaraprojectcreative.com',
    website: 'nusantaraprojectcreative.com',
    address:
      'Jl. Radio III No. 3, Kramat Pela, Kebayoran Baru, Jakarta Selatan 12130',
  },
  cfo: {
    slug: 'cfo',
    route: '/cfo',
    publicUrl: 'https://id.nusantaraprojectcreative/cfo',
    fullName: 'ISTIKOMAH WARDANI, S.E., AK.',
    firstName: 'Istikomah',
    middleName: '',
    lastName: 'Wardani',
    nameSuffix: 'S.E., Ak.',
    relatedName: 'CFO Nusantara Project Creative',
    jobTitle: 'Chief Financial Officer',
    shortRole: 'CFO',
    badgeText: 'Executive Finance • CFO',
    accentColor: '#10b981',
    accentSecondary: '#059669',
    glowColor: 'rgba(16, 185, 129, 0.26)',
    bgTheme:
      'radial-gradient(circle at 50% 0%, #06392c 0%, #071516 58%, #04090b 100%)',
    bannerGradient:
      'linear-gradient(135deg, #10b981 0%, #047857 52%, #0f172a 100%)',
    phones: ['+62 811-3654-233', '+62 811-3688-690'],
    emailBusiness: 'ninin@nusantaraprojectcreative.com',
    emailPersonal: 'contact@nusantaraprojectcreative.com',
    website: 'nusantaraprojectcreative.com',
    address:
      'Jl. Radio III No. 3, Kramat Pela, Kebayoran Baru, Jakarta Selatan 12130',
  },
};

export const EXECUTIVE_LIST = [
  EXECUTIVES.ceo,
  EXECUTIVES.director,
  EXECUTIVES.cfo,
];

/**
 * Format phone number for WhatsApp link (`https://wa.me/62811...`)
 */
export function formatWhatsAppUrl(phone) {
  const digits = (phone || '').replace(/[^\d]/g, '');
  const normalized = digits.startsWith('0') ? `62${digits.slice(1)}` : digits;
  return `https://wa.me/${normalized}`;
}

/**
 * Format phone number for `tel:` link
 */
export function formatTelUrl(phone) {
  return `tel:${(phone || '').replace(/[^\d+]/g, '')}`;
}

/**
 * Generate Apple iPhone (iOS) & Android optimized vCard 3.0 string.
 * Includes First Name, Middle Name, Last Name, Suffix, Company, Job Title,
 * WhatsApp/Mobile Phone, Work/Personal Email, Website URL, Structured Address,
 * and Apple iOS Related Name (`X-ABRELATEDNAMES`).
 */
export function generateExecutiveVCard(exec, prioritizedPhone = null) {
  const allPhones = exec.phones || [];
  const orderedPhones = prioritizedPhone
    ? [prioritizedPhone, ...allPhones.filter((p) => p !== prioritizedPhone)]
    : allPhones;

  const lines = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `N:${exec.lastName || ''};${exec.firstName || ''};${exec.middleName || ''};;${
      exec.nameSuffix || ''
    }`,
    `FN:${exec.fullName}`,
    `ORG:${COMPANY_INFO.name};`,
    `TITLE:${exec.jobTitle}`,
  ];

  // Phone numbers (WhatsApp / Mobile prioritized)
  orderedPhones.forEach((ph, idx) => {
    const clean = ph.replace(/[^\d+]/g, '');
    const itemIdx = idx + 1;
    if (idx === 0) {
      lines.push(`item${itemIdx}.TEL;TYPE=CELL,VOICE,MSG,PREF:${clean}`);
      lines.push(`item${itemIdx}.X-ABLabel:WhatsApp`);
    } else {
      lines.push(`item${itemIdx}.TEL;TYPE=CELL,WORK,VOICE:${clean}`);
      lines.push(`item${itemIdx}.X-ABLabel:Mobile`);
    }
  });

  // Emails (Business & Official/Personal)
  if (exec.emailBusiness) {
    lines.push(`item3.EMAIL;TYPE=WORK,INTERNET,PREF:${exec.emailBusiness}`);
    lines.push(`item3.X-ABLabel:Work`);
  }
  if (exec.emailPersonal) {
    lines.push(`item4.EMAIL;TYPE=HOME,INTERNET:${exec.emailPersonal}`);
    lines.push(`item4.X-ABLabel:Official`);
  }

  // URLs (Company Website & Digital Card URL)
  if (exec.website) {
    const cleanWeb = exec.website.replace(/^https?:\/\//, '');
    lines.push(`item5.URL;TYPE=WORK,PREF:https://${cleanWeb}`);
    lines.push(`item5.X-ABLabel:_$!<HomePage>!$_`);
  }
  if (exec.publicUrl) {
    lines.push(`item6.URL:${exec.publicUrl}`);
    lines.push(`item6.X-ABLabel:Digital ID Card`);
  }

  // Structured Work Address for iPhone & Google Maps
  lines.push(
    `item7.ADR;TYPE=WORK,PREF:;;${COMPANY_INFO.street};${COMPANY_INFO.city};${COMPANY_INFO.province};${COMPANY_INFO.postalCode};${COMPANY_INFO.country}`
  );
  lines.push(`item7.X-ABADR:id`);

  // iPhone Related Name (e.g. "CEO Nusantara Project Creative")
  const relatedVal =
    exec.relatedName || `${exec.shortRole} ${COMPANY_INFO.name}`;
  lines.push(`item8.X-ABRELATEDNAMES;TYPE=PREF:${relatedVal}`);
  lines.push(`item8.X-ABLabel:${exec.shortRole}`);

  lines.push(`NOTE:${relatedVal} — ${exec.fullName}`);
  lines.push('END:VCARD');
  return lines.join('\r\n');
}

/**
 * Trigger direct contact save (.vcf) on iPhone (Safari) & Android
 */
export function downloadExecutiveVCard(exec, prioritizedPhone = null) {
  const vcard = generateExecutiveVCard(exec, prioritizedPhone);
  const blob = new Blob([vcard], { type: 'text/vcard;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${exec.slug}-${exec.fullName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')}.vcf`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
