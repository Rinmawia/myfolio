import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const vertexShader = `
varying vec2 vUv;
void main() { 
    vUv = uv;
    gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);
}
`;

const fragmentShader = `
uniform sampler2D uTexture;
varying vec2 vUv;

uniform vec2 uResolution;
uniform float uProgress;
uniform vec3 uColor;

uniform vec2 uContainerRes;
uniform float uGridSize;
uniform float uBrightness;

float random (vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
}

vec2 squaresGrid(vec2 vUv) {
    float imageAspectX = 1.;
    float imageAspectY = 1.;
    float containerAspectX = uResolution.x/uResolution.y;
    float containerAspectY = uResolution.y/uResolution.x;
    vec2 ratio = vec2(
        min(containerAspectX / imageAspectX, 1.0),
        min(containerAspectY / imageAspectY, 1.0)
    );
    vec2 squareUvs = vec2(
        vUv.x * ratio.x + (1.0 - ratio.x) * 0.5,
        vUv.y * ratio.y + (1.0 - ratio.y) * 0.5
    );
    return squareUvs;
}

void main() {
    float imageAspectX = uResolution.x/uResolution.y;
    float imageAspectY = uResolution.y/uResolution.x;
    
    float containerAspectX = uContainerRes.x/uContainerRes.y;
    float containerAspectY = uContainerRes.y/uContainerRes.x;

    vec2 ratio = vec2(
        min(containerAspectX / imageAspectX, 1.0),
        min(containerAspectY / imageAspectY, 1.0)
    );

    vec2 coverUvs = vec2(
        vUv.x * ratio.x + (1.0 - ratio.x) * 0.5,
        vUv.y * ratio.y + (1.0 - ratio.y) * 0.5
    );

    //generate grid
    vec2 squareUvs = squaresGrid(coverUvs);
    float gridSize = floor(uContainerRes.x / 20.);
    vec2 grid = vec2(floor(squareUvs.x*gridSize)/gridSize, floor(squareUvs.y*gridSize)/gridSize);
    vec4 gridTexture = vec4(uColor, 0.);
    
    //image texture    
    vec4 texture = texture2D(uTexture, coverUvs);
    texture.rgb *= uBrightness;
    float height = 0.2;
    float progress = (1. + height) - (uProgress * (1. + height + height)); //goes from 1+height to -height

    float dist = 1. - distance(grid.y, progress);
    float clampedDist = smoothstep(height, 0., distance(grid.y, progress));
    float randDist = step(1. - height * random(grid), dist);
    dist = step(1. - height, dist);
    
    float rand = random(grid); 
    float alpha = dist * (clampedDist + rand - 0.5 * (1. - randDist));
    alpha = max(0., alpha);
    gridTexture.a = alpha;

    texture.rgba *= step(progress, grid.y);
    gl_FragColor = vec4(mix(texture, gridTexture, gridTexture.a));
}
`;

export class ImageEffect {
  constructor(options = {}) {
    this.container = options.container || document.body;
    this.images = [];
    this.color = options.color || "#242424";
    
    this.initCanvas();
    this.createScene();
    this.createCamera();
    this.createRenderer();
    this.setSizes();
    
    this.onResize = this.onResize.bind(this);
    window.addEventListener('resize', this.onResize);
    
    this.render = this.render.bind(this);
    gsap.ticker.add(this.render);
  }

  initCanvas() {
    this.element = document.createElement('canvas');
    this.element.style.position = 'fixed';
    this.element.style.top = '0';
    this.element.style.left = '0';
    this.element.style.width = '100vw';
    this.element.style.height = '100vh';
    this.element.style.pointerEvents = 'none'; 
    this.element.style.zIndex = '0'; 
    this.container.appendChild(this.element);
  }

  createScene() {
    this.scene = new THREE.Scene();
  }

