import Particle from './models/Particle.js';
import Drawer from './models/Drawer.js';
import { randNumber } from './utils.js';
import CollisionSystem from './CollisionSystem.js';

const areaWidth = 900;
const areaHeight = 600;
const N = 120; // Number of particles
const drawer = new Drawer(areaWidth, areaHeight);
const particles: Particle[] = [];

for (let i = 0; i < N; i += 1) {
  const particle = new Particle(
    randNumber(10, areaWidth / 2 - 10),
    randNumber(10, areaHeight - 10),
    0,
    0,
    4
  );
  particles.push(particle);
}

for (let i = 0; i < 12; i++) {
  particles.push(
    new Particle(
      randNumber(areaWidth / 2 + 10, areaWidth - 10),
      randNumber(areaHeight / 2 + 10, areaHeight - 10),
      0,
      0,
      8,
      4,
      'red'
    )
  );
}

for (let i = 0; i < 60; i++) {
  particles.push(
    new Particle((areaWidth - 4) / 2, 10 * i + 4, 0, 0, 4, 110000, 'blue')
  );
}
for (let i = 0; i < 60; i++) {
  particles.push(
    new Particle((areaWidth + 16) / 2, 10 * i + 4, 0, 0, 4, 110000, 'blue')
  );
}

for (let i = 0; i < 10; i++) {
  particles.push(
    new Particle(areaWidth / 4, 60 * i + 8, 0.1, 0, 4, 300, 'orange')
  );
}

for (let i = 0; i < 10; i++) {
  particles.push(
    new Particle(3 * areaWidth / 4, 60 * i + 8, -0.1, 0, 4, 300, 'orange')
  );
}

const collisionSystem = new CollisionSystem(particles, drawer);
collisionSystem.simulate(30000);
