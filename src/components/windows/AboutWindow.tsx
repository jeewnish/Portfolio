import { useMemo } from "react";
import { getAbout } from "../../services/portfolioService";
import { assetUrl } from "../../data/apps";

export default function AboutWindow() {
  const about = useMemo(() => getAbout(), []);

  return (
    <section className="app-content about-content">
      <div className="avatar-frame">
        <img src={assetUrl(about.avatar || "me.webp")} alt={about.name} draggable={false} />
      </div>
      <div>
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
          <a href="https://github.com/jeewnish" target="_blank" rel="noreferrer">
            GitHub ↗
          </a>
          <a
            href="https://www.linkedin.com/in/jeew-ekanayaka-432439295"
            target="_blank"
            rel="noreferrer"
          >
            LinkedIn ↗
          </a>
          {about.resumeUrl && (
            <a href="/cv/cv.pdf" download>
              Download CV ↓
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
