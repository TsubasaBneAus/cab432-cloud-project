import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { createClient } from "redis";
import { PrismaClient } from "@prisma/client";
import sharp from "sharp";
import { fileTypeFromBuffer } from "file-type";

// Process the image
const processImage = async (data, buffer) => {
  const width = data.imageWidth;
  const effect = data.imageEffect;
  const format = data.imageFormatType;
  const imageBuffer = Buffer.from(buffer, "base64");
  let editedImage = sharp(imageBuffer);
  let newBuffer;

  // Change processing option depending on the request
  switch (effect) {
    case "None":
      newBuffer = await editedImage.resize(width).toFormat(format).toBuffer();
      break;
    case "Blur":
      newBuffer = await editedImage
        .resize(width)
        .blur(5)
        .toFormat(format)
        .toBuffer();
      break;
    case "Median":
      newBuffer = await editedImage
        .resize(width)
        .median(15)
        .toFormat(format)
        .toBuffer();
      break;
    case "Gamma":
      newBuffer = await editedImage
        .resize(width)
        .gamma(3, 3)
        .toFormat(format)
        .toBuffer();
      break;
    case "Negate":
      newBuffer = await editedImage
        .resize(width)
        .negate()
        .toFormat(format)
        .toBuffer();
      break;
    case "Convolve":
      newBuffer = await editedImage
        .resize(width)
        .convolve({
          width: 3,
          height: 3,
          kernel: [-1, 0, 1, -2, 0, 2, -1, 0, 1],
        })
        .toFormat(format)
        .toBuffer();
      break;
    case "Grayscale":
      newBuffer = await editedImage
        .resize(width)
        .grayscale()
        .toFormat(format)
        .toBuffer();
      break;
  }
  const type = await fileTypeFromBuffer(newBuffer);
  const base64Image = newBuffer.toString("base64");
  const split = type.mime.split("/");

  return Response.json({
    state: true,
    message: "Success",
    image: base64Image,
    fileType: split[1],
  });
};

// Check if the image is stored in RDS
const checkRDS = async (data) => {
  try {
    // Fetch the base64-encoded Node.js Buffer from RDS
    const session = await getServerSession(authOptions);
    const prisma = new PrismaClient();
    const result = await prisma.userImage.findUnique({
      where: {
        userId: session.user.id,
      },
    });

    // Check if the buffer is not empty
    if (result.base64Image.length != 0) {
      return processImage(data, result.base64Image);
    } else {
      return Response.json({ state: false, message: "Image Editing Error" });
    }
  } catch (e) {
    return Response.json({ state: false, message: "Image Editing Error" });
  }
};

export const POST = async (req) => {
  // Extract the data of "image" key from the FormData
  const data = await req.json();

  try {
    // Fetch the base64-encoded Node.js Buffer from Redis
    const session = await getServerSession(authOptions);
    const client = await createClient({
      url: "redis://redis:6379",
    })
      .on("error", (e) => {
        throw e;
      })
      .connect();
    const buffer = await client.get(session.user.id);
    await client.disconnect();

    return processImage(data, buffer);
  } catch (e) {
    return checkRDS(data);
  }
};
