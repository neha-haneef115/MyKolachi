'use client';

import React, { useEffect, useRef, useState, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

// ==================== TYPES ====================
type AnimationPhase = 'globe' | 'map-3d';

// ==================== STL PARSER ====================
function parseSTLBinary(buffer: ArrayBuffer): THREE.BufferGeometry | null {
  try {
    const view = new DataView(buffer);
    const numTriangles = view.getUint32(80, true);
    
    const vertices: number[] = [];
    const normals: number[] = [];
    
    let offset = 84;
    
    for (let i = 0; i < numTriangles; i++) {
      const nx = view.getFloat32(offset, true);
      const ny = view.getFloat32(offset + 4, true);
      const nz = view.getFloat32(offset + 8, true);
      offset += 12;
      
      for (let j = 0; j < 3; j++) {
        vertices.push(
          view.getFloat32(offset, true),
          view.getFloat32(offset + 4, true),
          view.getFloat32(offset + 8, true)
        );
        normals.push(nx, ny, nz);
        offset += 12;
      }
      
      offset += 2;
    }
    
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    geometry.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
    
    return geometry;
  } catch (error) {
    console.error('STL parsing error:', error);
    return null;
  }
}

// ==================== 3D KARACHI MAP (STL) ====================
const Map3D: React.FC<{ opacity: number; rotating: boolean }> = ({ opacity, rotating }) => {
  const mapRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  const [geometry, setGeometry] = useState<THREE.BufferGeometry | null>(null);

  useEffect(() => {
    fetch('/karachi-map.stl')
      .then(response => {
        if (!response.ok) throw new Error('STL file not found');
        return response.arrayBuffer();
      })
      .then(buffer => {
        const geometry = parseSTLBinary(buffer);
        if (geometry) {
          geometry.center();
          geometry.computeVertexNormals();
          geometry.computeBoundingBox();
          setGeometry(geometry);
        }
      })
      .catch(error => {
        console.warn('STL loading failed:', error.message);
        setGeometry(null);
      });
  }, []);

  useFrame((_, delta) => {
    if (groupRef.current && rotating) {
      groupRef.current.rotation.z += delta * 0.5;
    }
  });

  if (!geometry) return null;

  let scale = 1;
  if (geometry.boundingBox) {
    const bbox = geometry.boundingBox;
    const size = new THREE.Vector3();
    bbox.getSize(size);
    const maxDim = Math.max(size.x, size.y, size.z);
    scale = 10 / maxDim;
  }

  return (
    <group ref={groupRef} position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <mesh 
        ref={mapRef} 
        geometry={geometry}
        rotation={[0, 0, 0]} 
        scale={[scale, scale, scale]}
      >
        <meshStandardMaterial
          color="#808080"
          transparent
          opacity={opacity}
          side={THREE.DoubleSide}
          metalness={0.3}
          roughness={0.7}
        />
      </mesh>
    </group>
  );
};

// ==================== CAMERA CONTROLLER ====================
const CameraController: React.FC<{ phase: AnimationPhase }> = ({ phase }) => {
  const { camera } = useThree();

  useFrame(() => {
    if (phase === 'globe') {
      const targetPos = new THREE.Vector3(0, 1, 8);
      camera.position.lerp(targetPos, 0.05);
      camera.lookAt(0, 0, 0);
    } else if (phase === 'map-3d') {
      const targetPos = new THREE.Vector3(8, 10, 8);
      camera.position.lerp(targetPos, 0.03);
      camera.lookAt(0, 0, 0);
    }
  });

  return null;
};

// ==================== THREE.JS CANVAS SCENE ====================
const ThreeScene: React.FC<{ phase: AnimationPhase }> = ({ phase }) => {
  return (
    <>
      <color attach="background" args={['#000000']} />
      
      <ambientLight intensity={1.0} />
      <directionalLight position={[5, 5, 5]} intensity={2} castShadow />
      <directionalLight position={[-3, 3, -3]} intensity={1} />
      <pointLight position={[0, 8, 0]} intensity={1.2} />
      <hemisphereLight intensity={0.8} groundColor="#222222" />

      <Suspense fallback={null}>
        {phase === 'map-3d' && (
          <Map3D opacity={1} rotating={true} />
        )}
      </Suspense>
      
      <CameraController phase={phase} />

      {phase === 'map-3d' && (
        <OrbitControls
          enablePan={false}
          enableZoom={true}
          enableRotate={true}
          minDistance={5}
          maxDistance={20}
          minPolarAngle={Math.PI / 6}
          maxPolarAngle={Math.PI / 2.2}
          autoRotate={true}
          autoRotateSpeed={2}
        />
      )}
    </>
  );
};

// ==================== GLOBE.GL COMPONENT ====================
const GlobeOverlay: React.FC<{ onZoomStart: () => void; visible: boolean }> = ({ onZoomStart, visible }) => {
  const globeRef = useRef<HTMLDivElement | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [hasTriggered, setHasTriggered] = useState(false);

  useEffect(() => {
    if (!visible || typeof window === 'undefined' || !globeRef.current) return;
    
    let globeInstance: any;
    let cleanupFn: (() => void) | undefined;

    const init = async () => {
      try {
        const GlobeModule = (await import('globe.gl')).default;
        const Globe = GlobeModule;

        globeInstance = new Globe(globeRef.current!)
          .globeImageUrl('https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg')
          .bumpImageUrl('https://unpkg.com/three-globe/example/img/earth-topology.png')
          .backgroundColor('rgba(0,0,0,0)')
          .showAtmosphere(true)
.atmosphereColor('#3a9bdc') // soft bluish glow
.atmosphereAltitude(0.2) 
          .pointOfView({ lat: 20, lng: 70, altitude: 2.5 });

        const karachi = {
          lat: 24.8607,
          lng: 67.0011,
          name: 'Karachi',
          color: '#D94A2E',
          size: 1.8,
        };

        globeInstance
          .pointsData([karachi])
          .pointLat('lat')
          .pointLng('lng')
          .pointColor('color')
          .pointAltitude(0.02)
          .pointRadius('size')
          .pointsMerge(false);

        globeInstance
          .labelsData([karachi])
          .labelLat('lat')
          .labelLng('lng')
          .labelText('name')
          .labelSize(1.8)
          .labelColor(() => '#F2E9E2')
          .labelAltitude(0.08)
          .labelDotRadius(0.5)
          .labelResolution(2);

        globeInstance
          .arcsData([
            {
              startLat: -25,
              startLng: -120,
              endLat: karachi.lat,
              endLng: karachi.lng,
              color: ['#943204', '#D94A2E'],
            },
          ])
          .arcColor('color')
          .arcAltitude(0.6)
          .arcStroke(2)
          .arcDashLength(0.4)
          .arcDashGap(0.01)
          .arcDashAnimateTime(6000)
          .arcDashInitialGap(() => Math.random());

        const rings = Array.from({ length: 3 }, (_, i) => ({
          lat: karachi.lat,
          lng: karachi.lng,
          maxR: 3 + i * 2,
          propagationSpeed: 1 + i * 0.3,
          repeatPeriod: 2000 + i * 1000,
          color: '#D94A2E',
        }));

        globeInstance
          .ringsData(rings)
          .ringColor('color')
          .ringMaxRadius('maxR')
          .ringPropagationSpeed('propagationSpeed')
          .ringRepeatPeriod('repeatPeriod');

        if (globeRef.current) {
          globeRef.current.style.width = '100%';
          globeRef.current.style.height = '100%';
        }

        try {
          const controls = globeInstance.controls();
          if (controls) {
            controls.autoRotate = true;
            controls.autoRotateSpeed = 0.7;
            controls.enableZoom = false;
          }
        } catch (e) {
          console.warn('Controls not available');
        }

        if (!hasTriggered) {
          setHasTriggered(true);
          setTimeout(() => {
            handleZoomToKarachi();
          }, 6000);
        }

        const handleZoomToKarachi = () => {
          if (isTransitioning) return;
          setIsTransitioning(true);
          onZoomStart();

          const currentView = globeInstance.pointOfView();
          const duration = 5000;
          const startTime = Date.now();

          const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);

            const lat = currentView.lat + (karachi.lat - currentView.lat) * eased;
            const lng = currentView.lng + (karachi.lng - currentView.lng) * eased;
            const altitude = currentView.altitude + (0.02 - currentView.altitude) * eased;

            globeInstance.pointOfView({ lat, lng, altitude });

            if (progress < 1) {
              requestAnimationFrame(animate);
            }
          };

          animate();
        };

        const handleClick = () => {
          if (!isTransitioning && !hasTriggered) {
            setHasTriggered(true);
            handleZoomToKarachi();
          }
        };

        globeRef.current?.addEventListener('click', handleClick);

        cleanupFn = () => {
          globeRef.current?.removeEventListener('click', handleClick);
          if (globeRef.current) globeRef.current.innerHTML = '';
        };
      } catch (error) {
        console.error('Failed to initialize Globe.gl:', error);
      }
    };

    init();

    return () => {
      cleanupFn?.();
    };
  }, [visible, onZoomStart, isTransitioning]);

  if (!visible) return null;

  return (
    <div 
      ref={globeRef} 
      style={{ 
        width: '100%', 
        height: '100%',
        pointerEvents: 'auto',
      }} 
    />
  );
};

