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
      <div className="avatar-frame">
        <img
          src={assetUrl(about.avatar || "me.webp")}
          alt={about.name || "Profile avatar"}
          draggable={false}
          onError={e => {
            // Fallback if avatar fails to load
            (e.currentTarget as HTMLImageElement).src = assetUrl("face.webp");
          }}
        />
      </div>
      <div className="about-details">
        <h2>{about.name}</h2>
        <p className="muted">{about.headline}</p>

        {about.shortBio && <p>{about.shortBio}</p>}
        {about.fullBio && <p>{about.fullBio}</p>}

        {about.currentInterests && about.currentInterests.length > 0 && (
          <div style={{ margin: "14px 0" }}>
            <h4 style={{ margin: "0 0 6px", fontSize: "14px", fontFamily: "var(--display)" }}>
              Current Focus & Interests:
            </h4>
            <ul style={{ margin: 0, paddingLeft: "18px", fontSize: "13px", lineHeight: "1.6" }}>
              {about.currentInterests.map((interest, idx) => (
                <li key={idx}>{interest}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="content-actions">
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
        </div>
      </div>
    </section>
  );
}
