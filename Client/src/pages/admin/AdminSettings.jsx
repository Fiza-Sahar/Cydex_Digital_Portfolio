import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { Settings, Save, Globe, Mail, Phone, MapPin, Share2, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminSettings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('general');

  const [settings, setSettings] = useState({
    companyName: 'Cydex Digital',
    tagline: 'Building Ideas Into Reality.',
    brandMessage: 'Helping businesses grow through innovative technology, creative design, and reliable digital solutions.',
    heroHeadline: 'Building Ideas Into Digital Reality.',
    heroSubheadline: 'We help businesses turn ambitious ideas into powerful digital experiences through technology, creative design, and reliable digital solutions.',
    primaryCtaText: 'Start a Project',
    secondaryCtaText: 'Explore Our Work',
    contactEmail: 'contact@cydexdigital.com',
    supportEmail: 'support@cydexdigital.com',
    phone: '+1 (555) 019-2834',
    address: 'Silicon Oasis Tech Park, Innovation Way',
    operatingHours: 'Mon - Fri: 9:00 AM - 6:00 PM EST',
    missionStatement: 'To empower organizations worldwide through resilient, secure, and thoughtfully designed digital architectures.',
    visionStatement: 'To be the standard of engineering excellence and creative digital transformation across global markets.',
    socialLinks: {
      linkedin: 'https://linkedin.com/company/cydexdigital',
      twitter: 'https://twitter.com/cydexdigital',
      github: 'https://github.com/cydexdigital',
      instagram: '',
      facebook: '',
      youtube: ''
    },
    metaTitle: 'Cydex Digital | Digital Solutions & Technology Agency',
    metaDescription: 'Building Ideas Into Reality with premier web, mobile, UI/UX, and custom software engineering.',
    maintenanceMode: false
  });

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const res = await adminService.getSettings();
      if (res.data) {
        setSettings((prev) => ({
          ...prev,
          ...res.data,
          socialLinks: { ...prev.socialLinks, ...(res.data.socialLinks || {}) }
        }));
      }
    } catch (err) {
      toast.error('Failed to load application settings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleChange = (field, value) => {
    setSettings((prev) => ({ ...prev, [field]: value }));
  };

  const handleSocialChange = (network, value) => {
    setSettings((prev) => ({
      ...prev,
      socialLinks: { ...prev.socialLinks, [network]: value }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      await adminService.updateSettings(settings);
      toast.success('Website settings saved successfully');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-24 flex justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  const tabs = [
    { id: 'general', label: 'General & Hero', icon: Sparkles },
    { id: 'contact', label: 'Contact Info', icon: Mail },
    { id: 'social', label: 'Social Media', icon: Share2 },
    { id: 'seo', label: 'SEO & Mission', icon: Globe }
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Settings className="w-6 h-6 text-cydex-turquoise" />
            Website & Agency Settings
          </h1>
          <p className="text-sm text-gray-400">
            Configure dynamic global copy, contact details, social links, and metadata.
          </p>
        </div>

        <Button onClick={handleSubmit} disabled={saving} className="flex items-center gap-2">
          <Save className="w-4 h-4" />
          {saving ? 'Saving...' : 'Save Settings'}
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-cydex-teal/20 gap-2 overflow-x-auto pb-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-t-lg transition-colors whitespace-nowrap ${
                isActive
                  ? 'bg-[#0b1f26] text-cydex-turquoise border-b-2 border-cydex-turquoise'
                  : 'text-gray-400 hover:text-white hover:bg-[#0b1f26]/50'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Form Content */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* General & Hero Tab */}
        {activeTab === 'general' && (
          <div className="bg-[#0b1f26] border border-cydex-teal/20 rounded-xl p-6 space-y-6">
            <h2 className="text-lg font-semibold text-white">Brand & Hero Section Content</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">Company Name</label>
                <input
                  type="text"
                  value={settings.companyName}
                  onChange={(e) => handleChange('companyName', e.target.value)}
                  className="w-full bg-[#06161B] border border-cydex-teal/30 rounded-lg px-3 py-2 text-white text-sm focus:border-cydex-turquoise focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">Tagline</label>
                <input
                  type="text"
                  value={settings.tagline}
                  onChange={(e) => handleChange('tagline', e.target.value)}
                  className="w-full bg-[#06161B] border border-cydex-teal/30 rounded-lg px-3 py-2 text-white text-sm focus:border-cydex-turquoise focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">Brand Message / Summary</label>
              <textarea
                rows={2}
                value={settings.brandMessage}
                onChange={(e) => handleChange('brandMessage', e.target.value)}
                className="w-full bg-[#06161B] border border-cydex-teal/30 rounded-lg px-3 py-2 text-white text-sm focus:border-cydex-turquoise focus:outline-none"
              />
            </div>

            <div className="pt-4 border-t border-cydex-teal/10 space-y-4">
              <h3 className="text-sm font-semibold text-cydex-turquoise">Homepage Hero Section</h3>

              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">Hero Headline</label>
                <input
                  type="text"
                  value={settings.heroHeadline}
                  onChange={(e) => handleChange('heroHeadline', e.target.value)}
                  className="w-full bg-[#06161B] border border-cydex-teal/30 rounded-lg px-3 py-2 text-white text-sm focus:border-cydex-turquoise focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">Hero Supporting Text</label>
                <textarea
                  rows={2}
                  value={settings.heroSubheadline}
                  onChange={(e) => handleChange('heroSubheadline', e.target.value)}
                  className="w-full bg-[#06161B] border border-cydex-teal/30 rounded-lg px-3 py-2 text-white text-sm focus:border-cydex-turquoise focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">Primary CTA Button Text</label>
                  <input
                    type="text"
                    value={settings.primaryCtaText}
                    onChange={(e) => handleChange('primaryCtaText', e.target.value)}
                    className="w-full bg-[#06161B] border border-cydex-teal/30 rounded-lg px-3 py-2 text-white text-sm focus:border-cydex-turquoise focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">Secondary CTA Button Text</label>
                  <input
                    type="text"
                    value={settings.secondaryCtaText}
                    onChange={(e) => handleChange('secondaryCtaText', e.target.value)}
                    className="w-full bg-[#06161B] border border-cydex-teal/30 rounded-lg px-3 py-2 text-white text-sm focus:border-cydex-turquoise focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Contact Info Tab */}
        {activeTab === 'contact' && (
          <div className="bg-[#0b1f26] border border-cydex-teal/20 rounded-xl p-6 space-y-4">
            <h2 className="text-lg font-semibold text-white">Agency Contact & Inquiries</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-cydex-turquoise" /> Primary Contact Email
                </label>
                <input
                  type="email"
                  value={settings.contactEmail}
                  onChange={(e) => handleChange('contactEmail', e.target.value)}
                  className="w-full bg-[#06161B] border border-cydex-teal/30 rounded-lg px-3 py-2 text-white text-sm focus:border-cydex-turquoise focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-cydex-turquoise" /> Client Support Email
                </label>
                <input
                  type="email"
                  value={settings.supportEmail}
                  onChange={(e) => handleChange('supportEmail', e.target.value)}
                  className="w-full bg-[#06161B] border border-cydex-teal/30 rounded-lg px-3 py-2 text-white text-sm focus:border-cydex-turquoise focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-cydex-turquoise" /> Phone Number
                </label>
                <input
                  type="text"
                  value={settings.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  className="w-full bg-[#06161B] border border-cydex-teal/30 rounded-lg px-3 py-2 text-white text-sm focus:border-cydex-turquoise focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">Operating Hours</label>
                <input
                  type="text"
                  value={settings.operatingHours}
                  onChange={(e) => handleChange('operatingHours', e.target.value)}
                  className="w-full bg-[#06161B] border border-cydex-teal/30 rounded-lg px-3 py-2 text-white text-sm focus:border-cydex-turquoise focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-cydex-turquoise" /> Agency Address / Location
              </label>
              <input
                type="text"
                value={settings.address}
                onChange={(e) => handleChange('address', e.target.value)}
                className="w-full bg-[#06161B] border border-cydex-teal/30 rounded-lg px-3 py-2 text-white text-sm focus:border-cydex-turquoise focus:outline-none"
              />
            </div>
          </div>
        )}

        {/* Social Media Tab */}
        {activeTab === 'social' && (
          <div className="bg-[#0b1f26] border border-cydex-teal/20 rounded-xl p-6 space-y-4">
            <h2 className="text-lg font-semibold text-white">Social Media Links</h2>
            <p className="text-xs text-gray-400">These will appear in the website footer and contact channels.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">LinkedIn</label>
                <input
                  type="url"
                  value={settings.socialLinks?.linkedin || ''}
                  onChange={(e) => handleSocialChange('linkedin', e.target.value)}
                  placeholder="https://linkedin.com/company/..."
                  className="w-full bg-[#06161B] border border-cydex-teal/30 rounded-lg px-3 py-2 text-white text-sm focus:border-cydex-turquoise focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">Twitter / X</label>
                <input
                  type="url"
                  value={settings.socialLinks?.twitter || ''}
                  onChange={(e) => handleSocialChange('twitter', e.target.value)}
                  placeholder="https://x.com/..."
                  className="w-full bg-[#06161B] border border-cydex-teal/30 rounded-lg px-3 py-2 text-white text-sm focus:border-cydex-turquoise focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">GitHub</label>
                <input
                  type="url"
                  value={settings.socialLinks?.github || ''}
                  onChange={(e) => handleSocialChange('github', e.target.value)}
                  placeholder="https://github.com/..."
                  className="w-full bg-[#06161B] border border-cydex-teal/30 rounded-lg px-3 py-2 text-white text-sm focus:border-cydex-turquoise focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">Instagram</label>
                <input
                  type="url"
                  value={settings.socialLinks?.instagram || ''}
                  onChange={(e) => handleSocialChange('instagram', e.target.value)}
                  placeholder="https://instagram.com/..."
                  className="w-full bg-[#06161B] border border-cydex-teal/30 rounded-lg px-3 py-2 text-white text-sm focus:border-cydex-turquoise focus:outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* SEO & Mission Tab */}
        {activeTab === 'seo' && (
          <div className="bg-[#0b1f26] border border-cydex-teal/20 rounded-xl p-6 space-y-4">
            <h2 className="text-lg font-semibold text-white">Mission, Vision & SEO</h2>

            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">Mission Statement</label>
              <textarea
                rows={2}
                value={settings.missionStatement}
                onChange={(e) => handleChange('missionStatement', e.target.value)}
                className="w-full bg-[#06161B] border border-cydex-teal/30 rounded-lg px-3 py-2 text-white text-sm focus:border-cydex-turquoise focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">Vision Statement</label>
              <textarea
                rows={2}
                value={settings.visionStatement}
                onChange={(e) => handleChange('visionStatement', e.target.value)}
                className="w-full bg-[#06161B] border border-cydex-teal/30 rounded-lg px-3 py-2 text-white text-sm focus:border-cydex-turquoise focus:outline-none"
              />
            </div>

            <div className="pt-4 border-t border-cydex-teal/10 space-y-4">
              <h3 className="text-sm font-semibold text-cydex-turquoise">Search Engine Optimization</h3>

              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">Global Meta Title</label>
                <input
                  type="text"
                  value={settings.metaTitle}
                  onChange={(e) => handleChange('metaTitle', e.target.value)}
                  className="w-full bg-[#06161B] border border-cydex-teal/30 rounded-lg px-3 py-2 text-white text-sm focus:border-cydex-turquoise focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">Global Meta Description</label>
                <textarea
                  rows={2}
                  value={settings.metaDescription}
                  onChange={(e) => handleChange('metaDescription', e.target.value)}
                  className="w-full bg-[#06161B] border border-cydex-teal/30 rounded-lg px-3 py-2 text-white text-sm focus:border-cydex-turquoise focus:outline-none"
                />
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-end pt-2">
          <Button type="submit" disabled={saving} className="flex items-center gap-2">
            <Save className="w-4 h-4" />
            {saving ? 'Saving...' : 'Save Settings'}
          </Button>
        </div>
      </form>
    </div>
  );
}
