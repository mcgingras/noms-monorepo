import { NomTrait } from "./trait";

export type Nom = {
  id: number;
  fullSVG: string;
  tokenId: number;
  traits?: NomTrait[];
};
