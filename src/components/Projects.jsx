import React, { Component } from "react";
import ProjectDetailsModal from "./ProjectDetailsModal";

class Projects extends Component {
  constructor(props) {
    super(props);
    this.state = {
      deps: {},
      detailsModalShow: false,
    };
  }

  render() {
    const show = (data) => this.setState({ detailsModalShow: true, deps: data });
    const close = () => this.setState({ detailsModalShow: false });

    const all = this.props.resumeProjects || [];
    const featured = all.find((p) => p.featured);
    const rest = all.filter((p) => p !== featured);
    const sectionName = this.props.resumeBasicInfo?.section_name?.projects;

    return (
      <section id="portfolio">
        <div className="col-md-12">
          <h1 className="section-title" style={{ color: "black" }}>
            <span>{sectionName}</span>
          </h1>

          {featured && (
            <div
              className="project-featured"
              onClick={() => show(featured)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && show(featured)}
            >
              <div className="project-featured-media">
                <img src={featured.images[0]} alt={featured.title} />
              </div>
              <div className="project-featured-body">
                <p className="project-featured-eyebrow">
                  Featured &middot; {featured.startDate}
                </p>
                <h3>{featured.title}</h3>
                <p className="project-featured-summary">{featured.summary}</p>
                <ul className="project-featured-tech">
                  {featured.technologies.map((tech) => (
                    <li key={tech.name}>{tech.name}</li>
                  ))}
                </ul>
                <span className="project-featured-cta">Read the case study</span>
              </div>
            </div>
          )}

          <div className="col-md-12 mx-auto">
            <div className="row mx-auto">
              {rest.map((project) => (
                <div
                  className="col-6 col-sm-4 col-md-3 col-lg-2"
                  key={project.title}
                  style={{ cursor: "pointer" }}
                >
                  <span className="portfolio-item d-block">
                    <div className="foto" onClick={() => show(project)}>
                      <div>
                        <img
                          src={project.images[0]}
                          alt="projectImages"
                          className="project-thumb"
                        />
                        <span className="project-date">
                          {project.startDate}
                        </span>
                        <br />
                        <p className="project-title-settings mt-3">
                          {project.title}
                        </p>
                      </div>
                    </div>
                  </span>
                </div>
              ))}
            </div>
          </div>

          <ProjectDetailsModal
            show={this.state.detailsModalShow}
            onHide={close}
            data={this.state.deps}
          />
        </div>
      </section>
    );
  }
}

export default Projects;
