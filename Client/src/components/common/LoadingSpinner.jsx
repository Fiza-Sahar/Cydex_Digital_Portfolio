import React from 'react';
import { Loader2 } from 'lucide-react';

export const LoadingSpinner = ({ label = 'Loading Cydex Digital...', fullScreen = false }) => {
  const content = (
    <div className="flex flex-col items-center justify-center p-8 text-center space-y-4">
      <div className="relative flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-2 border-[#143542] border-t-[#0AE3DA] animate-spin" />
        <div className="absolute w-3 h-3 rounded-full bg-[#03A094] animate-pulse" />
      </div>
      {label && <p className="text-sm font-medium text-[#E5E7E7]/70 font-sans tracking-wide">{label}</p>}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="min-h-screen bg-[#06161B] flex items-center justify-center">
        {content}
      </div>
    );
  }

  return content;
};

export default LoadingSpinner;