// ==================== TYPING ANIMATION ====================
const TypingText: React.FC = () => {
  const [displayedLines, setDisplayedLines] = useState<string[]>([]);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);

  const lines = [
  'City: Karachi, the pulse of Pakistan',
'Population: Around 20 million',
'Area: 591 square kilometers',
'Founded: 1729 as Kolachi village',
'Known for: Seaport, culture, and diversity',
'Spirit: A city that never sleeps'

  ];

  useEffect(() => {
    if (currentLineIndex >= lines.length) return;

    const currentLine = lines[currentLineIndex];
    
    if (currentCharIndex < currentLine.length) {
      const timeout = setTimeout(() => {
        setDisplayedLines(prev => {
          const newLines = [...prev];
          newLines[currentLineIndex] = currentLine.substring(0, currentCharIndex + 1);
          return newLines;
        });
        setCurrentCharIndex(prev => prev + 1);
      }, 30);
      return () => clearTimeout(timeout);
    } else {
      const timeout = setTimeout(() => {
        setCurrentLineIndex(prev => prev + 1);
        setCurrentCharIndex(0);
      }, 500);
      return () => clearTimeout(timeout);
    }
  }, [currentCharIndex, currentLineIndex]);

  return (
    <div className="space-y-6">
      {displayedLines.map((line, index) => (
        <div
          key={index}
          className="text-md font-light leading-[17px]"
          style={{
            color: '#F2E9E2',
            fontFamily: 'Geist, sans-serif',
            fontWeight: 300,
            animation: 'fadeIn 0.8s ease-in',
          }}
        >
          {line}
          {index === currentLineIndex && currentCharIndex === line.length && (
            <span 
              className="inline-block w-0.5 h-4 ml-1 animate-pulse" 
              style={{ backgroundColor: '#943204' }}
            />
          )}
        </div>
      ))}
    </div>
  );
};

