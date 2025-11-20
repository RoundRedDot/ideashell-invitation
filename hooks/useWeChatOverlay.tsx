'use client';

import { useState, useCallback } from 'react';
import { useIsWeChat } from '@/contexts/UserAgentContext';
import { useTranslations } from 'next-intl';
import { createPortal } from 'react-dom';

/**
 * Hook for handling WeChat-specific interactions
 * Returns boolean for whether WeChat overlay should be shown,
 * handler function to check environment, and the Overlay component
 */
export function useWeChatOverlay() {
  const [showOverlay, setShowOverlay] = useState(false);
  const isWeChat = useIsWeChat();
  const t = useTranslations('invitation.wechatGuide');
  // Use state lazy initialization to avoid hydration mismatch check effect
  const [mounted] = useState(() => typeof window !== 'undefined');

  const checkWeChat = useCallback((): boolean => {
    if (isWeChat) {
      setShowOverlay(true);
      return true;
    }
    return false;
  }, [isWeChat]);

  const WeChatOverlay = useCallback(() => {
    if (!showOverlay || !mounted) return null;

    // Use createPortal to render outside of parent stacking contexts (like transforms)
    if (typeof document === 'undefined') return null;
    
    return createPortal(
      <div 
        className="fixed inset-0 z-100 flex flex-col items-end p-4 bg-black/80 backdrop-blur-sm cursor-pointer"
        onClick={() => setShowOverlay(false)}
      >
        <div className="mr-4 mt-2 flex flex-col items-end">
          <svg 
            width="80" 
            height="80" 
            viewBox="0 0 100 100" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            className="text-white mb-4 animate-bounce"
          >
            <path 
              d="M60 10 L90 20 L80 50" 
              stroke="currentColor" 
              strokeWidth="4" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
            <path 
              d="M90 20 C 90 20 50 40 30 90" 
              stroke="currentColor" 
              strokeWidth="4" 
              strokeLinecap="round" 
              strokeDasharray="10 10"
            />
          </svg>
          <div className="text-white text-lg font-bold space-y-2 text-right">
            <p>{t('title')}</p>
            <p>{t('subtitle')}</p>
          </div>
        </div>
      </div>,
      document.body
    );
  }, [showOverlay, mounted, t]);

  return {
    checkWeChat,
    WeChatOverlay
  };
}
