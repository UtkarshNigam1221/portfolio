import React from "react";
import Icon from "./Icon";

const Skills = ({ sharedSkills, resumeBasicInfo }) => {
  const sectionName = resumeBasicInfo?.section_name?.skills;
  const groups = sharedSkills?.groups || [];

  return (
    <section id="skills">
      <div className="col-md-12">
        <h1 className="section-title">
          <span className="text-white">{sectionName}</span>
        </h1>
      </div>

      <div className="skill-groups">
        {groups.map((group) => (
          <div className="skill-group" key={group.name}>
            <h2 className="skill-group-name">{group.name}</h2>
            <ul className="skill-group-icons">
              {group.icons.map((skill) => (
                <li key={skill.name}>
                  <div className="skills-tile">
                    {/* label sits outside the <i>: inside it inherits the
                        devicon icon font and renders as unreadable mush */}
                    <Icon name={skill.class} />
                    <span className="skill-name">{skill.name}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Skills;
