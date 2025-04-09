declare module "3dmol" {
  export function createViewer(
    element: HTMLElement, 
    config?: {
      backgroundColor?: string;
      antialias?: boolean;
      disableFog?: boolean;
      [key: string]: any;
    }
  ): any;

  export function download(
    url: string,
    viewer: any,
    options?: any,
    callback?: (model: any) => void
  ): void;

  export enum SurfaceType {
    VDW,
    MS,
    SAS,
    SES
  }
} 