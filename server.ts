import express from "express";
import multer from "multer";
import sharp from "sharp";

const app = express();
const port = 7668;

// Middlewares
app.use(express.json());
const upload = multer({});

app.post("/img", upload.single("image"), async (req, res) => {
  if (!req.file) {
    res.status(400).send("No file uploaded.");
    return;
  }

  // Validate resize parameters.
  const width = parseInt(req.query.width as string, 10);
  const height = parseInt(req.query.height as string, 10);
  const doResize = !isNaN(width) && width > 0 && !isNaN(height) && height > 0;

  // Validate background color for flattening transparent images.
  const background_color = req.query.background_color as string | undefined;

  // Validate output format.
  const format = req.query.format as "jpeg" | "png" | "webp" | "avif";
  if (format && !["jpeg", "png", "webp", "avif"].includes(format)) {
    res.status(400).send("Invalid format specified.");
    return;
  }

  // Validate quality.
  const quality = parseInt(req.query.quality as string, 10) || 80; // Default quality
  if (quality < 1 || quality > 100) {
    res.status(400).send("Quality must be between 1 and 100.");
    return;
  }

  // Validate fit option.
  const fit = req.query.fit as
    | "cover"
    | "contain"
    | "fill"
    | "inside"
    | "outside"
    | undefined;
  if (fit && !["cover", "contain", "fill", "inside", "outside"].includes(fit)) {
    res.status(400).send("Invalid fit option specified.");
  }

  try {
    const buf = req.file.buffer;
    const image = sharp(buf);

    // Handle resizing if specified
    if (doResize) image.resize({ width, height, fit });

    // Handle background color if provided
    if (background_color) image.flatten({ background: background_color });

    // Output format handling
    if (format) image.toFormat(format, { quality });

    // Process the image and send the response
    const output = await image.toBuffer();
    res.status(200).send(output);
  } catch (error) {
    console.error("Error processing image:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});
