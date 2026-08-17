import React from "react";
import image from "./../profile.jpeg";

const About = ({ resumeBasicInfo }) => {
  const sectionName = resumeBasicInfo?.section_name?.about;
  const hello = resumeBasicInfo?.description_header;
  const about = resumeBasicInfo?.description || "";
  const highlights = resumeBasicInfo?.highlights || [];

  // the bio is stored as one string with blank lines between paragraphs
  const paragraphs = about.split("\n\n").filter(Boolean);

  return (
    <section id="about">
      <h1>
        <span>{sectionName}</span>
      </h1>

      <div className="about-grid">
        <aside className="about-aside">
          <figure className="about-portrait">
            <img src={image} alt="Utkarsh Nigam" />
          </figure>

          {highlights.length > 0 && (
            <dl className="about-facts">
              {highlights.map((fact) => (
                <div className="about-fact" key={fact.label}>
                  <dt>{fact.label}</dt>
                  <dd>{fact.value}</dd>
                </div>
              ))}
            </dl>
          )}
        </aside>

        <div className="about-body">
          {hello && <p className="about-greeting">{hello}</p>}
          {paragraphs.map((paragraph, i) => (
            <p key={i} className={i === 0 ? "about-lead" : "about-para"}>
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
};

export default About;
