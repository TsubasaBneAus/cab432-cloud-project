export const POST = async (req) => {
  // Extract the data of "image" key from the FormData
  const data = await req.formData();
  const image = data.get("image");

  // Convert the image data into ArrayBuffer
  const bytes = await image.arrayBuffer();

  // Convert the ArrayBuffer into Node.js Buffer
  const buffer = Buffer.from(bytes);

  return Response.json(buffer);
};