  createCamera() {
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );
    this.scene.add(this.camera);
    this.camera.position.z = 10;
  }

  createRenderer() {
    this.dimensions = {
      width: window.innerWidth,
      height: window.innerHeight,
      pixelRatio: Math.min(2, window.devicePixelRatio),
    };

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.element,
      alpha: true,
      antialias: true
    });
    this.renderer.setSize(this.dimensions.width, this.dimensions.height);
    this.renderer.setPixelRatio(this.dimensions.pixelRatio);
  }

  setSizes() {
    let fov = this.camera.fov * (Math.PI / 180);
    let height = this.camera.position.z * Math.tan(fov / 2) * 2;
    let width = height * this.camera.aspect;

    this.sizes = {
      width: width,
      height: height,
    };
  }

  onResize() {
    this.dimensions = {
      width: window.innerWidth,
      height: window.innerHeight,
      pixelRatio: Math.min(2, window.devicePixelRatio),
    };

    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.setSizes();

    this.renderer.setPixelRatio(this.dimensions.pixelRatio);
    this.renderer.setSize(this.dimensions.width, this.dimensions.height);

    this.images.forEach((img) => img.onResize(this.sizes));
  }

  addImages(selectorOrElements, options = {}) {
    let elements;
    if (typeof selectorOrElements === 'string') {
      elements = document.querySelectorAll(selectorOrElements);
    } else if (selectorOrElements instanceof HTMLElement) {
      elements = [selectorOrElements];
    } else if (selectorOrElements instanceof NodeList || Array.isArray(selectorOrElements)) {
      elements = Array.from(selectorOrElements);
    } else {
      console.warn("Invalid argument provided to addImages");
      return;
    }

    elements.forEach((el) => {
      el.style.opacity = '0'; 
      const media = new ImageMesh({
        element: el,
        scene: this.scene,
        sizes: this.sizes,
        color: this.color,
        manual: Boolean(options.manual)
      });
      this.images.push(media);
    });
  }

  render() {
    const scrollY = window.scrollY || window.pageYOffset;
    
    this.images.forEach((img) => {
      img.updateScroll(scrollY);
    });

    this.renderer.render(this.scene, this.camera);
  }

  destroy() {
    window.removeEventListener('resize', this.onResize);
    gsap.ticker.remove(this.render);
    this.images.forEach(img => img.destroy());
    this.renderer.dispose();
    if (this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);
    }
  }
}

class ImageMesh {
  constructor({ element, scene, sizes, color, manual }) {
    this.element = element;
    this.scene = scene;
    this.sizes = sizes;
    this.color = color;
    this.manual = manual;
    this.isDestroyed = false;

    this.createGeometry();
    this.createMaterial();
    this.createMesh();
    
    this.setNodeBounds();
    this.setMeshDimensions();
    this.setMeshPosition();
    this.setTexture();

    this.scene.add(this.mesh);
    if (!this.manual) {
      this.observe();
    }
  }

  createGeometry() {
    this.geometry = new THREE.PlaneGeometry(1, 1, 1, 1);
  }

