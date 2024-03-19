export const EaselAbi = [
  {
    type: "function",
    name: "addColorToPalette",
    inputs: [
      {
        name: "_paletteIndex",
        type: "uint8",
        internalType: "uint8",
      },
      {
        name: "_color",
        type: "string",
        internalType: "string",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "addManyColorsToPalette",
    inputs: [
      {
        name: "paletteIndex",
        type: "uint8",
        internalType: "uint8",
      },
      {
        name: "newColors",
        type: "string[]",
        internalType: "string[]",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "generateSVGForParts",
    inputs: [
      {
        name: "parts",
        type: "bytes[]",
        internalType: "bytes[]",
      },
    ],
    outputs: [
      {
        name: "",
        type: "string",
        internalType: "string",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "palettes",
    inputs: [
      {
        name: "",
        type: "uint8",
        internalType: "uint8",
      },
      {
        name: "",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [
      {
        name: "",
        type: "string",
        internalType: "string",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "event",
    name: "PaletteSet",
    inputs: [
      {
        name: "paletteIndex",
        type: "uint8",
        indexed: false,
        internalType: "uint8",
      },
    ],
    anonymous: false,
  },
] as const;
