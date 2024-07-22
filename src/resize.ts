import {
  ImageType,
  ObjectFit,
  objectFitToJSON,
  ResizeOptions,
  ResizeRequest,
  ResizeResponse,
} from "@fluxpb/flux";
import { handleUnaryCall, handleClientStreamingCall } from "@grpc/grpc-js";
import sharp, { FitEnum } from "sharp";
import Color from "color";

const DEFAULTS = {
  width: 800,
  height: 600,
  backgroundColor: "#000000",
  quality: 80,
};

type handler = handleClientStreamingCall<ResizeRequest, ResizeResponse>;

const resize: handler = (call, callback) => {
  let buffer = Buffer.from("");
  let opts: ResizeOptions | undefined;

  call.on("data", (chunk) => {
    buffer = Buffer.concat([buffer, chunk.imageData]);

    if (!opts) {
      opts = chunk.options;
    }
  });

  call.on("end", async () => {
    try {
      if (!opts) return callback(new Error("No options provided"));

      // Fallback to default values if not provided
      if (!opts.width) opts.width = DEFAULTS.width;
      if (!opts.height) opts.height = DEFAULTS.height;
      if (!opts.backgroundColor)
        opts.backgroundColor = DEFAULTS.backgroundColor;

      const bgColor = new Color(opts.backgroundColor);

      const fit = objectFitToJSON(
        opts.objectFit ?? ObjectFit.COVER,
      ).toLowerCase() as keyof FitEnum;

      const img = sharp(buffer).resize({
        width: opts.width,
        height: opts.height,
        background: bgColor.object(),
        fit,
      });

      // Result variable
      let response: ResizeResponse = {
        imageData: Buffer.from(""),
      };

      const quality = opts.quality || DEFAULTS.quality;

      switch (opts.imageType) {
        case ImageType.WEBP:
          response.imageData = await img.webp({ quality }).toBuffer();
          break;

        case ImageType.JPEG:
          response.imageData = await img.jpeg({ quality }).toBuffer();
          break;

        case ImageType.PNG:
          response.imageData = await img.png({ quality }).toBuffer();
          break;

        case ImageType.AVIF:
          response.imageData = await img.avif({ quality }).toBuffer();
          break;

        default:
          return callback(new Error("Unsupported image type"));
      }

      callback(null, response);
    } catch (err) {
      console.log(err);
      callback(err as Error);
    }
  });

  call.on("error", (err) => {
    callback(err);
  });
};

export default resize;
