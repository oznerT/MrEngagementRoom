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

            // Text configuration
            context.font = 'bold 50px Arial';
            context.fillStyle = '#000000'; // Black text
            context.textAlign = 'center';
            context.textBaseline = 'middle';

            // Draw text
            context.fillText('laRevuelta', width / 2, height / 2);
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
        // Size: 220x60 units (Slightly larger to ensure coverage)
        const geometry = new THREE.PlaneGeometry(220, 60);
        const mesh = new THREE.Mesh(geometry, material);

        // Position Logic:
        // Screen Center (Debug) was Y=950.
        // Bezel is below screen. Original was Y=380.
        // X needs to be left. Original was X=-500.
        // Z needs to be in front. Original Z=270. Debug Z=400.
        // New Target: X=-550 (Left), Y=360 (Lower Bezel), Z=320 (Safe Depth)

        mesh.position.set(-550, 360, 320);
        mesh.rotation.set(-3 * Math.PI / 180, 0, 0); // Match monitor rotation

        this.scene.add(mesh);
    }
}