// ==================== SYSTEM STATUS INDICATOR ====================
const SystemStatus: React.FC<{ phase: AnimationPhase }> = ({ phase }) => {
  const [time, setTime] = useState<string>('--:--:--');
  const [cpuLoad, setCpuLoad] = useState<number>(0);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString('en-US', { hour12: false }));
    };

    const interval = setInterval(updateTime, 1000);
    updateTime();

    // Simulate CPU load changes
    const cpuInterval = setInterval(() => {
      setCpuLoad(Math.floor(Math.random() * 40) + 10);
    }, 2000);

    return () => {
      clearInterval(interval);
      clearInterval(cpuInterval);
    };
  }, []);

  return (
    <div className="flex items-center gap-6 text-xs">
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
        <span style={{ color: 'rgba(242, 233, 226, 0.7)' }}>ONLINE</span>
      </div>
      <div className="flex items-center gap-2">
        <span style={{ color: 'rgba(242, 233, 226, 0.5)' }}>CPU:</span>
        <span style={{ color: '#943204' }}>{cpuLoad}%</span>
      </div>
      <div style={{ color: 'rgba(242, 233, 226, 0.5)' }}>{time}</div>
    </div>
  );
};

// ==================== ANIMATED SEPARATOR ====================
const AnimatedSeparator: React.FC = () => {
  return (
    <div className="relative h-4 mx-4">
      <div 
        className="w-px h-full"
        style={{
          background: 'linear-gradient(180deg, transparent, rgba(148, 50, 4, 0.6), transparent)',
          animation: 'pulse 2s ease-in-out infinite'
        }}
      />
    </div>
  );
};

