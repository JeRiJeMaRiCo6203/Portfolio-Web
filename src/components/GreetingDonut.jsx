import React, { useRef, useEffect, useMemo, useCallback } from 'react';

const baseGreetings = [
  { text: 'Hello!', lang: 'English' },
  { text: '你好！', lang: 'Mandarin' },
  //{ text: 'مرحبا!', lang: 'Arabic' },
  //{ text: '안녕하세요!', lang: 'Korean' },
  { text: 'Halo!', lang: 'Indonesian' },
  //{ text: 'こんにちは！', lang: 'Japanese' },
];

const RING_STEPS = 24;
const TUBE_ROWS = 4;
const RING_RADIUS = 1;
const DEFAULT_TILT = 55;
const FOCAL_LENGTH = 3;
const TILT_MIN = 15;
const TILT_MAX = 85;

const GreetingDonut = ({
  wobbleAngle = 45,
  wobbleDuration = 4,
  size = 300,
  tubeRatio = 0.4,
}) => {
  const containerRef = useRef(null);
  const labelsRef = useRef([]);
  const rafRef = useRef(null);

  const dragRef = useRef({
    isDragging: false,
    lastX: 0,
    lastY: 0,
    yawOffset: 0,
    tiltOffset: 0,
    yawVelocity: 0,
    tiltVelocity: 0,
    wobbleTime: 0,
    lastFrameTime: 0,
  });

  // Precompute torus surface points
  const points = useMemo(() => {
    const pts = [];
    const r = tubeRatio;
    for (let row = 0; row < TUBE_ROWS; row++) {
      const v = (row / TUBE_ROWS) * Math.PI * 2;
      const uOffset = (row % 2) * (Math.PI / RING_STEPS);
      for (let i = 0; i < RING_STEPS; i++) {
        const u = (i / RING_STEPS) * Math.PI * 2 + uOffset;
        const cosU = Math.cos(u);
        const sinU = Math.sin(u);
        const cosV = Math.cos(v);
        const sinV = Math.sin(v);

        pts.push({
          x: (RING_RADIUS + r * cosV) * cosU,
          y: r * sinV,
          z: (RING_RADIUS + r * cosV) * sinU,
          nx: cosV * cosU,
          ny: sinV,
          nz: cosV * sinU,
          greetingIndex: (i + row * 2) % baseGreetings.length,
        });
      }
    }
    return pts;
  }, [tubeRatio]);

  // Animation loop
  useEffect(() => {
    const drag = dragRef.current;
    const reducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    const animate = (time) => {
      const container = containerRef.current;
      if (!container) {
        rafRef.current = requestAnimationFrame(animate);
        return;
      }

      const containerWidth = container.clientWidth;
      const containerHeight = container.clientHeight;
      if (containerWidth === 0 || containerHeight === 0) {
        rafRef.current = requestAnimationFrame(animate);
        return;
      }

      const deltaTime = drag.lastFrameTime
        ? (time - drag.lastFrameTime) / 1000
        : 0;
      drag.lastFrameTime = time;

      // Advance wobble time (pause during drag and reduced motion)
      if (!drag.isDragging && !reducedMotion) {
        drag.wobbleTime += deltaTime;
      }

      // Wobble yaw
      const wobbleYaw =
        wobbleAngle * Math.sin((2 * Math.PI * drag.wobbleTime) / wobbleDuration);

      // Apply inertia and decay when not dragging
      if (!drag.isDragging) {
        drag.yawOffset += drag.yawVelocity;
        drag.tiltOffset += drag.tiltVelocity;
        drag.yawVelocity *= 0.92;
        drag.tiltVelocity *= 0.92;
        drag.yawOffset *= 0.97;
        drag.tiltOffset *= 0.97;
      }

      // Total angles
      const totalYaw = wobbleYaw + drag.yawOffset;
      const totalTilt = Math.max(
        TILT_MIN,
        Math.min(TILT_MAX, DEFAULT_TILT + drag.tiltOffset)
      );

      // Precompute trig
      const tiltRad = (totalTilt * Math.PI) / 180;
      const yawRad = (totalYaw * Math.PI) / 180;
      const cosTilt = Math.cos(tiltRad);
      const sinTilt = Math.sin(tiltRad);
      const cosYaw = Math.cos(yawRad);
      const sinYaw = Math.sin(yawRad);

      // Unit size for scaling
      const donutWidth = Math.min(containerWidth, size);
      const unitSize = donutWidth / 4.5;
      const centerX = containerWidth / 2;
      const centerY = containerHeight / 2;

      // Update each label
      for (let i = 0; i < points.length; i++) {
        const p = points[i];
        const label = labelsRef.current[i];
        if (!label) continue;

        // Rotate: tilt (X) then yaw (Y)
        const y1 = p.y * cosTilt - p.z * sinTilt;
        const z1 = p.y * sinTilt + p.z * cosTilt;
        const x2 = p.x * cosYaw + z1 * sinYaw;
        const z2 = -p.x * sinYaw + z1 * cosYaw;

        // Perspective
        const scale = FOCAL_LENGTH / (FOCAL_LENGTH - z2);

        // Screen position
        const screenX = centerX + x2 * scale * unitSize;
        const screenY = centerY + y1 * scale * unitSize;

        // Rotated normal
        const ny1 = p.ny * cosTilt - p.nz * sinTilt;
        const nz1 = p.ny * sinTilt + p.nz * cosTilt;
        const nz2 = -p.nx * sinYaw + nz1 * cosYaw;

        // Text compression
        const compression = Math.max(0.3, Math.abs(nz2));

        // Opacity
        let opacity = Math.max(0.12, Math.min(1, (z2 + 1.5) / 3));
        if (nz2 < 0) opacity *= 0.55;

        // Z-index
        const zIndex = Math.round((z2 + 1.5) * 100);

        label.style.transform = `translate(-50%, -50%) translate(${screenX}px, ${screenY}px) scale(${scale}) scaleX(${compression})`;
        label.style.opacity = opacity.toFixed(3);
        label.style.zIndex = zIndex;
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [points, wobbleAngle, wobbleDuration, size]);

  // Pointer handlers
  const handlePointerDown = useCallback((e) => {
    const drag = dragRef.current;
    drag.isDragging = true;
    drag.lastX = e.clientX;
    drag.lastY = e.clientY;
    drag.yawVelocity = 0;
    drag.tiltVelocity = 0;
    e.currentTarget.setPointerCapture(e.pointerId);
  }, []);

  const handlePointerMove = useCallback((e) => {
    const drag = dragRef.current;
    if (!drag.isDragging) return;

    const dx = e.clientX - drag.lastX;
    const dy = e.clientY - drag.lastY;
    drag.lastX = e.clientX;
    drag.lastY = e.clientY;

    const sensitivity = 0.4;
    drag.yawOffset += dx * sensitivity;
    drag.tiltOffset -= dy * sensitivity;

    drag.yawVelocity = dx * sensitivity * 0.3;
    drag.tiltVelocity = -dy * sensitivity * 0.3;
  }, []);

  const handlePointerUp = useCallback((e) => {
    const drag = dragRef.current;
    drag.isDragging = false;
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
  }, []);

  return (
    <div
      ref={containerRef}
      className="greeting-donut-container"
      role="img"
      aria-label="Greetings in six languages"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      {points.map((p, i) => {
        const greeting = baseGreetings[p.greetingIndex];
        return (
          <span
            key={i}
            ref={(el) => {
              labelsRef.current[i] = el;
            }}
            className="greeting-donut-label"
            aria-hidden="true"
            dir={greeting.lang === 'Arabic' ? 'rtl' : 'ltr'}
          >
            {greeting.text}
          </span>
        );
      })}
    </div>
  );
};

export default GreetingDonut;
