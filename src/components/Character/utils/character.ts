import * as THREE from "three";
import { DRACOLoader, GLTF, GLTFLoader } from "three-stdlib";
import { setCharTimeline, setAllTimeline } from "../../utils/GsapScroll";
import { decryptFile } from "./decrypt";

const setCharacter = (
  renderer: THREE.WebGLRenderer,
  scene: THREE.Scene,
  camera: THREE.PerspectiveCamera
) => {
  const loader = new GLTFLoader();
  const dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath("/draco/");
  loader.setDRACOLoader(dracoLoader);

  const loadCharacter = () => {
    return new Promise<GLTF | null>(async (resolve, reject) => {
      try {
        const encryptedBlob = await decryptFile(
          "/models/character.enc",
          "Character3D#@"
        );
        const blobUrl = URL.createObjectURL(new Blob([encryptedBlob]));

        let character: THREE.Object3D;
        loader.load(
          blobUrl,
          async (gltf) => {
            character = gltf.scene;
            await renderer.compileAsync(character, camera, scene);
            character.traverse((child: any) => {
              if (child.isMesh) {
                const mesh = child as THREE.Mesh;
                child.castShadow = true;
                child.receiveShadow = true;
                mesh.frustumCulled = true;
                
                // Tint outfit meshes for an attractive look
                const name = mesh.name.toLowerCase();
                
                let targetColor: string | null = null;
                
                if (name.includes("bottom") || name.includes("lower") || name.includes("pant") || name.includes("trousers")) {
                  targetColor = "#4a2a18"; // Rich chocolate brown
                } else if (name.includes("shoe") || name.includes("footwear") || name.includes("boot") || name.includes("sneaker")) {
                  targetColor = "#151515"; // Black
                } else if (name.includes("top") || name.includes("shirt") || name.includes("jacket") || name.includes("outfit") || name.includes("dress")) {
                  targetColor = "#ff2a85"; // Vibrant pink/violet
                }

                if (targetColor) {
                  // If material is an array, map it
                  if (Array.isArray(mesh.material)) {
                    mesh.material = mesh.material.map(m => m.clone());
                    mesh.material.forEach(m => {
                      const mat = m as THREE.MeshStandardMaterial;
                      if (mat.color) {
                        mat.color.set(targetColor!);
                        mat.roughness = 0.6;
                        mat.metalness = 0.1;
                      }
                    });
                  } else if (mesh.material) {
                    // Clone the material to ensure we don't accidentally tint the skin
                    mesh.material = (mesh.material as THREE.Material).clone();
                    const mat = mesh.material as THREE.MeshStandardMaterial;
                    if (mat.color) {
                      mat.color.set(targetColor);
                      mat.roughness = 0.6;
                      mat.metalness = 0.1;
                    }
                  }
                }
              }
            });
            resolve(gltf);
            setCharTimeline(character, camera);
            setAllTimeline();
            character!.getObjectByName("footR")!.position.y = 3.36;
            character!.getObjectByName("footL")!.position.y = 3.36;
            dracoLoader.dispose();
          },
          undefined,
          (error) => {
            console.error("Error loading GLTF model:", error);
            reject(error);
          }
        );
      } catch (err) {
        reject(err);
        console.error(err);
      }
    });
  };

  return { loadCharacter };
};

export default setCharacter;
