export type License='CC0'|'CC-BY'|'CC-BY-NC-SA'|'UNKNOWN';
export interface AssetRecord{id:string;source:string;license:License;url:string;localPath:string;purpose:string;bundleApproved:boolean;}
export const ASSET_REGISTRY:readonly AssetRecord[]=[
{id:'polyhaven-hospital-room',source:'Poly Haven',license:'CC0',url:'https://polyhaven.com/',localPath:'/assets/environment/hospital_room/',purpose:'environment',bundleApproved:true},
{id:'polyhaven-childrens-hospital',source:'Poly Haven',license:'CC0',url:'https://polyhaven.com/',localPath:'/assets/environment/childrens_hospital/',purpose:'environment',bundleApproved:true},
{id:'kenney-building-kit',source:'Kenney',license:'CC0',url:'https://kenney.nl/assets',localPath:'/assets/environment/kenney_building/',purpose:'environment',bundleApproved:true},
];
export function assertBundleApproved(a:AssetRecord){if(!a.bundleApproved||a.license==='UNKNOWN')throw new Error(`Asset ${a.id} is not cleared for bundling`);}
