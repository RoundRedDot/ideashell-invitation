"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { OneIconSVG, TwoIconSVG } from "../ui/icones";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { useAppLauncher } from "@/hooks/useAppLauncher";
import { useAppStore } from "@/hooks/useAppStore";
import { useWeChatOverlay } from "@/hooks/useWeChatOverlay";

interface InvitationCardProps {
  invitationCode?: string;
  className?: string;
}

type CardState = "expanded" | "collapsed";

const COLLAPSED_VISIBLE_HEIGHT = 70;
const BOTTOM_MARGIN = 24;
const MAX_DRAG_DISTANCE = 220;
const TAP_DISTANCE = 6;
const DRAG_VELOCITY_BREAKPOINT = 0.5;
const FAST_THRESHOLD = 50;
const SLOW_THRESHOLD = 80;

export const InvitationCard: React.FC<InvitationCardProps> = ({ invitationCode = "-", className = "" }) => {
  const t = useTranslations("invitation");

  const { checkWeChat, WeChatOverlay } = useWeChatOverlay();

  // Get code from URL on client side only, avoiding useEffect state update pattern
  const [urlCode] = useState<string>(() => {
    if (typeof window === 'undefined') return "";
    try {
      const qs = new URLSearchParams(window.location.search);
      return qs.get("code") || "";
    } catch {
      return "";
    }
  });
  const [cardState, setCardState] = useState<CardState>("expanded");
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const [distanceToBottom, setDistanceToBottom] = useState<number | null>(null);
  const [cardHeight, setCardHeight] = useState(0);

  const toggleCardState = useCallback(() => {
    setCardState((prev) => (prev === "collapsed" ? "expanded" : "collapsed"));
  }, []);

  const touchStartY = useRef<number>(0);
  const touchCurrentY = useRef<number>(0);
  const lastScrollY = useRef<number>(0);
  const draggingRef = useRef(false);
  const tapHandledRef = useRef(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const resolvedCode = invitationCode && invitationCode !== "-" ? invitationCode : urlCode || "-";

  // Use app launcher hook for app launching with fallback
  const { launch: launchApp } = useAppLauncher({
    deepLinkParams: resolvedCode && resolvedCode !== "-" ? { code: resolvedCode } : undefined,
    onSuccess: () => {
      console.log("App launched successfully");
    },
    onFallback: () => {
      console.log("Redirected to app store");
    },
  });

  // Use app store hook for direct store opening
  const { openStore, isAvailable: storeAvailable } = useAppStore({
    onOpen: (platform) => {
      console.log(`Opening ${platform} store`);
    },
  });

  const handleCopyCode = useCallback(() => {
    if (!resolvedCode) return;
    navigator.clipboard
      .writeText(resolvedCode)
      .then(() => {
        toast.success(t("copiedButton"), { position: "top-center", className: "bg-[#1c1917]! text-white!" });
      })
      .catch(() => {
        // Best effort: ignore copy failures
      });
  }, [resolvedCode, t]);

  const handleClaim = useCallback(() => {
    if (checkWeChat()) return;
    
    toast("Opening app or store...", { position: "top-center", className: "bg-[#1c1917]! text-white!" });
    launchApp();
  }, [launchApp, checkWeChat]);

  // Measure card height on mount and resize
  useEffect(() => {
    const updateHeight = () => {
      if (cardRef.current) {
        setCardHeight(cardRef.current.offsetHeight);
      }
    };

    updateHeight();
    window.addEventListener("resize", updateHeight);
    return () => window.removeEventListener("resize", updateHeight);
  }, []);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (draggingRef.current) return;

      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.pageYOffset || document.documentElement.scrollTop;
          const scrollDiff = currentScrollY - lastScrollY.current;

          // Check if we are at the bottom of the page
          const windowHeight = window.innerHeight;
          const documentHeight = document.documentElement.scrollHeight;
          const dist = documentHeight - (currentScrollY + windowHeight);

          // Docking logic:
          // If we are close to bottom, we want to track precise distance
          // We only care if the distance is less than the collapsed translation amount (approx height - 70)
          // plus a buffer to ensure smooth entry.
          const collapsedTranslation = cardRef.current ? cardRef.current.offsetHeight + BOTTOM_MARGIN - COLLAPSED_VISIBLE_HEIGHT : 200;

          if (dist < collapsedTranslation + 20) {
            setDistanceToBottom(dist);
          } else {
            setDistanceToBottom(null);
          }

          if (Math.abs(scrollDiff) > 5) {
            // Only change state if we are NOT in the docking zone (to avoid fighting)
            // OR if we are scrolling UP (always allow expanding)
            if (dist > collapsedTranslation) {
              if (currentScrollY > 100 && scrollDiff > 0) {
                setCardState("collapsed");
              } else if (scrollDiff < 0) {
                setCardState("expanded");
              }
            } else if (scrollDiff < 0) {
              // Even in docking zone, if scrolling up, ensure we are expanded logic-wise
              // though visual override might still apply if very close to bottom,
              // but actually if we scroll up, dist increases, so we eventually exit docking zone.
              setCardState("expanded");
            }

            lastScrollY.current = currentScrollY;
          }

          ticking = false;
        });

        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Docking logic
  const collapsedTranslation = cardHeight ? cardHeight + BOTTOM_MARGIN - COLLAPSED_VISIBLE_HEIGHT : 0;
  const isDocked = distanceToBottom !== null && distanceToBottom < collapsedTranslation + 20;

  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      if (isDocked) return;
      touchStartY.current = e.touches[0].clientY;
      touchCurrentY.current = e.touches[0].clientY;
      setIsDragging(true);
      draggingRef.current = true;
      tapHandledRef.current = false;
    },
    [isDocked]
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (!isDragging || isDocked) return;

      touchCurrentY.current = e.touches[0].clientY;
      const diff = touchStartY.current - touchCurrentY.current;

      if (cardState === "collapsed" && diff > 0) {
        setDragOffset(Math.min(diff, MAX_DRAG_DISTANCE));
      } else if (cardState === "expanded" && diff < 0) {
        setDragOffset(Math.max(diff, -MAX_DRAG_DISTANCE));
      }
    },
    [isDragging, cardState, isDocked]
  );

  const handleTouchEnd = useCallback(() => {
    if (isDocked) return;
    setIsDragging(false);
    draggingRef.current = false;

    const dragDistance = touchStartY.current - touchCurrentY.current;
    const isTap = Math.abs(dragDistance) < TAP_DISTANCE;
    const dragVelocity = Math.abs(dragDistance) / 100;
    const threshold = dragVelocity > DRAG_VELOCITY_BREAKPOINT ? FAST_THRESHOLD : SLOW_THRESHOLD;

    if (isTap) {
      toggleCardState();
    } else if (cardState === "collapsed" && dragDistance > threshold) {
      setCardState("expanded");
    } else if (cardState === "expanded" && dragDistance < -threshold) {
      setCardState("collapsed");
    }

    tapHandledRef.current = true;

    setDragOffset(0);
    touchStartY.current = 0;
    touchCurrentY.current = 0;
  }, [cardState, toggleCardState, isDocked]);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (isDocked) return;
      e.preventDefault();
      touchStartY.current = e.clientY;
      touchCurrentY.current = e.clientY;
      setIsDragging(true);
      draggingRef.current = true;
      tapHandledRef.current = false;
    },
    [isDocked]
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging || isDocked) return;

      touchCurrentY.current = e.clientY;
      const diff = touchStartY.current - touchCurrentY.current;

      if (cardState === "collapsed" && diff > 0) {
        setDragOffset(Math.min(diff, MAX_DRAG_DISTANCE));
      } else if (cardState === "expanded" && diff < 0) {
        setDragOffset(Math.max(diff, -MAX_DRAG_DISTANCE));
      }
    },
    [isDragging, cardState, isDocked]
  );

  const handleMouseUp = useCallback(() => {
    if (!isDragging || isDocked) return;

    setIsDragging(false);
    draggingRef.current = false;

    const dragDistance = touchStartY.current - touchCurrentY.current;
    const isTap = Math.abs(dragDistance) < TAP_DISTANCE;
    const dragVelocity = Math.abs(dragDistance) / 100;
    const threshold = dragVelocity > DRAG_VELOCITY_BREAKPOINT ? FAST_THRESHOLD : SLOW_THRESHOLD;

    if (isTap) {
      toggleCardState();
    } else if (cardState === "collapsed" && dragDistance > threshold) {
      setCardState("expanded");
    } else if (cardState === "expanded" && dragDistance < -threshold) {
      setCardState("collapsed");
    }

    tapHandledRef.current = true;

    setDragOffset(0);
    touchStartY.current = 0;
    touchCurrentY.current = 0;
  }, [isDragging, cardState, toggleCardState, isDocked]);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  const getTransform = () => {
    // Calculate the standard translation based on state
    // If collapsed, we translate down by (height - visible_height)
    // If expanded, we translate by 0
    const baseTranslation = cardState === "collapsed" ? collapsedTranslation : 0;

    let finalTranslation = baseTranslation;

    // Apply docking logic
    // If we are near bottom (distanceToBottom is set), the card should never be hidden more than distanceToBottom
    // This creates the effect of the card being "pushed up" by the bottom of the page
    if (distanceToBottom !== null && cardState === "collapsed") {
      finalTranslation = Math.min(baseTranslation, distanceToBottom);
    }

    // Apply drag offset
    if (isDragging) {
      finalTranslation -= dragOffset;
    }

    return `translateY(${finalTranslation}px)`;
  };

  // Disable transition when dragging OR when in docking mode (to prevent laggy scroll sync)
  const shouldDisableTransition = isDragging || (distanceToBottom !== null && cardState === "collapsed");

  return (
    <div
      ref={containerRef}
      className={`fixed bottom-4 z-50 flex justify-center ${className}`}
      style={{
        maxWidth: "428px",
        width: "calc(100% - 32px)",
        left: "50%",
        transform: "translateX(-50%)",
      }}
    >
      <div
        ref={cardRef}
        className="bg-[#ffc226] flex flex-col w-full rounded-2xl shadow-[0px_-4px_24px_0px_rgba(0,0,0,0.12)]"
        style={{
          transform: getTransform(),
          transition: shouldDisableTransition ? "none" : "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          willChange: "transform",
        }}
        role="region"
        aria-label="Invitation Card"
        data-state={cardState}
      >
        {/* Handle */}
        <div
          className="pt-3 pb-2 cursor-grab active:cursor-grabbing touch-none transition-opacity duration-300"
          style={{ opacity: isDocked ? 0 : 1, pointerEvents: isDocked ? "none" : "auto" }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleMouseDown}
          onClick={(e) => {
            e.preventDefault();
            if (!tapHandledRef.current && !isDocked) {
              toggleCardState();
              tapHandledRef.current = true;
            }
          }}
        >
          <div className="w-9 h-[5px] mx-auto bg-white/60 rounded-[100px]" />
        </div>

        <div className="px-4 pb-4 flex flex-col gap-4">
          <div className="border border-[rgba(0,0,0,0.1)] border-solid flex flex-col gap-3 p-3 rounded-lg w-full">
            <div
              className="flex flex-col h-[18px] justify-center text-[#ff4d23] text-[15px] font-bold w-full"
              style={{ fontFamily: "'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif" }}
            >
              <p className="leading-normal whitespace-pre-wrap">{t("title")}</p>
            </div>
            <div className="flex items-center justify-between w-full">
              <div className="flex gap-2 items-center">
                <div
                  className="flex flex-col justify-center text-2xl text-black font-semibold whitespace-nowrap"
                  style={{ fontFamily: "'New York', 'Times New Roman', serif" }}
                >
                  <p className="leading-normal" onClick={handleCopyCode}>
                    {resolvedCode}
                  </p>
                </div>
              </div>
              <button
                className="bg-[#1e1e1e] flex gap-2.5 h-8 items-center justify-center px-4 py-0 rounded-full overflow-clip"
                onClick={handleClaim}
              >
                <div
                  className="capitalize flex flex-col justify-center text-[13px] text-center text-white font-bold whitespace-nowrap"
                  style={{ fontFamily: "'SF Pro', -apple-system, BlinkMacSystemFont, sans-serif" }}
                >
                  <p className="leading-normal">{t("claimButton")}</p>
                </div>
              </button>
            </div>
          </div>

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
                    <span
                      className="underline decoration-solid [text-decoration-skip-ink:none] [text-underline-position:from-font] cursor-pointer hover:opacity-80"
                      onClick={() => {
                        if (checkWeChat()) return;

                        if (storeAvailable) {
                          openStore();
                        }
                      }}
                    >
                      {t("step1.action")}
                    </span>
                    <span>{t("step1.description")}</span>
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
                  <p className="leading-normal whitespace-pre-wrap">{t("step2.description")}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <WeChatOverlay />
    </div>
  );
};
