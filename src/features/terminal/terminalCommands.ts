import { getAbout, getContact, getProjectByIndex, getProjects, getSkills } from "../../services/portfolioService";
import type { ProjectData } from "../../types/portfolio";

export interface TerminalOutputItem {
  id: string;
  type: "command" | "text" | "error" | "system" | "card";
  text?: string;
  command?: string;
  lines?: string[];
  links?: { label: string; url: string }[];
  projectCard?: ProjectData;
}

export interface CommandContext {
  openProjectWindow?: (projectId?: string) => void;
}

export type CommandHandler = (
  args: string[],
  context?: CommandContext
) => TerminalOutputItem[] | null;

/**
 * Command registry for the simulated portfolio terminal.
 * All commands are strictly allowlisted; no arbitrary code execution or eval is used.
 */
export const TERMINAL_COMMANDS: Record<string, { description: string; handler: CommandHandler }> = {
  help: {
    description: "Display all available commands with short descriptions.",
    handler: () => [
      {
        id: crypto.randomUUID(),
        type: "system",
        lines: [
          "SLOTH-OS COMMAND REGISTRY [SIMULATED SHELL]",
          "-------------------------------------------",
          "  help               - Display all available commands",
          "  about              - Display personal bio and profile information",
          "  skills             - Display technical skills grouped by category",
          "  projects           - List all portfolio projects",
          "  projects <number>  - Display detailed info about project #",
          "  projects open <n>  - Open project # in the graphical Projects window",
          "  contact            - Show contact links, email, and social profiles",
          "  clear              - Clear the terminal screen output",
          "",
          "Tip: Use Up/Down arrow keys to navigate command history."
        ]
      }
    ]
  },

  about: {
    description: "Display personal profile and biography.",
    handler: () => {
      const about = getAbout();
      const lines: string[] = [
        `Name:       ${about.name}`,
        `Headline:   ${about.headline}`,
        about.location ? `Location:   ${about.location}` : "",
        "",
        about.shortBio,
        about.fullBio ? `\n${about.fullBio}` : ""
      ].filter(l => l !== "");

      if (about.education && about.education.length > 0) {
        lines.push("", "Education:", ...about.education.map(e => `  • ${e}`));
      }

      if (about.currentInterests && about.currentInterests.length > 0) {
        lines.push("", "Current Interests:", ...about.currentInterests.map(i => `  • ${i}`));
      }

      const links: { label: string; url: string }[] = [];
      if (about.resumeUrl) {
        links.push({ label: "Download Resume / CV", url: about.resumeUrl });
      }

      return [
        {
          id: crypto.randomUUID(),
          type: "text",
          lines,
          links: links.length > 0 ? links : undefined
        }
      ];
    }
  },

  skills: {
    description: "Display technical skills grouped by category.",
    handler: () => {
      const categories = getSkills();
      const lines: string[] = ["TECHNICAL SKILLS & COMPETENCIES", "------------------------------"];

      categories.forEach(cat => {
        lines.push("");
        lines.push(`[${cat.category}]${cat.description ? ` - ${cat.description}` : ""}`);
        const skillList = cat.skills
          .map(s => (typeof s === "string" ? s : `${s.name}${s.level ? ` (${s.level})` : ""}`))
          .join(" · ");
        lines.push(`  ${skillList}`);
      });

      return [
        {
          id: crypto.randomUUID(),
          type: "text",
          lines
        }
      ];
    }
  },

  projects: {
    description: "List portfolio projects or inspect details (e.g., 'projects 1', 'projects open 1').",
    handler: (args, context) => {
      const projects = getProjects();

      // Case 1: projects open <number>
      if (args[0] && args[0].toLowerCase() === "open") {
        const numStr = args[1];
        if (!numStr) {
          return [
            {
              id: crypto.randomUUID(),
              type: "error",
              text: "Usage: projects open <project_number> (e.g. 'projects open 1')"
            }
          ];
        }
        const index = parseInt(numStr, 10);
        const project = getProjectByIndex(index);
        if (!project) {
          return [
            {
              id: crypto.randomUUID(),
              type: "error",
              text: `Project #${numStr} not found. Total available projects: ${projects.length}. Run 'projects' to list all.`
            }
          ];
        }

        if (context?.openProjectWindow) {
          context.openProjectWindow(project.id);
          return [
            {
              id: crypto.randomUUID(),
              type: "system",
              text: `Opening graphical Projects window for #${index} [${project.title}]...`
            }
          ];
        }

        return [
          {
            id: crypto.randomUUID(),
            type: "text",
            text: `Selected project: ${project.title}. (Graphical window opened)`
          }
        ];
      }

      // Case 2: projects <number> (detailed view)
      if (args[0] && /^\d+$/.test(args[0])) {
        const index = parseInt(args[0], 10);
        const project = getProjectByIndex(index);
        if (!project) {
          return [
            {
              id: crypto.randomUUID(),
              type: "error",
              text: `Project #${args[0]} not found. Available range: 1 to ${projects.length}.`
            }
          ];
        }

        const lines: string[] = [
          `PROJECT #${index}: ${project.title.toUpperCase()}`,
          `Category:     ${project.category}`,
          project.status ? `Status:       ${project.status}` : "",
          `Technologies: ${project.technologies.join(", ")}`,
          "",
          `Description:  ${project.shortDescription}`,
          project.fullDescription ? `\n${project.fullDescription}` : ""
        ].filter(Boolean);

        const links: { label: string; url: string }[] = [];
        if (project.githubUrl) {
          links.push({ label: "GitHub Repository", url: project.githubUrl });
        }
        if (project.liveUrl) {
          links.push({ label: "Live Demo", url: project.liveUrl });
        }

        lines.push("", `Hint: Type 'projects open ${index}' to view in the GUI.`);

        return [
          {
            id: crypto.randomUUID(),
            type: "card",
            lines,
            links: links.length > 0 ? links : undefined,
            projectCard: project
          }
        ];
      }

      // Case 3: List all projects
      const lines: string[] = [
        "PORTFOLIO PROJECTS",
        "------------------",
        "Type 'projects <number>' for details (e.g. 'projects 1').",
        "Type 'projects open <number>' to open in GUI.",
        ""
      ];

      projects.forEach((p, idx) => {
        lines.push(`[${idx + 1}] ${p.title} (${p.category})`);
        lines.push(`    ${p.shortDescription}`);
        lines.push(`    Stack: ${p.technologies.join(" · ")}`);
        lines.push("");
      });

      return [
        {
          id: crypto.randomUUID(),
          type: "text",
          lines
        }
      ];
    }
  },

  contact: {
    description: "Display contact information and professional links.",
    handler: () => {
      const contact = getContact();
      const lines: string[] = ["CONTACT & SOCIALS", "-----------------"];
      const links: { label: string; url: string }[] = [];

      let hasInfo = false;

      if (contact.email) {
        hasInfo = true;
        lines.push(`Email:    ${contact.email}`);
        links.push({ label: `Email (${contact.email})`, url: `mailto:${contact.email}` });
      }

      if (contact.github) {
        hasInfo = true;
        lines.push(`GitHub:   ${contact.github}`);
        links.push({ label: "GitHub Profile", url: contact.github });
      }

      if (contact.linkedin) {
        hasInfo = true;
        const formatted = contact.linkedin.startsWith("http") ? contact.linkedin : `https://${contact.linkedin}`;
        lines.push(`LinkedIn: ${contact.linkedin}`);
        links.push({ label: "LinkedIn Profile", url: formatted });
      }

      if (contact.website) {
        hasInfo = true;
        lines.push(`Website:  ${contact.website}`);
        links.push({ label: "Website", url: contact.website });
      }

      if (contact.twitter) {
        hasInfo = true;
        lines.push(`Twitter:  ${contact.twitter}`);
        links.push({ label: "Twitter", url: contact.twitter });
      }

      if (contact.other && contact.other.length > 0) {
        contact.other.forEach(item => {
          if (item.url) {
            hasInfo = true;
            lines.push(`${item.label}: ${item.url}`);
            links.push({ label: item.label, url: item.url });
          }
        });
      }

      if (!hasInfo) {
        lines.push("No contact links have been configured yet in src/data/portfolio/contact.json.");
      }

      return [
        {
          id: crypto.randomUUID(),
          type: "text",
          lines,
          links: links.length > 0 ? links : undefined
        }
      ];
    }
  },

  clear: {
    description: "Clear the terminal screen.",
    handler: () => null // Handled specially by terminal to reset outputs
  }
};

/**
 * Execute a command line safely via registry lookup.
 */
export function executeTerminalCommand(
  rawInput: string,
  context?: CommandContext
): { output: TerminalOutputItem[]; clearScreen?: boolean } {
  const trimmed = rawInput.trim();
  if (!trimmed) {
    return { output: [] };
  }

  const parts = trimmed.split(/\s+/);
  const commandName = parts[0].toLowerCase();
  const args = parts.slice(1);

  if (commandName === "clear") {
    return { output: [], clearScreen: true };
  }

  const registered = TERMINAL_COMMANDS[commandName];
  if (!registered) {
    return {
      output: [
        {
          id: crypto.randomUUID(),
          type: "error",
          text: `command not found: "${commandName}". Type 'help' to see all available commands.`
        }
      ]
    };
  }

  const result = registered.handler(args, context);
  return { output: result || [] };
}
