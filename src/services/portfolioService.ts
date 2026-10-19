import type { AboutData, ContactData, ProjectData, SkillCategory } from "../types/portfolio";
import aboutData from "../data/portfolio/about.json";
import skillsData from "../data/portfolio/skills.json";
import projectsData from "../data/portfolio/projects.json";
import contactData from "../data/portfolio/contact.json";

/**
 * Portfolio content service.
 * Serves as the single source of truth for portfolio information.
 * Allows easy switching to an external CMS or API in the future without modifying UI components.
 */

export function getAbout(): AboutData {
  return aboutData as AboutData;
}

export function getSkills(): SkillCategory[] {
  return skillsData as SkillCategory[];
}

export function getProjects(): ProjectData[] {
  return projectsData as ProjectData[];
}

export function getProjectById(id: string): ProjectData | undefined {
  return getProjects().find(p => p.id.toLowerCase() === id.toLowerCase());
}

export function getProjectByIndex(index: number): ProjectData | undefined {
  const projects = getProjects();
  if (index >= 1 && index <= projects.length) {
    return projects[index - 1];
  }
  return undefined;
}

export function getContact(): ContactData {
  return contactData as ContactData;
}
