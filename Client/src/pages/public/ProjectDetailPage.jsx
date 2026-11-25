import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { publicService } from '../../services/publicService';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { Button } from '../../components/common/Button';
import {
  ExternalLink,
  Download,
  Calendar,
  Layers,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
} from 'lucide-react';
import { Github } from '../../components/common/SocialIcons';

const APP_METADATA = {
  campuslink: {
    platform: 'Android (APK)',
    packageName: 'com.example.campus_link',
    version: '1.0.0 (Build 1)',
    size: '61.73 MB',
    minSdk: 'Android 5.0 (API 21)',
    targetSdk: 'Android 14 (API 34)',
    downloadName: 'CampusLink-release.apk',
  },
  'baby-shop': {
    platform: 'Android (APK)',
    packageName: 'com.example.the_baby_shop',
    version: '1.0.0 (Build 1)',
    size: '103.34 MB',
    minSdk: 'Android 5.0 (API 21)',
    targetSdk: 'Android 14 (API 34)',
    downloadName: 'BabyShop-release.apk',
  },
};

export const ProjectDetailPage = () => {
  const { slug } = useParams();
  const [project, setProject] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState('');

  const appMeta =
    project?.slug && APP_METADATA[project.slug]
      ? APP_METADATA[project.slug]
      : project?.title?.toLowerCase().includes('baby')
      ? APP_METADATA['baby-shop']
      : project?.title?.toLowerCase().includes('campus')
      ? APP_METADATA['campuslink']
      : null;

  useEffect(() => {
    setLoading(true);
    publicService
      .getProjectBySlug(slug)
      .then((res) => {
        if (res.success && res.data) {
          setProject(res.data.project);
          setRelated(res.data.related || []);
          setActiveImage(res.data.project.coverImage);
          document.title = `${res.data.project.title} | CYDEX DIGITAL`;
        } else {
          setProject(null);
          setRelated([]);
          document.title = 'Project Not Found | CYDEX DIGITAL';
        }
      })
      .catch((err) => {
        console.error(err);
        setProject(null);
        setRelated([]);
        document.title = 'Project Not Found | CYDEX DIGITAL';
      })
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return <LoadingSpinner fullScreen label="Loading project details..." />;
  }

  if (!project) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full studio-card text-xs font-mono text-[var(--text-muted)]">
          Case Study
        </div>
        <h2 className="font-serif text-3xl sm:text-5xl font-normal text-[var(--text-primary)] tracking-tight">
          Project <span className="italic text-[#03A094]">Not Found</span>
        </h2>
        <p className="text-sm sm:text-base text-[var(--text-muted)] max-w-md mx-auto">
          The requested portfolio project could not be found or has not been published yet.
        </p>
        <div className="pt-2 flex items-center justify-center gap-3">
          <Link to="/portfolio">
            <Button variant="primary">Browse Portfolio</Button>
          </Link>
          <Link to="/contact">
            <Button variant="outline">Start a Project</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-14 space-y-8 sm:space-y-12">
      {/* Back Link */}
      <div>
        <Link
          to="/portfolio"
          className="inline-flex items-center gap-2 text-xs font-medium text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Portfolio</span>
        </Link>
      </div>

      {/* Project Header Info */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-8 space-y-5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-medium studio-card text-[var(--text-primary)]">
              {project.category}
            </span>
            {project.projectType && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-medium studio-card text-[var(--text-muted)]">
                {project.projectType}
              </span>
            )}
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-[var(--text-primary)] tracking-tight leading-[1.15]">
            {project.title}
          </h1>

          <p className="text-base sm:text-lg text-[var(--text-muted)] leading-relaxed font-normal">
            {project.shortDescription}
          </p>

          {/* Action links */}
          <div className="flex flex-wrap gap-3 pt-2">
            {project.projectUrl && (
              project.projectUrl.toLowerCase().includes('.apk') ? (
                <a href={project.projectUrl} download={appMeta?.downloadName || 'app-release.apk'}>
                  <Button variant="primary" size="md" icon={Download} iconPosition="left">
                    Download Android APK
                  </Button>
                </a>
              ) : (
                <a href={project.projectUrl} target="_blank" rel="noopener noreferrer">
                  <Button variant="primary" size="md" icon={ExternalLink} iconPosition="right">
                    View Project
                  </Button>
                </a>
              )
            )}
            {project.githubUrl && (
              <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="md" icon={Github}>
                  View Repository
                </Button>
              </a>
            )}
            <Link to={`/contact?service=${encodeURIComponent(project.category)}`}>
              <Button variant="secondary" size="md">
                Start Similar Project
              </Button>
            </Link>
          </div>
        </div>

        {/* Project Meta Column */}
        <div className="lg:col-span-4 studio-card rounded-2xl p-6 space-y-5">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] border-b border-[var(--border-color)] pb-3">
            Project Overview
          </h3>

          <div className="space-y-4 text-xs">
            {project.clientName && (
              <div>
                <span className="text-[var(--text-muted)] block mb-1">Client</span>
                <span className="text-[var(--text-primary)] font-medium text-sm">{project.clientName}</span>
              </div>
            )}

            <div>
              <span className="text-[var(--text-muted)] block mb-1">Category</span>
              <span className="text-[var(--text-primary)] font-medium text-sm">{project.category}</span>
            </div>

            {(project.category === 'Mobile Applications' || project.projectUrl?.toLowerCase().includes('.apk')) && (
              <>
                <div>
                  <span className="text-[var(--text-muted)] block mb-1">Platform</span>
                  <span className="text-[var(--text-primary)] font-medium text-sm">{appMeta?.platform || 'Android (APK)'}</span>
                </div>
                <div>
                  <span className="text-[var(--text-muted)] block mb-1">Package Name</span>
                  <span className="text-[var(--text-primary)] font-mono text-xs">{appMeta?.packageName || 'Mobile Package'}</span>
                </div>
                <div>
                  <span className="text-[var(--text-muted)] block mb-1">Version</span>
                  <span className="text-[var(--text-primary)] font-mono text-xs">{appMeta?.version || '1.0.0 (Build 1)'}</span>
                </div>
                <div>
                  <span className="text-[var(--text-muted)] block mb-1">Package Size</span>
                  <span className="text-[var(--text-primary)] font-mono text-xs">{appMeta?.size || 'Release APK'}</span>
                </div>
                {appMeta?.targetSdk && (
                  <div>
                    <span className="text-[var(--text-muted)] block mb-1">Target SDK</span>
                    <span className="text-[var(--text-primary)] font-mono text-xs">{appMeta.targetSdk}</span>
                  </div>
                )}
                {appMeta?.minSdk && (
                  <div>
                    <span className="text-[var(--text-muted)] block mb-1">Minimum SDK</span>
                    <span className="text-[var(--text-primary)] font-mono text-xs">{appMeta.minSdk}</span>
                  </div>
                )}
              </>
            )}

            <div>
              <span className="text-[var(--text-muted)] block mb-2">Technologies</span>
              <div className="flex flex-wrap gap-1.5">
                {project.technologies?.map((tech, i) => (
                  <span key={i} className="px-2 py-0.5 rounded text-[11px] font-mono studio-card text-[var(--text-primary)]">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Image Showcase & Gallery */}
      <div className="space-y-4">
        <div className="aspect-video w-full rounded-2xl overflow-hidden studio-card border border-[var(--border-color)]">
          <img
            src={activeImage || project.coverImage}
            alt={project.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Gallery Thumbs */}
        {project.gallery && project.gallery.length > 0 && (
          <div className="flex items-center gap-3 overflow-x-auto pb-2">
            <button
              onClick={() => setActiveImage(project.coverImage)}
              className={`w-24 h-16 rounded-lg overflow-hidden border transition-all ${
                activeImage === project.coverImage ? 'border-[#03A094] ring-1 ring-[#03A094]' : 'border-[var(--border-color)] opacity-70 hover:opacity-100'
              }`}
            >
              <img src={project.coverImage} alt="Cover" className="w-full h-full object-cover" />
            </button>
            {project.gallery.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImage(img)}
                className={`w-24 h-16 rounded-lg overflow-hidden border transition-all ${
                  activeImage === img ? 'border-[#03A094] ring-1 ring-[#03A094]' : 'border-[var(--border-color)] opacity-70 hover:opacity-100'
                }`}
              >
                <img src={img} alt={`Gallery ${idx}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Full Description & Architecture */}
      <div className="studio-card rounded-2xl p-6 sm:p-8 space-y-4">
        <h3 className="font-serif text-xl sm:text-2xl font-normal text-[var(--text-primary)]">Solution & Architecture</h3>
        <div className="prose max-w-none text-sm sm:text-base leading-relaxed text-[var(--text-muted)] whitespace-pre-line">
          {project.fullDescription}
        </div>
      </div>

      {/* Related Projects */}
      {related.length > 0 && (
        <div className="space-y-6 pt-6 border-t border-[var(--border-color)]">
          <h3 className="font-serif text-xl font-normal text-[var(--text-primary)]">Related Work</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {related.map((rel) => (
              <Link
                key={rel._id}
                to={`/portfolio/${rel.slug}`}
                className="studio-card rounded-xl overflow-hidden group flex flex-col hover:border-[var(--text-primary)] transition-colors"
              >
                <div className="aspect-video w-full overflow-hidden bg-[var(--surface-color)]">
                  <img
                    src={rel.coverImage}
                    alt={rel.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-4 space-y-1">
                  <span className="text-[10px] uppercase font-mono tracking-wider text-[var(--text-muted)]">{rel.category}</span>
                  <h4 className="text-sm font-medium text-[var(--text-primary)] group-hover:text-[#03A094] transition-colors line-clamp-1">
                    {rel.title}
                  </h4>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectDetailPage;
