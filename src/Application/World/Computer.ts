import * as THREE from 'three';
import Application from '../Application';
import BakedModel from '../Utils/BakedModel';
import Resources from '../Utils/Resources';

export default class Computer {
    application: Application;
    scene: THREE.Scene;
    resources: Resources;
    bakedModel: BakedModel;

    constructor() {
        this.application = new Application();
        this.scene = this.application.scene;
        this.resources = this.application.resources;

        this.bakeModel();
        this.setModel();
        this.createBrandingOverlay();
    }

    bakeModel() {
        this.bakedModel = new BakedModel(
            this.resources.items.gltfModel.computerSetupModel,
            this.resources.items.texture.computerSetupTexture,
            900
        );
    }

    setModel() {
        this.scene.add(this.bakedModel.getModel());
    }

    createBrandingOverlay() {
        // Create canvas for texture
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        // High resolution for crisp text
        const width = 512;
        const height = 128;
        canvas.width = width;
        canvas.height = height;

        if (context) {
            // Yellow background for sticker effect
            context.fillStyle = '#FFD700'; // Gold/Yellow
            context.fillRect(0, 0, width, height);

            // Red border
            context.strokeStyle = '#FF0000';
            context.lineWidth = 10;
            context.strokeRect(0, 0, width, height);

            // Text configuration
            context.font = 'bold 40px Courier New'; // Terminal style
            context.fillStyle = '#FF0000'; // Red text
            context.textAlign = 'center';
            context.textBaseline = 'middle';

            // Draw text
            context.fillText('ENTRAR AL SISTEMA', width / 2, height / 2);
        }

        // Create texture
        const texture = new THREE.CanvasTexture(canvas);

        // Create material
        const material = new THREE.MeshBasicMaterial({
            map: texture,
            transparent: true,
            side: THREE.DoubleSide,
        });

        // Create mesh (Plane)
        // Size: 220x60 units
        const geometry = new THREE.PlaneGeometry(220, 60);
        const mesh = new THREE.Mesh(geometry, material);
        mesh.name = 'enterHotspot'; // Name for raycaster

        // Position Logic:
        // Lower Bezel position
        mesh.position.set(0, 360, 400); // 0 x to be center, 360 y for bezel, 400 z to be in front
        mesh.rotation.set(-10 * Math.PI / 180, 0, 0); // Slight tilt

        this.scene.add(mesh);
    }
}
