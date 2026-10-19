export interface AboutData {
  name: string;
  headline: string;
  shortBio: string;
  fullBio?: string;
  location?: string;
  avatar: string;
  resumeUrl?: string;
  education?: string[];
  currentInterests?: string[];
}

export interface SkillItem {
  name: string;
  level?: string;
  icon?: string;
}

export interface SkillCategory {
  category: string;
  description?: string;
  skills: (string | SkillItem)[];
}

export interface ProjectData {
  id: string;
  title: string;
  category: string;
  shortDescription: string;
  fullDescription?: string;
  technologies: string[];
  thumbnail?: string;
  githubUrl?: string;
  liveUrl?: string;
  status?: string;
  featured?: boolean;
}

export interface ContactData {
  email?: string;
  github?: string;
  linkedin?: string;
  website?: string;
  twitter?: string;
  other?: { label: string; url: string }[];
}
