import React, { useState, useEffect } from "react";
import "./App.scss";
import Header from "./components/Header";
import Footer from "./components/Footer";
import About from "./components/About";
import Experience from "./components/Experience";
import Projects from "./components/Projects";
import Skills from "./components/Skills";

const loadJson = async (path) => {
  const response = await fetch(path, { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText}`);
  }
  return response.json();
};

const App = () => {
  const [resumeData, setResumeData] = useState({});
  const [sharedData, setSharedData] = useState({});

  useEffect(() => {
    loadJson("res_primaryLanguage.json")
      .then(setResumeData)
      .catch((err) => console.error("Failed to load resume data:", err));

    loadJson("portfolio_shared_data.json")
      .then(setSharedData)
      .catch((err) => console.error("Failed to load shared data:", err));
  }, []);

  return (
    <div>
      <Header sharedData={sharedData.basic_info} />
      <About
        resumeBasicInfo={resumeData.basic_info}
        sharedBasicInfo={sharedData.basic_info}
      />
      <Projects
        resumeProjects={resumeData.projects}
        resumeBasicInfo={resumeData.basic_info}
      />
      <Skills
        sharedSkills={sharedData.skills}
        resumeBasicInfo={resumeData.basic_info}
      />
      <Experience
        resumeExperience={resumeData.experience}
        resumeBasicInfo={resumeData.basic_info}
        resumeEducation={resumeData.education}
      />
      <Footer sharedBasicInfo={sharedData.basic_info} />
    </div>
  );
};

export default App;
