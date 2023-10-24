export const effects = {
  title: "Effect",
  values: [
    "None",
    "Blur",
    "Median",
    "Gamma",
    "Negate",
    "Convolve",
    "Grayscale",
  ],
};

export const formatTypes = {
  title: "Image Format Type",
  values: ["JPEG", "PNG", "WebP", "TIFF", "HEIF", "AVIF"],
};

export const defaultValues = {
  uploadedImage: "",
  editedImage: "",
  imageWidth: 800,
  imageEffect: "None",
  imageFormatType: "JPEG",
};
