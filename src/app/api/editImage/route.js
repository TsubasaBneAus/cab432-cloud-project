import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { createClient } from "redis";
import { PrismaClient } from "@prisma/client";

import sharp from 'sharp';

// Check if the image is stored in RDS
const checkRDS = async () => {
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
      return Response.json({
        state: true,
        message: "Success",
        image: result.base64Image,
      });
    } else {
      return Response.json({ state: false, message: "Editing Error" });
    }
  } catch (e) {
    return Response.json({ state: false, message: "Editing Error" });
  }
};

export const POST = async (req, res) => {
  try {
    // Extract the data of "image" key from the FormData
    const data = await req.json();
    const width = parseInt(data.imageWidth, 10);
    const effect = data.imageEffect;
    const format = data.imageFormatType;

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
    if (buffer) {
      let imageBuffer = Buffer.from(buffer, 'base64');
      let editedImage = sharp(imageBuffer);
      let newBuffer;

      switch (`${effect}`) {
        case "None":
          newBuffer = await editedImage.resize(width).toFormat(`${format}`).toBuffer();
          break;
        case "Blur":
          newBuffer = await editedImage.resize(width).blur().toFormat(`${format}`).toBuffer();
          break;
        case "Median":
          newBuffer = await editedImage.resize(width).median().toFormat(`${format}`).toBuffer();
          break;
        case "Gamma":
          newBuffer = await editedImage.resize(width).gamma.toFormat(`${format}`).toBuffer();
          break;
        case "Negate":
          newBuffer = await editedImage.resize(width).negate.toFormat(`${format}`).toBuffer();
          break;
        case "Convolve":
          newBuffer = await editedImage.resize(width).convolve.toFormat(`${format}`).toBuffer();
          break;
        case "Grayscale":
        newBuffer = await editedImage.resize(width).grayscale.toFormat(`${format}`).toBuffer();
        break;
    }
      const base64Image = newBuffer.toString('base64');
      
      return Response.json({ state: true, message: `${effect}`, image: base64Image });
    } else {
      return Response.json({ state: true, message: "no buffer" });
    }
  } catch (e) {
    // return checkRDS();
    return Response.json({ state: true, message: "error (checkRDS)" });
  }
};
