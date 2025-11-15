import React from 'react';
import { Twitter, MessageCircle, Facebook, Instagram, Calendar, User } from 'lucide-react';
import GlassCard from './GlassCard';

/**
 * URLPreviewCard Component
 * Displays extracted social media post preview
 * @param {string} platform - 'Twitter' | 'Reddit' | 'Instagram' | 'Facebook'
 * @param {string} author - Username/handle
 * @param {string} date - Post date
 * @param {string} content - Extracted post content
 * @param {function} onAnalyze - Callback to analyze content
 */
const URLPreviewCard = ({ platform, author, date, content, onAnalyze }) => {
  const platformIcons = {
    Twitter: <Twitter size={20} className="text-accent-primary" />,
    Reddit: <MessageCircle size={20} className="text-accent-primary" />,
    Instagram: <Instagram size={20} className="text-accent-primary" />,
    Facebook: <Facebook size={20} className="text-accent-primary" />,
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown date';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <GlassCard className="mt-4 animate-fade-in">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-text-primary">Post Preview</h3>
          <div className="flex items-center gap-2">
            {platformIcons[platform] || platformIcons.Twitter}
            <span className="text-text-secondary text-sm font-medium">{platform}</span>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <User size={16} className="text-text-tertiary" />
            <span className="text-text-secondary text-sm">
              <span className="font-medium">{author || 'Unknown author'}</span>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Calendar size={16} className="text-text-tertiary" />
            <span className="text-text-secondary text-sm">{formatDate(date)}</span>
          </div>

          <div className="mt-4 p-4 bg-bg-secondary rounded-12 border border-border-subtle">
            <p className="text-text-primary text-sm leading-relaxed whitespace-pre-wrap">
              {content || 'No content extracted'}
            </p>
          </div>
        </div>

        {onAnalyze && (
          <button
            onClick={onAnalyze}
            className="w-full btn-primary mt-4"
          >
            Analyze This Content
          </button>
        )}
      </div>
    </GlassCard>
  );
};

export default URLPreviewCard;
