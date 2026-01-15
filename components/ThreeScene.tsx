
import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { TransformControls } from 'three/examples/jsm/controls/TransformControls';
import { TransformMode } from '../App';

interface ThreeSceneProps {
  mode: TransformMode;
  resetTrigger: number;
}

const ThreeScene: React.FC<ThreeSceneProps> = ({ mode, resetTrigger }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const transformControlsRef = useRef<TransformControls | null>(null);
  const furnitureGroupRef = useRef<THREE.Group | null>(null);
  const selectionHelperRef = useRef<THREE.BoxHelper | null>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // 1. Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xfff5f5);

    const aspect = window.innerWidth / window.innerHeight;
    const camera = new THREE.PerspectiveCamera(45, aspect, 0.1, 1000);
    camera.position.set(15, 15, 15);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mountRef.current.appendChild(renderer.domElement);

    // 2. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 0.9);
    dirLight.position.set(-10, 20, 10);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.set(2048, 2048);
    scene.add(dirLight);

    const monitorLight = new THREE.PointLight(0x00ffff, 1, 6);
    monitorLight.position.set(-4, 4.5, -7);
    scene.add(monitorLight);

    // 3. Highlight Helper
    const selectionHelper = new THREE.BoxHelper(new THREE.Object3D(), 0x3b82f6);
    selectionHelper.visible = false;
    scene.add(selectionHelper);
    selectionHelperRef.current = selectionHelper;

    // 4. Room Geometry
    const roomGroup = new THREE.Group();
    scene.add(roomGroup);

    const floor = new THREE.Mesh(
      new THREE.BoxGeometry(20, 0.5, 20),
      new THREE.MeshStandardMaterial({ color: 0xf3f4f6 })
    );
    floor.position.y = -0.25;
    floor.receiveShadow = true;
    roomGroup.add(floor);

    const wallMat = new THREE.MeshStandardMaterial({ color: 0xffccaa });
    const wallBack = new THREE.Mesh(new THREE.BoxGeometry(20, 15, 0.5), wallMat);
    wallBack.position.set(0, 7.25, -10);
    wallBack.receiveShadow = true;
    roomGroup.add(wallBack);

    const wallLeft = new THREE.Mesh(new THREE.BoxGeometry(0.5, 15, 20), wallMat);
    wallLeft.position.set(-10, 7.25, 0);
    wallLeft.receiveShadow = true;
    roomGroup.add(wallLeft);

    // 4b. MLH Wall Logo
    const textureLoader = new THREE.TextureLoader();
    textureLoader.load('https://static.mlh.io/brand-assets/logo/official/mlh-logo-color.png', (texture) => {
      const logoMaterial = new THREE.MeshStandardMaterial({ 
        map: texture, 
        transparent: true,
        roughness: 0.3,
        metalness: 0.1
      });
      // Aspect ratio correction (standard MLH logo is approx 2.5:1)
      const logoGeometry = new THREE.PlaneGeometry(5, 2);
      const wallLogo = new THREE.Mesh(logoGeometry, logoMaterial);
      wallLogo.position.set(0, 8, -9.74); // Slightly in front of back wall
      roomGroup.add(wallLogo);
    });

    // 5. Furniture Grouping
    const furnitureGroup = new THREE.Group();
    scene.add(furnitureGroup);
    furnitureGroupRef.current = furnitureGroup;

    // Create Desk
    const deskGroup = new THREE.Group();
    deskGroup.name = "Desk";
    const deskTop = new THREE.Mesh(new THREE.BoxGeometry(8, 0.4, 4), new THREE.MeshStandardMaterial({ color: 0xd6ba8d }));
    deskTop.position.set(-5, 3, -7);
    deskTop.castShadow = true;
    deskGroup.add(deskTop);
    [[-8.5, -5.5], [-1.5, -5.5], [-8.5, -8.5], [-1.5, -8.5]].forEach(([lx, lz]) => {
      const leg = new THREE.Mesh(new THREE.BoxGeometry(0.2, 3, 0.2), new THREE.MeshStandardMaterial({ color: 0x94a3b8 }));
      leg.position.set(lx, 1.5, lz);
      leg.castShadow = true;
      deskGroup.add(leg);
    });
    furnitureGroup.add(deskGroup);

    // Create Monitor
    const monitorGroup = new THREE.Group();
    monitorGroup.name = "Monitor";
    const mBase = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.2, 1), new THREE.MeshStandardMaterial({ color: 0x334155 }));
    mBase.position.set(-5, 3.2, -8);
    monitorGroup.add(mBase);
    const mScreen = new THREE.Mesh(
      new THREE.BoxGeometry(4.2, 2.4, 0.2),
      [
        new THREE.MeshStandardMaterial({ color: 0x334155 }), new THREE.MeshStandardMaterial({ color: 0x334155 }),
        new THREE.MeshStandardMaterial({ color: 0x334155 }), new THREE.MeshStandardMaterial({ color: 0x334155 }),
        new THREE.MeshStandardMaterial({ color: 0x22d3ee, emissive: 0x22d3ee, emissiveIntensity: 0.5 }),
        new THREE.MeshStandardMaterial({ color: 0x334155 }),
      ]
    );
    mScreen.position.set(-5, 4.6, -8);
    monitorGroup.add(mScreen);
    furnitureGroup.add(monitorGroup);

    // Gamer Chair
    const chairGroup = new THREE.Group();
    chairGroup.name = "Chair";
    const seat = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.2, 0.4, 32), new THREE.MeshStandardMaterial({ color: 0xd946ef }));
    seat.position.y = 1.8; chairGroup.add(seat);
    const back = new THREE.Mesh(new THREE.BoxGeometry(2, 2.5, 0.4), new THREE.MeshStandardMaterial({ color: 0xd946ef }));
    back.position.set(0, 3.2, 1); chairGroup.add(back);
    chairGroup.position.set(-5, 0, -3);
    furnitureGroup.add(chairGroup);

    // MLH Trophy
    const trophyGroup = new THREE.Group();
    trophyGroup.name = "MLH_Trophy";
    const cup = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.2, 0.8, 12), new THREE.MeshStandardMaterial({ color: 0xffd700, metalness: 0.8, roughness: 0.1 }));
    cup.position.y = 1.0; trophyGroup.add(cup);
    const trophyBase = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.5, 0.7), new THREE.MeshStandardMaterial({ color: 0x422006 }));
    trophyBase.position.y = 0.3; trophyGroup.add(trophyBase);
    trophyGroup.position.set(-1, 3.2, -8);
    furnitureGroup.add(trophyGroup);

    // 6. Controls
    const orbit = new OrbitControls(camera, renderer.domElement);
    orbit.enableDamping = true;

    const transform = new TransformControls(camera, renderer.domElement);
    
    // Safety check for Object3D instance
    if (transform instanceof THREE.Object3D) {
      scene.add(transform);
    } else {
      const helper = (transform as any).getHelper?.();
      if (helper instanceof THREE.Object3D) scene.add(helper);
    }
    
    transformControlsRef.current = transform;

    transform.addEventListener('dragging-changed', (event) => {
      orbit.enabled = !event.value;
    });

    transform.addEventListener('change', () => {
      if (transform.object && selectionHelperRef.current) {
        selectionHelperRef.current.update();
      }
    });

    // 7. Raycasting
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const onMouseDown = (event: MouseEvent) => {
      if ((event.target as HTMLElement).closest('.absolute')) return;

      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(furnitureGroup.children, true);

      if (intersects.length > 0) {
        let target: THREE.Object3D = intersects[0].object;
        while (target.parent && target.parent !== furnitureGroup) {
          target = target.parent;
        }

        if (target.parent === furnitureGroup) {
          transform.attach(target);
          if (selectionHelperRef.current) {
            selectionHelperRef.current.setFromObject(target);
            selectionHelperRef.current.visible = true;
          }
        }
      } else {
        const roomIntersects = raycaster.intersectObject(roomGroup, true);
        if (roomIntersects.length > 0) {
          transform.detach();
          if (selectionHelperRef.current) selectionHelperRef.current.visible = false;
        }
      }
    };

    window.addEventListener('mousedown', onMouseDown);

    // 8. Animation Loop
    let animationId: number;
    const animate = () => {
      animationId = requestAnimationFrame(animate);
      orbit.update();
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousedown', onMouseDown);
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
      transform.dispose();
      orbit.dispose();
    };
  }, []);

  useEffect(() => {
    if (transformControlsRef.current) {
      transformControlsRef.current.setMode(mode);
    }
  }, [mode]);

  useEffect(() => {
    if (resetTrigger > 0 && transformControlsRef.current) {
      transformControlsRef.current.detach();
      if (selectionHelperRef.current) selectionHelperRef.current.visible = false;
    }
  }, [resetTrigger]);

  return <div ref={mountRef} className="w-full h-full touch-none" />;
};

export default ThreeScene;
