import React, { useState, useEffect, useRef } from 'react';
import { adminService } from '../../services/adminService';
import Button from '../../components/common/Button';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { Image, Upload, Trash2, Copy, Check, Search, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminMedia() {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedUrl, setCopiedUrl] = useState(null);
  const fileInputRef = useRef(null);

  const fetchMedia = async () => {
    try {
      setLoading(true);
      const res = await adminService.getMedia();
      setAssets(res.data || []);
    } catch (err) {
      toast.error('Failed to load media assets');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', file.name);

    try {
      setUploading(true);
      await adminService.uploadMedia(formData);
      toast.success('Media uploaded successfully');
      if (fileInputRef.current) fileInputRef.current.value = '';
      fetchMedia();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const copyToClipboard = (url) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    toast.success('URL copied to clipboard');
    setTimeout(() => setCopiedUrl(null), 2500);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await adminService.deleteMedia(deleteId);
      toast.success('Media asset deleted');
      setDeleteId(null);
      fetchMedia();
    } catch (err) {
      toast.error('Failed to delete asset');
    }
  };

  const filteredAssets = assets.filter((asset) => {
    const term = searchTerm.toLowerCase();
    return (
      (asset.title && asset.title.toLowerCase().includes(term)) ||
      (asset.originalName && asset.originalName.toLowerCase().includes(term)) ||
      (asset.mimeType && asset.mimeType.toLowerCase().includes(term))
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Image className="w-6 h-6 text-cydex-turquoise" />
            Media Library
          </h1>
          <p className="text-sm text-gray-400">
            Upload images, banners, and icons for use in services, portfolio, and blog articles.
          </p>
        </div>

        <div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept="image/*"
            className="hidden"
          />
          <Button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="flex items-center gap-2"
          >
            <Upload className="w-4 h-4" />
            {uploading ? 'Uploading...' : 'Upload Image'}
          </Button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search media by title or filename..."
          className="w-full bg-[#0b1f26] border border-cydex-teal/20 rounded-lg pl-9 pr-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-cydex-turquoise"
        />
      </div>

      {/* Media Grid */}
      {loading ? (
        <div className="py-20 flex justify-center"><LoadingSpinner /></div>
      ) : filteredAssets.length === 0 ? (
        <div className="bg-[#0b1f26] border border-cydex-teal/20 rounded-xl p-12 text-center text-gray-400">
          <Image className="w-12 h-12 mx-auto text-gray-600 mb-3" />
          <p className="text-lg font-medium text-white">No media assets found</p>
          <p className="text-sm mt-1">Click "Upload Image" to add files to your library.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredAssets.map((asset) => (
            <div
              key={asset._id}
              className="bg-[#0b1f26] border border-cydex-teal/20 rounded-xl overflow-hidden group hover:border-cydex-turquoise/40 transition-all flex flex-col justify-between"
            >
              <div className="relative aspect-video bg-[#06161B] overflow-hidden flex items-center justify-center">
                <img
                  src={asset.url}
                  alt={asset.title || asset.originalName}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80';
                  }}
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button
                    onClick={() => copyToClipboard(asset.url)}
                    className="p-2 bg-cydex-dark rounded-full text-white hover:text-cydex-turquoise transition-colors"
                    title="Copy Image URL"
                  >
                    {copiedUrl === asset.url ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                  <a
                    href={asset.url}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 bg-cydex-dark rounded-full text-white hover:text-cydex-turquoise transition-colors"
                    title="Open Full Image"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>

              <div className="p-3">
                <p className="text-xs font-semibold text-white truncate" title={asset.title || asset.originalName}>
                  {asset.title || asset.originalName}
                </p>
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-cydex-teal/10 text-[10px] text-gray-400">
                  <span>{asset.size ? `${(asset.size / 1024).toFixed(1)} KB` : 'Asset'}</span>
                  <button
                    onClick={() => setDeleteId(asset._id)}
                    className="text-gray-500 hover:text-red-400 transition-colors p-1"
                    title="Delete Asset"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={Boolean(deleteId)}
        title="Delete Media Asset"
        message="Are you sure you want to delete this media file? Any articles or services linking directly to this file might experience broken imagery."
        confirmLabel="Delete Asset"
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
