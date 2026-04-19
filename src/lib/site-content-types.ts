export type StatItem = { value: string; label: string };

export type PartnerLogo = {
  name: string;
  src: string;
  width: number;
  height: number;
};

export type HomeSections = {
  hero: {
    slideImages: string[];
    badge: string;
    titleLine1: string;
    titleAccent: string;
    titleLine2: string;
    desc: string;
    btn1: string;
    btn2: string;
    stats: StatItem[];
    slideLabel: string;
  };
};

export type AboutSections = {
  main: {
    sectionLabel: string;
    h2Line1: string;
    h2Accent: string;
    p1: string;
    p2: string;
    imageUrl: string;
    imageBuildingName: string;
    imageBuildingSubtitle: string;
    yearsBadgeValue: string;
    yearsLabel: string;
    stats: StatItem[];
  };
};

export type FooterSections = {
  partners: {
    partnersLabel: string;
    items: PartnerLogo[];
  };
  brand: {
    desc: string;
  };
};

export type ContactSections = {
  hero: {
    badge: string;
    h2Accent: string;
    intro: string;
  };
  items: { title: string; value: string }[];
  agent: {
    initials: string;
    name: string;
    role: string;
    telHref: string;
    telLabel: string;
  };
  formTitle: string;
};

export type ServicesSections = {
  header: {
    badge: string;
    h2Line1: string;
    h2Accent: string;
    intro: string;
  };
  features: { title: string; desc: string }[];
  banner: { value: string; suffix: string; label: string }[];
};

/** /properties listing page copy (site page id: `properties-page`) */
export type PropertiesPageSections = {
  header: {
    badge: string;
    titleLine1: string;
    titleAccent: string;
    intro: string;
  };
  categories: string[];
  items: {
    id: number;
    name: string;
    image: string;
    category: string;
    badge: string | null;
    size: string;
    floor: string;
    parking: string;
    price: string;
    tag: string;
    description: string;
  }[];
  cta: {
    href: string;
    label: string;
  };
};

/** /sales marketing header (site page id: `sales-page`) */
export type SalesPageSections = {
  header: {
    eyebrow: string;
    title: string;
    intro: string;
  };
};

/** /jobs listing page copy (site page id: `jobs-page`) */
export type JobsPageSections = {
  header: {
    title: string;
    intro: string;
  };
};

export type TeamMember = {
  name: string;
  role: string;
  initials: string;
  /** Tailwind bg class, e.g. `bg-accent-500` */
  color: string;
  phone: string;
  email: string;
  bio: string;
  projects: number;
};

/** /team — «Мэдээ мэдээлэл» (site page id: `team`) */
export type TeamPageSections = {
  header: {
    eyebrow: string;
    h2Line1: string;
    h2Accent: string;
    intro: string;
  };
  members: TeamMember[];
  cta: {
    title: string;
    subtitle: string;
    buttonLabel: string;
    buttonHref: string;
  };
};
