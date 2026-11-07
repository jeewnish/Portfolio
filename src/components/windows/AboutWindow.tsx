import { useMemo } from "react";
import { getAbout, getContact } from "../../services/portfolioService";
import { assetUrl } from "../../data/apps";

export default function AboutWindow() {
  const about = useMemo(() => getAbout(), []);
  const contact = useMemo(() => getContact(), []);

  const githubUrl = contact.github || "https://github.com/jeewnish";
  const linkedinUrl = contact.linkedin
    ? contact.linkedin.startsWith("http")
      ? contact.linkedin
      : `https://${contact.linkedin}`
    : "https://www.linkedin.com";

  return (
    <section className="app-content about-content">
      <header className="about-profile">
        <div className="avatar-frame">
          <img
            src={assetUrl(about.avatar || "me.webp")}
            alt={`Portrait of ${about.name || "Jeew Ekanayaka"}`}
            draggable={false}
            onError={e => {
              (e.currentTarget as HTMLImageElement).src = assetUrl("face.webp");
            }}
          />
        </div>

        <div className="about-intro-card">
          <h2>{about.name}</h2>
          <p className="muted">{about.headline}</p>
        </div>
      </header>

      <div className="about-details">
        <div className="about-bio">
          {about.shortBio && <p>{about.shortBio}</p>}
          {about.fullBio && <p>{about.fullBio}</p>}
        </div>

        {about.currentInterests && about.currentInterests.length > 0 && (
          <section className="about-interests" aria-labelledby="about-interests-title">
            <h3 id="about-interests-title">Current Focus &amp; Interests:</h3>
            <ul>
              {about.currentInterests.map(interest => (
                <li key={interest}>{interest}</li>
              ))}
            </ul>
          </section>
        )}

        <nav className="content-actions" aria-label="About links">
          {githubUrl && (
            <a href={githubUrl} target="_blank" rel="noreferrer" aria-label="Visit GitHub Profile">
              GitHub ↗
            </a>
          )}
          {linkedinUrl && (
            <a href={linkedinUrl} target="_blank" rel="noreferrer" aria-label="Visit LinkedIn Profile">
              LinkedIn ↗
            </a>
          )}
          {contact.email && (
            <a href={`mailto:${contact.email}`} aria-label={`Email ${contact.email}`}>
              Email ✉
            </a>
          )}
          {about.resumeUrl && (
            <a href="/cv/cv.pdf" download="Jeew_Ekanayaka_CV.pdf" aria-label="Download CV">
              Download CV ↓
            </a>
          )}
        </nav>
      </div>
    </section>
  );
}
