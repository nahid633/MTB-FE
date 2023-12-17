import {Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {NgOptimizedImage} from "@angular/common";
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";
import * as THREE from 'three';
import {RGBELoader} from "three/examples/jsm/loaders/RGBELoader";
import {PMREMGenerator} from "three";
import {MatButtonModule} from "@angular/material/button";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [
    NgOptimizedImage,
    MatButtonModule,
    RouterLink
  ],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.scss'
})
export class LandingComponent implements OnInit, OnDestroy {
  @ViewChild('canvasContainer', {static: true}) canvasContainer!: ElementRef<HTMLDivElement>;
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private gltfLoader = new GLTFLoader();
  private frameId: number | null = null;
  private carModel!: THREE.Object3D; // Reference to the car object

  ngOnInit(): void {
    this.initThree();
    this.loadCar();
  }

  ngOnDestroy(): void {
    if (this.frameId != null) {
      cancelAnimationFrame(this.frameId);
    }
    this.renderer.dispose();
  }

  private initThree(): void {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(25, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.setClearColor(0x000000, 0); // Set clear color to black with 0 opacity

    this.renderer.toneMappingExposure = 1.0;
    this.canvasContainer.nativeElement.appendChild(this.renderer.domElement);

    // Position the camera at a 45-degree angle
    const radius = 50; // Distance from the center of the scene
    const angle = Math.PI / 4; // 45 degrees in radians
    this.camera.position.z = radius * Math.sin(angle);

    this.camera.position.x = 75;
    this.camera.position.y = 10;
    // this.camera.position.z = 150;

    // Point the camera towards the center of the scene
    this.camera.lookAt(this.scene.position);

    const light = new THREE.HemisphereLight(0xffffbb, 0x080820, 1);
    this.scene.add(light);
    this.loadHDREnvironmentMap();
  }
  private animate(timestamp: number): void {
    this.frameId = requestAnimationFrame((timestamp) => this.animate(timestamp));

    // this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }
  private loadHDREnvironmentMap(): void {
    const rgbeLoader = new RGBELoader();
    rgbeLoader.load('./assets/hdri/studio.hdr', (texture) => {
      const pmremGenerator = new PMREMGenerator(this.renderer);
      pmremGenerator.compileEquirectangularShader();
      const envMap = pmremGenerator.fromEquirectangular(texture).texture;

      this.scene.environment = envMap;
      // this.scene.background = 'transparent';
      texture.dispose();
      pmremGenerator.dispose();
    });
  }
  private loadCar(): void {
    this.gltfLoader.load('./assets/cars/smart.glb', (gltf) => {
      // Assume the car model is the entire scene for simplicity
      gltf.scene.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          const mesh = child as THREE.Mesh;
          (mesh.material as THREE.MeshStandardMaterial).envMap = this.scene.environment;
          (mesh.material as THREE.MeshStandardMaterial).metalness = 0.5; // Adjust as needed
          (mesh.material as THREE.MeshStandardMaterial).roughness = 0.1; // Adjust as needed
        }
      });
      this.carModel = gltf.scene;
      this.carModel.scale.set(4, 4, 4);
      this.carModel.rotation.set(0, Math.PI / 4  ,0);
      this.scene.add(this.carModel);

      this.animate(0);
    }, undefined, (error) => {
      console.error('An error occurred while loading the car', error);
    });
  }

  @HostListener('window:resize', ['$event'])
  onWindowResize() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }
  @HostListener('window:scroll', ['$event'])
  onWindowScroll(event: Event) {
    this.rotateModelBasedOnScroll(window.scrollY);
    this.revealOnScroll();
  }
  private rotateModelBasedOnScroll(scrollPosition: number): void {
    // Constants for rotation
    const rotationPerScroll = 0.001; // Adjust for scroll sensitivity
    const maxScroll = 3; // Maximum scroll value for a full rotation sequence
    // Normalizing scroll position to a value between 0 and 1
    let normalizedScroll = (scrollPosition * rotationPerScroll) % maxScroll / maxScroll;
    console.log(normalizedScroll)
    // Defining rotation stages
    const rotationStages = [
      { x: 0, y: Math.PI / 4, z: 0 },
      { x: 0, y: 0, z: 0 },
      { x: Math.PI / 4, y: 0, z: 0 },
      { x: 0, y: 0, z: 0 },
      { x: -Math.PI / 4, y: 0, z: 0 },
  ];
    this.carModel.scale.set(4, 4, 4);

    // Calculate current stage and interpolation factor
    let stageIndex = Math.floor(normalizedScroll * rotationStages.length);
    let nextStageIndex = (stageIndex + 1) % rotationStages.length;
    let lerpFactor = (normalizedScroll * rotationStages.length) % 1;

    // Interpolating rotation between stages
    let currentStage = rotationStages[stageIndex];
    let nextStage = rotationStages[nextStageIndex];

    let xRotation = this.interpolate(currentStage.x, nextStage.x, lerpFactor);
    let yRotation = this.interpolate(currentStage.y, nextStage.y, lerpFactor);
    let zRotation = this.interpolate(currentStage.z, nextStage.z, lerpFactor);
  // console.log(xRotation, yRotation, zRotation);
    // Apply rotation
    if (this.carModel) {
      this.carModel.rotation.set(xRotation, yRotation, zRotation);
    }
  }

// Helper function for interpolation
  private interpolate(start: number, end: number, factor: number): number {
    return start + (end - start) * factor;
  }
   revealOnScroll() {
     let contentItems = document.querySelectorAll('.content-item');

     for (let i = 0; i < contentItems.length; i++) {
       const windowHeight = window.innerHeight;
       const elementTop = contentItems[i].getBoundingClientRect().top;
       const elementVisible = 150; // Adjust as needed

       if (elementTop < windowHeight - elementVisible) {
         // @ts-ignore
         contentItems[i].style.opacity = 1;
         // @ts-ignore
         contentItems[i].style.transform = "translateY(0)"; // Move to original position
       } else {
         // @ts-ignore
         contentItems[i].style.opacity = 0;
         // @ts-ignore
         contentItems[i].style.transform = "translateY(50px)"; // Move down
       }
    }
  }

}
