import * as THREE from 'three';
import Application from '../Application';

export default class ClutterGenerator {
    application: Application;
    scene: THREE.Scene;

    constructor() {
        this.application = new Application();
        this.scene = this.application.scene;

        this.spawnJunkFood();
        this.spawnBling();
        this.spawnTech();
    }

    spawnJunkFood() {
        // Pizza Boxes (Red/Grease) - SCALED UP
        const pizzaGeo = new THREE.BoxGeometry(400, 50, 400);
        const pizzaMat = new THREE.MeshBasicMaterial({ color: 0xcc0000 });
        for (let i = 0; i < 5; i++) {
            const mesh = new THREE.Mesh(pizzaGeo, pizzaMat);
            // Scatter on floor/desk
            mesh.position.set((Math.random() - 0.5) * 3000, Math.random() * 500, (Math.random() - 0.5) * 3000);
            mesh.rotation.y = Math.random() * Math.PI;
            this.scene.add(mesh);
        }

        // Burgers/Wrappers (Brown/Yellow) - SCALED UP
        const burgerGeo = new THREE.DodecahedronGeometry(100, 0);
        const burgerMat = new THREE.MeshBasicMaterial({ color: 0x996633 });
        for (let i = 0; i < 10; i++) {
            const mesh = new THREE.Mesh(burgerGeo, burgerMat);
            // Desk Height approx 450?
            mesh.position.set((Math.random() - 0.5) * 2000, 450 + Math.random() * 200, (Math.random() - 0.5) * 1000);
            this.scene.add(mesh);
        }

        // Soda Cans (Red/Blue) - SCALED UP
        const canGeo = new THREE.CylinderGeometry(50, 50, 150, 8);
        const cokeMat = new THREE.MeshBasicMaterial({ color: 0xff0000 });
        const pepsiMat = new THREE.MeshBasicMaterial({ color: 0x0000ff });
        for (let i = 0; i < 8; i++) {
            const mesh = new THREE.Mesh(canGeo, Math.random() > 0.5 ? cokeMat : pepsiMat);
            mesh.position.set((Math.random() - 0.5) * 1500, 525, (Math.random() - 0.5) * 1000); // Desk
            this.scene.add(mesh);
        }
    }

    spawnBling() {
        // Gold Coins (Yellow) - SCALED UP
        const coinGeo = new THREE.CylinderGeometry(50, 50, 10, 12);
        const goldMat = new THREE.MeshBasicMaterial({ color: 0xffd700 });
        for (let i = 0; i < 30; i++) {
            const mesh = new THREE.Mesh(coinGeo, goldMat);
            // Scatter everywhere
            mesh.position.set((Math.random() - 0.5) * 4000, Math.random() * 1500, (Math.random() - 0.5) * 4000);
            mesh.rotation.x = Math.PI / 2;
            mesh.rotation.z = Math.random() * Math.PI;
            this.scene.add(mesh);
        }
    }

    spawnTech() {
        // Laptops (Silver/Black) - SCALED UP
        const laptopBaseGeo = new THREE.BoxGeometry(500, 20, 350);
        const laptopScreenGeo = new THREE.BoxGeometry(500, 350, 20);
        const laptopMat = new THREE.MeshBasicMaterial({ color: 0x222222 });
        const screenMat = new THREE.MeshBasicMaterial({ color: 0x888888 });

        // Laptop 1 (Floor)
        const l1Base = new THREE.Mesh(laptopBaseGeo, laptopMat);
        l1Base.position.set(1000, 10, 1000);
        const l1Screen = new THREE.Mesh(laptopScreenGeo, screenMat);
        l1Screen.position.set(0, 170, -170);
        l1Screen.rotation.x = Math.PI / 4; // Open
        l1Base.add(l1Screen);
        l1Base.rotation.y = Math.random();
        this.scene.add(l1Base);

        // Laptop 2 (Leaning)
        const l2Base = new THREE.Mesh(laptopBaseGeo, laptopMat);
        l2Base.position.set(-1500, 500, -1000);
        l2Base.rotation.z = Math.PI / 3;
        l2Base.rotation.y = Math.random();
        this.scene.add(l2Base);
    }
}
