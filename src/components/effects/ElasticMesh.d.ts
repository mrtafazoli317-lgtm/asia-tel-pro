import type { CSSProperties, HTMLAttributes } from "react";

export interface ElasticMeshProps extends HTMLAttributes<HTMLDivElement> {
  image?: string;
  color1?: string;
  color2?: string;
  highlight?: string;
  showGrid?: boolean;
  gridDensity?: number;
  gridOpacity?: number;
  gridColor?: string;
  borderRadius?: number;
  stiffness?: number;
  damping?: number;
  grabRadius?: number;
  pull?: number;
  wobble?: number;
  tilt?: number;
  shading?: number;
  resolution?: number;
  interaction?: "hover" | "drag";
  enabled?: boolean;
  className?: string;
  style?: CSSProperties;
}

declare const ElasticMesh: (props: ElasticMeshProps) => JSX.Element;
export default ElasticMesh;
