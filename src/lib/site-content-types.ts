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
    slideLabel: string;
  };
};

export type AboutSections = {
  hidden?: boolean;
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

export type FooterSocial = {
  label: string;
  href: string;
  iconType: "facebook" | "instagram" | "linkedin" | "twitter" | "youtube";
};

export type FooterLinkSection = {
  label: string;
  href?: string;
  items: { label: string; href: string; hidden?: boolean }[];
  hidden?: boolean;
};



export type FooterSections = {
  hidden?: boolean;
  logo: string;

  partners: {
    partnersLabel: string;
    items: PartnerLogo[];
  };
  brand: {
    desc: string;
  };
  socials: FooterSocial[];
  sections: FooterLinkSection[];
  copyright: string;
};


export type ContactSections = {
  hidden?: boolean;
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
  links: { type: string; href: string; title: string }[];
};

export type GallerySections = {
  hidden?: boolean;
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
  }[];
  cta: {
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
};

/** /projects listing page (site page id: `projects-page`) */
export type ProjectsPageSections = {
  hidden?: boolean;
  header: {

    badge: string;
    titleLine1: string;
    titleAccent: string;
    intro: string;
  };
  items: ProjectItem[];
};

/** /sales marketing header (site page id: `sales-page`) */
export type SalesPageSections = {
  hidden?: boolean;
  header: {

    eyebrow: string;
    title: string;
    intro: string;
  };
};

/** /jobs listing page copy (site page id: `jobs-page`) */
export type JobsPageSections = {
  hidden?: boolean;
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
  hidden?: boolean;
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
