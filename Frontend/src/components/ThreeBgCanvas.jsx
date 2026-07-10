import React, { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import * as THREE from "three";

// Reusable Theme Configurations for Sports-Themed 3D Atmospheric Backgrounds (Refined for ArenaSync)
const THEME_CONFIGS = {
  home: {
    particleCount: 50,
    colors: ["#2563EB", "#0F4C81", "#D4AF37", "#F8FAFC"],
    shapes: [
      { type: "pitch-grid", width: 60, height: 40, opacity: 0.2, color: 0x2563EB, y: -10 },
      { type: "spotlight", radius: 3, height: 18, x: -18, y: 9, z: -8, rz: -Math.PI / 6, color: 0x0F4C81, opacity: 0.2 },
      { type: "spotlight", radius: 3, height: 18, x: 18, y: 9, z: -8, rz: Math.PI / 6, color: 0xD4AF37, opacity: 0.15 },
      { type: "kinetic-orbit", radius: 8, opacity: 0.25, color: 0xF8FAFC, rx: 0.3, ry: 0.4 }
    ]
  },
  profile: {
    particleCount: 40,
    colors: ["#2563EB", "#0F4C81", "#D4AF37", "#F8FAFC"],
    shapes: [
      { type: "kinetic-orbit", radius: 6, opacity: 0.25, color: 0x2563EB, rx: 0.2, ry: 0.3 },
      { type: "kinetic-orbit", radius: 9, opacity: 0.2, color: 0xD4AF37, rx: -0.4, ry: 0.5 },
      { type: "trophy-silhouettes", opacity: 0.25, color: 0xD4AF37 }
    ]
  },
  team: {
    particleCount: 40,
    colors: ["#2563EB", "#0F4C81", "#F8FAFC"],
    shapes: [
      { type: "tactical-lines", opacity: 0.3, color: 0x2563EB },
      { type: "spotlight", radius: 2.5, height: 18, x: -14, y: 8, z: -6, rz: -Math.PI / 6, color: 0x0F4C81, opacity: 0.25 }
    ]
  },
  tournament: {
    particleCount: 45,
    colors: ["#2563EB", "#0F4C81", "#D4AF37", "#F8FAFC"],
    shapes: [
      { type: "bracket-frames", opacity: 0.3, color: 0x0F4C81 },
      { type: "trophy-silhouettes", opacity: 0.25, color: 0xD4AF37 }
    ]
  },
  events: {
    particleCount: 45,
    colors: ["#2563EB", "#0F4C81", "#F8FAFC"],
    shapes: [
      { type: "stadium-roof", radius: 14, opacity: 0.35, color: 0x2563EB },
      { type: "spotlight", radius: 2.2, height: 18, x: -14, y: 8, z: -6, rz: -Math.PI / 6, color: 0x0F4C81, opacity: 0.3 },
      { type: "spotlight", radius: 2.2, height: 18, x: 14, y: 8, z: -6, rz: Math.PI / 6, color: 0x0F4C81, opacity: 0.3 }
    ]
  },
  match: {
    particleCount: 40,
    colors: ["#2563EB", "#0F4C81", "#D4AF37", "#F8FAFC"],
    shapes: [
      { type: "pitch-grid", width: 50, height: 32, opacity: 0.35, color: 0x2563EB, y: -9 },
      { type: "spotlight", radius: 2, height: 20, x: -18, y: 10, z: -6, rz: -Math.PI / 5, color: 0x0F4C81, opacity: 0.25 },
      { type: "spotlight", radius: 2, height: 20, x: 18, y: 10, z: -6, rz: Math.PI / 5, color: 0xD4AF37, opacity: 0.15 }
    ]
  },
  analytics: {
    particleCount: 45,
    colors: ["#2563EB", "#0F4C81", "#F8FAFC"],
    shapes: [
      { type: "grid-floor", size: 50, divisions: 16, opacity: 0.25, color1: 0x2563EB, color2: 0x0F4C81, y: -9 },
      { type: "kinetic-orbit", radius: 6, opacity: 0.25, color: 0x2563EB, rx: Math.PI / 2.3, ry: 0.1 }
    ]
  },
  default: {
    particleCount: 40,
    colors: ["#2563EB", "#0F4C81", "#F8FAFC"],
    shapes: [
      { type: "pitch-grid", width: 45, height: 30, opacity: 0.25, color: 0x2563EB, y: -8 },
      { type: "spotlight", radius: 2.5, height: 18, x: -14, y: 8, z: -6, rz: -Math.PI / 6, color: 0x0F4C81, opacity: 0.25 }
    ]
  },
  tournaments_page: {
    particleCount: 65,
    colors: ["#2563EB", "#0F4C81", "#D4AF37", "#F8FAFC"],
    shapes: [
      { type: "stadium-roof", radius: 14, opacity: 0.45, color: 0x2563EB },
      { type: "spotlight", radius: 3.5, height: 22, x: -16, y: 10, z: -8, rz: -Math.PI / 6, color: 0x0F4C81, opacity: 0.4 },
      { type: "spotlight", radius: 3.5, height: 22, x: 16, y: 10, z: -8, rz: Math.PI / 6, color: 0x0F4C81, opacity: 0.4 },
      { type: "pitch-grid", width: 60, height: 40, opacity: 0.35, color: 0x2563EB, y: -10 },
      { type: "bracket-frames", opacity: 0.35, color: 0x0F4C81 },
      { type: "trophy-silhouettes", opacity: 0.25, color: 0xD4AF37 }
    ]
  }
};

const getThemeFromPathname = (path) => {
  if (path === "/") return "home";
  if (path.includes("/profile")) return "profile";
  if (
    path.includes("/my-teams") ||
    path.includes("/team") ||
    path.includes("/teams") ||
    path.includes("/approve-players") ||
    path.includes("/players/approve")
  ) {
    return "team";
  }
  if (path.includes("/leaderboard")) return "tournament";
  if (path.includes("/tournament")) {
    if (path.startsWith("/tournaments") || path === "/tournaments") return "tournaments_page";
    return "tournament";
  }
  if (
    path.includes("/events") ||
    path.includes("/schedule") ||
    path.includes("/venue") ||
    path.includes("/sponsors") ||
    path.includes("/gallery") ||
    path.includes("/speakers")
  ) {
    return "events";
  }
  if (path.includes("/match") || path.includes("/matches")) {
    return "match";
  }
  if (path.includes("/analytics") || path.includes("/reports")) {
    return "analytics";
  }
  return "default";
};

// Helper to draw a 2D trophy silhouette outline in Three.js
const drawTrophyShape = (x, y, z, scale, color, opacity) => {
  const shape = new THREE.Shape();
  shape.moveTo(0, -2);
  shape.lineTo(1.5, -2); // Base bottom
  shape.lineTo(1, -1.6);
  shape.lineTo(0.3, -1.6);
  shape.lineTo(0.3, -0.8); // Stem
  shape.lineTo(1.5, 0.5);  // Cup bottom
  shape.lineTo(1.8, 2);    // Cup top rim
  shape.lineTo(-1.8, 2);   // Cup top left
  shape.lineTo(-1.5, 0.5); // Cup bottom left
  shape.lineTo(-0.3, -0.8); // Stem left
  shape.lineTo(-0.3, -1.6);
  shape.lineTo(-1, -1.6);
  shape.lineTo(-1.5, -2);
  shape.lineTo(0, -2);

  const points = shape.getPoints();
  const geom = new THREE.BufferGeometry().setFromPoints(points.map(p => new THREE.Vector3(p.x * scale + x, p.y * scale + y, z)));
  const mat = new THREE.LineBasicMaterial({ color, transparent: true, opacity });
  const trophyLine = new THREE.Line(geom, mat);

  // Left Handle
  const handleLeftPoints = [];
  for (let i = 0; i <= 16; i++) {
    const theta = Math.PI / 2 + (i / 16) * Math.PI;
    handleLeftPoints.push(new THREE.Vector3(
      (-1.5 + Math.cos(theta) * 0.7) * scale + x,
      (1.1 + Math.sin(theta) * 0.7) * scale + y,
      z
    ));
  }
  const handleGeomLeft = new THREE.BufferGeometry().setFromPoints(handleLeftPoints);
  const handleLeft = new THREE.Line(handleGeomLeft, mat);

  // Right Handle
  const handleRightPoints = [];
  for (let i = 0; i <= 16; i++) {
    const theta = -Math.PI / 2 + (i / 16) * Math.PI;
    handleRightPoints.push(new THREE.Vector3(
      (1.5 + Math.cos(theta) * 0.7) * scale + x,
      (1.1 + Math.sin(theta) * 0.7) * scale + y,
      z
    ));
  }
  const handleGeomRight = new THREE.BufferGeometry().setFromPoints(handleRightPoints);
  const handleRight = new THREE.Line(handleGeomRight, mat);

  const group = new THREE.Group();
  group.add(trophyLine);
  group.add(handleLeft);
  group.add(handleRight);
  return group;
};

// Helper to draw a 2D medal silhouette outline in Three.js
const drawMedalShape = (x, y, z, scale, color, opacity) => {
  const group = new THREE.Group();
  const mat = new THREE.LineBasicMaterial({ color, transparent: true, opacity });
  
  // Outer Medal Circle
  const circlePoints = [];
  for (let i = 0; i <= 32; i++) {
    const theta = (i / 32) * Math.PI * 2;
    circlePoints.push(new THREE.Vector3(Math.cos(theta) * scale + x, Math.sin(theta) * scale + y, z));
  }
  const circleGeom = new THREE.BufferGeometry().setFromPoints(circlePoints);
  group.add(new THREE.Line(circleGeom, mat));

  // Inner Medal Star Motif
  const starPoints = [];
  for (let i = 0; i < 5; i++) {
    const theta1 = (i / 5) * Math.PI * 2 - Math.PI / 2;
    starPoints.push(new THREE.Vector3(Math.cos(theta1) * scale * 0.4 + x, Math.sin(theta1) * scale * 0.4 + y, z));
    const theta2 = ((i + 0.5) / 5) * Math.PI * 2 - Math.PI / 2;
    starPoints.push(new THREE.Vector3(Math.cos(theta2) * scale * 0.18 + x, Math.sin(theta2) * scale * 0.18 + y, z));
  }
  starPoints.push(starPoints[0]);
  const starGeom = new THREE.BufferGeometry().setFromPoints(starPoints);
  group.add(new THREE.Line(starGeom, mat));

  // Medal Ribbon
  const ribbonPoints = [
    new THREE.Vector3(-0.4 * scale + x, 0.8 * scale + y, z),
    new THREE.Vector3(-0.6 * scale + x, 1.8 * scale + y, z),
    new THREE.Vector3(0 * scale + x, 1.6 * scale + y, z),
    new THREE.Vector3(0.6 * scale + x, 1.8 * scale + y, z),
    new THREE.Vector3(0.4 * scale + x, 0.8 * scale + y, z),
  ];
  const ribbonGeom = new THREE.BufferGeometry().setFromPoints(ribbonPoints);
  group.add(new THREE.Line(ribbonGeom, mat));

  return group;
};

export default function ThreeBgCanvas() {
  const containerRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
  const location = useLocation();
  const theme = getThemeFromPathname(location.pathname);

  useEffect(() => {
    if (!containerRef.current) return;

    const config = THEME_CONFIGS[theme] || THEME_CONFIGS.default;

    // 1. Setup Scene, Camera, and WebGLRenderer
    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 100);
    camera.position.z = 25;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    containerRef.current.appendChild(renderer.domElement);

    // 2. Generate 3D Particle Cloud
    const particleCount = config.particleCount;
    const particlesGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const colorPalette = config.colors.map(c => new THREE.Color(c));

    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 50;
      positions[i + 1] = (Math.random() - 0.5) * 35;
      positions[i + 2] = (Math.random() - 0.5) * 25;

      const randomColor = colorPalette[Math.floor(Math.random() * colorPalette.length)];
      colors[i] = randomColor.r;
      colors[i + 1] = randomColor.g;
      colors[i + 2] = randomColor.b;
    }

    particlesGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    particlesGeometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    // Particle Texture creation dynamically
    const canvasTexture = document.createElement("canvas");
    canvasTexture.width = 16;
    canvasTexture.height = 16;
    const ctx = canvasTexture.getContext("2d");
    const gradient = ctx.createRadialGradient(8, 8, 0, 8, 8, 8);
    gradient.addColorStop(0, "rgba(255,255,255,1)");
    gradient.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 16, 16);
    const pTexture = new THREE.CanvasTexture(canvasTexture);

    const isTournamentsPage = theme === "tournaments_page";
    const particlesMaterial = new THREE.PointsMaterial({
      size: isTournamentsPage ? 0.45 : 0.35,
      vertexColors: true,
      map: pTexture,
      transparent: true,
      opacity: isTournamentsPage ? 0.45 : 0.34,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const particleSystem = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particleSystem);

    // 3. Floating 3D Geometric Atmospheric Outlines based on Page Theme Config
    const shapes = [];

    config.shapes.forEach((s) => {
      if (s.type === "pitch-grid") {
        const pitchGroup = new THREE.Group();
        const lineMat = new THREE.LineBasicMaterial({
          color: s.color,
          transparent: true,
          opacity: s.opacity
        });

        // Outer border of pitch
        const borderPoints = [
          new THREE.Vector3(-s.width / 2, 0, -s.height / 2),
          new THREE.Vector3(s.width / 2, 0, -s.height / 2),
          new THREE.Vector3(s.width / 2, 0, s.height / 2),
          new THREE.Vector3(-s.width / 2, 0, s.height / 2),
          new THREE.Vector3(-s.width / 2, 0, -s.height / 2)
        ];
        const borderGeom = new THREE.BufferGeometry().setFromPoints(borderPoints);
        pitchGroup.add(new THREE.Line(borderGeom, lineMat));

        // Center line
        const centerPoints = [
          new THREE.Vector3(0, 0, -s.height / 2),
          new THREE.Vector3(0, 0, s.height / 2)
        ];
        const centerGeom = new THREE.BufferGeometry().setFromPoints(centerPoints);
        pitchGroup.add(new THREE.Line(centerGeom, lineMat));

        // Center circle
        const circleGeom = new THREE.RingGeometry(s.height / 6, s.height / 6 + 0.05, 32);
        const circleMat = new THREE.MeshBasicMaterial({
          color: s.color,
          transparent: true,
          opacity: s.opacity,
          side: THREE.DoubleSide
        });
        const circleMesh = new THREE.Mesh(circleGeom, circleMat);
        circleMesh.rotation.x = Math.PI / 2;
        pitchGroup.add(circleMesh);

        // Penalty boxes (Left & Right)
        const penaltyBoxWidth = s.width / 6;
        const penaltyBoxHeight = s.height * 0.6;
        const leftBoxPoints = [
          new THREE.Vector3(-s.width / 2, 0, -penaltyBoxHeight / 2),
          new THREE.Vector3(-s.width / 2 + penaltyBoxWidth, 0, -penaltyBoxHeight / 2),
          new THREE.Vector3(-s.width / 2 + penaltyBoxWidth, 0, penaltyBoxHeight / 2),
          new THREE.Vector3(-s.width / 2, 0, penaltyBoxHeight / 2)
        ];
        pitchGroup.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(leftBoxPoints), lineMat));

        const rightBoxPoints = [
          new THREE.Vector3(s.width / 2, 0, -penaltyBoxHeight / 2),
          new THREE.Vector3(s.width / 2 - penaltyBoxWidth, 0, -penaltyBoxHeight / 2),
          new THREE.Vector3(s.width / 2 - penaltyBoxWidth, 0, penaltyBoxHeight / 2),
          new THREE.Vector3(s.width / 2, 0, penaltyBoxHeight / 2)
        ];
        pitchGroup.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(rightBoxPoints), lineMat));

        pitchGroup.position.set(0, s.y || -9, -6);
        pitchGroup.rotation.x = -Math.PI / 2.2;
        scene.add(pitchGroup);
        shapes.push({ mesh: pitchGroup, spin: "none", type: s.type });
      } 
      else if (s.type === "spotlight") {
        const geom = new THREE.ConeGeometry(s.radius, s.height, 12, 1, true);
        const mat = new THREE.MeshBasicMaterial({
          color: s.color,
          wireframe: true,
          transparent: true,
          opacity: s.opacity,
        });
        const mesh = new THREE.Mesh(geom, mat);
        mesh.position.set(s.x || 0, s.y || 0, s.z || 0);
        if (s.rz !== undefined) mesh.rotation.z = s.rz;
        scene.add(mesh);
        shapes.push({ mesh, spin: s.rz ? (s.rz < 0 ? "spotlight-left" : "spotlight-right") : "none", type: s.type });
      } 
      else if (s.type === "kinetic-orbit") {
        const trackGroup = new THREE.Group();
        // Concentric running track lanes
        for (let r = s.radius; r < s.radius + 1.2; r += 0.3) {
          const geom = new THREE.RingGeometry(r, r + 0.03, 64);
          const mat = new THREE.MeshBasicMaterial({
            color: s.color,
            transparent: true,
            opacity: s.opacity,
            side: THREE.DoubleSide
          });
          const mesh = new THREE.Mesh(geom, mat);
          trackGroup.add(mesh);
        }
        if (s.rx !== undefined) trackGroup.rotation.x = s.rx;
        if (s.ry !== undefined) trackGroup.rotation.y = s.ry;
        trackGroup.position.set(s.x || 0, s.y || 0, s.z || 0);
        scene.add(trackGroup);
        shapes.push({ mesh: trackGroup, spin: "orbit-tracks", type: s.type });
      } 
      else if (s.type === "tactical-lines") {
        const tacticalGroup = new THREE.Group();
        const lineMat = new THREE.LineBasicMaterial({
          color: s.color,
          transparent: true,
          opacity: s.opacity,
        });

        // Node points (Team Network Nodes)
        const nodeGeom = new THREE.BufferGeometry();
        const nodePositions = [];
        
        const tacticalPoints = [
          new THREE.Vector3(-14, -2, -6),
          new THREE.Vector3(-8, 4, -5),
          new THREE.Vector3(-8, -5, -5),
          new THREE.Vector3(2, 3, -4),
          new THREE.Vector3(2, -3, -4),
          new THREE.Vector3(12, 1, -5),
        ];

        tacticalPoints.forEach(p => {
          nodePositions.push(p.x, p.y, p.z);
        });

        nodeGeom.setAttribute("position", new THREE.Float32BufferAttribute(nodePositions, 3));
        const nodeMat = new THREE.PointsMaterial({
          color: s.color,
          size: 0.4,
          transparent: true,
          opacity: s.opacity * 1.5
        });
        const nodeSystem = new THREE.Points(nodeGeom, nodeMat);
        tacticalGroup.add(nodeSystem);

        const linePairs = [
          [0, 1], [0, 2], [1, 2],
          [1, 3], [2, 4], [3, 4],
          [3, 5], [4, 5]
        ];
        const linePoints = [];
        linePairs.forEach(([i, j]) => {
          linePoints.push(tacticalPoints[i]);
          linePoints.push(tacticalPoints[j]);
        });
        const lineGeom = new THREE.BufferGeometry().setFromPoints(linePoints);
        const lines = new THREE.LineSegments(lineGeom, lineMat);
        tacticalGroup.add(lines);

        scene.add(tacticalGroup);
        shapes.push({ mesh: tacticalGroup, spin: "tactical-board", type: s.type });
      } 
      else if (s.type === "bracket-frames") {
        const bracketGroup = new THREE.Group();
        const lineMat = new THREE.LineBasicMaterial({
          color: s.color,
          transparent: true,
          opacity: s.opacity,
        });

        // Draw structured orthogonal tournament brackets in space
        const drawBracketBranch = (startX, startY, startZ, width, height, direction) => {
          const points = [
            new THREE.Vector3(startX, startY - height / 2, startZ),
            new THREE.Vector3(startX + width * direction, startY - height / 2, startZ),
            new THREE.Vector3(startX + width * direction, startY + height / 2, startZ),
            new THREE.Vector3(startX, startY + height / 2, startZ),
          ];
          const geom = new THREE.BufferGeometry().setFromPoints(points);
          bracketGroup.add(new THREE.Line(geom, lineMat));

          const connPoints = [
            new THREE.Vector3(startX + width * direction, startY, startZ),
            new THREE.Vector3(startX + width * direction * 1.8, startY, startZ)
          ];
          bracketGroup.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(connPoints), lineMat));
        };

        // Draw left side bracket (quarter/semi)
        drawBracketBranch(-16, 5, -8, 2, 4, 1);
        drawBracketBranch(-16, -5, -8, 2, 4, 1);
        
        // Draw right side bracket (quarter/semi)
        drawBracketBranch(16, 5, -8, 2, 4, -1);
        drawBracketBranch(16, -5, -8, 2, 4, -1);

        // Semifinal connection lines
        const leftSemiPoints = [
          new THREE.Vector3(-12.4, 5, -8),
          new THREE.Vector3(-12.4, 0, -8),
          new THREE.Vector3(-12.4, -5, -8)
        ];
        bracketGroup.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(leftSemiPoints), lineMat));

        const rightSemiPoints = [
          new THREE.Vector3(12.4, 5, -8),
          new THREE.Vector3(12.4, 0, -8),
          new THREE.Vector3(12.4, -5, -8)
        ];
        bracketGroup.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(rightSemiPoints), lineMat));

        // Connect both sides to final center
        const finalPoints = [
          new THREE.Vector3(-12.4, 0, -8),
          new THREE.Vector3(12.4, 0, -8)
        ];
        bracketGroup.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(finalPoints), lineMat));

        scene.add(bracketGroup);
        shapes.push({ mesh: bracketGroup, spin: "rotate-slow", type: s.type });
      } 
      else if (s.type === "stadium-roof") {
        const roofGroup = new THREE.Group();
        // Concentric stadium arches
        for (let r = s.radius; r < s.radius + 1.6; r += 0.4) {
          const geom = new THREE.RingGeometry(r, r + 0.05, 64);
          const mat = new THREE.MeshBasicMaterial({
            color: s.color,
            transparent: true,
            opacity: s.opacity,
            side: THREE.DoubleSide
          });
          const mesh = new THREE.Mesh(geom, mat);
          roofGroup.add(mesh);
        }
        roofGroup.rotation.x = Math.PI / 2;
        roofGroup.position.set(0, 10, -8);
        scene.add(roofGroup);
        shapes.push({ mesh: roofGroup, spin: "none", type: s.type });
      } 
      else if (s.type === "grid-floor") {
        const gridHelper = new THREE.GridHelper(s.size, s.divisions, s.color1, s.color2);
        gridHelper.position.set(0, s.y || -9, -5);
        gridHelper.material.transparent = true;
        gridHelper.material.opacity = s.opacity;
        scene.add(gridHelper);
        shapes.push({ mesh: gridHelper, spin: "none", type: s.type });
      }
      else if (s.type === "trophy-silhouettes") {
        const trophyGroup = new THREE.Group();
        const trophy = drawTrophyShape(-12, 6, -9, 1.8, s.color, s.opacity);
        const medal = drawMedalShape(12, -6, -9, 1.8, s.color, s.opacity);
        trophyGroup.add(trophy);
        trophyGroup.add(medal);
        scene.add(trophyGroup);
        shapes.push({ mesh: trophyGroup, spin: "rotate-slow", type: s.type });
      }
    });

    // Gentle ambient lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    // 4. Mouse movement tracking
    const handleMouseMove = (event) => {
      const x = (event.clientX / window.innerWidth) - 0.5;
      const y = (event.clientY / window.innerHeight) - 0.5;
      mouseRef.current.targetX = x * 8;
      mouseRef.current.targetY = -y * 5;
    };

    window.addEventListener("mousemove", handleMouseMove);

    // 5. Canvas resizing with ResizeObserver to track full document/container height
    const handleResize = () => {
      if (!containerRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    const resizeObserver = new ResizeObserver(() => {
      handleResize();
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    // 6. Animation Loop
    let animationFrameId;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      // Lerp mouse coordinates
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.05;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.05;

      camera.position.x += (mouseRef.current.x - camera.position.x) * 0.05;
      camera.position.y += (mouseRef.current.y - camera.position.y) * 0.05;
      camera.lookAt(scene.position);

      // Spin particles
      particleSystem.rotation.y += 0.0003;
      particleSystem.rotation.x += 0.0001;

      // Animate shapes
      shapes.forEach((item, idx) => {
        const { mesh, spin } = item;
        if (!mesh) return;

        if (spin === "rotate-slow") {
          mesh.rotation.y += 0.0003;
          mesh.position.y += Math.sin(Date.now() * 0.0008 + idx) * 0.001;
        } else if (spin === "orbit-tracks") {
          mesh.rotation.z += 0.0008;
        } else if (spin === "tactical-board") {
          mesh.rotation.y = Math.sin(Date.now() * 0.0002) * 0.05;
          mesh.rotation.x = Math.cos(Date.now() * 0.0001) * 0.03;
        } else if (spin === "spotlight-left") {
          mesh.rotation.y = Math.sin(Date.now() * 0.0004) * 0.04;
        } else if (spin === "spotlight-right") {
          mesh.rotation.y = Math.cos(Date.now() * 0.0004) * 0.04;
        }
      });

      renderer.render(scene, camera);
    };

    animate();

    // Recursive scene deallocation function to prevent memory leaks
    const disposeHierarchy = (obj) => {
      obj.traverse((child) => {
        if (child.geometry) child.geometry.dispose();
        if (child.material) {
          if (Array.isArray(child.material)) {
            child.material.forEach((m) => m.dispose());
          } else {
            child.material.dispose();
          }
        }
      });
    };

    // 7. Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("mousemove", handleMouseMove);
      if (resizeObserver) {
        resizeObserver.disconnect();
      }

      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }

      particlesGeometry.dispose();
      particlesMaterial.dispose();
      pTexture.dispose();

      disposeHierarchy(scene);
      renderer.dispose();
    };
  }, [theme]);

  return (
    <div
      ref={containerRef}
      className="three-bg-canvas"
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: "100%",
        height: "100%",
        zIndex: 0,
        pointerEvents: "none",
        overflow: "hidden",
      }}
    />
  );
}
