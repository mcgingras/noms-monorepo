import { NomTrait } from "./trait";

export type Nom = {
  id: string;
  fullSVG: string;
  tokenId: string;
  traits?: NomTrait[];
};
