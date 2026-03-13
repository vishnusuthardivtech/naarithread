import { useRevealOnScroll } from '../hooks/useRevealOnScroll'

export default function Contact() {
  useRevealOnScroll([])

  return (
    <>
      <section className="contact-hero">
        <h1>Get in Touch</h1>
        <p>We’re here to help you with orders, styling guidance, or any questions about Naarithread. Reach out — we’d love to hear from you.</p>
      </section>

      <section className="contact-luxury">
        <div className="contact-row"><div className="contact-icon">{'\uD83D\uDCCD'}</div><div className="contact-text"><h2>Our Location</h2><p>2019 , 2020 1st floor Polarise Market Puna Patiya Surat, Gujarat — India’s textile capital, where tradition, craftsmanship, and modern design come together.</p></div></div>
        <div className="contact-row"><div className="contact-icon">{'\uD83D\uDCDE'}</div><div className="contact-text"><h2>Phone Support</h2><p>+91 79906 45085 <br />Available Monday to Saturday, 10:00 AM – 7:00 PM</p></div></div>
        <div className="contact-row"><div className="contact-icon">{'\u2709\uFE0F'}</div><div className="contact-text"><h2>Email Us</h2><p>naarithread@gmail.com <br />We usually respond within 24 hours.</p></div></div>
      </section>

      <section className="contact-form-section">
        <h2 className="contact-form-heading">Send Us a Message</h2>
        <p className="contact-form-sub">Whether it’s an order inquiry or styling advice, write to us — we’re happy to assist.</p>
        <form className="contact-form" onSubmit={(event) => event.preventDefault()}>
          <input type="text" placeholder="Your Name" required />
          <input type="email" placeholder="Your Email" required />
          <input type="text" placeholder="Phone Number" />
          <textarea placeholder="Your Message" rows="5" required></textarea>
          <button type="submit">Send Message</button>
        </form>
      </section>
    </>
  )
}



