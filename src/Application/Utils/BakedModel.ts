import * as THREE from 'three';

export default class BakedModel {
    model: LoadedModel;
    texture: LoadedTexture;
    material: THREE.MeshBasicMaterial;
    screenMesh: THREE.Mesh | null = null;

    constructor(model: LoadedModel, texture: LoadedTexture, scale?: number) {
        this.model = model;
        this.texture = texture;

        this.texture.flipY = false;
        this.texture.encoding = THREE.sRGBEncoding;

        this.material = new THREE.MeshBasicMaterial({
            map: this.texture,
        });

        this.model.scene.traverse((child) => {
            if (child instanceof THREE.Mesh) {
                if (scale) child.scale.set(scale, scale, scale);

                // Check if this is the screen mesh
                if (child.name.toLowerCase().includes('screen') || child.name.toLowerCase().includes('monitor')) {
                    this.screenMesh = child;
                    child.material = this.material.clone();
                    // BasicMaterial: just keep it simple for now
                }
                // Check for Lamp/Bulb mesh
                else if (child.name.toLowerCase().includes('lamp') || child.name.toLowerCase().includes('bulb') || child.name.toLowerCase().includes('light')) {
                    child.visible = false; // HIDE LAMP
                }
                // HIDE JUNK/OFFICE PROPS (User request: ONLY COMPUTER, MOUSE, KEYBOARD)
                else if (
                    child.name.toLowerCase().includes('book') ||
                    child.name.toLowerCase().includes('stack') ||
                    child.name.toLowerCase().includes('paper') ||
                    child.name.toLowerCase().includes('binder') ||
                    child.name.toLowerCase().includes('folder') ||
                    child.name.toLowerCase().includes('plant') ||
                    child.name.toLowerCase().includes('leaf') ||
                    child.name.toLowerCase().includes('shelf') ||
                    child.name.toLowerCase().includes('cabinet') ||
                    child.name.toLowerCase().includes('decor') ||
                    child.name.toLowerCase().includes('pencil') ||
                    child.name.toLowerCase().includes('pen') ||
                    child.name.toLowerCase().includes('mug') ||
                    child.name.toLowerCase().includes('coffee')
                ) {
                    child.visible = false; // REMOVE ALL OFFICE CLUTTER
                }
                else {
                    child.material = this.material;
                }
            }
        });

        return this;
    }

    getModel(): THREE.Group {
        return this.model.scene;
    }
}
