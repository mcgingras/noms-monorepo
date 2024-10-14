import { colors } from "./constants";

export interface ImageBounds {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

export interface RGBAColor {
  r: number;
  g: number;
  b: number;
  a: number;
}

const TRANSPARENT_STRING = "TRANSPARENT";

/**
 * A class used to convert an image into the following RLE format:
 * Palette Index, Bounds [Top (Y), Right (X), Bottom (Y), Left (X)] (4 Bytes), [Pixel Length (1 Byte), Color Index (1 Byte)][].
 *
 * As opposed to the first encoding version, this supports multiline run-length encoding
 */
export class Image {
  private _width: number;
  private _height: number;
  private _bounds: ImageBounds = { top: 0, bottom: 0, left: 0, right: 0 };
  private _image: string[][] = [];
  public tuples: number[][] = [];
  private _getHexOrTransparentAt: (
    x: number,
    y: number,
    image: string[][]
  ) => string;

  constructor(
    width: number,
    height: number,
    image: string[][],
    getHexOrTransparentAt: (x: number, y: number, image: string[][]) => string
  ) {
    this._width = width;
    this._height = height;
    this._image = image;
    this._getHexOrTransparentAt = getHexOrTransparentAt;
  }

  get height(): number {
    return this._height;
  }

  get width(): number {
    return this._width;
  }

  get bounds(): ImageBounds {
    return this._bounds;
  }

  public toRLE(colors: Map<string, number>): string {
    this._bounds = this.calcBounds();
    const width = this.bounds.right - this.bounds.left;

    const indexes: number[] = [];

    for (let y = this.bounds.top; y <= this.bounds.bottom; y++) {
      for (let x = this.bounds.left; x < this.bounds.right; x++) {
        const hexColor = this._getHexOrTransparentAt(x, y, this._image);

        // Insert the color if it does not yet exist
        if (!colors.has(hexColor)) {
          throw new Error(`Color ${hexColor} not found in palette`);
        }

        const isTransparent = hexColor === TRANSPARENT_STRING;
        indexes.push(isTransparent ? 0 : colors.get(hexColor)!);
      }
    }

    // [palette_index, top, right, bottom, left]
    const metadata = [
      0,
      this.bounds.top,
      this.bounds.right,
      this.bounds.bottom,
      this.bounds.left,
    ].map((v) => toPaddedHex(v));
    return `0x${metadata.join("")}${this.encode(indexes, width)}`;
  }

  /**
   * Given a numeric array, return a string of padded hex run-length encoded values
   * @param data The numeric array to run-length encode
   */
  private encode(data: number[], width: number): string {
    if (data.length === 0) {
      return "";
    }

    if (data.length % width !== 0) {
      throw new Error("Data length must be a multiple of width");
    }

    const encoding: [number, number][] = [];

    for (let i = 0; i < data.length; i += width) {
      const row = data.slice(i, i + width);
      let count = 1;
      let current = row[0];

      for (let j = 1; j < width; j++) {
        if (row[j] === current) {
          count++;
        } else {
          encoding.push([count, current]);
          this.tuples.push([count, current]);
          count = 1;
          current = row[j];
        }
      }

      // Push the last run of the row
      encoding.push([count, current]);
      this.tuples.push([count, current]);
    }

    // Convert the encoding to the required string format
    return encoding
      .map(([count, value]) => `${toPaddedHex(count)}${toPaddedHex(value)}`)
      .join("");
  }

  calcBounds(): ImageBounds {
    let bottom = this.height - 1;
    while (bottom > 0 && this._isTransparentRow(bottom)) {
      bottom--;
    }

    let top = 0;
    while (top < bottom && this._isTransparentRow(top)) {
      top++;
    }

    let right = this.width - 1;
    while (right >= 0 && this._isTransparentColumn(right)) {
      right--;
    }

    let left = 0;
    while (left < right && this._isTransparentColumn(left)) {
      left++;
    }

    return {
      top: top,
      bottom: bottom,
      left: left,
      right: right + 1, // right bound is÷ calculated to be one pixel outside the content
    };
  }

  // starts as 31 and clocks down
  private _isTransparentColumn(column: number) {
    for (let row = 0; row < this.height; row++) {
      if (
        this._getHexOrTransparentAt(column, row, this._image) !==
        TRANSPARENT_STRING
      ) {
        return false;
      }
    }
    return true;
  }

  private _isTransparentRow(row: number) {
    for (let column = 0; column < this.width; column++) {
      if (
        this._getHexOrTransparentAt(column, row, this._image) !==
        TRANSPARENT_STRING
      ) {
        return false;
      }
    }
    return true;
  }
}

/**
 * Convert the provided number to a passed hex string
 * @param c
 * @param pad The desired number of chars in the hex string
 */
export const toPaddedHex = (c: number, pad = 2): string => {
  return c.toString(16).padStart(pad, "0");
};

export const getHexOrTransparentAt = (
  x: number,
  y: number,
  grid: string[][]
) => {
  const hexOfPixelAtIndex = grid[y][x];
  return hexOfPixelAtIndex;
};

const createColorMap = () => {
  const colorMap = new Map<string, number>();
  colors.forEach((color, index) => {
    colorMap.set(color, index);
  });
  return colorMap;
};

export const getRLE = (_image: string[][]) => {
  const colorMap = createColorMap();
  const image = new Image(32, 32, _image, getHexOrTransparentAt);
  return image.toRLE(colorMap);
};
