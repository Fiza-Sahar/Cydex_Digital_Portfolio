import mongoose from 'mongoose';

const siteSettingSchema = new mongoose.Schema(
  {
    heroHeading: {
      type: String,
      default: 'Building Ideas Into Digital Reality.',
    },
    heroDescription: {
      type: String,
      default:
        'We help businesses turn ambitious ideas into powerful digital experiences through technology, creative design, and reliable digital solutions.',
    },
    heroCtaPrimary: {
      label: { type: String, default: 'Start a Project' },
      link: { type: String, default: '/contact' },
    },
    heroCtaSecondary: {
      label: { type: String, default: 'Explore Our Work' },
      link: { type: String, default: '/portfolio' },
    },
    aboutTitle: {
      type: String,
      default: 'Empowering Businesses With Next-Generation Digital Craftsmanship',
    },
    aboutContent: {
      type: String,
      default:
        'Cydex Digital is a dedicated technology agency committed to building scalable web applications, mobile platforms, enterprise software, and world-class digital design. Our engineering principles ensure every deliverable is built for high performance, maintainability, and user engagement.',
    },
    mission: {
      type: String,
      default:
        'To transform innovative concepts into dependable, high-impact digital products that empower our clients to scale globally.',
    },
    vision: {
      type: String,
      default:
        'To be the preferred global digital technology partner known for engineering excellence, client transparency, and creative innovation.',
    },
    footerDescription: {
      type: String,
      default:
        'Cydex Digital builds high-performance websites, custom software, mobile apps, and refined UI/UX designs for modern businesses worldwide.',
    },
    contactEmail: {
      type: String,
      default: 'cydexdigital@gmail.com',
    },
    contactPhone: {
      type: String,
      default: '+92 3162088436',
    },
    contactAddress: {
      type: String,
      default: 'Karachi, Pakistan (Serving Globally)',
    },
    socialLinks: {
      linkedin: { type: String, default: 'https://linkedin.com' },
      twitter: { type: String, default: 'https://twitter.com' },
      github: { type: String, default: 'https://github.com' },
      instagram: { type: String, default: 'https://instagram.com' },
    },
    seoDefaults: {
      metaTitle: { type: String, default: 'Cydex Digital — Building Ideas Into Reality' },
      metaDescription: {
        type: String,
        default:
          'Full-service technology and digital solutions agency specializing in web, mobile, custom software, and UX engineering.',
      },
      shareImage: { type: String, default: '/cydex-og.png' },
    },
  },
  {
    timestamps: true,
  }
);

export const SiteSetting = mongoose.model('SiteSetting', siteSettingSchema);
