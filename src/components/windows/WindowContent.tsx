import { FaGithub, FaLinkedin, FaEnvelope,FaArrowLeft, FaArrowRight, FaRedo } from "react-icons/fa";
import type { WindowId } from "../../types";
import { assetUrl } from "../../data/apps";
import { getContact } from "../../services/portfolioService";
import AboutWindow from "./AboutWindow";
import ProjectsWindow from "./ProjectsWindow";
import TerminalWindow from "../../features/terminal/TerminalWindow";

interface WindowContentProps {
  id: WindowId;
  onOpenProject?: (projectId?: string) => void;
}

export default function WindowContent({ id, onOpenProject }: WindowContentProps) {
  const contact = getContact();
  const linkedinUrl = contact.linkedin
    ? contact.linkedin.startsWith("http")
      ? contact.linkedin
      : `https://${contact.linkedin}`
    : "https://www.linkedin.com";

  const githubUrl = contact.github || "https://github.com";

  switch (id) {
    case "about":
      return <AboutWindow />;

    case "projects":
      return <ProjectsWindow />;

    case "terminal":
      return <TerminalWindow onOpenProject={onOpenProject} />;

    case "browser":
      return (
        <section className="browser-content">
          <div className="browser-toolbar">
            <span><FaArrowLeft size={20} color="black" /></span>
            <span><FaArrowRight size={20} color="black" /></span>
            <span><FaRedo size={20} color="black" /></span>
            <div className="address-bar">https://sloth-portfolio</div>
          </div>
          <div className="app-content browser-home">
            <img className="browser-mark" src={assetUrl("chrome.webp")} alt="" draggable={false} />
            <h2>Explore my work</h2>
            <p className="muted">Choose a destination to continue.</p>
            <a className="destination" href={githubUrl} target="_blank" rel="noreferrer">
              <FaGithub size={28} color="black" />{" "}
              <span>
                <b>GitHub</b>
                <small>{contact.github ? contact.github.replace("https://", "") : "Code repositories"}</small>
              </span>{" "}
              ↗
            </a>
            <a className="destination" href={linkedinUrl} target="_blank" rel="noreferrer">
              <FaLinkedin size={28} color="black" />{" "}
              <span>
                <b>LinkedIn</b>
                <small>Professional profile & network</small>
              </span>{" "}
              ↗
            </a>
            {contact.email && (
              <a className="destination" href={`mailto:${contact.email}`}>
                <FaEnvelope size={28} color="black" />{" "}
                <span>
                  <b>Email</b>
                  <small>{contact.email}</small>
                </span>{" "}
                ↗
              </a>
            )}
          </div>
        </section>
      );

    case "arcade":
      return (
        <section className="app-content arcade-content">
          <img className="arcade-icon" src={assetUrl("gameplay.webp")} alt="" draggable={false} />
          <img className="arcade-sloth" src={assetUrl("falling_sloth.webp")} alt="" draggable={false} />
          <h2>Arcade is coming soon</h2>
          <p className="muted">A tiny Snake game will live here.</p>
          <button className="primary-button" disabled>
            Start game (not implemented yet)
          </button>
        </section>
      );
  }
}
