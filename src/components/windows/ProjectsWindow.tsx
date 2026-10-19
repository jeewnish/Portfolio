import { useState, useMemo } from "react";
import { getProjects } from "../../services/portfolioService";
import { assetUrl } from "../../data/apps";
import type { ProjectData } from "../../types/portfolio";

interface ProjectsWindowProps {
  initialSelectedProjectId?: string;
}

export default function ProjectsWindow({ initialSelectedProjectId }: ProjectsWindowProps) {
  const allProjects = useMemo(() => getProjects(), []);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedProject, setSelectedProject] = useState<ProjectData | null>(() => {
    if (initialSelectedProjectId) {
      return allProjects.find(p => p.id === initialSelectedProjectId) || null;
    }
    return null;
  });

  // Extract unique categories for filtering
  const categories = useMemo(() => {
    const set = new Set<string>(["All"]);
    allProjects.forEach(p => {
      if (p.category) set.add(p.category);
    });
    return Array.from(set);
  }, [allProjects]);

  const filteredProjects = useMemo(() => {
    if (selectedCategory === "All") return allProjects;
    return allProjects.filter(p => p.category === selectedCategory);
  }, [allProjects, selectedCategory]);

  const getArtClass = (idx: number) => {
    const artClasses = ["art-one", "art-two", "art-three"];
    return artClasses[idx % artClasses.length];
  };

  // If a project is selected, render the detailed view
  if (selectedProject) {
    return (
      <section className="app-content project-detail-view">
        <button
          className="project-back-btn"
          onClick={() => setSelectedProject(null)}
          aria-label="Back to project list"
        >
          ← Back to all projects
        </button>

        <div className="project-detail-header">
          <div className="project-detail-badge-group">
            <span className="project-category-badge">{selectedProject.category}</span>
            {selectedProject.status && (
              <span className="project-status-badge">{selectedProject.status}</span>
            )}
          </div>
          <h2>{selectedProject.title}</h2>
          <p className="project-detail-summary">{selectedProject.shortDescription}</p>
        </div>

        {selectedProject.fullDescription && (
          <div className="project-detail-section">
            <h3>Overview</h3>
            <p>{selectedProject.fullDescription}</p>
          </div>
        )}

        <div className="project-detail-section">
          <h3>Technologies & Tools</h3>
          <div className="project-tech-tags">
            {selectedProject.technologies.map(tech => (
              <span key={tech} className="project-tech-tag">
                {tech}
              </span>
            ))}
          </div>
        </div>

        <div className="content-actions" style={{ marginTop: "24px" }}>
          {selectedProject.githubUrl && (
            <a href={selectedProject.githubUrl} target="_blank" rel="noreferrer">
              View on GitHub ↗
            </a>
          )}
          {selectedProject.liveUrl && (
            <a href={selectedProject.liveUrl} target="_blank" rel="noreferrer">
              Live Demo ↗
            </a>
          )}
        </div>
      </section>
    );
  }

  return (
    <section className="app-content">
      <div className="projects-head">
        <img src={assetUrl("slipping_sloth.webp")} alt="" draggable={false} />
        <div>
          <h2 style={{ fontSize: "22px", margin: "0 0 4px" }}>Projects</h2>
          <p className="muted" style={{ margin: 0 }}>
            A few things I've been working on. Click any card to explore details.
          </p>
        </div>
      </div>

      {/* Category filter tabs */}
      <div className="project-category-filters" role="tablist">
        {categories.map(cat => (
          <button
            key={cat}
            role="tab"
            aria-selected={selectedCategory === cat}
            className={`project-filter-btn ${selectedCategory === cat ? "is-active" : ""}`}
            onClick={() => setSelectedCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="project-grid">
        {filteredProjects.map((project, idx) => (
          <article
            key={project.id}
            className="project-card interactive-project-card"
            onClick={() => setSelectedProject(project)}
            onKeyDown={e => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setSelectedProject(project);
              }
            }}
            tabIndex={0}
            role="button"
            aria-label={`View details for ${project.title}`}
          >
            <div className={`project-art ${getArtClass(idx)}`}>
              {String(idx + 1).padStart(2, "0")}
            </div>
            <h3>{project.title}</h3>
            <p>{project.shortDescription}</p>
            <div className="project-card-footer">
              <span>{project.technologies.slice(0, 3).join(" · ")}</span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
