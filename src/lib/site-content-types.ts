export type StatItem = { value: string; label: string };

export type PartnerLogo = {
  name: string;
  src: string;
  width: number;
  height: number;
};

export type HomeSections = {
  hidden?: boolean;
  hero: {
    hidden?: boolean;
    slideImages: string[];
    badge: string;
    titleLine1: string;
    titleAccent: string;
    titleLine2: string;
    desc: string;
    btn1: string;
    btn1Href: string;
    btn2: string;
    btn2Href: string;
    stats: StatItem[];
    statsHidden?: boolean;
    slideLabel: string;
  };
};

export type AboutSections = {
  hidden?: boolean;
  main: {
    hidden?: boolean;
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
    statsHidden?: boolean;
  };
};

export type FooterSocial = {
  label: string;
  href: string;
  iconType: "facebook" | "instagram" | "linkedin" | "twitter" | "youtube";
  hidden?: boolean;
};

export type FooterLinkSection = {
  label: string;
  href?: string;
  hidden?: boolean;
  items: { label: string; href: string; hidden?: boolean }[];
};


export type FooterSections = {
  hidden?: boolean;
  logo: string;
  logoHidden?: boolean;

  partners: {
    hidden?: boolean;
    partnersLabel: string;
    items: PartnerLogo[];
  };
  brand: {
    hidden?: boolean;
    desc: string;
  };
  socials: FooterSocial[];
  sections: FooterLinkSection[];
  copyright: string;
  copyrightHidden?: boolean;
};


export type ContactSections = {
  hidden?: boolean;
  navbarPhoneLabel?: string;
  navbarPhoneHref?: string;
  hero: {
    hidden?: boolean;
    badge: string;
    h2Accent: string;
    intro: string;
  };
  items: { title: string; value: string; icon?: string; hidden?: boolean }[];
  itemsHidden?: boolean;
  agent: {
    hidden?: boolean;
    initials: string;
    name: string;
    role: string;
    telHref: string;
    telLabel: string;
  };
  formTitle?: string;
  formHidden?: boolean;
  links: { type: string; href: string; title: string; hidden?: boolean }[];
  linksHidden?: boolean;
};

export type GallerySections = {
  hidden?: boolean;
  header: {
    hidden?: boolean;
    badge: string;
    h2Line1: string;
    h2Accent: string;
    intro: string;
  };
  features: { title: string; desc: string; image: string; images: string[]; videoUrl?: string; date?: string; hidden?: boolean }[];
  featuresHidden?: boolean;
  banner: { value: string; suffix: string; label: string }[];
  bannerHidden?: boolean;
  slides: string[];
};

export type ServicesSections = {
  header: {
    badge: string;
    h2Line1: string;
    h2Accent: string;
    intro: string;
  };
  features: { title: string; desc: string; image: string; images: string[]; videoUrl?: string; date?: string }[];
  banner: { value: string; suffix: string; label: string }[];
  slides: string[];
};

/** /properties listing page copy (site page id: `properties-page`) */
export type PropertiesPageSections = {
  hidden?: boolean;
  header: {
    hidden?: boolean;
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
    images: string[];
    hidden?: boolean;
  }[];
  itemsHidden?: boolean;
  cta: {
    hidden?: boolean;
    href: string;
    label: string;
  };
};

export type ProjectItem = {
  id: number;
  name: string;
  coverImage: string;
  images: string[];
  description: string;
  category: string;
  hidden?: boolean;
};

/** /projects listing page (site page id: `projects-page`) */
export type ProjectsPageSections = {
  hidden?: boolean;
  header: {
    hidden?: boolean;
    badge: string;
    titleLine1: string;
    titleAccent: string;
    intro: string;
  };
  items: ProjectItem[];
  itemsHidden?: boolean;
};

/** /sales marketing header (site page id: `sales-page`) */
export type SalesPageSections = {
  hidden?: boolean;
  header: {
    hidden?: boolean;
    eyebrow: string;
    title: string;
    intro: string;
  };
};

/** /jobs listing page copy (site page id: `jobs-page`) */
export type JobsPageSections = {
  hidden?: boolean;
  header: {
    hidden?: boolean;
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
  hidden?: boolean;
};

/** /team — «Мэдээ мэдээлэл» (site page id: `team`) */
export type TeamPageSections = {
  hidden?: boolean;
  header: {
    hidden?: boolean;
    eyebrow: string;
    h2Line1: string;
    h2Accent: string;
    intro: string;
  };
  members: TeamMember[];
  membersHidden?: boolean;
  cta: {
    hidden?: boolean;
    title: string;
    subtitle: string;
    buttonLabel: string;
    buttonHref: string;
  };
};
