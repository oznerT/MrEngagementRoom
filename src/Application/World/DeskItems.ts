import * as THREE from 'three';
import Application from '../Application';

export default class DeskItems {
    application: Application;
    scene: THREE.Scene;

    constructor() {
        this.application = new Application();
        this.scene = this.application.scene;

        this.createPhone();
        this.createSodaCan();
    }

    createPhone() {
        // Phone Dimensions: ~7cm x 14cm x 1cm
        // Room Scale: ~900x
        // Scaled Dimensions: 
        // Width: 0.07 * 900 = 63
        // Height: 0.14 * 900 = 126
        // Depth: 0.01 * 900 = 9

        const geometry = new THREE.BoxGeometry(65, 130, 10);
        const material = new THREE.MeshBasicMaterial({ color: 0x111111 }); // Black Phone
        const screenMat = new THREE.MeshBasicMaterial({ color: 0xffffff }); // White Screen

        const phone = new THREE.Mesh(geometry, material);

        // Screen (slightly smaller and in front)
        const screenGeo = new THREE.BoxGeometry(60, 120, 1);
        const screen = new THREE.Mesh(screenGeo, screenMat);
        screen.position.z = 6; // Slightly in front of body
        phone.add(screen);

        // Position on Desk
        // Desk Height: ~450 (Estimated from previous steps)
        // Position: To the right of the keyboard?
        // Keyboard is likely central. Let's put phone at X=300, Z=500
        phone.position.set(400, 455, 600);
        phone.rotation.x = -Math.PI / 2; // Laying flat
        phone.rotation.z = -Math.PI / 6; // Slightly angled

        this.scene.add(phone);
    }

    createSodaCan() {
        // Can Dimensions: ~6cm diameter, 12cm height
        // Room Scale: ~900x
        // Radius: 0.03 * 900 = 27
        // Height: 0.12 * 900 = 108

        const geometry = new THREE.CylinderGeometry(27, 27, 108, 32);
        const material = new THREE.MeshBasicMaterial({ color: 0xff0000 }); // Red Can

        const can = new THREE.Mesh(geometry, material);

        // Position on Desk
        // Left of keyboard?
        can.position.set(-400, 504, 600); // Y = 450 + 54 (half height)

        this.scene.add(can);
    }
}
