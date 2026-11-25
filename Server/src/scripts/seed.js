import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import { User } from '../models/User.js';
import { Service } from '../models/Service.js';
import { PortfolioProject } from '../models/PortfolioProject.js';
import { BlogPost, BlogCategory } from '../models/BlogPost.js';
import { Testimonial } from '../models/Testimonial.js';
import { TeamMember } from '../models/TeamMember.js';
import { SiteSetting } from '../models/SiteSetting.js';
import { ClientProject } from '../models/ClientProject.js';
import { ProjectMilestone } from '../models/ProjectMilestone.js';
import { Inquiry } from '../models/Inquiry.js';
import { Conversation } from '../models/Conversation.js';
import { Message } from '../models/Message.js';
import { Notification } from '../models/Notification.js';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/cydex_digital';

const seedDatabase = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('[Seed] Connected to MongoDB');

    // Clean existing data for clean seed
    await Promise.all([
      User.deleteMany({}),
      Service.deleteMany({}),
      PortfolioProject.deleteMany({}),
      BlogPost.deleteMany({}),
      BlogCategory.deleteMany({}),
      Testimonial.deleteMany({}),
      TeamMember.deleteMany({}),
      SiteSetting.deleteMany({}),
      ClientProject.deleteMany({}),
      ProjectMilestone.deleteMany({}),
      Inquiry.deleteMany({}),
      Conversation.deleteMany({}),
      Message.deleteMany({}),
      Notification.deleteMany({}),
    ]);
    console.log('[Seed] Cleared collections');

    // 1. Create Default Site Settings
    await SiteSetting.create({
      heroHeading: 'Building Ideas Into Digital Reality.',
      heroDescription:
        'We help businesses turn ambitious ideas into powerful digital experiences through innovative technology, creative design, and reliable digital solutions.',
      heroCtaPrimary: { label: 'Start a Project', link: '/contact' },
      heroCtaSecondary: { label: 'Explore Our Work', link: '/portfolio' },
      aboutTitle: 'Empowering Businesses With Next-Generation Digital Craftsmanship',
      aboutContent:
        'Cydex Digital is a dedicated digital solutions and technology agency helping startups, mid-market leaders, and global enterprises build scalable web platforms, high-performance mobile apps, and refined UI/UX designs. Our engineering process bridges visionary concept with production-grade execution.',
      mission:
        'To transform innovative concepts into dependable, high-impact digital products that empower our clients to scale globally.',
      vision:
        'To be the preferred global digital technology partner known for engineering excellence, client transparency, and creative innovation.',
      footerDescription:
        'Cydex Digital builds high-performance websites, custom software, mobile apps, and refined UI/UX designs for modern businesses worldwide.',
      contactEmail: 'contact@cydexdigital.com',
      contactPhone: '+1 (555) 234-8900',
      socialLinks: {
        linkedin: 'https://linkedin.com/company/cydex-digital',
        twitter: 'https://twitter.com/cydexdigital',
        github: 'https://github.com/cydexdigital',
        instagram: 'https://instagram.com/cydexdigital',
      },
    });
    console.log('[Seed] Created Site Settings');

    // 2. Create Admin and Demo Client Users
    const adminUser = await User.create({
      name: 'Cydex Administrator',
      email: 'admin@cydexdigital.com',
      password: 'Admin@Cydex2026!',
      role: 'admin',
      company: 'Cydex Digital HQ',
      phone: '+1 (555) 010-9999',
    });

    const clientUser = await User.create({
      name: 'Alex Rivera',
      email: 'client@cydexdigital.com',
      password: 'Client1234!',
      role: 'client',
      company: 'Vanguard Dynamics Corp',
      phone: '+1 (555) 443-8821',
      timezone: 'America/New_York',
    });
    console.log('[Seed] Created Admin & Client Accounts');

    // 3. Create the 6 Core Services
    const servicesData = [
      {
        title: 'Website Development',
        slug: 'website-development',
        icon: 'Globe',
        displayOrder: 1,
        shortDescription:
          'High-performance, secure, responsive web applications and corporate websites engineered for conversion and speed.',
        heroDescription:
          'From high-converting corporate sites to complex web applications, our engineering team crafts fast, responsive, and SEO-optimized web experiences utilizing modern React, Node.js, and cloud architectures.',
        benefits: [
          'Sub-second page load times with modern frontends',
          'Search engine optimized semantic HTML and metadata',
          'Responsive layouts tailored for all screen sizes',
          'Secure backend integration and CMS capabilities',
        ],
        features: [
          'Full-stack custom React & Next.js development',
          'E-commerce platforms & payment gateway integration',
          'Headless CMS & custom administrative control panels',
          'API integrations & automated workflows',
        ],
        deliverables: [
          'Production-ready codebase with clean documentation',
          'Responsive design tested across 15+ device viewports',
          'Automated CI/CD deployment pipeline configuration',
          'Performance audit report with Lighthouse scores 90+',
        ],
        process: [
          { step: 1, title: 'Requirements & Architecture', description: 'Analyze technical requirements, define information architecture and user journeys.' },
          { step: 2, title: 'Design & Prototyping', description: 'Wireframing, UI styleguide creation, and interactive Figma prototyping.' },
          { step: 3, title: 'Engineering & Testing', description: 'Clean component development, backend API creation, automated testing, and security hardening.' },
          { step: 4, title: 'Deployment & Launch', description: 'Production staging, DNS configuration, SSL setup, and ongoing technical support.' },
        ],
        faqs: [
          { question: 'What technologies do you use for web development?', answer: 'We specialize in React, Vite, Next.js, Node.js, Express, MongoDB, PostgreSQL, and modern Tailwind CSS.' },
          { question: 'How long does a typical web development project take?', answer: 'Typical projects range from 3 to 8 weeks depending on scope, custom features, and third-party integrations.' },
        ],
      },
      {
        title: 'Mobile App Development',
        slug: 'mobile-app-development',
        icon: 'Smartphone',
        displayOrder: 2,
        shortDescription:
          'Cross-platform iOS and Android applications designed with smooth native ergonomics and offline resilience.',
        heroDescription:
          'Deliver exceptional mobile experiences directly into the hands of your users. We build robust, fluid mobile apps with React Native and modern native toolchains.',
        benefits: [
          'Unified codebase for both iOS and Android stores',
          'Native hardware integration (Camera, GPS, Biometrics)',
          'Offline caching and resilient data synchronization',
          'App Store & Google Play compliance guarantee',
        ],
        features: [
          'Interactive push notifications & messaging',
          'Biometric authentication & secure keychain storage',
          'Real-time geolocation & mapping services',
          'In-app purchases and subscription management',
        ],
        deliverables: [
          'Ready-to-publish IPA and APK app packages',
          'App Store and Play Store asset generation',
          'Backend cloud microservices & synchronization APIs',
          'Complete user onboarding flows',
        ],
        process: [
          { step: 1, title: 'Mobile Strategy', description: 'Define user personas, device compatibility matrix, and core mobile value.' },
          { step: 2, title: 'Mobile UI/UX', description: 'Design tactile interfaces adhering to Apple HIG and Google Material 3 guidelines.' },
          { step: 3, title: 'App Engineering', description: 'Develop cross-platform modules with performance profiling.' },
          { step: 4, title: 'Store Submission', description: 'TestFlight beta testing, app store compliance, and store release.' },
        ],
        faqs: [
          { question: 'Do you build native or cross-platform apps?', answer: 'We build cross-platform apps using React Native and Flutter, which allows native performance while cutting development time and cost in half.' },
        ],
      },
      {
        title: 'UI/UX and Graphic Design',
        slug: 'ui-ux-design',
        icon: 'Palette',
        displayOrder: 3,
        shortDescription:
          'Intuitive digital product interfaces, design systems, and cohesive branding that turn visitors into loyal users.',
        heroDescription:
          'Design is not just how it looks, but how it works. Our product designers create intuitive user journeys, accessible design systems, and memorable brand identities.',
        benefits: [
          'Increased conversion rates through frictionless UX',
          'Consistent brand presence across all digital touchpoints',
          'WCAG AA accessible color palettes and typography',
          'Scalable Figma design systems for easy developer handoff',
        ],
        features: [
          'User research, customer personas & journey mapping',
          'Wireframing and high-fidelity interactive prototypes',
          'Comprehensive design systems & component libraries',
          'Brand identity guidelines, logos, and icon suites',
        ],
        deliverables: [
          'Figma component library with design tokens',
          'Clickable interactive high-fidelity prototypes',
          'Comprehensive design specs for engineering team',
          'Brand asset pack (SVG, PNG, color guides)',
        ],
        process: [
          { step: 1, title: 'Research & Discovery', description: 'Competitor benchmarking, user surveys, and friction point analysis.' },
          { step: 2, title: 'Wireframing', description: 'Structural low-fidelity wireframes exploring layout alternatives.' },
          { step: 3, title: 'Visual Styling', description: 'High-fidelity visual design, typography, brand tokens, and interaction states.' },
          { step: 4, title: 'Design System Delivery', description: 'Production-ready component variants with auto-layout.' },
        ],
        faqs: [
          { question: 'Do you deliver Figma files?', answer: 'Yes, all projects include organized Figma files with responsive components, auto-layout, and color/typography variables.' },
        ],
      },
      {
        title: 'Content Writing',
        slug: 'content-writing',
        icon: 'FileText',
        displayOrder: 4,
        shortDescription:
          'Persuasive, SEO-optimized copy, technical articles, and brand storytelling that resonate with target audiences.',
        heroDescription:
          'Words that articulate your value and drive action. Our technical copywriters craft compelling landing pages, thought-leadership articles, and product documentation.',
        benefits: [
          'Search engine visibility through keyword-rich copy',
          'Clear communication of complex technical propositions',
          'Consistent brand voice across marketing channels',
          'Engaging product narratives that boost sales conversions',
        ],
        features: [
          'Landing page and website copywriting',
          'Technical blog posts and whitepapers',
          'Email marketing sequences and newsletter campaigns',
          'Product documentation and microcopy',
        ],
        deliverables: [
          'Polished markdown and Google Docs copy deliverables',
          'Keyword research and meta tags optimization guide',
          'Editorial calendar and content strategy playbook',
        ],
        process: [
          { step: 1, title: 'Voice & Tone Alignment', description: 'Define the brand lexicon, audience reading habits, and key messaging pillars.' },
          { step: 2, title: 'Keyword Strategy', description: 'Identify target intent queries and search opportunities.' },
          { step: 3, title: 'Drafting & Editorial Review', description: 'Craft compelling narratives with structured headlines and scannable formatting.' },
          { step: 4, title: 'Revisions & Delivery', description: 'Incorporate client feedback and finalize copy for immediate publishing.' },
        ],
        faqs: [
          { question: 'Is your content written with SEO in mind?', answer: 'Yes, every piece includes natural keyword integration, optimized heading tags, and meta descriptions.' },
        ],
      },
      {
        title: 'Video Editing',
        slug: 'video-editing',
        icon: 'Video',
        displayOrder: 5,
        shortDescription:
          'Dynamic promotional videos, product walkthroughs, social media reels, and visual effects that capture attention.',
        heroDescription:
          'Bring your product story to life through high-impact video. We produce promotional teasers, motion-graphics explainers, and product demonstrations that captivate viewers.',
        benefits: [
          'Significantly higher engagement on digital advertising',
          'Crisp motion graphics explaining intricate software features',
          'Optimized formats for web, YouTube, and vertical reels',
          'Professional color grading and sound design',
        ],
        features: [
          'Product demo reels & SaaS feature walkthroughs',
          'Kinetic typography & 2D motion graphics',
          'Sound design, voiceover mastering, and audio mix',
          'Social media cutdowns (16:9, 9:16, 1:1)',
        ],
        deliverables: [
          '4K UHD Master video exports (MP4 / ProRes)',
          'Multi-ratio exports for Instagram, TikTok, and LinkedIn',
          'Subtitle files (SRT) and thumbnail designs',
        ],
        process: [
          { step: 1, title: 'Storyboard & Script', description: 'Map out the visual timeline, pacing, and narrative beats.' },
          { step: 2, title: 'Assembly & Cut', description: 'Select prime takes, match rhythm with musical score, and sequence scenes.' },
          { step: 3, title: 'Motion Graphics & Grading', description: 'Add animated UI elements, callouts, and cinematic color LUTs.' },
          { step: 4, title: 'Sound Polish & Final Export', description: 'Clean audio tracks, mix ambient sound effects, and export high-res formats.' },
        ],
        faqs: [
          { question: 'What footage do you need to begin?', answer: 'You can provide raw screen recordings, footage, or we can animate your Figma designs directly into fluid product demos.' },
        ],
      },
      {
        title: 'Custom Software Development',
        slug: 'custom-software-development',
        icon: 'Cpu',
        displayOrder: 6,
        shortDescription:
          'Tailored enterprise software, automated CRM/ERP integrations, and cloud architectures built for scalability.',
        heroDescription:
          'Solve distinct operational challenges with software engineered precisely for your workflow. We develop bespoke enterprise systems, data pipelines, and workflow automation.',
        benefits: [
          'Zero recurring per-user SaaS license fees',
          'Seamless integration with your legacy databases and APIs',
          'Full intellectual property ownership of your codebase',
          'Enterprise-grade security, role authorization, and audit trails',
        ],
        features: [
          'Bespoke ERP and internal operational platforms',
          'Cloud infrastructure setup (AWS, GCP, DigitalOcean)',
          'Automated data ingestion and real-time reporting',
          'Role-based access control and encrypted credential storage',
        ],
        deliverables: [
          'Fully containerized Docker application setup',
          'RESTful and GraphQL API schemas with documentation',
          'Database schemas with automated migrations',
          'System architecture diagrams and runbooks',
        ],
        process: [
          { step: 1, title: 'Systems Analysis', description: 'Deep audit of existing workflows, bottlenecks, and security considerations.' },
          { step: 2, title: 'Architecture Blueprint', description: 'Design modular microservices, database schemas, and API contracts.' },
          { step: 3, title: 'Agile Sprints', description: 'Iterative two-week development sprints with weekly client milestone reviews.' },
          { step: 4, title: 'UAT & Handover', description: 'Rigorous user acceptance testing, load testing, and team training.' },
        ],
        faqs: [
          { question: 'Who owns the code upon completion?', answer: 'You retain 100% full intellectual property and source code ownership upon project completion.' },
        ],
      },
    ];

    await Service.insertMany(servicesData);
    console.log('[Seed] Created 6 Agency Services');

    // 4. Create Demo Portfolio Projects
    const portfolioData = [
      {
        title: 'Apex Financial — Real-Time Wealth Intelligence Platform',
        slug: 'apex-financial-platform',
        shortDescription:
          'A modern wealth analytics dashboard offering portfolio insights, automated rebalancing, and live institutional market tickers.',
        fullDescription:
          'Apex Financial required a high-throughput, secure web platform to display real-time market data and automated portfolio optimization. Cydex Digital engineered a full-stack solution featuring sub-second chart rendering, multi-factor authentication, and automated statement generation.',
        coverImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
        gallery: [
          'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?auto=format&fit=crop&w=1200&q=80',
        ],
        category: 'Websites',
        technologies: ['React', 'Node.js', 'MongoDB', 'Tailwind CSS', 'Recharts', 'Socket.io'],
        projectType: 'Concept / Demo',
        clientName: 'Apex Wealth Partners (Demo)',
        projectUrl: 'https://demo.cydexdigital.com/apex-financial',
        githubUrl: 'https://github.com/cydexdigital/apex-financial-demo',
        featured: true,
        isPublished: true,
        seoTitle: 'Apex Financial Platform Case Study | Cydex Digital',
        seoDescription: 'Discover how Cydex Digital engineered a real-time wealth intelligence and portfolio platform.',
      },
      {
        title: 'Kuro Health — Telehealth Mobile Experience',
        slug: 'kuro-health-mobile-app',
        shortDescription:
          'An end-to-end mobile telehealth application connecting patients with board-certified physicians via encrypted video calls.',
        fullDescription:
          'Kuro Health needed an intuitive mobile app that simplified booking medical consultations, tracking prescription deliveries, and conducting HIPAA-compliant video calls. Cydex Digital designed and developed the mobile app using React Native, integrating WebRTC and Stripe.',
        coverImage: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80',
        gallery: [
          'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1200&q=80',
        ],
        category: 'Mobile Applications',
        technologies: ['React Native', 'WebRTC', 'Node.js', 'Express', 'Stripe'],
        projectType: 'Concept / Demo',
        clientName: 'Kuro Health Innovations (Demo)',
        projectUrl: 'https://demo.cydexdigital.com/kuro-health',
        featured: true,
        isPublished: true,
      },
      {
        title: 'Solstice Design System & SaaS UI Kit',
        slug: 'solstice-design-system',
        shortDescription:
          'A comprehensive enterprise design system featuring 140+ accessible Figma components, dark mode tokens, and interactive guidelines.',
        fullDescription:
          'Solstice is an enterprise design system created to unify fragmented SaaS products. The project includes extensive tokenization for colors, spacing, and typography, alongside rigorous WCAG 2.2 AA accessibility verification.',
        coverImage: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1200&q=80',
        gallery: [
          'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?auto=format&fit=crop&w=1200&q=80',
        ],
        category: 'UI/UX and Design',
        technologies: ['Figma', 'Design Tokens', 'Tailwind CSS', 'Storybook', 'WCAG 2.2'],
        projectType: 'Concept / Demo',
        clientName: 'Solstice Technologies (Demo)',
        featured: true,
        isPublished: true,
      },
      {
        title: 'Nexus Logistics — Automated Supply Chain ERP',
        slug: 'nexus-logistics-erp',
        shortDescription:
          'Custom logistics software orchestrating freight dispatch, automated route calculations, and warehouse inventory tracking.',
        fullDescription:
          'Nexus Logistics required a unified operational tool to eliminate manual spreadsheet dispatching. Cydex Digital developed a bespoke ERP platform that optimizes driver routes, tracks container telemetry, and generates automated customs clearance documentation.',
        coverImage: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80',
        gallery: [
          'https://images.unsplash.com/photo-1553413077-190dd305871c?auto=format&fit=crop&w=1200&q=80',
        ],
        category: 'Custom Software',
        technologies: ['Node.js', 'Express', 'MongoDB', 'Docker', 'Leaflet Maps', 'Redis'],
        projectType: 'Concept / Demo',
        clientName: 'Nexus Global Freight (Demo)',
        featured: true,
        isPublished: true,
      },
      {
        title: 'Veritas Media — High-Throughput Digital Publication',
        slug: 'veritas-media-publication',
        shortDescription:
          'A dynamic journalism portal handling 50,000+ daily readers with lightning-fast CDN caching and audio article narration.',
        fullDescription:
          'Veritas Media required a modern digital newsroom that prioritized clean reading typography, rapid article loads under peak breaking-news traffic, and audio voiceover streaming.',
        coverImage: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1200&q=80',
        category: 'Websites',
        technologies: ['React', 'Vite', 'Tailwind CSS', 'Node.js', 'AWS CloudFront'],
        projectType: 'Concept / Demo',
        clientName: 'Veritas Publishing Group (Demo)',
        featured: false,
        isPublished: true,
      },
      {
        title: 'Pulse Commerce — Next-Gen Headless Storefront',
        slug: 'pulse-commerce-storefront',
        shortDescription:
          'An ultra-fast e-commerce shopping experience with instant product filtering, 3D product previews, and 1-click checkout.',
        fullDescription:
          'Pulse Commerce is a high-converting storefront built for a boutique electronics brand. We engineered sub-second search filters, mobile-optimized checkout funnels, and real-time inventory alerts.',
        coverImage: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&w=1200&q=80',
        category: 'Websites',
        technologies: ['React', 'Stripe', 'Node.js', 'MongoDB', 'Tailwind CSS'],
        projectType: 'Concept / Demo',
        clientName: 'Pulse Audio Wear (Demo)',
        featured: false,
        isPublished: true,
      },
    ];

    await PortfolioProject.insertMany(portfolioData);
    console.log('[Seed] Created Portfolio Projects');

    // 5. Create Blog Categories and Posts
    const catTech = await BlogCategory.create({
      name: 'Technology',
      slug: 'technology',
      description: 'Insights on modern software engineering, web architectures, and cloud services.',
    });
    const catDesign = await BlogCategory.create({
      name: 'Design & UX',
      slug: 'design-ux',
      description: 'Exploring product design, usability, design systems, and visual communication.',
    });
    const catBusiness = await BlogCategory.create({
      name: 'Digital Strategy',
      slug: 'digital-strategy',
      description: 'Strategies for scaling digital operations, MVP development, and agency collaboration.',
    });

    const blogPostsData = [
      {
        title: 'Architecting Scalable Web Applications with Modern MERN and Clean Boundaries',
        slug: 'architecting-scalable-web-applications-mern',
        excerpt:
          'A comprehensive engineering guide on separating concerns in full-stack JavaScript applications for high reliability, maintainability, and security.',
        content: `Building scalable web applications requires more than just picking a technology stack; it demands deliberate architecture and clear modular boundaries. In this article, we examine how Cydex Digital structures enterprise MERN stack applications for sustained growth.

### 1. Centralized Domain Logic
Separating controllers from services ensures that HTTP handling remains thin while core business logic is testable in isolation. Rather than embedding database queries within routing functions, domain services encapsulate data mutations and validations.

### 2. Cookie-Based Session Security
While storing tokens in localStorage is common in basic tutorials, production applications handling sensitive client data must rely on HttpOnly, SameSite cookies. This shields authentication tokens from Cross-Site Scripting (XSS) attacks.

### 3. Server-Side Data Validation
Client-side validation enhances user experience by providing immediate visual feedback, but it must never be treated as a security layer. Every endpoint must independently validate payload schemas and sanitize inputs against NoSQL injection.

### Conclusion
By enforcing disciplined architecture, thorough logging, and strict authorization checks, engineering teams build digital products that scale smoothly as user volume multiplies.`,
        coverImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80',
        author: 'Cydex Engineering Team',
        category: 'Technology',
        tags: ['MERN Stack', 'Architecture', 'Web Development', 'Security'],
        status: 'published',
        publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      },
      {
        title: 'Why Design Systems are Essential for High-Growth Startups',
        slug: 'why-design-systems-are-essential-for-startups',
        excerpt:
          'How building a reusable component library and unified token system cuts frontend development time and delivers brand consistency.',
        content: `In fast-moving digital environments, startups frequently make the mistake of creating one-off user interfaces for every new feature. The outcome is technical debt, inconsistent styling, and slow product iterations.

### The Power of Design Tokens
Design tokens act as the single source of truth for color values, spacing scales, and typography. When a brand update is required, changing a single variable updates both Figma assets and production code effortlessly.

### Speeding Developer Velocity
With well-documented component libraries in Tailwind CSS or UI primitives, engineers assemble screens like building blocks rather than re-inventing buttons, modal dialogs, and navigation drawers.

### Accessible by Default
Embedding WCAG AA contrast standards and keyboard focus states into foundational components guarantees that your application remains accessible to every user from day one.`,
        coverImage: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?auto=format&fit=crop&w=1200&q=80',
        author: 'Elena Rostova, Lead UI/UX',
        category: 'Design & UX',
        tags: ['Design Systems', 'Figma', 'UI/UX', 'Product Design'],
        status: 'published',
        publishedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      },
      {
        title: 'The Product Roadmap: From Raw Idea to Live Deployment',
        slug: 'the-product-roadmap-idea-to-deployment',
        excerpt:
          'Our transparent four-phase process for turning client visions into resilient, revenue-generating software solutions.',
        content: `At Cydex Digital, our tagline is "Building Ideas Into Reality." But how does an abstract idea become an operational digital product? Here is our four-step execution framework.

### 1. Discover
Before writing a single line of code, we work collaboratively to define business objectives, user expectations, technical constraints, and measurable success KPIs.

### 2. Plan
Scope definition, user story mapping, and database entity design prevent scope creep and ensure realistic delivery timelines.

### 3. Build
We construct software in weekly milestones. Clients have full access to our private client portal to view milestones, inspect deliverables, and communicate directly with staff.

### 4. Launch & Support
We conduct pre-flight security scans, performance benchmarking, and assist with cloud deployment to ensure an impeccable launch day.`,
        coverImage: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80',
        author: 'Marcus Vance, Head of Delivery',
        category: 'Digital Strategy',
        tags: ['Product Management', 'Strategy', 'Agile', 'Consulting'],
        status: 'published',
        publishedAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000),
      },
    ];

    await BlogPost.insertMany(blogPostsData);
    console.log('[Seed] Created Blog Posts');

    // 6. Create Testimonials (Clearly marked as demo / development sample content)
    const testimonialsData = [
      {
        clientName: 'Sarah Jenkins',
        position: 'Chief Product Officer',
        company: 'Vanguard Dynamics (Demo Client)',
        quote:
          'Cydex Digital transformed our complex legacy tool into an intuitive, high-speed web application. Their transparency and milestone-driven process made working with them seamless.',
        rating: 5,
        isApproved: true,
        isSample: true,
        displayOrder: 1,
      },
      {
        clientName: 'David Chen',
        position: 'Founder & CEO',
        company: 'Kuro Health Innovations (Demo Client)',
        quote:
          'From initial Figma prototypes to our live App Store submission, the team at Cydex delivered exceptional code quality and responsive support every step of the way.',
        rating: 5,
        isApproved: true,
        isSample: true,
        displayOrder: 2,
      },
      {
        clientName: 'Amara Okafor',
        position: 'Head of Marketing',
        company: 'Apex Wealth Partners (Demo Client)',
        quote:
          'The attention to visual detail and performance optimization was remarkable. Our portal loads instantly and our user engagement metrics have skyrocketed.',
        rating: 5,
        isApproved: true,
        isSample: true,
        displayOrder: 3,
      },
    ];

    await Testimonial.insertMany(testimonialsData);
    console.log('[Seed] Created Testimonials');

    // 7. Create Team Members (Editable draft profiles)
    const teamData = [
      {
        name: 'Tariq Al-Mansoor',
        role: 'Founder & Technical Director',
        bio: 'Full-stack software architect with deep expertise in cloud architectures, distributed systems, and modern JavaScript.',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
        skills: ['React', 'Node.js', 'System Architecture', 'Cloud Infrastructure'],
        socialLinks: { linkedin: 'https://linkedin.com', github: 'https://github.com' },
        displayOrder: 1,
        isVisible: true,
      },
      {
        name: 'Elena Rostova',
        role: 'Lead UI/UX Designer',
        bio: 'Specialist in intuitive interface design, multi-brand design systems, and accessible design principles.',
        avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80',
        skills: ['Figma', 'Design Systems', 'User Research', 'Prototyping'],
        socialLinks: { linkedin: 'https://linkedin.com', twitter: 'https://twitter.com' },
        displayOrder: 2,
        isVisible: true,
      },
      {
        name: 'Marcus Vance',
        role: 'Senior Full-Stack Engineer',
        bio: 'Specializing in database design, API security, and high-concurrency microservices.',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
        skills: ['Node.js', 'MongoDB', 'React', 'Docker'],
        socialLinks: { linkedin: 'https://linkedin.com', github: 'https://github.com' },
        displayOrder: 3,
        isVisible: true,
      },
    ];

    await TeamMember.insertMany(teamData);
    console.log('[Seed] Created Team Members');

    // 8. Create Demo Client Project, Milestones, and Inquiries
    const clientProject = await ClientProject.create({
      title: 'Vanguard Enterprise Portal Redesign',
      projectReference: 'PRJ-2026-4819',
      client: clientUser._id,
      description:
        'Complete architectural overhaul and UI/UX modernization of the Vanguard client onboarding and account management portal.',
      scope:
        'Design system implementation, secure cookie JWT authentication, dynamic dashboard, and automated PDF statement generation.',
      deliverables: [
        'Production React application with Tailwind styling',
        'Express.js backend with MongoDB integration',
        'Administrative analytics dashboard',
        'Complete test suite and documentation',
      ],
      services: ['Website Development', 'UI/UX and Graphic Design'],
      startDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
      targetCompletionDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      status: 'In Progress',
      progress: 50,
      clientUpdates: [
        {
          update: 'Milestone 2 completed: Backend API endpoints and database schemas validated and deployed to staging.',
          author: adminUser._id,
          date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        },
        {
          update: 'Milestone 1 completed: Figma design system and high-fidelity prototypes approved by client team.',
          author: adminUser._id,
          date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        },
        {
          update: 'Project initiated and repository structure provisioned.',
          author: adminUser._id,
          date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
        },
      ],
      internalNotes: [
        {
          note: 'Client confirmed target launch date. Staging environment credentials delivered via secure channel.',
          author: adminUser._id,
          date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        },
      ],
      deliverableFiles: [
        {
          name: 'Vanguard-Design-System-v1.pdf',
          url: 'https://demo.cydexdigital.com/files/Vanguard-Design-System-v1.pdf',
          uploadedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        },
      ],
    });

    // Milestones for Client Project
    await ProjectMilestone.insertMany([
      {
        clientProject: clientProject._id,
        title: 'Phase 1: Architecture & UI/UX Prototypes',
        description: 'Complete Figma wireframes, component design tokens, and architectural blueprint.',
        dueDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        status: 'Completed',
        completedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        order: 1,
      },
      {
        clientProject: clientProject._id,
        title: 'Phase 2: Backend APIs & Authentication Engine',
        description: 'Express server, JWT cookie authentication, database schemas, and input validation.',
        dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        status: 'Completed',
        completedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        order: 2,
      },
      {
        clientProject: clientProject._id,
        title: 'Phase 3: Frontend Dashboard & Data Tables',
        description: 'Implement responsive client portal with live analytics charts and project management.',
        dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
        status: 'In Progress',
        order: 3,
      },
      {
        clientProject: clientProject._id,
        title: 'Phase 4: UAT, Penetration Testing & Launch',
        description: 'End-to-end integration tests, security review, and production cloud deployment.',
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        status: 'Pending',
        order: 4,
      },
    ]);
    console.log('[Seed] Created Client Project & Milestones');

    // 9. Create Inquiries
    await Inquiry.create({
      referenceId: 'CYD-2026-8921B',
      client: clientUser._id,
      name: clientUser.name,
      email: clientUser.email,
      phone: clientUser.phone,
      company: clientUser.company,
      service: 'Custom Software Development',
      budgetRange: '$15,000 - $30,000',
      timeline: '2 - 3 months',
      projectTitle: 'Automated Billing and Invoicing Microservice',
      details:
        'We would like to add an automated subscription billing engine that interfaces with our Stripe billing ledger and sends PDF receipts.',
      preferredContactMethod: 'Email',
      privacyConsent: true,
      status: 'Qualified',
      internalNotes: [
        {
          note: 'Initial requirements reviewed. Suitable for Phase 2 extension on existing engagement.',
          author: adminUser._id,
          createdAt: new Date(),
        },
      ],
    });

    await Inquiry.create({
      referenceId: 'CYD-2026-3194A',
      name: 'Michael Sterling',
      email: 'm.sterling@sterlingbrands.io',
      phone: '+1 (555) 902-1144',
      company: 'Sterling Brands International',
      service: 'Website Development',
      budgetRange: '$10,000 - $20,000',
      timeline: '1 - 2 months',
      projectTitle: 'Global Brand E-Commerce Portal',
      details:
        'Seeking an experienced digital agency to re-platform our consumer electronics store to a modern React / Headless stack.',
      preferredContactMethod: 'Video Call',
      privacyConsent: true,
      status: 'New',
    });
    console.log('[Seed] Created Inquiries');

    // 10. Create Message Conversation
    const conversation = await Conversation.create({
      participants: [adminUser._id, clientUser._id],
      client: clientUser._id,
      clientProject: clientProject._id,
      subject: 'Vanguard Enterprise Portal Redesign',
      lastMessage: 'The staging build for Milestone 2 is ready for your team to review.',
      lastMessageAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
    });

    await Message.create({
      conversation: conversation._id,
      sender: adminUser._id,
      recipient: clientUser._id,
      content:
        'Hello Alex, welcome to your Cydex Digital portal. We have provisioned your project dashboard and uploaded Milestone 1 deliverables.',
      isRead: true,
      readAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
      createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
    });

    await Message.create({
      conversation: conversation._id,
      sender: clientUser._id,
      recipient: adminUser._id,
      content:
        'Thank you! The Figma designs look outstanding. Our stakeholders gave full approval on the dark navy and turquoise color scheme.',
      isRead: true,
      readAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    });

    await Message.create({
      conversation: conversation._id,
      sender: adminUser._id,
      recipient: clientUser._id,
      content:
        'The staging build for Milestone 2 is ready for your team to review. You can check the updated progress bar in your dashboard.',
      isRead: false,
      createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
    });
    console.log('[Seed] Created Conversation and Messages');

    // 11. Create Notifications
    await Notification.create({
      user: clientUser._id,
      title: 'Milestone 2 Completed',
      message: 'Backend APIs & Authentication Engine has been marked as Completed.',
      type: 'milestone',
      link: `/portal/projects/${clientProject._id}`,
      isRead: false,
    });

    await Notification.create({
      user: adminUser._id,
      title: 'New Project Inquiry',
      message: 'Michael Sterling submitted an inquiry for "Global Brand E-Commerce Portal" [Ref: CYD-2026-3194A]',
      type: 'inquiry',
      link: '/admin/inquiries',
      isRead: false,
    });
    console.log('[Seed] Created Notifications');

    console.log('========================================================');
    console.log('  CYDEX DIGITAL DATABASE SEEDED SUCCESSFULLY!');
    console.log('  Admin Login:  admin@cydexdigital.com  /  Admin@Cydex2026!');
    console.log('  Client Login: client@cydexdigital.com /  Client1234!');
    console.log('========================================================');

    process.exit(0);
  } catch (error) {
    console.error('[Seed Error]:', error);
    process.exit(1);
  }
};

seedDatabase();
