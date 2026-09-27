import React, { useRef, useEffect, useCallback } from 'react';
import { GameState, WasteItem, ClueSource } from '../types/game';
import { MAP_WIDTH, MAP_HEIGHT } from './constants';
import { sound } from '../services/sound';

interface GameCanvasProps {
  gameState: GameState;
  onCollectWaste: (waste: WasteItem) => void;
  onInteractSource: (source: ClueSource) => void;
  onOpenSorting: () => void;
  joystickDelta: { x: number; y: number } | null;
}

export const GameCanvas: React.FC<GameCanvasProps> = ({
  gameState,
  onCollectWaste,
  onInteractSource,
  onOpenSorting,
  joystickDelta
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const keysRef = useRef<{ [key: string]: boolean }>({});
  const mouseTargetRef = useRef<{ x: number; y: number } | null>(null);
  const playerPosRef = useRef({
    x: gameState.player.x,
    y: gameState.player.y,
    vx: 0,
    vy: 0,
    direction: 'down' as 'left' | 'right' | 'up' | 'down',
    frame: 0
  });

  const animTimeRef = useRef(0);
  const lastFootstepRef = useRef(0);
  const particlesRef = useRef<{ x: number; y: number; vx: number; vy: number; life: number; maxLife: number; color: string; size: number }[]>([]);

  // Track closest interactable
  const nearestWasteRef = useRef<WasteItem | null>(null);
  const nearestSourceRef = useRef<ClueSource | null>(null);

  // Sync internal player position if reset externally
  useEffect(() => {
    playerPosRef.current.x = gameState.player.x;
    playerPosRef.current.y = gameState.player.y;
  }, [gameState.phase]);

  // Key listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent scrolling
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }
      keysRef.current[e.key.toLowerCase()] = true;
      keysRef.current[e.code] = true;

      // Handle interaction key 'E' or Space
      if (e.key.toLowerCase() === 'e' || e.key === ' ') {
        if (nearestWasteRef.current && !nearestWasteRef.current.collected) {
          onCollectWaste(nearestWasteRef.current);
        } else if (nearestSourceRef.current) {
          onInteractSource(nearestSourceRef.current);
        }
      }

      if (e.key.toLowerCase() === 'i') {
        onOpenSorting();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysRef.current[e.key.toLowerCase()] = false;
      keysRef.current[e.code] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [onCollectWaste, onInteractSource, onOpenSorting]);

  // Handle click / tap on canvas to move player or click item
  const handleCanvasPointerDown = useCallback((e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    // Convert screen coordinates to world coordinates using camera offset
    const player = playerPosRef.current;
    const camX = Math.max(0, Math.min(MAP_WIDTH - canvas.width, player.x - canvas.width / 2));
    const camY = Math.max(0, Math.min(MAP_HEIGHT - canvas.height, player.y - canvas.height / 2));

    const worldX = clickX + camX;
    const worldY = clickY + camY;

    // Check if clicked directly on an uncollected waste item
    const clickedWaste = gameState.wasteItems.find(
      w => !w.collected && Math.hypot(w.x - worldX, w.y - worldY) < 36
    );
    if (clickedWaste) {
      if (Math.hypot(player.x - clickedWaste.x, player.y - clickedWaste.y) < 70) {
        onCollectWaste(clickedWaste);
        return;
      }
    }

    // Check if clicked directly on a source NPC
    const clickedSource = gameState.sources.find(
      s => Math.hypot(s.x - worldX, s.y - worldY) < 45
    );
    if (clickedSource) {
      if (Math.hypot(player.x - clickedSource.x, player.y - clickedSource.y) < 80) {
        onInteractSource(clickedSource);
        return;
      }
    }

    mouseTargetRef.current = { x: worldX, y: worldY };
  }, [gameState.wasteItems, gameState.sources, onCollectWaste, onInteractSource]);

  // Main game rendering and update loop
  useEffect(() => {
    let animationFrameId: number;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const handleResize = () => {
      if (!canvas) return;
      const parent = canvas.parentElement;
      if (parent) {
        canvas.width = parent.clientWidth;
        canvas.height = parent.clientHeight;
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);

    const isCollidingWithBuildings = (x: number, y: number) => {
      // Ray's market building: [120, 100] to [380, 310]
      if (x > 110 && x < 390 && y > 90 && y < 315) return true;
      // Greenwood Apartments: [1080, 280] to [1460, 680]
      if (x > 1070 && x < 1470 && y > 270 && y < 690) return true;
      // Construction fence area: [50, 750] to [320, 960]
      if (x > 40 && x < 330 && y > 740 && y < 970) return true;
      // Park fountain basin: [870, 180] to [950, 260]
      if (x > 860 && x < 960 && y > 170 && y < 270) return true;
      return false;
    };

    const loop = (timestamp: number) => {
      animTimeRef.current = timestamp;

      // 1. UPDATE PLAYER PHYSICS
      const p = playerPosRef.current;
      const speed = 3.6;
      let moveX = 0;
      let moveY = 0;

      const keys = keysRef.current;
      if (keys['w'] || keys['arrowup'] || keys['KeyW']) moveY -= 1;
      if (keys['s'] || keys['arrowdown'] || keys['KeyS']) moveY += 1;
      if (keys['a'] || keys['arrowleft'] || keys['KeyA']) moveX -= 1;
      if (keys['d'] || keys['arrowright'] || keys['KeyD']) moveX += 1;

      // Joystick input override if active
      if (joystickDelta && (Math.abs(joystickDelta.x) > 0.1 || Math.abs(joystickDelta.y) > 0.1)) {
        moveX = joystickDelta.x;
        moveY = joystickDelta.y;
        mouseTargetRef.current = null;
      }

      // Mouse/Tap click-to-move
      if (mouseTargetRef.current) {
        const dx = mouseTargetRef.current.x - p.x;
        const dy = mouseTargetRef.current.y - p.y;
        const dist = Math.hypot(dx, dy);
        if (dist > 8) {
          moveX = dx / dist;
          moveY = dy / dist;
        } else {
          mouseTargetRef.current = null;
        }
      }

      // Normalize diagonal movement
      if (moveX !== 0 || moveY !== 0) {
        const length = Math.hypot(moveX, moveY);
        const normX = (moveX / length) * speed;
        const normY = (moveY / length) * speed;

        const nextX = Math.max(30, Math.min(MAP_WIDTH - 30, p.x + normX));
        const nextY = Math.max(30, Math.min(MAP_HEIGHT - 30, p.y + normY));

        if (!isCollidingWithBuildings(nextX, p.y)) p.x = nextX;
        if (!isCollidingWithBuildings(p.x, nextY)) p.y = nextY;

        // Facing direction
        if (Math.abs(normX) > Math.abs(normY)) {
          p.direction = normX > 0 ? 'right' : 'left';
        } else {
          p.direction = normY > 0 ? 'down' : 'up';
        }

        p.frame += 0.2;

        // Audio footstep trigger
        if (timestamp - lastFootstepRef.current > 320) {
          sound.playFootstep();
          lastFootstepRef.current = timestamp;
        }
      } else {
        p.frame = 0;
      }

      // 2. CHECK PROXIMITY TO WASTE ITEMS & SOURCES
      let foundWaste: WasteItem | null = null;
      let minWasteDist = 65;
      for (const w of gameState.wasteItems) {
        if (!w.collected) {
          const d = Math.hypot(w.x - p.x, w.y - p.y);
          if (d < minWasteDist) {
            minWasteDist = d;
            foundWaste = w;
          }
        }
      }
      nearestWasteRef.current = foundWaste;

      let foundSource: ClueSource | null = null;
      let minSourceDist = 75;
      for (const s of gameState.sources) {
        const d = Math.hypot(s.x - p.x, s.y - p.y);
        if (d < minSourceDist) {
          minSourceDist = d;
          foundSource = s;
        }
      }
      nearestSourceRef.current = foundSource;

      // 3. CAMERA SETUP (centered on player, clamped to map)
      const camX = Math.max(0, Math.min(MAP_WIDTH - canvas.width, p.x - canvas.width / 2));
      const camY = Math.max(0, Math.min(MAP_HEIGHT - canvas.height, p.y - canvas.height / 2));

      ctx.save();
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.translate(-camX, -camY);

      // --- DRAW WORLD ENVIRONMENT ---
      drawWorld(ctx, timestamp, gameState);

      // --- DRAW WASTE ITEMS ---
      drawWasteItems(ctx, gameState.wasteItems, timestamp);

      // --- DRAW HOTSPOTS & NPCS ---
      drawNPCsAndSources(ctx, gameState.sources, timestamp, gameState);

      // --- DRAW PLAYER ---
      drawPlayer(ctx, p, timestamp);

      // --- DRAW PARTICLES ---
      drawParticles(ctx);

      // --- DRAW INTERACTION PROMPT ---
      if (foundWaste) {
        drawInteractionPrompt(ctx, foundWaste.x, foundWaste.y - 25, `COLLECT [E] · ${foundWaste.name}`);
      } else if (foundSource) {
        const promptLabel = gameState.phase === 'PLAYING_WEEK_LATER'
          ? `TALK [E] · ${foundSource.npcName}`
          : gameState.phase === 'PLAYING_INVESTIGATION'
            ? `INVESTIGATE [E] · ${foundSource.npcName}`
            : `TALK [E] · ${foundSource.npcName}`;
        drawInteractionPrompt(ctx, foundSource.x, foundSource.y - 45, promptLabel);
      }

      ctx.restore();

      // Atmospheric overlay (smog or fresh sunlight)
      drawAtmosphereOverlay(ctx, canvas.width, canvas.height, gameState);

      animationFrameId = requestAnimationFrame(loop);
    };

    animationFrameId = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [gameState, joystickDelta]);

  // Helper renderer: World background & buildings
  const drawWorld = (ctx: CanvasRenderingContext2D, time: number, state: GameState) => {
    const isWeekLater = state.phase === 'PLAYING_WEEK_LATER';
    const outcome = state.outcome || 'THRIVING';

    // 1. BASE ASPHALT & SIDEWALKS
    ctx.fillStyle = '#1e2430'; // Base ground
    ctx.fillRect(0, 0, MAP_WIDTH, MAP_HEIGHT);

    // Main horizontal roadway
    ctx.fillStyle = '#2b3342';
    ctx.fillRect(0, 400, MAP_WIDTH, 170);

    // Road dash lines
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 4;
    ctx.setLineDash([25, 25]);
    ctx.beginPath();
    ctx.moveTo(0, 485);
    ctx.lineTo(MAP_WIDTH, 485);
    ctx.stroke();
    ctx.setLineDash([]);

    // Crosswalk zebra stripes
    ctx.fillStyle = '#f8fafc';
    for (let i = 0; i < 6; i++) {
      ctx.fillRect(630 + i * 20, 405, 12, 160);
    }

    // Sidewalks
    ctx.fillStyle = '#475569';
    ctx.fillRect(0, 340, MAP_WIDTH, 60); // North sidewalk
    ctx.fillRect(0, 570, MAP_WIDTH, 70); // South sidewalk

    // Sidewalk tile paving lines
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1;
    for (let x = 0; x < MAP_WIDTH; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 340);
      ctx.lineTo(x, 400);
      ctx.moveTo(x, 570);
      ctx.lineTo(x, 640);
      ctx.stroke();
    }

    // 2. GREENWOOD PARK ZONE (Top Right quadrant)
    const parkGrassColor = isWeekLater && outcome === 'THRIVING'
      ? '#22c55e'
      : isWeekLater && outcome === 'RELAPSED'
        ? '#656d4a'
        : '#4ade80';
    ctx.fillStyle = parkGrassColor;
    ctx.beginPath();
    ctx.roundRect(700, 40, 750, 300, [16]);
    ctx.fill();

    // Park stone path
    ctx.fillStyle = '#94a3b8';
    ctx.beginPath();
    ctx.roundRect(740, 160, 400, 35, [10]);
    ctx.roundRect(910, 80, 35, 230, [10]);
    ctx.fill();

    // Park Fountain / Pond
    const waterColor = isWeekLater && outcome === 'THRIVING'
      ? '#38bdf8'
      : isWeekLater && outcome === 'RELAPSED'
        ? '#3f4e2f'
        : state.environmentHealth > 60
          ? '#60a5fa'
          : '#475569';

    ctx.fillStyle = '#64748b';
    ctx.beginPath();
    ctx.arc(910, 215, 36, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = waterColor;
    ctx.beginPath();
    ctx.arc(910, 215, 28, 0, Math.PI * 2);
    ctx.fill();

    // Fountain ripple
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.lineWidth = 1.5;
    const rippleRadius = (time * 0.03) % 24;
    ctx.beginPath();
    ctx.arc(910, 215, rippleRadius, 0, Math.PI * 2);
    ctx.stroke();

    // Park Trees
    drawTree(ctx, 760, 90, time);
    drawTree(ctx, 1180, 100, time);
    drawTree(ctx, 1380, 220, time);
    drawTree(ctx, 750, 290, time);

    // Park Benches
    drawBench(ctx, 810, 250);
    drawBench(ctx, 1030, 250);

    // Flowerbeds in park
    if (isWeekLater && outcome === 'THRIVING') {
      drawFlowerbed(ctx, 740, 220, time);
      drawFlowerbed(ctx, 1080, 220, time);
      drawFlowerbed(ctx, 960, 110, time);
      drawButterflies(ctx, time);
      drawBirds(ctx, time);
    }

    // 3. RAY'S CORNER MARKET (Top Left)
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(120, 100, 260, 210); // Wall
    ctx.fillStyle = '#334155';
    ctx.fillRect(130, 110, 240, 80);  // Upper story

    // Shop Windows
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(140, 210, 80, 60);
    ctx.fillRect(280, 210, 80, 60);

    // Shop Door
    ctx.fillStyle = '#475569';
    ctx.fillRect(235, 210, 36, 90);

    // Striped Awning
    const stripeColors = ['#ef4444', '#f8fafc'];
    for (let s = 0; s < 13; s++) {
      ctx.fillStyle = stripeColors[s % 2];
      ctx.fillRect(120 + s * 20, 185, 20, 25);
    }

    // Shop Signboard
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(150, 125, 200, 36);
    ctx.fillStyle = '#f8fafc';
    ctx.font = 'bold 13px "Outfit", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText("RAY'S CORNER MARKET", 250, 148);

    // Shop feature in Week Later Thriving (Reusable Mug Kiosk)
    if (isWeekLater && outcome === 'THRIVING') {
      ctx.fillStyle = '#10b981';
      ctx.fillRect(330, 270, 30, 35);
      ctx.fillStyle = '#ffffff';
      ctx.font = '16px sans-serif';
      ctx.fillText('☕', 345, 292);
      ctx.font = 'bold 9px sans-serif';
      ctx.fillText('REUSABLES', 345, 315);
    }

    // 4. GREENWOOD APARTMENTS (Bottom Right)
    ctx.fillStyle = '#7c2d12'; // Brick red
    ctx.fillRect(1080, 280, 380, 400);

    // Apartment windows with warm light
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        ctx.fillStyle = (r + c) % 2 === 0 ? '#fde047' : '#94a3b8';
        ctx.fillRect(1110 + c * 80, 310 + r * 70, 45, 40);
        ctx.strokeStyle = '#451a03';
        ctx.strokeRect(1110 + c * 80, 310 + r * 70, 45, 40);
      }
    }

    // Apartment Entrance
    ctx.fillStyle = '#451a03';
    ctx.fillRect(1230, 600, 60, 80);

    // Dumpster Nook beside apartments
    drawDumpsterArea(ctx, state, isWeekLater, outcome);

    // 5. STORM DRAIN & RUNOFF CHANNEL (Near curb at x: 480, y: 560)
    drawStormDrain(ctx, state, isWeekLater, outcome, time);

    // 6. RENOVATION CORNER (Bottom Left)
    drawRenovationSite(ctx, state, isWeekLater, outcome, time);

    // 7. STREETLIGHTS
    drawStreetlight(ctx, 450, 350);
    drawStreetlight(ctx, 800, 350);
    drawStreetlight(ctx, 1150, 350);
    drawStreetlight(ctx, 450, 620);
    drawStreetlight(ctx, 800, 620);
  };

  const drawTree = (ctx: CanvasRenderingContext2D, x: number, y: number, time: number) => {
    // Tree trunk
    ctx.fillStyle = '#78350f';
    ctx.fillRect(x - 8, y + 10, 16, 32);

    // Tree canopy with gentle sway
    const sway = Math.sin(time * 0.002 + x) * 3;
    ctx.fillStyle = '#15803d';
    ctx.beginPath();
    ctx.arc(x + sway, y, 36, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#16a34a';
    ctx.beginPath();
    ctx.arc(x + sway - 10, y - 10, 24, 0, Math.PI * 2);
    ctx.arc(x + sway + 12, y - 8, 22, 0, Math.PI * 2);
    ctx.fill();
  };

  const drawBench = (ctx: CanvasRenderingContext2D, x: number, y: number) => {
    ctx.fillStyle = '#b45309';
    ctx.fillRect(x - 24, y - 6, 48, 12);
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(x - 20, y + 6, 6, 8);
    ctx.fillRect(x + 14, y + 6, 6, 8);
  };

  const drawFlowerbed = (ctx: CanvasRenderingContext2D, x: number, y: number, time: number) => {
    ctx.fillStyle = '#3f6212';
    ctx.beginPath();
    ctx.roundRect(x - 20, y - 12, 40, 24, [6]);
    ctx.fill();

    const colors = ['#f43f5e', '#fbbf24', '#38bdf8', '#c084fc'];
    for (let i = 0; i < 6; i++) {
      const fx = x - 14 + (i % 3) * 14;
      const fy = y - 6 + Math.floor(i / 3) * 12;
      ctx.fillStyle = colors[i % colors.length];
      ctx.beginPath();
      ctx.arc(fx, fy + Math.sin(time * 0.005 + i) * 1.5, 4, 0, Math.PI * 2);
      ctx.fill();
    }
  };

  const drawButterflies = (ctx: CanvasRenderingContext2D, time: number) => {
    const butterflyX = 850 + Math.sin(time * 0.003) * 60;
    const butterflyY = 220 + Math.cos(time * 0.004) * 30;
    ctx.font = '14px sans-serif';
    ctx.fillText('🦋', butterflyX, butterflyY);

    const b2X = 1000 + Math.cos(time * 0.003) * 50;
    const b2Y = 160 + Math.sin(time * 0.004) * 25;
    ctx.fillText('🦋', b2X, b2Y);
  };

  const drawBirds = (ctx: CanvasRenderingContext2D, time: number) => {
    const birdX = 940 + Math.sin(time * 0.001) * 30;
    const birdY = 140;
    ctx.font = '16px sans-serif';
    ctx.fillText('🐦', birdX, birdY);
  };

  const drawDumpsterArea = (
    ctx: CanvasRenderingContext2D,
    state: GameState,
    isWeekLater: boolean,
    outcome: string
  ) => {
    const x = 1260;
    const y = 490;

    if (isWeekLater && outcome === 'THRIVING') {
      // 4-stream color coded bins + compost tumbler
      const bins = [
        { color: '#16a34a', icon: '🌱', label: 'ORGANIC' },
        { color: '#2563eb', icon: '♻️', label: 'RECYCLE' },
        { color: '#dc2626', icon: '⚠️', label: 'HAZARD' },
        { color: '#9333ea', icon: '🔌', label: 'E-WASTE' }
      ];
      bins.forEach((b, i) => {
        ctx.fillStyle = b.color;
        ctx.fillRect(x - 50 + i * 28, y - 20, 24, 38);
        ctx.fillStyle = '#ffffff';
        ctx.font = '12px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(b.icon, x - 50 + i * 28 + 12, y);
      });

      // Compost tumbler
      ctx.fillStyle = '#065f46';
      ctx.beginPath();
      ctx.roundRect(x + 65, y - 22, 34, 40, [8]);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 8px sans-serif';
      ctx.fillText('COMPOST', x + 82, y + 26);
    } else if (isWeekLater && outcome === 'RELAPSED') {
      // Overflowing broken dumpster with garbage spill and flies
      ctx.fillStyle = '#4b5563';
      ctx.fillRect(x - 20, y - 25, 60, 45);
      // Overflow bags
      ctx.fillStyle = '#111827';
      ctx.beginPath();
      ctx.arc(x - 10, y - 30, 14, 0, Math.PI * 2);
      ctx.arc(x + 15, y - 32, 16, 0, Math.PI * 2);
      ctx.arc(x + 35, y - 10, 12, 0, Math.PI * 2);
      ctx.fill();
      // Flies
      ctx.font = '12px sans-serif';
      ctx.fillText('🪰', x + 5, y - 45);
      ctx.fillText('🪰', x + 30, y - 35);
    } else {
      // Normal single metal dumpster
      ctx.fillStyle = '#374151';
      ctx.fillRect(x - 20, y - 25, 55, 42);
      ctx.fillStyle = '#1f2937';
      ctx.fillRect(x - 18, y - 27, 51, 8);
    }
  };

  const drawStormDrain = (
    ctx: CanvasRenderingContext2D,
    state: GameState,
    isWeekLater: boolean,
    outcome: string,
    time: number
  ) => {
    const x = 480;
    const y = 570;

    // Drain culvert basin
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(x - 30, y - 15, 60, 35);

    // Water flow inside
    const isClean = isWeekLater && outcome === 'THRIVING';
    const isToxic = !isClean && (isWeekLater && outcome === 'RELAPSED' || state.environmentHealth < 50);

    ctx.fillStyle = isClean ? '#0284c7' : isToxic ? '#365314' : '#1e3a5f';
    ctx.fillRect(x - 26, y - 10, 52, 26);

    // Grate bars
    ctx.strokeStyle = isClean ? '#38bdf8' : '#64748b';
    ctx.lineWidth = isClean ? 3 : 2;
    for (let b = -22; b <= 22; b += 9) {
      ctx.beginPath();
      ctx.moveTo(x + b, y - 12);
      ctx.lineTo(x + b, y + 16);
      ctx.stroke();
    }

    // Filter basket if systemic choice was made
    if (isClean) {
      ctx.strokeStyle = '#22c55e';
      ctx.lineWidth = 2;
      ctx.strokeRect(x - 28, y - 13, 56, 30);
      // Clean water ripple
      ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
      const rx = (time * 0.05) % 40;
      ctx.fillRect(x - 20 + rx, y - 4, 8, 3);
    }
  };

  const drawRenovationSite = (
    ctx: CanvasRenderingContext2D,
    state: GameState,
    isWeekLater: boolean,
    outcome: string,
    time: number
  ) => {
    const x = 160;
    const y = 800;

    // Renovation site enclosure
    ctx.fillStyle = '#334155';
    ctx.fillRect(50, 750, 270, 210);

    // Scaffolding lines
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(70, 760);
    ctx.lineTo(70, 940);
    ctx.moveTo(150, 760);
    ctx.lineTo(150, 940);
    ctx.moveTo(230, 760);
    ctx.lineTo(230, 940);
    ctx.moveTo(60, 800);
    ctx.lineTo(240, 800);
    ctx.moveTo(60, 880);
    ctx.lineTo(240, 880);
    ctx.stroke();

    // Cones
    ctx.fillStyle = '#f97316';
    ctx.beginPath();
    ctx.moveTo(70, 745);
    ctx.lineTo(60, 765);
    ctx.lineTo(80, 765);
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(130, 745);
    ctx.lineTo(120, 765);
    ctx.lineTo(140, 765);
    ctx.fill();

    if (isWeekLater && outcome === 'THRIVING') {
      // Clean bulk recycling container + solar light
      ctx.fillStyle = '#059669';
      ctx.fillRect(x + 10, y + 20, 60, 40);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 9px sans-serif';
      ctx.fillText('RECYCLE', x + 40, y + 44);

      // Solar floodlight pole
      ctx.fillStyle = '#cbd5e1';
      ctx.fillRect(x - 60, y + 10, 4, 50);
      ctx.fillStyle = '#fde047';
      ctx.beginPath();
      ctx.arc(x - 58, y + 8, 8, 0, Math.PI * 2);
      ctx.fill();
    } else if (isWeekLater && outcome === 'RELAPSED') {
      // Huge illegal fly-tipping heap
      ctx.font = '22px sans-serif';
      ctx.fillText('🛢️', x, y + 30);
      ctx.fillText('🧱', x + 30, y + 45);
      ctx.fillText('🚗', x - 30, y + 45);
    }
  };

  const drawStreetlight = (ctx: CanvasRenderingContext2D, x: number, y: number) => {
    // Pole
    ctx.fillStyle = '#64748b';
    ctx.fillRect(x - 3, y - 45, 6, 45);
    // Lamp head
    ctx.fillStyle = '#fef08a';
    ctx.beginPath();
    ctx.arc(x, y - 48, 7, 0, Math.PI * 2);
    ctx.fill();
    // Soft halo
    const grad = ctx.createRadialGradient(x, y - 48, 2, x, y - 48, 28);
    grad.addColorStop(0, 'rgba(254, 240, 138, 0.25)');
    grad.addColorStop(1, 'rgba(254, 240, 138, 0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(x, y - 48, 28, 0, Math.PI * 2);
    ctx.fill();
  };

  // Draw naturally scattered waste items
  const drawWasteItems = (ctx: CanvasRenderingContext2D, items: WasteItem[], time: number) => {
    items.forEach(w => {
      if (w.collected) return;

      // Sparkling pulse ring around uncollected waste
      const pulse = Math.sin(time * 0.006 + w.x) * 4 + 14;
      ctx.strokeStyle = 'rgba(234, 179, 8, 0.45)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(w.x, w.y, pulse, 0, Math.PI * 2);
      ctx.stroke();

      // Shadow
      ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
      ctx.beginPath();
      ctx.ellipse(w.x, w.y + 8, 10, 4, 0, 0, Math.PI * 2);
      ctx.fill();

      // Emoji/Icon
      ctx.font = '20px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(w.icon, w.x, w.y);
    });
  };

  // Draw NPCs and Clue Hotspots
  const drawNPCsAndSources = (
    ctx: CanvasRenderingContext2D,
    sources: ClueSource[],
    time: number,
    state: GameState
  ) => {
    sources.forEach(s => {
      // NPC Shadow
      ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
      ctx.beginPath();
      ctx.ellipse(s.x, s.y + 16, 12, 5, 0, 0, Math.PI * 2);
      ctx.fill();

      // NPC Body
      let bodyColor = '#0284c7';
      let hatIcon = '🧢';
      if (s.id === 'source-shop') {
        bodyColor = '#ea580c';
        hatIcon = '👨‍🍳';
      } else if (s.id === 'source-drain') {
        bodyColor = '#10b981';
        hatIcon = '👩‍🔬';
      } else if (s.id === 'source-construction') {
        bodyColor = '#f59e0b';
        hatIcon = '👷';
      } else if (s.id === 'source-residential') {
        bodyColor = '#8b5cf6';
        hatIcon = '👵';
      }

      ctx.fillStyle = bodyColor;
      ctx.beginPath();
      ctx.roundRect(s.x - 10, s.y - 4, 20, 20, [4]);
      ctx.fill();

      // NPC Head
      ctx.fillStyle = '#fed7aa';
      ctx.beginPath();
      ctx.arc(s.x, s.y - 10, 9, 0, Math.PI * 2);
      ctx.fill();

      // Head icon/hat
      ctx.font = '12px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(hatIcon, s.x, s.y - 12);

      // Name label
      ctx.fillStyle = '#f8fafc';
      ctx.font = 'bold 10px "Outfit", sans-serif';
      ctx.fillText(s.npcName, s.x, s.y + 28);

      // Attention marker if in investigation phase and not investigated yet
      if (state.phase === 'PLAYING_INVESTIGATION' && !s.investigated) {
        const bounce = Math.sin(time * 0.007) * 4;
        ctx.fillStyle = '#f59e0b';
        ctx.beginPath();
        ctx.arc(s.x, s.y - 32 + bounce, 10, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 11px sans-serif';
        ctx.fillText('?', s.x, s.y - 28 + bounce);
      }
    });
  };

  // Draw Player Character
  const drawPlayer = (
    ctx: CanvasRenderingContext2D,
    p: { x: number; y: number; direction: string; frame: number },
    time: number
  ) => {
    const bob = Math.sin(p.frame) * 2;

    // Shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
    ctx.beginPath();
    ctx.ellipse(p.x, p.y + 14, 12, 5, 0, 0, Math.PI * 2);
    ctx.fill();

    // Backpack (shows collected trash)
    ctx.fillStyle = '#15803d'; // Forest green eco backpack
    ctx.beginPath();
    ctx.roundRect(p.x - 12, p.y - 8 + bob, 24, 16, [4]);
    ctx.fill();

    // Body (Jacket)
    ctx.fillStyle = '#059669'; // Emerald jacket
    ctx.beginPath();
    ctx.roundRect(p.x - 9, p.y - 6 + bob, 18, 18, [4]);
    ctx.fill();

    // Legs with walk swing
    ctx.fillStyle = '#1e293b';
    const legOffset = Math.sin(p.frame) * 4;
    ctx.fillRect(p.x - 7, p.y + 10 + bob, 5, 7 + legOffset);
    ctx.fillRect(p.x + 2, p.y + 10 + bob, 5, 7 - legOffset);

    // Head
    ctx.fillStyle = '#fed7aa';
    ctx.beginPath();
    ctx.arc(p.x, p.y - 12 + bob, 9, 0, Math.PI * 2);
    ctx.fill();

    // Green Eco Cap
    ctx.fillStyle = '#047857';
    ctx.beginPath();
    ctx.arc(p.x, p.y - 14 + bob, 9.5, Math.PI, 0);
    ctx.fill();
    // Cap visor
    const visorDir = p.direction === 'left' ? -6 : p.direction === 'right' ? 6 : 0;
    ctx.fillRect(p.x - 7 + visorDir, p.y - 15 + bob, 14, 3);

    // Eyes
    ctx.fillStyle = '#0f172a';
    if (p.direction === 'left') {
      ctx.fillRect(p.x - 6, p.y - 13 + bob, 2, 3);
    } else if (p.direction === 'right') {
      ctx.fillRect(p.x + 4, p.y - 13 + bob, 2, 3);
    } else if (p.direction === 'down') {
      ctx.fillRect(p.x - 4, p.y - 13 + bob, 2, 3);
      ctx.fillRect(p.x + 2, p.y - 13 + bob, 2, 3);
    }

    // Trash Grabber / Broom tool held in hand
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 2;
    ctx.beginPath();
    if (p.direction === 'left') {
      ctx.moveTo(p.x - 8, p.y + bob);
      ctx.lineTo(p.x - 18, p.y + 12 + bob);
    } else {
      ctx.moveTo(p.x + 8, p.y + bob);
      ctx.lineTo(p.x + 18, p.y + 12 + bob);
    }
    ctx.stroke();
  };

  const drawParticles = (ctx: CanvasRenderingContext2D) => {
    const particles = particlesRef.current;
    for (let i = particles.length - 1; i >= 0; i--) {
      const pt = particles[i];
      pt.x += pt.vx;
      pt.y += pt.vy;
      pt.life--;

      const alpha = pt.life / pt.maxLife;
      ctx.fillStyle = pt.color;
      ctx.globalAlpha = alpha;
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, pt.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;

      if (pt.life <= 0) {
        particles.splice(i, 1);
      }
    }
  };

  const drawInteractionPrompt = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    text: string
  ) => {
    ctx.font = 'bold 11px "Outfit", sans-serif';
    const textWidth = ctx.measureText(text).width;
    const pad = 8;

    ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
    ctx.strokeStyle = '#22c55e';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(x - textWidth / 2 - pad, y - 12, textWidth + pad * 2, 22, [6]);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, x, y);
  };

  const drawAtmosphereOverlay = (
    ctx: CanvasRenderingContext2D,
    w: number,
    h: number,
    state: GameState
  ) => {
    // If environment is polluted, draw greyish/yellowish smog vignette
    if (state.environmentHealth < 60 && state.phase !== 'PLAYING_WEEK_LATER') {
      const smogOpacity = (60 - state.environmentHealth) / 60 * 0.22;
      ctx.fillStyle = `rgba(100, 116, 139, ${smogOpacity})`;
      ctx.fillRect(0, 0, w, h);
    } else if (state.phase === 'PLAYING_WEEK_LATER' && state.outcome === 'THRIVING') {
      // Golden fresh warm sunlight overlay
      ctx.fillStyle = 'rgba(253, 224, 71, 0.04)';
      ctx.fillRect(0, 0, w, h);
    } else if (state.phase === 'PLAYING_WEEK_LATER' && state.outcome === 'RELAPSED') {
      // Toxic heavy grey overlay
      ctx.fillStyle = 'rgba(40, 50, 40, 0.28)';
      ctx.fillRect(0, 0, w, h);
    }
  };

  return (
    <div className="relative w-full h-full overflow-hidden select-none bg-slate-950">
      <canvas
        ref={canvasRef}
        onPointerDown={handleCanvasPointerDown}
        className="block w-full h-full cursor-crosshair touch-none"
      />
    </div>
  );
};
