"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { OneIconSVG, TwoIconSVG } from "../ui/icones";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { useAppLauncher } from "@/hooks/useAppLauncher";
import { useAppStore } from "@/hooks/useAppStore";

interface InvitationCardProps {
  invitationCode?: string;
  className?: string;
}

type CardState = "expanded" | "collapsed";

const COLLAPSED_VISIBLE_HEIGHT = 70;
const MAX_DRAG_DISTANCE = 220;
const TAP_DISTANCE = 6;
const DRAG_VELOCITY_BREAKPOINT = 0.5;
const FAST_THRESHOLD = 50;
const SLOW_THRESHOLD = 80;
const COLLAPSED_TRANSLATE = `100% - ${COLLAPSED_VISIBLE_HEIGHT}px`;

export const InvitationCard: React.FC<InvitationCardProps> = ({ invitationCode = "-", className = "" }) => {
  const t = useTranslations("invitation");

  const [urlCode] = useState<string>(() => {
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
    toast("Opening app or store...", { position: "top-center", className: "bg-[#1c1917]! text-white!" });
    launchApp();
  }, [launchApp]);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (draggingRef.current) return;

      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.pageYOffset || document.documentElement.scrollTop;
          const scrollDiff = currentScrollY - lastScrollY.current;

          if (Math.abs(scrollDiff) > 5) {
            if (currentScrollY > 100 && scrollDiff > 0) {
              setCardState("collapsed");
            } else if (scrollDiff < 0) {
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

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
    touchCurrentY.current = e.touches[0].clientY;
    setIsDragging(true);
    draggingRef.current = true;
    tapHandledRef.current = false;
  }, []);

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (!isDragging) return;

      touchCurrentY.current = e.touches[0].clientY;
      const diff = touchStartY.current - touchCurrentY.current;

      if (cardState === "collapsed" && diff > 0) {
        setDragOffset(Math.min(diff, MAX_DRAG_DISTANCE));
      } else if (cardState === "expanded" && diff < 0) {
        setDragOffset(Math.max(diff, -MAX_DRAG_DISTANCE));
      }
    },
    [isDragging, cardState]
  );

  const handleTouchEnd = useCallback(() => {
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
  }, [cardState, toggleCardState]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    touchStartY.current = e.clientY;
    touchCurrentY.current = e.clientY;
    setIsDragging(true);
    draggingRef.current = true;
    tapHandledRef.current = false;
  }, []);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging) return;

      touchCurrentY.current = e.clientY;
      const diff = touchStartY.current - touchCurrentY.current;

      if (cardState === "collapsed" && diff > 0) {
        setDragOffset(Math.min(diff, MAX_DRAG_DISTANCE));
      } else if (cardState === "expanded" && diff < 0) {
        setDragOffset(Math.max(diff, -MAX_DRAG_DISTANCE));
      }
    },
    [isDragging, cardState]
  );

  const handleMouseUp = useCallback(() => {
    if (!isDragging) return;

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
  }, [isDragging, cardState, toggleCardState]);

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
    const base = cardState === "collapsed" ? COLLAPSED_TRANSLATE : "0px";

    if (isDragging) {
      return `translateY(calc(${base} - ${dragOffset}px))`;
    }

    return cardState === "collapsed" ? `translateY(calc(${base}))` : "translateY(0)";
  };

  return (
    <div
      ref={containerRef}
      className={`fixed bottom-0 z-50 flex justify-center ${className}`}
      style={{
        maxWidth: "428px",
        width: "calc(100% - 32px)",
        left: "50%",
        transform: "translateX(-50%)",
      }}
    >
      <div
        ref={cardRef}
        className="bg-[#ffc226] flex flex-col w-full rounded-t-2xl shadow-[0px_-4px_24px_0px_rgba(0,0,0,0.12)]"
        style={{
          transform: getTransform(),
          transition: isDragging ? "none" : "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          willChange: "transform",
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
          onClick={(e) => {
            e.preventDefault();
            if (!tapHandledRef.current) {
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
    </div>
  );
};
