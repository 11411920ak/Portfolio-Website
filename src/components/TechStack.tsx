import * as THREE from "three";
import { useRef, useMemo, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Text } from "@react-three/drei";
import { EffectComposer, N8AO } from "@react-three/postprocessing";
import {
  BallCollider,
  Physics,
  RigidBody,
  CylinderCollider,
  RapierRigidBody,
} from "@react-three/rapier";

const techCategories = [
  {
    name: "Programming Languages",
    color: "#ff4b4b", // Red
    items: [
      { name: "C", short: "C" },
      { name: "C++", short: "C++" },
      { name: "JavaScript", short: "JS" },
      { name: "SQL", short: "SQL" },
      { name: "HTML5", short: "HTML" },
      { name: "CSS3", short: "CSS" }
    ]
  },
  {
    name: "Frontend Development",
    color: "#4da8da", // Blue
    items: [
      { name: "React.js", short: "React" },
      { name: "Next.js", short: "Next" },
      { name: "HTML5", short: "HTML" },
      { name: "CSS3", short: "CSS" },
      { name: "JavaScript", short: "JS" }
    ]
  },
  {
    name: "Backend Development",
    color: "#4caf50", // Green
    items: [
      { name: "Node.js", short: "Node" }
    ]
  },
  {
    name: "Databases",
    color: "#ffc107", // Yellow
    items: [
      { name: "MySQL", short: "MySQL" },
      { name: "MongoDB", short: "Mongo" },
      { name: "PostgreSQL", short: "PG" },
      { name: "Supabase", short: "Supa" }
    ]
  },
  {
    name: "Tools & Platforms",
    color: "#9c27b0", // Purple
    items: [
      { name: "Git", short: "Git" },
      { name: "GitHub", short: "GitHub" },
      { name: "VS Code", short: "VSCode" }
    ]
  },
  {
    name: "Core Computer Science",
    color: "#ff9800", // Orange
    items: [
      { name: "Data Structures & Algorithms", short: "DSA" },
      { name: "Object-Oriented Programming (OOP)", short: "OOP" },
      { name: "Database Management Systems (DBMS)", short: "DBMS" },
      { name: "Operating Systems", short: "OS" },
      { name: "Computer Networks", short: "Net" }
    ]
  }
];

const itemImages: Record<string, string> = {
  "JavaScript": "/images/javascript.webp",
  "React.js": "/images/react2.webp",
  "Next.js": "/images/next2.webp",
  "Node.js": "/images/node2.webp",
  "MongoDB": "/images/mongo.webp",
  "MySQL": "/images/mysql.webp",
};

const textureLoader = new THREE.TextureLoader();
const loadedTextures: Record<string, THREE.Texture> = {};
Object.entries(itemImages).forEach(([key, url]) => {
  loadedTextures[key] = textureLoader.load(url);
});

// Flatten items to create spheres
const spheresData = techCategories.flatMap(cat => 
  cat.items.map(item => ({
    category: cat.name,
    color: cat.color,
    item: item.name,
    short: item.short,
    texture: loadedTextures[item.name] || null,
    scale: [0.8, 1.1, 0.9, 1.2, 1][Math.floor(Math.random() * 5)]
  }))
);

const sphereGeometry = new THREE.SphereGeometry(1, 28, 28);

type SphereProps = {
  vec?: THREE.Vector3;
  scale: number;
  color: string;
  short: string;
  texture: THREE.Texture | null;
  r?: typeof THREE.MathUtils.randFloatSpread;
  isActive: boolean;
};

function SphereGeo({
  vec = new THREE.Vector3(),
  scale,
  color,
  short,
  texture,
  r = THREE.MathUtils.randFloatSpread,
  isActive,
}: SphereProps) {
  const api = useRef<RapierRigidBody | null>(null);

  const material = useMemo(() => {
    // If no image texture is provided, generate a custom canvas texture
    let finalTexture = texture;
    if (!finalTexture) {
      const canvas = document.createElement("canvas");
      canvas.width = 512;
      canvas.height = 512;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        // Fill white background
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, 512, 512);

        // Draw colored circle
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(256, 256, 160, 0, Math.PI * 2);
        ctx.fill();

        // Draw text
        ctx.fillStyle = "#ffffff";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        let fontSize = 100;
        if (short.length > 4) fontSize = 60;
        else if (short.length > 3) fontSize = 80;
        ctx.font = `bold ${fontSize}px Arial, sans-serif`;
        ctx.fillText(short, 256, 256);

        finalTexture = new THREE.CanvasTexture(canvas);
        finalTexture.colorSpace = THREE.SRGBColorSpace;
      }
    }

    return new THREE.MeshPhysicalMaterial({
      map: finalTexture,
      emissive: "#ffffff",
      emissiveMap: finalTexture,
      emissiveIntensity: 0.3,
      metalness: 0.5,
      roughness: 1,
      clearcoat: 0.1,
    });
  }, [texture, color, short]);

  useFrame((_state, delta) => {
    if (!isActive) return;
    delta = Math.min(0.1, delta);
    const impulse = vec
      .copy(api.current!.translation())
      .normalize()
      .multiply(
        new THREE.Vector3(
          -50 * delta * scale,
          -150 * delta * scale,
          -50 * delta * scale
        )
      );

    api.current?.applyImpulse(impulse, true);
  });

  return (
    <RigidBody
      linearDamping={0.75}
      angularDamping={0.15}
      friction={0.2}
      position={[r(20), r(20) - 25, r(20) - 10]}
      ref={api}
      colliders={false}
    >
      <BallCollider args={[scale]} />
      <CylinderCollider
        rotation={[Math.PI / 2, 0, 0]}
        position={[0, 0, 1.2 * scale]}
        args={[0.15 * scale, 0.275 * scale]}
      />
      <mesh
        castShadow
        receiveShadow
        scale={scale}
        geometry={sphereGeometry}
        material={material}
        rotation={[0.3, 1, 1]}
      />
    </RigidBody>
  );
}

