import {Component, ElementRef, HostListener, inject, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import * as THREE from 'three';
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {RGBELoader} from "three/examples/jsm/loaders/RGBELoader";
import {PMREMGenerator} from "three";
import {MatButtonModule} from "@angular/material/button";
import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'app-test-location',
  standalone: true,
  imports: [
    MatButtonModule
  ],
  templateUrl: './test-location.component.html',
  styleUrl: './test-location.component.scss'
})
export class TestLocationComponent  implements OnInit, OnDestroy {
  @ViewChild('canvasContainer', {static: true}) canvasContainer!: ElementRef<HTMLDivElement>;
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private gltfLoader = new GLTFLoader();
  private frameId: number | null = null;
  private controls!: OrbitControls;
  private animationStartTime: number | null = null;
  private animationDuration: number = 10000; // 1 second in milliseconds
  private startPosition = new THREE.Vector3(0, 0, 0); // Example start position
  private endPosition = new THREE.Vector3(50, 0, -50); // Example end position
  private isAnimating: boolean = false;
  private carModel!: THREE.Object3D; // Reference to the car object
  private mixer!: THREE.AnimationMixer;
  private previousRenderTime!: number;
  private animationClips: THREE.AnimationClip[] = [];
  private toastr =  inject(ToastrService);

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
    this.renderer.toneMappingExposure = 1.0;
    this.canvasContainer.nativeElement.appendChild(this.renderer.domElement);

    // Position the camera at a 45-degree angle
    const radius = 50; // Distance from the center of the scene
    const angle = Math.PI / 4; // 45 degrees in radians

    // this.camera.position.x = radius * Math.cos(angle);
    // this.camera.position.y = radius * Math.sin(angle);
    this.camera.position.z = radius * Math.sin(angle);

    this.camera.position.x = 75;
    this.camera.position.y = 10;
    // this.camera.position.z = 150;

    // Point the camera towards the center of the scene
    this.camera.lookAt(this.scene.position);

    const light = new THREE.HemisphereLight(0xffffbb, 0x080820, 1);
    this.scene.add(light);
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true; // Optional: to have inertia effect
    this.controls.dampingFactor = 0.05;
    this.controls.minPolarAngle = this.controls.getPolarAngle();
    this.controls.maxPolarAngle = this.controls.getPolarAngle();
    this.controls.enableZoom = false;
    this.loadHDREnvironmentMap();
  }
  private animate(timestamp: number): void {
    this.frameId = requestAnimationFrame((timestamp) => this.animate(timestamp));

    // Calculate the time delta
    if (this.previousRenderTime === undefined) {
      this.previousRenderTime = timestamp;
    }
    const delta = (timestamp - this.previousRenderTime) / 1000; // Convert milliseconds to seconds
    this.previousRenderTime = timestamp;

    // Update the mixer
    if (this.mixer) {
      this.mixer.update(delta);
    }

    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }
  private loadHDREnvironmentMap(): void {
    const rgbeLoader = new RGBELoader();
    rgbeLoader.load('./assets/hdri/kiara.hdr', (texture) => {
      const pmremGenerator = new PMREMGenerator(this.renderer);
      pmremGenerator.compileEquirectangularShader();
      const envMap = pmremGenerator.fromEquirectangular(texture).texture;

      this.scene.environment = envMap;
      this.scene.background = envMap;
      texture.dispose();
      pmremGenerator.dispose();
    });
  }
  private loadCar(): void {
    this.gltfLoader.load('./assets/cars/car1.glb', (gltf) => {
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

      this.scene.add(this.carModel);
      this.animationClips = gltf.animations;
      // Set up the mixer
      this.mixer = new THREE.AnimationMixer(this.carModel);
      this.mixer.timeScale = 0.5;  // Half the normal speed
      // Play all animations
      // gltf.animations.forEach((clip) => {
      //   const action = this.mixer.clipAction(clip);
      //   action.setLoop(THREE.LoopOnce, 1);
      //   action.clampWhenFinished = true;  // Ensure the animation stays at its end state when finished
      //   action.play();
      // });

      this.animate(0);
    }, undefined, (error) => {
      console.error('An error occurred while loading the car', error);
    });
  }

   loadCar2Animations(): void {
     // this.scene.remove(this.carModel);
     this.gltfLoader.load('./assets/cars/car2.glb', (gltf) => {
      this.animationClips = gltf.animations;
      // this.animate(0);
       this.startAnimationByIndex();
    }, undefined, (error) => {
      console.error('An error occurred while loading the car', error);
    });
  }

  public startAnimationByIndex(): void {

    if (!this.animationClips.length) {
      return;
    }
    if (this.mixer) {
      this.animationClips.forEach((clip: any) => {
        const action = this.mixer.clipAction(clip);
        action.setLoop(THREE.LoopOnce, 1);
        action.clampWhenFinished = true;  // Ensure the animation stays at its end state when finished
        action.play();
      });
    }
  }
  onConnect(){
    this.toastr.success('Successfully Connected', 'Success');
  }

  @HostListener('window:resize', ['$event'])
  onWindowResize() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }
}
