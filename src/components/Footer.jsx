import React from "react";

const Footer = ({ sharedBasicInfo }) => {
  const name = sharedBasicInfo?.name;
  const email = sharedBasicInfo?.email;
  const resume = sharedBasicInfo?.resume;
  const social = sharedBasicInfo?.social || [];

  return (
    <footer>
      <div className="contact">
        <h2 className="contact-heading">Let&rsquo;s talk</h2>
        <p className="contact-line">
          Open to interesting engineering problems &mdash; systems worth
          designing from scratch, and ones worth making faster.
        </p>

        <div className="contact-actions">
          {email && (
            <a className="contact-button primary" href={`mailto:${email}`}>
              <i className="fas fa-envelope" />
              {email}
            </a>
          )}
          {resume && (
            <a
              className="contact-button"
              href={resume}
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="fas fa-file-alt" />
              Resume
            </a>
          )}
          {social.map((network) => (
            <a
              className="contact-button"
              key={network.name}
              href={network.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className={network.class} />
              {network.label || network.name}
            </a>
          ))}
        </div>
      </div>

      <div className="copyright py-4 text-center">
        <div className="container">
          <small>Copyright &copy; {name || "???"}</small>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
