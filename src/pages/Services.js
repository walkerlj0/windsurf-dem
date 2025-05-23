import React, { useEffect, useState, useCallback, useRef } from 'react';
import ReactGA from 'react-ga4';
import emailjs from '@emailjs/browser';
import Footer from '../components/Footer';
import './Services.css';

// Check if we're in a browser environment
const isBrowser = typeof window !== 'undefined' && 
                  typeof document !== 'undefined' && 
                  !process.env.REACT_APP_HEADLESS_BROWSER;

// Animated header logic
const lines = ["S ervices"];
function AnimatedServicesHeader() {
  const [displayed, setDisplayed] = useState([""]);
  
  useEffect(() => {
    // Skip animation in headless environments
    if (!isBrowser) {
      setDisplayed(lines); // Just display the full text immediately
      return;
    }
    
    let currentLine = 0;
    let currentChar = 0;
    const interval = setInterval(() => {
      try {
        if (
          currentLine >= lines.length ||
          currentChar >= (lines[currentLine]?.length || 0)
        ) {
          clearInterval(interval);
          return;
        }
        setDisplayed(prev => {
          if (currentLine >= lines.length) return prev;
          const newDisplayed = [...prev];
          if (!newDisplayed[currentLine]) newDisplayed[currentLine] = "";
          if (currentChar < lines[currentLine].length) {
            newDisplayed[currentLine] += lines[currentLine][currentChar];
          }
          return newDisplayed;
        });
        currentChar++;
        if (currentChar === lines[currentLine].length) {
          currentLine++;
          currentChar = 0;
        }
      } catch (error) {
        console.error('Error in animated header:', error);
        clearInterval(interval);
        setDisplayed(lines); // Fallback to displaying full text
      }
    }, 100);
    return () => clearInterval(interval);
  }, []);
  
  return (
    <h1 className="services-animated-header">
      {displayed.map((line, idx) => (
        <span key={idx}>{line}<br/></span>
      ))}
    </h1>
  );
}

