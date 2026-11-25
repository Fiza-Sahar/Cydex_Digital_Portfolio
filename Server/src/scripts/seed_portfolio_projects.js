import mongoose from 'mongoose';
import dns from 'dns';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { PortfolioProject } from '../models/PortfolioProject.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../../.env') });

try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch {}

const projectsToSeed = [
  {
    title: 'Healthy Mind',
    slug: 'healthy-mind',
    category: 'Websites',
    projectType: 'Concept / Demo',
    shortDescription: 'A wellness website for online aerobics, guided meditation and yoga.',
    fullDescription: 'Healthy Mind brings yoga, meditation and fitness resources together in one place. Visitors can browse yoga poses by type, benefit and anatomy, and explore courses, guided meditations, videos and recommended books.',
    technologies: ['HTML', 'CSS'],
    projectUrl: 'https://healthymindd.netlify.app/',
    coverImage: '/portfolio/healthymind-desktop.jpg',
    gallery: [
      '/portfolio/healthymind-detail.jpg',
      '/portfolio/healthymind-mobile.jpg'
    ],
    featured: false,
    isPublished: true,
    seoTitle: 'Healthy Mind — Wellness, Meditation & Yoga Platform',
    seoDescription: 'Healthy Mind brings yoga, meditation and fitness resources together in one place with course directories and guided meditations.',
    createdAt: new Date('2026-10-01T10:00:00.000Z'),
  },
  {
    title: 'LuxeFurniture',
    slug: 'luxefurniture',
    category: 'Websites',
    projectType: 'Concept / Demo',
    shortDescription: 'A furniture storefront with category collections and product cards.',
    fullDescription: 'A responsive furniture shopping website organised into Chair, Sofa, Divider and Table collections. Each product card shows price, discount badge and an add-to-cart button, with a photo gallery, newsletter signup, About and Contact pages. Built as a demo storefront.',
    technologies: ['HTML', 'CSS'],
    projectUrl: 'https://luxuryfurnituree.netlify.app/',
    coverImage: '/portfolio/luxefurniture-desktop.jpg',
    gallery: [
      '/portfolio/luxefurniture-detail.jpg',
      '/portfolio/luxefurniture-mobile.jpg'
    ],
    featured: false,
    isPublished: true,
    seoTitle: 'LuxeFurniture — Contemporary Furniture Storefront',
    seoDescription: 'A responsive furniture shopping website organised into Chair, Sofa, Divider and Table collections with cart capabilities and gallery.',
    createdAt: new Date('2026-10-15T10:00:00.000Z'),
  },
  {
    title: 'Forma Atelier',
    slug: 'forma-atelier',
    category: 'Websites',
    projectType: 'Concept / Demo',
    shortDescription: 'A concept website for a fictional interior architecture studio, built around a scroll-driven hero animation.',
    fullDescription: "A concept website designed and built for a fictional interior design studio. The homepage turns scrolling into a five-stage animated sequence, followed by services, a four-step design process, a selected-work grid and an FAQ. A validated 'Book a Design Visit' form completes the visitor journey, and separate Services and About pages support the main page. The studio, clients and projects shown on the site are fictional.",
    technologies: ['HTML', 'CSS', 'JavaScript'],
    projectUrl: 'https://forma-atelier-steel.vercel.app',
    coverImage: '/portfolio/forma-atelier-desktop.jpg',
    gallery: [
      '/portfolio/forma-atelier-process.jpg',
      '/portfolio/forma-atelier-projects.jpg',
      '/portfolio/forma-atelier-mobile.jpg'
    ],
    featured: false,
    isPublished: true,
    seoTitle: 'Forma Atelier — Interior Architecture Studio Concept',
    seoDescription: 'A concept website for a fictional interior architecture studio, built around a scroll-driven hero animation.',
    createdAt: new Date('2026-10-25T10:00:00.000Z'),
  },
  {
    title: 'EventSphere',
    slug: 'eventsphere',
    category: 'Custom Software',
    projectType: 'Concept / Demo',
    shortDescription: 'A MERN web platform for expo and event management.',
    fullDescription: 'A full-stack web application for managing expos and events, built with the MERN stack.',
    technologies: ['MongoDB', 'Express.js', 'React', 'Node.js'],
    projectUrl: 'https://event-sphere-complete-project-rouge.vercel.app/',
    coverImage: '/portfolio/eventsphere-desktop.jpg',
    gallery: [
      '/portfolio/eventsphere-detail.jpg',
      '/portfolio/eventsphere-mobile.jpg'
    ],
    featured: true,
    isPublished: true,
    seoTitle: 'EventSphere — Expo & Event Management Platform',
    seoDescription: 'A full-stack web application for managing expos and events, built with the MERN stack.',
    createdAt: new Date('2026-11-01T10:00:00.000Z'),
  },
];

async function seed() {
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    console.error('MONGODB_URI not found in environment');
    process.exit(1);
  }

  console.log('Connecting to MongoDB...');
  await mongoose.connect(mongoUri);
  console.log('Connected to MongoDB.');

  for (const item of projectsToSeed) {
    const existing = await PortfolioProject.findOne({ slug: item.slug });
    if (existing) {
      console.log(`Updating existing project: ${item.title} (${item.slug})`);
      await PortfolioProject.updateOne({ slug: item.slug }, { $set: item });
    } else {
      console.log(`Inserting project: ${item.title} (${item.slug})`);
      await PortfolioProject.create(item);
    }
  }

  const allProjects = await PortfolioProject.find({ isPublished: true }).sort({ createdAt: -1 });
  console.log('\nCurrent Published Portfolio in DB (Order):');
  allProjects.forEach((p, idx) => {
    console.log(`${idx + 1}. [${p.featured ? 'FEATURED' : 'STANDARD'}] ${p.title} (${p.category}) -> ${p.projectUrl}`);
  });

  await mongoose.disconnect();
  console.log('Done.');
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seed error:', err);
  process.exit(1);
});
