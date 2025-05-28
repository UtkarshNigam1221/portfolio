import React, { useState, useEffect } from "react";
import $ from "jquery";
import "./App.scss";
import Header from "./components/Header";
import Footer from "./components/Footer";
import About from "./components/About";
import Experience from "./components/Experience";
import Projects from "./components/Projects";
import Skills from "./components/Skills";

const App = () => {
  const [resumeData, setResumeData] = useState({});
  const [sharedData, setSharedData] = useState({});

  const loadResumeFromPath = (path) => {
      $.ajax({
      url: path,
      dataType: "json",
      cache: false,
      success: function (data) {
        setResumeData(data);
      },
      error: function (xhr, status, err) {
        alert(err);
      },
    });
  };

  const loadSharedData = (path) => {
      $.ajax({
      url: path,
      dataType: "json",
      cache: false,
      success: function (data) {
        setSharedData(data);
        document.title = data.basic_info.name;
      },
      error: function (xhr, status, err) {
          alert(err);
      },
    });
  };

  useEffect(() => {
    loadResumeFromPath('res_primaryLanguage.json');
      loadSharedData(`portfolio_shared_data.json`);

  }, []); // Empty dependency array means this effect runs once on mount

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
      />
      <Footer sharedBasicInfo={sharedData.basic_info} />
    </div>
  );
};

export default App;