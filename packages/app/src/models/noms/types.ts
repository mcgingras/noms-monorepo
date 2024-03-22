export type Nom = {
  id: string;
  deployed: boolean;
  ownedTraits: OwnedTrait[];
};

type OwnedTrait = {
  id: string;
  rleBytes: string;
};
