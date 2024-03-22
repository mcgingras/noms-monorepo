import { Trait } from "../traits/types";

export type Nom = {
  id: string;
  tokenId: string;
  created: number;
  owner: string;
  deployed: boolean;
  fullSVG: string;
  traits: NomTrait[];
};

type NomTrait = {
  id: string;
  equipped: boolean;
  quantity: number;
  trait: Trait;
  nom: Nom;
};
