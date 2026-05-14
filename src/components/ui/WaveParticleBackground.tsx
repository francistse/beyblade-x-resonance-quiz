import { useEffect, useRef, useCallback } from 'react';

interface Particle {
  x: number;
  y: number;
  baseX: number;
  baseY: number;
  radius: number;
  baseOpacity: number;
  phase: number;
}

interface WaveParticleBackgroundProps {
  dotSpacing?: number;
  waveAmplitude?: number;
  waveSpeed?: number;
  waveFrequency?: number;
}

const WaveParticleBackground: React.FC<WaveParticleBackgroundProps> = ({
  dotSpacing = 18,
  waveAmplitude = 12,
  waveSpeed = 0.015,
  waveFrequency = 0.006,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const particlesRef = useRef<Particle[]>([]);
  const timeRef = useRef(0);

  const initParticles = useCallback((width: number, height: number) => {
    const particles: Particle[] = [];

    const columns = 35;
    const focalX = width * -0.25;
    const focalY = height * 0.12;
    const maxRadius = Math.max(width, height) * 1.15;

    const centerAngle = Math.PI * 0.05;

    for (let col = 0; col < columns; col++) {
      const progress = col / columns;
      const r = progress * maxRadius;

      const angleSpread = 0.4 + progress * 1.6;
      const startAngle = centerAngle - angleSpread / 2;

      const arcLength = r * angleSpread;
      const numDots = Math.max(1, Math.floor(arcLength / (dotSpacing * (0.5 + progress * 0.7))));

      for (let i = 0; i < numDots; i++) {
        const t = i / (numDots - 1 || 1);
        const angle = startAngle + t * angleSpread;

        const jitter = (Math.random() - 0.5) * dotSpacing * 0.35;
        const currentR = r + jitter;

        const x = focalX + currentR * Math.cos(angle);
        const y = focalY + currentR * Math.sin(angle);

        if (x < -50 || x > width + 50 || y < -50 || y > height + 50) continue;

        const densityFactor = 1 - progress * 0.65;
        const opacity = Math.pow(densityFactor, 1.3) * 0.3;

        const radius = 0.6 + densityFactor * 1.6;

        const phase = Math.random() * Math.PI * 2;

        particles.push({
          x,
          y,
          baseX: x,
          baseY: y,
          radius,
          baseOpacity: opacity,
          phase,
        });
      }
    }

    particlesRef.current = particles;
  }, [dotSpacing]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;

    const resize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.scale(dpr, dpr);

      initParticles(width, height);
    };

    resize();
    window.addEventListener('resize', resize);

    const animate = () => {
      timeRef.current += waveSpeed;

      const width = window.innerWidth;
      const height = window.innerHeight;

      ctx.clearRect(0, 0, width, height);

      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, width, height);

      const particles = particlesRef.current;

      for (let i = 0; i < particles.length; i++) {
        const particle = particles[i];

        const waveX = Math.sin(
          particle.baseY * waveFrequency + timeRef.current + particle.phase * 0.3
        ) * waveAmplitude * 0.5;

        const waveY = Math.cos(
          particle.baseX * waveFrequency * 0.5 + timeRef.current * 0.6 + particle.phase * 0.2
        ) * waveAmplitude * 0.4;

        const x = particle.baseX + waveX;
        const y = particle.baseY + waveY;

        const opacity = particle.baseOpacity * (0.85 + Math.sin(timeRef.current + particle.phase) * 0.15);

        if (opacity < 0.01) continue;

        ctx.beginPath();
        ctx.arc(x, y, particle.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(140, 140, 155, ${opacity})`;
        ctx.fill();
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationRef.current);
    };
  }, [initParticles, waveAmplitude, waveSpeed, waveFrequency, dotSpacing]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full"
      style={{ zIndex: 0, pointerEvents: 'none' }}
    />
  );
};

export default WaveParticleBackground;
