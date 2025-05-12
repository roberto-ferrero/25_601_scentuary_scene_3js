//import gsap from "gsap"
import * as THREE from 'three';

class WindGenerator {
  constructor(speed = 1, strength = 5) {
    this.speed = speed;         // how fast wind changes
    this.strength = strength;   // max magnitude of wind
    this.time = 0;
  }

  // Simple pseudo-noise using sine waves
  noise(t, seed = 0) {
    return Math.sin(t * 0.1 + seed) * 0.5 + Math.sin(t * 0.05 + seed * 2) * 0.3;
  }

  update(deltaTime) {
    this.time += deltaTime * this.speed;

    // Generate pseudo-random direction with smooth noise
    const angle = this.noise(this.time, 1) * Math.PI * 2; // full 360° variation
    const magnitude = (this.noise(this.time, 2) * 0.5 + 0.5) * this.strength;

    const wind = new THREE.Vector2(Math.cos(angle), Math.sin(angle));
    wind.multiplyScalar(magnitude);

    return wind;
  }
}
export default WindGenerator