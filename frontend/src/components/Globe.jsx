import React, { useEffect, useRef } from "react";
import createGlobe from "cobe";

export default function Globe({ size = 480 }) {
  const canvasRef = useRef(null);
  const phiRef = useRef(0);
  const pointerRef = useRef({ down: false, x: 0 });

  useEffect(() => {
    let width = size;
    const onResize = () => {
      if (canvasRef.current) width = canvasRef.current.offsetWidth;
    };
    window.addEventListener("resize", onResize);
    onResize();

    const globe = createGlobe(canvasRef.current, {
      devicePixelRatio: 2,
      width: width * 2,
      height: width * 2,
      phi: 0,
      theta: 0.3,
      dark: 1,
      diffuse: 1.2,
      mapSamples: 16000,
      mapBrightness: 6,
      baseColor: [0.15, 0.18, 0.24],
      markerColor: [0.02, 0.71, 0.83],
      glowColor: [0.02, 0.71, 0.83],
      markers: [
        { location: [51.4556, 7.0116], size: 0.08 },
        { location: [52.52, 13.405], size: 0.05 },
        { location: [48.1351, 11.582], size: 0.05 },
        { location: [40.7128, -74.006], size: 0.04 },
        { location: [35.6762, 139.6503], size: 0.04 },
        { location: [-33.8688, 151.2093], size: 0.04 },
      ],
      onRender: (state) => {
        if (!pointerRef.current.down) {
          phiRef.current += 0.0032;
        }
        state.phi = phiRef.current;
        state.width = width * 2;
        state.height = width * 2;
      },
    });

    return () => {
      globe.destroy();
      window.removeEventListener("resize", onResize);
    };
  }, [size]);

  const handlePointerDown = (e) => {
    pointerRef.current.down = true;
    pointerRef.current.x = e.clientX ?? e.touches?.[0]?.clientX ?? 0;
    canvasRef.current.style.cursor = "grabbing";
  };

  const handlePointerUp = () => {
    pointerRef.current.down = false;
    if (canvasRef.current) canvasRef.current.style.cursor = "grab";
  };

  const handlePointerMove = (e) => {
    if (!pointerRef.current.down) return;
    const clientX = e.clientX ?? e.touches?.[0]?.clientX ?? 0;
    const delta = clientX - pointerRef.current.x;
    phiRef.current += delta * 0.005;
    pointerRef.current.x = clientX;
  };

  return (
    <div style={{ width: "100%", maxWidth: size, aspectRatio: 1, margin: "0 auto", position: "relative" }}>
      <canvas
        ref={canvasRef}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerOut={handlePointerUp}
        onPointerMove={handlePointerMove}
        onTouchStart={handlePointerDown}
        onTouchEnd={handlePointerUp}
        onTouchMove={handlePointerMove}
        style={{ width: "100%", height: "100%", cursor: "grab", contain: "layout paint size" }}
      />
    </div>
  );
}