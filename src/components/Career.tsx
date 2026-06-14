import "./styles/Career.css";

const Career = () => {
  return (
    <div className="career-section section-container">
      <div className="career-container">
        <h2>
          My career <span>&</span>
          <br /> experience
        </h2>
        <div className="career-info">
          <div className="career-timeline">
            <div className="career-dot"></div>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>Web Development Intern</h4>
                <h5>Cognifyz Technologies</h5>
              </div>
              <h3>2026</h3>
            </div>
            <p>
              Developed responsive web applications using HTML, CSS, and JavaScript. Improved cross-browser compatibility, optimized performance, and collaborated in an Agile development environment.
            </p>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>YUVA AI For All</h4>
                <h5>TCS iON & IndiaAI Government Initiative</h5>
              </div>
              <h3>2026</h3>
            </div>
            <p>
              Completed a government-backed AI literacy program covering machine learning, responsible AI, and real-world AI applications.
            </p>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>TCS iON Career Edge – Young Professional</h4>
                <h5>Tata Consultancy Services</h5>
              </div>
              <h3>2026</h3>
            </div>
            <p>
              Developed professional skills in business communication, workplace readiness, IT fundamentals, and AI awareness.
            </p>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>Oracle Cloud Infrastructure 2025 Certified AI Foundations Associate</h4>
                <h5>Oracle University</h5>
              </div>
              <h3>2025</h3>
            </div>
            <p>
              Earned certification in cloud-native AI/ML services, generative AI fundamentals, and Oracle Cloud Infrastructure.
            </p>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>GenAI Powered Data Analytics Job Simulation</h4>
                <h5>Tata Group via Forage</h5>
              </div>
              <h3>2025</h3>
            </div>
            <p>
              Completed a hands-on simulation involving AI-driven analytics, risk profiling, and data storytelling.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Career;
