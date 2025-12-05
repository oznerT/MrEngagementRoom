import * as THREE from 'three';
import Application from '../Application';

export default class FloatingPhones {
    application: Application;
    scene: THREE.Scene;
    phones: THREE.Mesh[] = [];
    time: number = 0;

    constructor() {
        this.application = new Application();
        this.scene = this.application.scene;

        this.createFloatingPhones();
    }

    createFloatingPhones() {
        // SCALED UP PHONES
        const geometry = new THREE.BoxGeometry(300, 600, 50);
        const material = new THREE.MeshBasicMaterial({ color: 0xffffff }); // White screens

        for (let i = 0; i < 15; i++) {
            const phone = new THREE.Mesh(geometry, material);

            // Random positioning around the desk area
            // We want them floating at eye level (Screen center is Y=950)
            const x = (Math.random() - 0.5) * 4000; // Spread X
            const y = 1200 + Math.random() * 1000; // Height (1200 to 2200)
            const z = (Math.random() - 0.5) * 2000 + 500; // Spread Z (In front of screen)

            phone.position.set(x, y, z);

            // Random rotation
            phone.rotation.x = Math.random() * Math.PI;
            phone.rotation.y = Math.random() * Math.PI;

            // Store initial Y for animation
            phone.userData.initialY = y;
            phone.userData.speed = 0.002 + Math.random() * 0.003;
            phone.userData.offset = Math.random() * Math.PI * 2;

            this.scene.add(phone);
            this.phones.push(phone);
        }
    }

    update() {
        this.time += 0.01;

        this.phones.forEach(phone => {
            // Float up and down - Increased Amplitude
            phone.position.y = phone.userData.initialY + Math.sin(this.time * 2 + phone.userData.offset) * 50;

            // Slowly rotate
            phone.rotation.y += phone.userData.speed;
        });
    }
}
