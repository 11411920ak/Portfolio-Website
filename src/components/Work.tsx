import "./styles/Work.css";
import WorkImage from "./WorkImage";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useRef } from "react";
import { MdArrowOutward } from "react-icons/md";

gsap.registerPlugin(useGSAP);

const Work = () => {
  const workFlexRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    let mm = gsap.matchMedia();

    mm.add("(min-width: 900px)", () => {
      let getScrollAmount = () => {
        const boxes = document.getElementsByClassName("work-box");
        const container = document.querySelector(".work-container");
        if (!boxes.length || !container) return 0;
        
        const rectLeft = container.getBoundingClientRect().left;
        const rect = boxes[0].getBoundingClientRect();
        const parentWidth = boxes[0].parentElement!.getBoundingClientRect().width;
        let padding: number = parseInt(window.getComputedStyle(boxes[0]).padding) / 2;
        
        let translateX = rect.width * boxes.length - (rectLeft + parentWidth) + padding + (window.innerWidth / 2);
        return -translateX;
      };

      let tween = gsap.to(workFlexRef.current, {
        x: getScrollAmount,
        ease: "none",
      });

      ScrollTrigger.create({
        trigger: ".work-section",
        start: "bottom bottom",
        end: () => `+=${Math.abs(getScrollAmount())}`,
        pin: true,
        animation: tween,
        scrub: 1,
        invalidateOnRefresh: true,
        id: "work",
      });

      return () => {
        ScrollTrigger.getById("work")?.kill();
      };
    });
  }, []);

  const projects = [
    {
      title: "Resonance",
      category: "AI Voice Platform",
      description: "Built an AI-powered voice platform that enables zero-shot voice cloning and speech synthesis. Optimized cloud storage and GPU-based processing.",
      tools: "Next.js, React, Prisma, Cloudflare, Modal",
      link: "#",
      image: "https://images.unsplash.com/photo-1589254065878-42c9da997008?auto=format&fit=crop&w=800&q=80"
    },
    {
      title: "Meet.AI",
      category: "AI Video Conferencing Platform",
      description: "Developed a real-time video conferencing platform with AI-powered meeting assistance, automatic transcription, and smart summaries. Secure authentication.",
      tools: "Next.js, React, OpenAI API, PostgreSQL, tRPC",
      link: "#",
      image: "https://images.unsplash.com/photo-1516387938699-a93567ec168e?auto=format&fit=crop&w=800&q=80"
    },
    {
      title: "Personal Portfolio Website",
      category: "Portfolio Website",
      description: "Designed and developed a modern portfolio website to showcase my skills, projects, certifications, and professional experience. Responsive and fast.",
      tools: "React, JavaScript, CSS",
      link: "#",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80"
    }
  ];

  return (
    <div className="work-section" id="work">
      <div className="work-container section-container">
        <h2>
          My <span>Work</span>
        </h2>
        <div className="work-flex" ref={workFlexRef}>
          {projects.map((project, index) => (
            <div className="work-box" key={index} style={{ gap: "30px" }}>
              <div className="work-info">
                <div className="work-title">
                  <h3>0{index + 1}</h3>

                  <div>
                    <h4>{project.title}</h4>
                    <p>{project.category}</p>
                  </div>
                </div>
                <p className="work-description" style={{ marginBottom: "15px", color: "#ddd" }}>
                  {project.description}
                </p>
                <h4>Tech Stack</h4>
                <p>{project.tools}</p>
                <div style={{ marginTop: "15px" }}>
                  <a 
                    href={project.link} 
                    target="_blank" 
                    rel="noreferrer"
                    className="live-demo-btn"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "8px",
                      padding: "10px 20px",
                      backgroundColor: "var(--accentColor, #fff)",
                      color: "#000",
                      textDecoration: "none",
                      borderRadius: "50px",
                      fontWeight: 500,
                      transition: "0.3s",
                      fontSize: "14px"
                    }}
                  >
                    Live Demo <MdArrowOutward />
                  </a>
                </div>
              </div>
              <WorkImage image={project.image} alt={project.title} link={project.link} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Work;
