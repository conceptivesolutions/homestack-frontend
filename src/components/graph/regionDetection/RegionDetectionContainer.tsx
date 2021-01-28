import { generateRandomHexColor, rgbToHex } from "helpers/Utility";
import { BiMap } from "mnemonist";

/**
 * Container that stores information about the location of a rendered object.
 * this is done by asserting a specific color to a given object.
 */
export class RegionDetectionContainer
{

  private readonly _canvas: HTMLCanvasElement = document.createElement("canvas");

  // noinspection JSMismatchedCollectionQueryUpdate
  private readonly _objects: BiMap<any, string> = new BiMap<any, string>();

  constructor()
  {
    this.insertIfAbsent = this.insertIfAbsent.bind(this);
    this.render = this.render.bind(this);
    this.clear = this.clear.bind(this);
    this.getObjectAt = this.getObjectAt.bind(this);
  }

  get canvas(): HTMLCanvasElement
  {
    return this._canvas;
  }

  get ctx(): CanvasRenderingContext2D
  {
    return this.canvas.getContext("2d")!;
  }

  /**
   * renders a new object on the underlying canvas
   */
  public render(object: any, fn: ((color: string, ctx: CanvasRenderingContext2D) => void)): void
  {
    const color = this.insertIfAbsent(object);
    const transform = this.ctx.getTransform();
    this.ctx.strokeStyle = color;
    this.ctx.fillStyle = color;
    fn(color, this.ctx);
    this.ctx.setTransform(transform);
  }

  /**
   * Returns the underlying object or undefined if no object is set on this location
   */
  public getObjectAt(x: number, y: number): any | undefined
  {
    const pixelData = this.ctx.getImageData(x, y, 1, 1).data;
    const hex = rgbToHex(pixelData[0], pixelData[1], pixelData[2]);
    return this._objects.inverse.get(hex);
  }

  /**
   * Inserts a new object - color mapping
   *
   * @param object object to map
   * @return color
   */
  public insertIfAbsent(object: any): string
  {
    if (this._objects.has(object))
      return this._objects.get(object);

    for (let i = 0; i < 10000; i++) //just large enough to generate random colors
    {
      const color = generateRandomHexColor();
      if (!this._objects.inverse.has(color))
      {
        this._objects.set(object, color);
        return color;
      }
    }

    throw new Error("Failed to generate unique random color after 10000 tries");
  }

  /**
   * Clears the underlying mapping
   */
  public clear(): void
  {
    this._objects.clear();
  }

}
