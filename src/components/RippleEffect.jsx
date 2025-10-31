"use client";
import { useEffect, useRef } from "react";

export default function RippleEffect({
  className = "",
  style = {},
  options = {},
  autoDrops = true,
  dropIntervalMs = 1400,
}) {
  const rippleRef = useRef(null);

  useEffect(() => {
    let destroy = () => {};
    let intervalId = null;

    async function initRipples() {
      if (!rippleRef.current) return;
      try {
        const jQueryModule = await import("jquery");
        const jq = jQueryModule.default || jQueryModule;
        // Ensure plugin augments the same global jQuery instance
        if (typeof window !== "undefined") {
          // @ts-ignore
          window.jQuery = jq;
          // @ts-ignore
          window.$ = jq;
        }
        await import("jquery.ripples");
        const $el = jq(rippleRef.current);
        if (typeof $el.ripples === "function") {
          $el.ripples({
            resolution: 512,
            dropRadius: 50,
            perturbance: 0.02,
            ...options,
          });

          if (autoDrops) {
            const el = rippleRef.current;
            const getSize = () => ({
              w: el?.clientWidth || 0,
              h: el?.clientHeight || 0,
            });
            intervalId = window.setInterval(() => {
              const { w, h } = getSize();
              if (!w || !h) return;
              const x = Math.random() * w;
              const y = Math.random() * h;
              const radius = 20 + Math.random() * 40; // 20-60
              const strength = 0.01 + Math.random() * 0.03; // 0.01-0.04
              try {
                $el.ripples("drop", x, y, radius, strength);
              } catch {}
            }, Math.max(400, dropIntervalMs));
          }
          destroy = () => {
            try {
              $el.ripples("destroy");
            } catch {}
          };
        }
      } catch (e) {
        console.error("Error al inicializar Ripple:", e);
      }
    }

    initRipples();

    return () => {
      if (intervalId) window.clearInterval(intervalId);
      destroy();
    };
  }, []);

  return (
    <div
      ref={rippleRef}
      className={`absolute inset-0 ${className}`}
      style={{ width: "100%", height: "100%", ...style }}
    ></div>
  );
}
