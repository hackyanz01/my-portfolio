import { useEffect, useRef, useState } from "react";

interface ThreeDBackgroundProps {
  intensity?: number;
  effectType?: "particles" | "matrix" | "aurora";
}

export default function ThreeDBackground({ intensity = 1.0, effectType = "particles" }: ThreeDBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.targetX = e.clientX;
      mouseRef.current.targetY = e.clientY;
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove);

    // Particle background parameters
    const particleCount = Math.min(80, Math.floor((width * height) / 18000)) * intensity;
    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      color: string;
    }
    const particles: Particle[] = [];

    const colors = [
      "rgba(59, 130, 246, 0.4)",  // blue
      "rgba(139, 92, 246, 0.4)", // purple
      "rgba(6, 182, 212, 0.4)",  // cyan
    ];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        radius: Math.random() * 2 + 1,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    // Matrix effect setup
    const fontSize = 14;
    const columns = Math.floor(width / fontSize);
    const drops: number[] = Array(columns).fill(1);

    // Animation Loop
    const render = () => {
      // Clear with subtle trail or fully
      if (effectType === "matrix") {
        ctx.fillStyle = "rgba(5, 5, 5, 0.08)";
        ctx.fillRect(0, 0, width, height);
      } else {
        ctx.fillStyle = "#050505";
        ctx.fillRect(0, 0, width, height);
      }

      // Smooth mouse coordinates
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.08;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.08;

      if (effectType === "particles") {
        // Draw deep ambient radial glows (Aurora hubs)
        const gradient1 = ctx.createRadialGradient(
          width * 0.2 + Math.sin(Date.now() * 0.0005) * 100,
          height * 0.3 + Math.cos(Date.now() * 0.0003) * 100,
          10,
          width * 0.2,
          height * 0.3,
          Math.max(width * 0.4, 300)
        );
        gradient1.addColorStop(0, "rgba(59, 130, 246, 0.08)");
        gradient1.addColorStop(1, "rgba(0, 0, 0, 0)");

        const gradient2 = ctx.createRadialGradient(
          width * 0.8 + Math.cos(Date.now() * 0.0004) * 100,
          height * 0.7 + Math.sin(Date.now() * 0.0005) * 100,
          10,
          width * 0.8,
          height * 0.7,
          Math.max(width * 0.5, 400)
        );
        gradient2.addColorStop(0, "rgba(139, 92, 246, 0.07)");
        gradient2.addColorStop(1, "rgba(0, 0, 0, 0)");

        // Spotlight under mouse cursor
        const spotGradient = ctx.createRadialGradient(
          mouseRef.current.x,
          mouseRef.current.y,
          0,
          mouseRef.current.x,
          mouseRef.current.y,
          350
        );
        spotGradient.addColorStop(0, "rgba(29, 78, 216, 0.12)");
        spotGradient.addColorStop(0.5, "rgba(124, 58, 237, 0.03)");
        spotGradient.addColorStop(1, "rgba(0,0,0,0)");

        ctx.fillStyle = gradient1;
        ctx.fillRect(0, 0, width, height);
        ctx.fillStyle = gradient2;
        ctx.fillRect(0, 0, width, height);
        ctx.fillStyle = spotGradient;
        ctx.fillRect(0, 0, width, height);

        // Draw particle node network
        particles.forEach((p) => {
          // Update positions
          p.x += p.vx;
          p.y += p.vy;

          // Boundary bounce
          if (p.x < 0 || p.x > width) p.vx *= -1;
          if (p.y < 0 || p.y > height) p.vy *= -1;

          // Mouse pull (subtle)
          const dx = mouseRef.current.x - p.x;
          const dy = mouseRef.current.y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 180) {
            p.x -= (dx / dist) * 0.15;
            p.y -= (dy / dist) * 0.15;
          }

          // Draw node
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.fill();
        });

        // Draw connection lines
        ctx.lineWidth = 0.5;
        for (let i = 0; i < particles.length; i++) {
          for (let j = i + 1; j < particles.length; j++) {
            const p1 = particles[i];
            const p2 = particles[j];
            const dx = p1.x - p2.x;
            const dy = p1.y - p2.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 120) {
              const alpha = (1 - dist / 120) * 0.18;
              ctx.strokeStyle = `rgba(139, 92, 246, ${alpha})`;
              ctx.beginPath();
              ctx.moveTo(p1.x, p1.y);
              ctx.lineTo(p2.x, p2.y);
              ctx.stroke();
            }
          }
        }
      } else if (effectType === "matrix") {
        // Matrix hacker stream style
        ctx.fillStyle = "rgba(6, 182, 212, 0.15)";
        ctx.font = `${fontSize}px monospace`;

        for (let i = 0; i < drops.length; i++) {
          // Random matrix binary character
          const text = Math.random() > 0.5 ? "1" : "0";
          const x = i * fontSize;
          const y = drops[i] * fontSize;

          // Draw the character
          ctx.fillText(text, x, y);

          // Reset drop if it exits screen or randomly
          if (y > height && Math.random() > 0.975) {
            drops[i] = 0;
          }
          drops[i] += 0.6; // Speed
        }
      } else if (effectType === "aurora") {
        // High-end ambient wave lines
        const time = Date.now() * 0.0002;
        ctx.strokeStyle = "rgba(59, 130, 246, 0.07)";
        ctx.lineWidth = 1.5;

        for (let i = 0; i < 5; i++) {
          ctx.beginPath();
          const offset = i * 40;
          for (let x = 0; x < width; x += 30) {
            const y = height * 0.5 + Math.sin(x * 0.002 + time + i * 0.5) * 120 + Math.cos(x * 0.001 - time * 0.8) * 80;
            if (x === 0) {
              ctx.moveTo(x, y + offset);
            } else {
              ctx.lineTo(x, y + offset);
            }
          }
          ctx.stroke();
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, [intensity, effectType]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full -z-10 pointer-events-none transition-opacity duration-700 bg-black"
    />
  );
}
