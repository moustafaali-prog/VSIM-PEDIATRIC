import * as THREE from 'three';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';
import {DRACOLoader} from 'three/examples/jsm/loaders/DRACOLoader.js';
import {KTX2Loader} from 'three/examples/jsm/loaders/KTX2Loader.js';
import {MeshoptDecoder} from 'three/examples/jsm/libs/meshopt_decoder.module.js';
export class GltfAssetLoader{private loader:GLTFLoader;constructor(renderer?:THREE.WebGLRenderer,dracoPath?:string,basisPath?:string){this.loader=new GLTFLoader();this.loader.setMeshoptDecoder(MeshoptDecoder);if(dracoPath){const d=new DRACOLoader();d.setDecoderPath(dracoPath);this.loader.setDRACOLoader(d);}if(renderer&&basisPath){const k=new KTX2Loader().setTranscoderPath(basisPath).detectSupport(renderer);this.loader.setKTX2Loader(k);}}async load(url:string){return (await this.loader.loadAsync(url)).scene;}}