function Services() {
  const [formStatus, setFormStatus] = useState('');
  const formRef = useRef();
  
  // Use useCallback for event handlers
  const handleSubmit = useCallback((e) => {
    // Skip in headless environments
    if (!isBrowser) return;
    
    e.preventDefault();
    setFormStatus('Sending...');
    
    // Track form submission event
    ReactGA.event({
      category: 'Engagement',
      action: 'FormSubmit',
      label: 'Contact Form'
    });
    console.log('[Analytics] Tracked contact form submission');
    
    // Send email using EmailJS
    console.log('Sending email with EmailJS...');
    console.log('Form data:', {
      name: formRef.current.user_name.value,
      email: formRef.current.user_email.value,
      subject: formRef.current.subject.value,
      message: formRef.current.message.value
    });
    
    // Create template parameters with reply_to parameter
    const templateParams = {
      from_name: formRef.current.user_name.value,
      from_email: formRef.current.user_email.value,
      subject: formRef.current.subject.value,
      message: formRef.current.message.value,
      reply_to: formRef.current.user_email.value, // Set reply-to as the submitter's email
    };
    
    // Send email using EmailJS
    emailjs.send(
      'default_service',
      'template_ho39bfs',
      templateParams,
      'cMAwUroj7SZsWuqPb'
    )
      .then((result) => {
        console.log('Email successfully sent!', result.text);
        setFormStatus('Message sent! We will get back to you soon.');
        
        // Track successful email send
        ReactGA.event({
          category: 'Engagement',
          action: 'EmailSent',
          label: 'Contact Form Success'
        });
        
        // Reset the form
        formRef.current.reset();
        
        // Clear success message after 5 seconds
        setTimeout(() => {
          setFormStatus('');
        }, 5000);
      }, (error) => {
        console.error('Failed to send email:', error.text);
        setFormStatus('Failed to send message. Please try again or email us directly.');
        
        // Track failed email send
        ReactGA.event({
          category: 'Error',
          action: 'EmailFailed',
          label: 'Contact Form Error'
        });
        
        // Clear error message after 5 seconds
        setTimeout(() => {
          setFormStatus('');
        }, 5000);
      });
  }, []);

  return (
    <div className="page">
      {/* Header Section */}
      <header className="page-header services-header">
        <AnimatedServicesHeader />
        <p>
          We offer a range of technical consulting services to help bridge the gap between highly technical teams and functional audiences. Our expertise spans documentation, developer relations, and strategic communications.
        </p>
      </header>

      {/* Services Overview Section */}
      <section className="service-section">
        <h2>Our Services</h2>
        <p>
          At Prodable, we specialize in creating clear, concise, and effective technical communication. Our services are designed to help you connect with your audience, whether they're developers, executives, or end-users.
        </p>
        <p>
          We work closely with your team to understand your technology, your goals, and your audience. This allows us to create tailored solutions that meet your specific needs and help you achieve your objectives.
        </p>
        <p>
          Our team brings years of experience in technical writing, developer relations, and strategic communications. We've worked with companies of all sizes, from startups to enterprise organizations, across a variety of industries.
        </p>
      </section>

      {/* Pricing Section */}
      <section className="service-section dark-bg">
        <h2>Pricing</h2>
        <p>
          We offer flexible pricing options to accommodate different project scopes and budgets. Our rates are based on the type of work and complexity of the project. Contact us for a custom quote.
        </p>
        <p className="hourly-rates-note" style={{ marginBottom: '2rem' }}>Base rate is determined by project complexity and timeline requirements.</p>
        <div className="pricing-container">
          <div className="pricing-tier">
            <div className="service-code">001</div>
            <h3>Discovery</h3>
            <p>Charges for the analysis and evaluation of initial documents and systems</p>
            <div className="rate-button">1 × base rate</div>
          </div>
          
          <div className="pricing-tier">
            <div className="service-code">002</div>
            <h3>Technical Writing & Research</h3>
            <p>Charges for technical curriculum writing including interviewing, writing, and editing/updating of technical copy, website copy, or other technical material.</p>
            <p><strong>Deliverables:</strong> Created in a GDoc or similar format.</p>
            <div className="rate-button">1.2 × base rate</div>
          </div>
          
          <div className="pricing-tier">
            <div className="service-code">003</div>
            <h3>Technical Writing & System Maintenance</h3>
            <p>Charges for technical writing projects that also include setting up CI, platforms, and updating source code. This can also include technical/engineering documentation that requires the development of code or technical configuration samples.</p>
            <p><strong>Deliverables:</strong> Authored & updated directly in your website or other system.</p>
            <div className="rate-button">1.8 × base rate</div>
          </div>
          
          <div className="pricing-tier">
            <div className="service-code">004</div>
            <h3>Platform and Website Setup</h3>
            <p>This includes services where we are setting up a platform or system for documentation, websites, and other systems. This will include recommendations and custom build out of a platform for your company, and internal documentation of how to use and maintain the platform.</p>
            <p><strong>Deliverables:</strong> A completely operational website or documentation system.</p>
            <div className="rate-button">1.7 × base rate</div>
          </div>
          
          <div className="pricing-tier">
            <div className="service-code">005</div>
            <h3>Documentation Architecture</h3>
            <p>Charges for the planning and design of technical writing systems, and higher-level technical documentation including whitepapers or technical Case Studies. This could include taking an existing body of docs in various systems and creating a usable, consumer-facing written product.</p>
            <p><strong>Deliverables:</strong> Open-ended and complex.</p>
            <div className="rate-button">2 × base rate</div>
          </div>
        </div>
      </section>

      {/* Contact Information Section */}
      <section id="contact" className="service-section">
        <h2>Contact Information</h2>
        <p>
          Ready to get started? Have questions about our services? We'd love to hear from you. Reach out using any of the methods below, or fill out the form and we'll get back to you as soon as possible.
        </p>
        <div className="contact-container">
          <div className="contact-info">
            <div className="contact-method">
              <h3>Email</h3>
              <p><a href="mailto:info@prodable.org">info@prodable.org</a></p>
            </div>
            <div className="contact-method">
              <h3>Location</h3>
              <p>Austin, TX</p>
            </div>
            <div className="contact-method">
              <h3>Hours</h3>
              <p>Monday - Friday: 9am - 5pm CST</p>
            </div>
          </div>
          <div className="contact-form">
            {formStatus && (
              <div className={`form-status ${formStatus.includes('Failed') ? 'error' : 'success'}`}>
                {formStatus}
              </div>
            )}
            <form ref={formRef} onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="user_name">Name</label>
                <input type="text" id="user_name" name="user_name" required />
              </div>
              <div className="form-group">
                <label htmlFor="user_email">Email</label>
                <input type="email" id="user_email" name="user_email" required />
              </div>
              <div className="form-group">
                <label htmlFor="subject">Subject</label>
                <input type="text" id="subject" name="subject" required />
              </div>
              <div className="form-group">
                <label htmlFor="message">Message</label>
                <textarea id="message" name="message" required></textarea>
              </div>
              <button type="submit" className="submit-button">Send Message</button>
            </form>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default Services;