// ==================== MAIN COMPONENT ====================
function GlobeToKarachiMap() {
  const [phase, setPhase] = useState<AnimationPhase>('globe');
  const [loaded, setLoaded] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);

  // Reset animation state when component mounts
  useEffect(() => {
    setPhase('globe');
    setHasAnimated(false);
    setLoaded(true);
    
    // Cleanup function to reset state when component unmounts
    return () => {
      setPhase('globe');
      setHasAnimated(false);
    };
  }, []);

  const handleZoomStart = () => {
    setPhase('map-3d');
  };

  const showCanvas = phase === 'map-3d';

  return (
    <div 
      className="relative w-full h-screen overflow-hidden"
      style={{ backgroundColor: '#000000' }}
    >
      {/* Subtle Grid Overlay */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div style={{
          backgroundImage: `
            linear-gradient(rgba(148, 50, 4, 0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(148, 50, 4, 0.3) 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px',
          width: '100%',
          height: '100%'
        }} />
      </div>

      {/* Enhanced Top Header Bar - Futuristic Software Interface */}
      <div 
        className="absolute top-0 left-0 right-0 h-16 flex items-center px-8 z-40"
        style={{ 
          background: 'linear-gradient(180deg, rgba(10, 10, 12, 0.95) 0%, rgba(8, 8, 10, 0.85) 100%)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(148, 50, 4, 0.15)',
          boxShadow: '0 0 30px rgba(148, 50, 4, 0.1)',
          opacity: loaded ? 1 : 0,
          transition: 'opacity 1s ease-in'
        }}
      >
        {/* System Logo and Title */}
        <div className="flex items-center gap-4">
          <div className="relative">
            <div 
              className="w-3 h-3 rounded-sm"
              style={{ 
                backgroundColor: '#943204',
                boxShadow: '0 0 15px rgba(148, 50, 4, 0.6)'
              }} 
            />
            <div 
              className="absolute -inset-1 rounded-sm border"
              style={{ 
                borderColor: 'rgba(148, 50, 4, 0.3)',
                animation: 'pulse 3s ease-in-out infinite'
              }}
            />
          </div>
          
          <div className="flex flex-col">
            <span 
              className="text-sm font-medium tracking-widest uppercase"
              style={{ 
                color: '#943204',
                fontFamily: 'Orbitron, monospace',
                fontWeight: 500,
                letterSpacing: '0.2em'
              }}
            >
              GEO-SPATIAL OS
            </span>
            <span 
              className="text-xs font-light tracking-wide"
              style={{ 
                color: 'rgba(242, 233, 226, 0.4)',
                fontFamily: 'Inter Tight, sans-serif'
              }}
            >
              v2.4.1
            </span>
          </div>
        </div>

        <AnimatedSeparator />

        {/* Navigation Status */}
        <div className="flex items-center gap-6">
          <div className="flex flex-col">
            <span 
              className="text-xs font-light tracking-wide"
              style={{ 
                color: 'rgba(242, 233, 226, 0.5)',
                fontFamily: 'Inter Tight, sans-serif'
              }}
            >
              ACTIVE MODE
            </span>
            <span 
              className="text-sm font-medium uppercase"
              style={{ 
                color: phase === 'globe' ? '#943204' : '#F2E9E2',
                fontFamily: 'Orbitron, monospace'
              }}
            >
              {phase === 'globe' ? 'ORBITAL VIEW' : '3D CITY MAP'}
            </span>
          </div>
        </div>

        <div className="ml-auto flex items-center gap-8">
          {/* System Metrics */}
          <div className="flex items-center gap-6">
            <div className="text-right">
              <span 
                className="text-xs font-light block"
                style={{ 
                  color: 'rgba(242, 233, 226, 0.4)',
                  fontFamily: 'Inter Tight, sans-serif'
                }}
              >
                RENDER
              </span>
              <span 
                className="text-sm font-medium"
                style={{ 
                  color: '#943204',
                  fontFamily: 'Orbitron, monospace'
                }}
              >
                {phase === 'globe' ? 'GLOBE-V1' : '3D-MESH'}
              </span>
            </div>
            
            <AnimatedSeparator />
            
            <SystemStatus phase={phase} />
          </div>
        </div>
      </div>

      {/* Main Content Container */}
      <div className="absolute inset-0 flex pt-10">
        
        {/* Left Panel - Text Content */}
        <div 
          className="w-1/2 flex items-center justify-center relative"
          style={{
            opacity: loaded ? 1 : 0,
            transform: loaded ? 'translateX(0)' : 'translateX(-20px)',
            transition: 'opacity 1.2s ease-out, transform 1.2s ease-out'
          }}
        >
          {/* Vertical Accent Line */}
          <div 
            className="absolute left-0 top-1/4 bottom-1/4 w-px"
            style={{
              background: 'linear-gradient(180deg, transparent, rgba(148, 50, 4, 0.4), transparent)'
            }}
          />

          <div className="max-w-xl px-5 relative">
            {/* Minimal Frame Corner - Top Left */}
            <div 
              className="absolute -top-8 -left-12 w-12 h-12 border-l border-t"
              style={{ 
                borderColor: 'rgba(148, 50, 4, 0.3)',
                opacity: loaded ? 1 : 0,
                transition: 'opacity 1.5s ease-out 0.3s'
              }}
            />

            <h1 
              className="text-7xl mb-8 tracking-tight"
              style={{
                color: '#943204',
                fontFamily: 'Montserrat, serif',
                fontWeight: 600,
                letterSpacing: '-0.03em',
                textShadow: '0 0 40px rgba(148, 50, 4, 0.2)'
              }}
            >
              3D Geography
            </h1>

            {/* Glowing Divider */}
            <div 
              className="w-54 h-px mb-10"
              style={{
                background: 'linear-gradient(90deg, rgba(148, 50, 4, 0.6), transparent)',
                boxShadow: '0 0 10px rgba(148, 50, 4, 0.4)'
              }}
            />
            
            <TypingText />
            
            {/* Coordinates Section */}
            <div className="mt-10 pt-8 relative">
              <div 
                className="absolute top-0 left-0 w-full h-px"
                style={{
                  background: 'linear-gradient(90deg, rgba(148, 50, 4, 0.3), transparent 50%)'
                }}
              />
              <div 
                className="text-xs font-light tracking-wider uppercase flex items-center gap-2"
                style={{ 
                  color: 'rgba(242, 233, 226, 0.5)',
                  fontFamily: 'Inter Tight, sans-serif'
                }}
              >
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <circle cx="6" cy="6" r="5" stroke="rgba(148, 50, 4, 0.6)" strokeWidth="0.5"/>
                  <circle cx="6" cy="6" r="1" fill="rgba(148, 50, 4, 0.8)"/>
                </svg>
                24.8607°N, 67.0011°E
              </div>
            </div>

            {/* Minimal Frame Corner - Bottom Right */}
            <div 
              className="absolute -bottom-4 -right-16 w-12 h-12 border-r border-b"
              style={{ 
                borderColor: 'rgba(148, 50, 4, 0.3)',
                opacity: loaded ? 1 : 0,
                transition: 'opacity 1.5s ease-out 0.3s'
              }}
            />
          </div>
        </div>

        {/* Right Panel - 3D Visualization */}
        <div 
          className="w-1/2 flex items-center justify-center relative"
          style={{
            opacity: loaded ? 1 : 0,
            transform: loaded ? 'translateX(0)' : 'translateX(20px)',
            transition: 'opacity 1.2s ease-out 0.2s, transform 1.2s ease-out 0.2s'
          }}
        >
          {phase === 'globe' && !hasAnimated ? (
            <div className="w-full h-full flex items-center justify-center -translate-x-90">
              <GlobeOverlay onZoomStart={handleZoomStart} visible={true} />
            </div>
          ) : (
            <div style={{ 
              position: 'absolute',
              top: '45%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '550px',
              height: '550px',
              overflow: 'visible',
              zIndex: 10
            }}>
              <Canvas 
                camera={{ position: [0, 1, 8], fov: 55 }} 
                gl={{ antialias: true, alpha: true }}
              >
                <ThreeScene phase={phase} />
              </Canvas>
            </div>
          )}
        </div>
      </div>

      {/* Enhanced Bottom Info Bar - Futuristic Dashboard */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-12 flex items-center justify-between px-8 z-40"
        style={{ 
          background: 'linear-gradient(0deg, rgba(10, 10, 12, 0.95) 0%, rgba(8, 8, 10, 0.85) 100%)',
          backdropFilter: 'blur(20px)',
          borderTop: '1px solid rgba(148, 50, 4, 0.15)',
          boxShadow: '0 0 30px rgba(148, 50, 4, 0.1)',
          opacity: loaded ? 1 : 0,
          transition: 'opacity 1s ease-in 0.5s'
        }}
      >
        {/* Left Section - Location Data */}
        <div className="flex items-center gap-8">
          <div className="flex flex-col">
            <span 
              className="text-xs font-light tracking-wider uppercase"
              style={{ 
                color: 'rgba(242, 233, 226, 0.4)',
                fontFamily: 'Inter Tight, sans-serif'
              }}
            >
              TARGET LOCATION
            </span>
            <span 
              className="text-sm font-medium"
              style={{ 
                color: '#943204',
                fontFamily: 'Orbitron, monospace'
              }}
            >
              KARACHI, PAKISTAN
            </span>
          </div>

          <AnimatedSeparator />

          <div className="flex flex-col">
            <span 
              className="text-xs font-light tracking-wider uppercase"
              style={{ 
                color: 'rgba(242, 233, 226, 0.4)',
                fontFamily: 'Inter Tight, sans-serif'
              }}
            >
              ELEVATION
            </span>
            <span 
              className="text-sm font-mono"
              style={{ 
                color: 'rgba(242, 233, 226, 0.7)',
                fontFamily: 'Inter Tight, monospace'
              }}
            >
              10m
            </span>
          </div>
        </div>

        {/* Center Section - System Data */}
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              <span 
                className="text-xs font-light"
                style={{ color: 'rgba(242, 233, 226, 0.6)' }}
              >
                DATA STREAM
              </span>
            </div>
            
            <div className="text-xs font-mono" style={{ color: '#943204' }}>
              {phase === 'globe' ? 'LIVE_SATELLITE' : 'TERRAIN_MESH'}
            </div>
          </div>
        </div>

        {/* Right Section - Technical Info */}
        <div className="flex items-center gap-8">
          <div className="flex flex-col text-right">
            <span 
              className="text-xs font-light tracking-wider uppercase"
              style={{ 
                color: 'rgba(242, 233, 226, 0.4)',
                fontFamily: 'Inter Tight, sans-serif'
              }}
            >
              RESOLUTION
            </span>
            <span 
              className="text-sm font-mono"
              style={{ 
                color: 'rgba(242, 233, 226, 0.7)',
                fontFamily: 'Inter Tight, monospace'
              }}
            >
              {phase === 'globe' ? '4K UHD' : '8K 3D'}
            </span>
          </div>

          <AnimatedSeparator />

          <div className="flex flex-col text-right">
            <span 
              className="text-xs font-light tracking-wider uppercase"
              style={{ 
                color: 'rgba(242, 233, 226, 0.4)',
                fontFamily: 'Inter Tight, sans-serif'
              }}
            >
              TIMESTAMP
            </span>
            <span 
              className="text-sm font-mono"
              style={{ 
                color: 'rgba(242, 233, 226, 0.7)',
                fontFamily: 'Inter Tight, monospace'
              }}
            >
              {new Date().toISOString().split('T')[0]}
            </span>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default GlobeToKarachiMap;