type PointerProps = {
  vec?: THREE.Vector3;
  isActive: boolean;
};

function Pointer({ vec = new THREE.Vector3(), isActive }: PointerProps) {
  const ref = useRef<RapierRigidBody>(null);

  useFrame(({ pointer, viewport }) => {
    if (!isActive) return;
    const targetVec = vec.lerp(
      new THREE.Vector3(
        (pointer.x * viewport.width) / 2,
        (pointer.y * viewport.height) / 2,
        0
      ),
      0.2
    );
    ref.current?.setNextKinematicTranslation(targetVec);
  });

  return (
    <RigidBody
      position={[100, 100, 100]}
      type="kinematicPosition"
      colliders={false}
      ref={ref}
    >
      <BallCollider args={[2]} />
    </RigidBody>
  );
}

const TechStack = () => {
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      const workElem = document.getElementById("work");
      if(workElem) {
        const threshold = workElem.getBoundingClientRect().top;
        setIsActive(scrollY > threshold);
      } else {
        setIsActive(true);
      }
    };
    document.querySelectorAll(".header a").forEach((elem) => {
      const element = elem as HTMLAnchorElement;
      element.addEventListener("click", () => {
        const interval = setInterval(() => {
          handleScroll();
        }, 10);
        setTimeout(() => {
          clearInterval(interval);
        }, 1000);
      });
    });
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className="techstack" style={{ display: 'flex', flexDirection: 'column' }}>
      
      {/* Title Section */}
      <div style={{ width: '100%', paddingTop: '120px', zIndex: 10, pointerEvents: 'none' }}>
        <h2 style={{ textAlign: 'center', margin: 0, position: 'relative' }}>
          My Techstack
        </h2>
      </div>

      {/* Interactive Balls Canvas */}
      <div style={{ position: 'relative', width: '100%', height: '55vh', minHeight: '400px', marginTop: '20px' }}>
        <Canvas
          shadows
          gl={{ alpha: true, stencil: false, depth: false, antialias: false }}
          camera={{ position: [0, 0, 20], fov: 32.5, near: 1, far: 100 }}
          onCreated={(state) => (state.gl.toneMappingExposure = 1.5)}
          className="tech-canvas"
          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1 }}
        >
          <ambientLight intensity={1} />
          <spotLight
            position={[20, 20, 25]}
            penumbra={1}
            angle={0.2}
            color="white"
            castShadow
            shadow-mapSize={[512, 512]}
          />
          <directionalLight position={[0, 5, -4]} intensity={2} />
          <Physics gravity={[0, 0, 0]}>
            <Pointer isActive={isActive} />
            {spheresData.map((props, i) => (
              <SphereGeo
                key={i}
                scale={props.scale}
                color={props.color}
                short={props.short}
                texture={props.texture}
                isActive={isActive}
              />
            ))}
          </Physics>
          <Environment
            files="/models/char_enviorment.hdr"
            environmentIntensity={0.5}
            environmentRotation={[0, 4, 2]}
          />
          <EffectComposer enableNormalPass={false}>
            <N8AO color="#0f002c" aoRadius={2} intensity={1.15} />
          </EffectComposer>
        </Canvas>
      </div>

      {/* Bottom Content Section: Contains the details cards securely separated from the canvas */}
      <div style={{ 
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '20px', 
        padding: '50px 20px 100px 20px',
        zIndex: 10,
        position: 'relative'
      }}>
        {/* Row 1 */}
        <div style={{
          display: 'flex', 
          justifyContent: 'center', 
          gap: '20px', 
          flexWrap: 'wrap', 
          width: '100%',
          maxWidth: '1000px'
        }}>
          {techCategories.slice(0, 3).map((cat, i) => (
            <div key={i} style={{ 
              background: 'rgba(0,0,0,0.4)', 
              padding: '20px', 
              borderRadius: '15px',
              borderTop: `3px solid ${cat.color}`,
              backdropFilter: 'blur(10px)',
              flex: '1 1 250px',
              minWidth: '180px',
              maxWidth: '280px',
              boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
            }}>
              <h3 style={{ margin: '0 0 15px 0', fontSize: '18px', color: cat.color }}>{cat.name}</h3>
              <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {cat.items.map((item, j) => (
                  <li key={j} style={{ fontSize: '15px', color: '#eae5ec' }}>{item.name}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Row 2 */}
        <div style={{
          display: 'flex', 
          justifyContent: 'center', 
          gap: '20px', 
          flexWrap: 'wrap', 
          width: '100%',
          maxWidth: '1000px',
          marginLeft: '40px'
        }}>
          {techCategories.slice(3, 6).map((cat, i) => (
            <div key={i + 3} style={{ 
              background: 'rgba(0,0,0,0.4)', 
              padding: '20px', 
              borderRadius: '15px',
              borderTop: `3px solid ${cat.color}`,
              backdropFilter: 'blur(10px)',
              flex: '1 1 250px',
              minWidth: '180px',
              maxWidth: '280px',
              boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
            }}>
              <h3 style={{ margin: '0 0 15px 0', fontSize: '18px', color: cat.color }}>{cat.name}</h3>
              <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {cat.items.map((item, j) => (
                  <li key={j} style={{ fontSize: '15px', color: '#eae5ec' }}>{item.name}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default TechStack;

