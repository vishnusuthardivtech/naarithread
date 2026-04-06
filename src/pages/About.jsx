import { logoPath } from '../data/site'

const aboutItems = [
  {
    icon: '\uD83E\uDDF5',
    title: 'Premium Fabrics',
    text: 'At Naarithread, fabric selection is never rushed. Each material is carefully sourced to ensure comfort, durability, and elegance. Our lehengas are lightweight yet luxurious, allowing effortless movement while maintaining a royal appearance for festive occasions.',
  },
  {
    icon: '\u270B',
    title: 'Handcrafted Designs',
    text: 'Every lehenga is detailed by skilled artisans who bring traditional craftsmanship into modern silhouettes. From embroidery to finishing, each piece reflects hours of dedicated workmanship and attention to detail.',
  },
  {
    icon: '\uD83D\uDCD0',
    title: 'Perfect Fit Philosophy',
    text: 'Our designs are created to flatter modern body structures while maintaining elegance. We focus on proportions, drapes, and silhouettes that feel refined, youthful, and comfortable throughout long celebrations.',
  },
  {
    icon: '\u2714',
    title: 'Quality Checked',
    text: 'Every Naarithread piece goes through quality checks before reaching you. From stitching to embroidery alignment, we ensure consistency that meets premium fashion standards.',
  },
  {
    icon: '\uD83D\uDCCD',
    title: 'Made in Surat',
    text: 'Based in Surat, India\u2019s textile capital, Naarithread proudly represents authentic craftsmanship blended with contemporary design sensibilities. Our roots keep us connected to tradition while our vision stays modern.',
  },
  {
    icon: '\uD83D\uDC57',
    title: 'Non-Bridal Lehengas, Redefined',
    text: 'Naarithread focuses exclusively on non-bridal lehengas designed for modern celebrations. Our collections are crafted for women who want elegance without heaviness \u2014 perfect for festive functions, family gatherings, receptions, and cultural events beyond weddings.',
  },
  {
    icon: '\uD83C\uDFA8',
    title: 'Design Aesthetic',
    text: 'Our design language blends royal charm with modern minimalism. We believe true elegance lies in clean silhouettes, balanced detailing, and colors that feel festive yet refined. Every Naarithread piece is thoughtfully designed to remain timeless, not trend-dependent.',
  },
  {
    icon: '\uD83E\uDDF6',
    title: 'From Fabric to Finish',
    text: 'Each lehenga begins with fabric selection, followed by embroidery planning, silhouette structuring, and finishing. We work closely with artisans to ensure every element \u2014 from thread work to drape \u2014 meets our standards of quality, comfort, and elegance.',
  },
  {
    icon: '\uD83C\uDF38',
    title: 'Made for Modern Women',
    text: 'Naarithread is designed for women who celebrate their individuality. Our pieces are youthful, elegant, and versatile \u2014 created to move effortlessly with confidence, comfort, and grace through every celebration.',
  },
  {
    icon: '\uD83C\uDFED',
    title: 'Manufactured In-House',
    text: 'We design and manufacture our collections with close attention to detail. By controlling the production process, we ensure consistency, superior craftsmanship, and reliable quality across every Naarithread creation.',
  },
  {
    icon: '\uD83E\uDDED',
    title: 'Rooted in Surat',
    text: 'Being based in Surat gives us access to India\u2019s finest textiles, embroidery techniques, and skilled craftsmanship. Our roots keep us connected to tradition, while our vision pushes design forward.',
  },
  {
    icon: '\uD83D\uDCAC',
    title: 'Customer-First Approach',
    text: 'We believe luxury is not just about design, but also experience. From browsing to purchase, our focus is to offer clarity, support, and confidence so every customer feels assured in their choice.',
  },
  {
    icon: '\u2728',
    title: 'The Naarithread Promise',
    text: 'Every Naarithread piece represents a promise \u2014 of quality, elegance, and thoughtful design. We create for women who value understated luxury, modern expression, and timeless celebration wear.',
  },
]

export default function About() {
  return (
    <section className="about-luxury">
      <style>{`
        .about-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 30px;
          margin-top: 28px;
        }

        .about-luxury .about-grid .about-row {
          height: 100%;
          align-items: flex-start;
          gap: 22px;
          padding: 26px 24px;
          border-radius: 18px;
          background: linear-gradient(180deg, #120000, #0b0b0b);
          border: 1px solid rgba(212, 175, 55, 0.25);
          box-shadow: 0 12px 30px rgba(0, 0, 0, 0.24);
        }

        .about-luxury .about-grid .about-row:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 50px rgba(212, 175, 55, 0.25);
          border-color: #d4af37;
        }

        .about-luxury .about-grid .about-icon {
          min-width: 58px;
          width: 58px;
          height: 58px;
          font-size: 24px;
        }

        .about-luxury .about-grid .about-text h2 {
          font-size: 20px;
          margin-bottom: 10px;
        }

        .about-luxury .about-grid .about-text p {
          color: #ccc;
          font-size: 14px;
          line-height: 1.6;
        }

        @media (max-width: 768px) {
          .about-grid {
            grid-template-columns: 1fr;
            gap: 22px;
          }

          .about-luxury .about-grid .about-row {
            text-align: left;
            flex-direction: row;
          }

          .about-luxury .about-grid .about-icon {
            margin-bottom: 0;
          }
        }
      `}</style>

      <section className="about-hero">
        <img src={logoPath} alt="Naarithread logo" className="about-logo" />
        <h1>Why Naarithread?</h1>
        <p>Crafted for modern celebrations with timeless elegance</p>
      </section>

      <div className="about-grid">
        {aboutItems.map((item) => (
          <div className="about-row reveal active" key={item.title}>
            <div className="about-icon">{item.icon}</div>
            <div className="about-text">
              <h2>{item.title}</h2>
              <p>{item.text}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
