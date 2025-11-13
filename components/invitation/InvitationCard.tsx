"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { OneIconSVG, TwoIconSVG } from "../ui/icones";

interface InvitationCardProps {
  invitationCode?: string;
  className?: string;
}

type CardState = 'expanded' | 'collapsed';

export const InvitationCard: React.FC<InvitationCardProps> = ({ invitationCode = "ER56Y", className = "" }) => {
  const [copied, setCopied] = useState(false);
  const [cardState, setCardState] = useState<CardState>('expanded');
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  
  // Refs for tracking scroll and drag state
  const touchStartY = useRef<number>(0);
  const touchCurrentY = useRef<number>(0);
  const lastScrollY = useRef<number>(0);
  const cardRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleClaimCredits = () => {
    navigator.clipboard.writeText(invitationCode).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  // Scroll handler - auto collapse/expand based on scroll direction
  useEffect(() => {
    let ticking = false;
    
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.pageYOffset || document.documentElement.scrollTop;
          const scrollDiff = currentScrollY - lastScrollY.current;
          
          // Ignore small scrolls (debounce)
          if (Math.abs(scrollDiff) > 5) {
            if (currentScrollY > 100 && scrollDiff > 0) {
              // Scrolling down past threshold - collapse
              setCardState('collapsed');
            } else if (scrollDiff < 0) {
              // Scrolling up - expand
              setCardState('expanded');
            }
            
            lastScrollY.current = currentScrollY;
          }
          
          ticking = false;
        });
        
        ticking = true;
      }
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Touch handlers for manual drag
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
    touchCurrentY.current = e.touches[0].clientY;
    setIsDragging(true);
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isDragging) return;
    
    touchCurrentY.current = e.touches[0].clientY;
    const diff = touchStartY.current - touchCurrentY.current;
    
    // Allow dragging up when collapsed, or down when expanded
    if (cardState === 'collapsed' && diff > 0) {
      setDragOffset(Math.min(diff, 200));
    } else if (cardState === 'expanded' && diff < 0) {
      setDragOffset(Math.max(diff, -200));
    }
  }, [isDragging, cardState]);

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false);
    
    const dragDistance = touchStartY.current - touchCurrentY.current;
    const dragVelocity = Math.abs(dragDistance) / 100;
    
    // Determine threshold based on velocity (faster swipe = lower threshold)
    const threshold = dragVelocity > 0.5 ? 50 : 80;
    
    if (cardState === 'collapsed' && dragDistance > threshold) {
      setCardState('expanded');
    } else if (cardState === 'expanded' && dragDistance < -threshold) {
      setCardState('collapsed');
    }
    
    // Reset
    setDragOffset(0);
    touchStartY.current = 0;
    touchCurrentY.current = 0;
  }, [cardState]);

  // Mouse handlers for desktop testing
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    touchStartY.current = e.clientY;
    touchCurrentY.current = e.clientY;
    setIsDragging(true);
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return;
    
    touchCurrentY.current = e.clientY;
    const diff = touchStartY.current - touchCurrentY.current;
    
    if (cardState === 'collapsed' && diff > 0) {
      setDragOffset(Math.min(diff, 200));
    } else if (cardState === 'expanded' && diff < 0) {
      setDragOffset(Math.max(diff, -200));
    }
  }, [isDragging, cardState]);

  const handleMouseUp = useCallback(() => {
    if (!isDragging) return;
    
    setIsDragging(false);
    
    const dragDistance = touchStartY.current - touchCurrentY.current;
    const dragVelocity = Math.abs(dragDistance) / 100;
    const threshold = dragVelocity > 0.5 ? 50 : 80;
    
    if (cardState === 'collapsed' && dragDistance > threshold) {
      setCardState('expanded');
    } else if (cardState === 'expanded' && dragDistance < -threshold) {
      setCardState('collapsed');
    }
    
    setDragOffset(0);
    touchStartY.current = 0;
    touchCurrentY.current = 0;
  }, [isDragging, cardState]);

  // Add mouse event listeners
  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  // Calculate transform based on state and drag offset
  const getTransform = () => {
    if (isDragging) {
      const baseTransform = cardState === 'collapsed' ? 'calc(100% - 140px)' : '0';
      return `translateY(calc(${baseTransform} - ${dragOffset}px))`;
    }
    return cardState === 'collapsed' ? 'translateY(calc(100% - 140px))' : 'translateY(0)';
  };

  return (
    <div 
      ref={containerRef}
      className={`fixed bottom-0 left-0 right-0 z-50 flex justify-center ${className}`}
      style={{
        maxWidth: '428px',
        margin: '0 auto',
      }}
    >
      <div
        ref={cardRef}
        className="bg-[#ffc226] flex flex-col w-full rounded-t-2xl shadow-[0px_-4px_24px_0px_rgba(0,0,0,0.12)]"
        style={{
          transform: getTransform(),
          transition: isDragging ? 'none' : 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          willChange: 'transform',
        }}
        role="region"
        aria-label="Invitation Card"
        data-state={cardState}
      >
        {/* Handle */}
        <div
          className="pt-3 pb-2 cursor-grab active:cursor-grabbing touch-none"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleMouseDown}
        >
          <div className="w-9 h-[5px] bg-[rgba(0,0,0,0.3)] rounded-full mx-auto" />
        </div>

        {/* Content */}
        <div className="px-4 pb-4 flex flex-col gap-4">
          {/* Credits Card */}
          <div className="border border-[rgba(0,0,0,0.1)] border-solid flex flex-col gap-3 p-3 rounded-lg w-full">
            <div
              className="flex flex-col h-[18px] justify-center text-[#ff4d23] text-[15px] font-bold w-full"
              style={{ fontFamily: "'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif" }}
            >
              <p className="leading-normal whitespace-pre-wrap">Receive 100,000 AI Credits</p>
            </div>
            <div className="flex items-center justify-between w-full">
              <div className="flex gap-2 items-center">
                <div
                  className="flex flex-col justify-center text-2xl text-black font-semibold whitespace-nowrap"
                  style={{ fontFamily: "'New York', 'Times New Roman', serif" }}
                >
                  <p className="leading-normal">{invitationCode}</p>
                </div>
              </div>
              <button
                onClick={handleClaimCredits}
                className="bg-[#1e1e1e] flex gap-2.5 h-8 items-center justify-center px-4 py-0 rounded-full overflow-clip"
              >
                <div
                  className="capitalize flex flex-col justify-center text-[13px] text-center text-white font-bold whitespace-nowrap"
                  style={{ fontFamily: "'SF Pro', -apple-system, BlinkMacSystemFont, sans-serif" }}
                >
                  <p className="leading-normal">{copied ? "Copied!" : "Claim Credits"}</p>
                </div>
              </button>
            </div>
          </div>

          {/* Instructions */}
          <div className="flex flex-col gap-2 w-full">
            <div className="flex flex-col gap-2 w-full">
              <div className="flex gap-3 items-center text-white w-full">
                <div
                  className="flex flex-col justify-center items-center opacity-60 text-xl font-semibold whitespace-nowrap"
                  style={{ fontFamily: "'SF Pro', -apple-system, BlinkMacSystemFont, sans-serif" }}
                >
                  <OneIconSVG className="w-full h-full" />
                </div>
                <div
                  className="flex flex-col justify-center flex-1 text-sm font-medium"
                  style={{ fontFamily: "'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif" }}
                >
                  <p className="leading-normal whitespace-pre-wrap">
                    <span className="underline decoration-solid [text-decoration-skip-ink:none] [text-underline-position:from-font]">
                      Install
                    </span>
                    <span>{` ideaShell App`}</span>
                  </p>
                </div>
              </div>
              <div className="flex gap-3 items-center text-white w-full">
                <div
                  className="flex flex-col justify-center items-center opacity-60 text-xl font-semibold whitespace-nowrap"
                  style={{ fontFamily: "'SF Pro', -apple-system, BlinkMacSystemFont, sans-serif" }}
                >
                  <TwoIconSVG className="w-full h-full" />
                </div>
                <div
                  className="flex flex-col justify-center flex-1 text-sm font-medium"
                  style={{ fontFamily: "'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif" }}
                >
                  <p className="leading-normal whitespace-pre-wrap">
                    Back here and press Accept Invitation or enter the invitation code on the Settings/My Account page.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
