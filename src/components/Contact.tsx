import { useState, useEffect, useRef } from "react";
import { MdArrowOutward, MdCopyright } from "react-icons/md";
import { FaGithub, FaLinkedinIn, FaWhatsapp } from "react-icons/fa6";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./styles/Contact.css";

gsap.registerPlugin(ScrollTrigger);

const Contact = () => {
  const [result, setResult] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const sectionRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const formBoxRef = useRef<HTMLDivElement>(null);
  const infoBoxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ctx = gsap.context(() => {
      gsap.fromTo(
        headingRef.current,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
          },
        }
      );

      gsap.fromTo(
        formBoxRef.current,
        { opacity: 0, x: -50 },
        {
          opacity: 1,
          x: 0,
          duration: 1,
          delay: 0.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
          },
        }
      );

      gsap.fromTo(
        infoBoxRef.current,
        { opacity: 0, x: 50 },
        {
          opacity: 1,
          x: 0,
          duration: 1,
          delay: 0.4,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setResult("Sending....");
    
    const form = event.currentTarget;
    const formData = new FormData(form);
    // TODO: Add your Web3Forms Access Key below
    formData.append("access_key", "6f5a1ed0-d957-4628-93dd-6f88c1f4d329");
    
    const object = Object.fromEntries(formData);
    const json = JSON.stringify(object);

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: json
      });

      const data = await response.json();

      if (response.status === 200 && data.success) {
        setResult("Message Sent Successfully!");
        form.reset();
      } else {
        console.log("Error", data);
        setResult(data.message || "An error occurred");
      }
    } catch (error) {
      console.log("Error", error);
      setResult("Something went wrong. Please try again.");
    }
    
    setIsSubmitting(false);
    setTimeout(() => {
      setResult("");
    }, 5000);
  };

  return (
    <div className="contact-section section-container" id="contact" ref={sectionRef}>
      <div className="contact-container">
        <h3 ref={headingRef}>Contact</h3>
        <div className="contact-flex">
          
          <div className="contact-form-box" ref={formBoxRef}>
            <h4 className="form-heading">Get In Touch</h4>
            <p className="form-subheading">Interested in collaborating, internships, or software development opportunities? Feel free to reach out.</p>
            <form onSubmit={onSubmit} className="contact-form">
              <div className="input-group">
                <input type="text" name="name" placeholder="Your Name" required />
              </div>
              <div className="input-group">
                <input type="email" name="email" placeholder="Your Email" required />
              </div>
              <div className="input-group">
                <textarea name="message" placeholder="Your Message" rows={5} required></textarea>
              </div>
              <button type="submit" disabled={isSubmitting} className="submit-btn animated-btn">
                {isSubmitting ? "Sending..." : "Send Message"}
              </button>
            </form>
            <span className={`form-result ${result.includes("Successfully") ? "success" : ""}`}>{result}</span>
          </div>

          <div className="contact-info-box" ref={infoBoxRef}>
            <div className="contact-box">
              <h4>Email</h4>
              <p>
                <a href="mailto:ankitkumar109251@gmail.com" className="hover-underline" data-cursor="disable">
                  ankitkumar109251@gmail.com
                </a>
              </p>
              <h4>Phone</h4>
              <p>
                <a href="tel:+917368928280" className="hover-underline" data-cursor="disable">
                  +91 73689 28280
                </a>
              </p>
              <div className="social-capsules-container" style={{ marginTop: "10px" }}>
                <a
                  href="https://wa.me/917368928280"
                  target="_blank"
                  rel="noopener noreferrer"
                  data-cursor="disable"
                  className="contact-social-capsule"
                >
                  <FaWhatsapp style={{ fontSize: "1.2rem", color: "#25D366" }} /> <span>WhatsApp Me</span> <MdArrowOutward className="social-arrow" />
                </a>
              </div>
            </div>
            
            <div className="contact-box">
              <h4>Social links</h4>
              <div className="social-capsules-container">
                <a
                  href="https://github.com/11411920ak"
                  target="_blank"
                  data-cursor="disable"
                  className="contact-social-capsule"
                >
                  <FaGithub style={{ fontSize: "1.2rem" }} /> <span>Github</span> <MdArrowOutward className="social-arrow" />
                </a>
                <a
                  href="https://linkedin.com/in/ankit-kumar-83b14a2b1"
                  target="_blank"
                  data-cursor="disable"
                  className="contact-social-capsule"
                >
                  <FaLinkedinIn style={{ fontSize: "1.2rem", color: "#0077b5" }} /> <span>Linkedin</span> <MdArrowOutward className="social-arrow" />
                </a>
              </div>
            </div>

            <div className="contact-box credits">
              <h2>
                Designed and Developed <br /> by <span>Ankit Kumar</span>
              </h2>
              <h5>
                <MdCopyright /> 2026 Ankit Kumar. All Rights Reserved.
              </h5>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default Contact;