  createMaterial() {
    this.material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uTexture: new THREE.Uniform(null),
        uResolution: new THREE.Uniform(new THREE.Vector2(0, 0)),
        uContainerRes: new THREE.Uniform(new THREE.Vector2(0, 0)),
        uProgress: new THREE.Uniform(0),
        uGridSize: new THREE.Uniform(20),
        uColor: new THREE.Uniform(new THREE.Color(this.color)),
        uBrightness: new THREE.Uniform(1),
      },
      transparent: true
    });
  }

  createMesh() {
    this.mesh = new THREE.Mesh(this.geometry, this.material);
  }

  setNodeBounds() {
    const rect = this.element.getBoundingClientRect();
    this.absoluteTop = rect.top + window.scrollY;
    this.absoluteLeft = rect.left + window.scrollX;
    
    this.nodeDimensions = {
      width: rect.width,
      height: rect.height,
    };
  }

  setMeshDimensions() {
    this.meshDimensions = {
      width: (this.nodeDimensions.width * this.sizes.width) / window.innerWidth,
      height: (this.nodeDimensions.height * this.sizes.height) / window.innerHeight,
    };

    this.mesh.scale.x = this.meshDimensions.width;
    this.mesh.scale.y = this.meshDimensions.height;
  }

  setMeshPosition() {
    let x = (this.absoluteLeft * this.sizes.width) / window.innerWidth;
    x -= this.sizes.width / 2;
    x += this.meshDimensions.width / 2;
    this.baseX = x;

    let y = (-this.absoluteTop * this.sizes.height) / window.innerHeight;
    y -= this.meshDimensions.height / 2;
    y += this.sizes.height / 2;
    this.baseY = y;

    this.mesh.position.x = this.baseX;
    this.mesh.position.y = this.baseY; 
  }

  setTexture() {
    if (this.element.src) {
      new THREE.TextureLoader().load(
        this.element.src,
        (texture) => {
          if (this.isDestroyed) {
            if (typeof texture?.dispose === 'function') texture.dispose();
            return;
          }
          this.material.uniforms.uTexture.value = texture;
          const { naturalWidth, naturalHeight } = texture.image;

          this.material.uniforms.uResolution.value = new THREE.Vector2(
            naturalWidth,
            naturalHeight
          );

          this.material.uniforms.uContainerRes.value = new THREE.Vector2(
            this.nodeDimensions.width,
            this.nodeDimensions.height
          );
        }
      );
    }
  }

  reveal(duration = 1.6, delay = 0) {
    this.material.uniforms.uProgress.value = 0;
    
    if (this.revealAnim) {
      this.revealAnim.kill();
    }
    
    this.revealAnim = gsap.to(this.material.uniforms.uProgress, {
      value: 1,
      duration: duration,
      delay: delay,
      ease: "linear"
    });
    
    return this.revealAnim;
  }

  hide(duration = 1.6, delay = 0) {
    if (this.revealAnim) {
      this.revealAnim.kill();
    }
    
    this.revealAnim = gsap.to(this.material.uniforms.uProgress, {
      value: 0,
      duration: duration,
      delay: delay,
      ease: "linear"
    });
    
    return this.revealAnim;
  }

  setBrightness(value = 1, duration = 0.3) {
    if (this.brightnessAnim) {
      this.brightnessAnim.kill();
    }

    this.brightnessAnim = gsap.to(this.material.uniforms.uBrightness, {
      value,
      duration,
      ease: 'power2.out'
    });

    return this.brightnessAnim;
  }

  updateScroll(scrollY) {
    const scrollOffset = (scrollY * this.sizes.height) / window.innerHeight;
    this.mesh.position.y = this.baseY + scrollOffset;
  }

  observe() {
    this.scrollTrigger = gsap.to(this.material.uniforms.uProgress, {
      value: 1,
      scrollTrigger: {
        trigger: this.element,
        start: "top bottom",
        end: "bottom top",
        toggleActions: "play reset restart reset",
      },
      duration: 1.6,
      ease: "linear",
    });
  }

  onResize(sizes) {
    this.sizes = sizes;

    this.setNodeBounds();
    this.setMeshDimensions();
    this.setMeshPosition();
    this.updateScroll(window.scrollY);

    this.material.uniforms.uContainerRes.value = new THREE.Vector2(
      this.nodeDimensions.width,
      this.nodeDimensions.height
    );
  }

  destroy() {
    this.isDestroyed = true;
    this.scene.remove(this.mesh);
    if (this.scrollTrigger && this.scrollTrigger.scrollTrigger) {
      this.scrollTrigger.scrollTrigger.kill();
    }
    if (this.scrollTrigger) {
      this.scrollTrigger.kill();
    }
    if (this.revealAnim) {
      this.revealAnim.kill();
    }
    if (this.brightnessAnim) {
      this.brightnessAnim.kill();
    }
    this.geometry.dispose();
    this.material.dispose();
    const texture = this.material?.uniforms?.uTexture?.value;
    if (typeof texture?.dispose === 'function') {
      texture.dispose();
    }
  }
}
