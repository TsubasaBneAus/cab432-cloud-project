"use client";

import EditingTabs from "./EditingTabs";
import { Image, Button, Input } from "@nextui-org/react";

const EditingPage = (props) => {
  const effects = {
    title: "Effect",
    values: ["Blur", "Median", "Gamma", "Negate", "Convolve", "Grayscale"],
  };
  const formatTypes = {
    title: "Image Format Type",
    values: ["JPEG", "PNG"],
  };

  // Display an image as a preview
  const displayPreview = () => {
    // Check if an uploaded image exist and the image after editing does not exist
    if (props.uploadedImage && !props.editedImage) {
      return (
        <Image
          className="max-h-[350px] max-w-[600px]"
          src={window.URL.createObjectURL(props.uploadedImage)}
          alt="Uploaded image"
          shadow="lg"
        />
      );
    }

    const base64Image = Buffer.from(props.editedImage).toString("base64");
    return (
      <Image
        className="max-h-[350px] max-w-[600px]"
        src={`data:image/jpeg;base64,${base64Image}`}
        alt="Edited image"
        shadow="lg"
      />
    );
  };

  // Handle the click event of the button to upload an image to ElastiCache
  const handleClick = async () => {
    console.log(props.uploadedImage);
    const formData = new FormData();
    formData.append("image", props.uploadedImage);
    console.log(typeof props.uploadedImage);
    const res = await fetch("/api/uploadImages", {
      method: "POST",
      body: formData,
    });
    const modifiedImage = await res.json();
    console.log(modifiedImage);
    // console.log(modifiedImage.data);
    props.setEditedImage(modifiedImage);
  };

  // Change the display of the editing page depending on if an uploaded image exists
  if (props.uploadedImage) {
    return (
      <main className="flex grow">
        <div className="grid w-full animate-fade-in-top grid-cols-2 grid-rows-4 items-center justify-center">
          <div className="col-start-1 col-end-2 row-start-1 row-end-4 flex items-center justify-center">
            {displayPreview()}
          </div>
          <div className="col-start-1 col-end-2 row-start-4 row-end-5 flex items-center justify-center">
            <Button
              className="mr-5 transition delay-150 duration-300 ease-in-out hover:-translate-y-1 hover:scale-110 hover:bg-indigo-500"
              color="primary"
              onPress={() => props.setUploadedImage(null)}
            >
              Back to Image Selection
            </Button>
            <Button
              className="transition delay-150 duration-300 ease-in-out hover:-translate-y-1 hover:scale-110 hover:bg-indigo-500"
              color="primary"
              onPress={() => props.setUploadedImage(null)}
            >
              Download
            </Button>
          </div>
          <div className="col-start-2 col-end-3 row-start-1 row-end-4 mx-auto flex flex-col gap-y-5">
            <div className="w-full">
              <p className="mb-1 text-xl">Image Width</p>
              <Input
                className="w-1/2"
                classNames={{
                  inputWrapper: "bg-slate-900 text-white",
                  description: "text-white",
                }}
                type="number"
                value={props.imageWidth}
                onValueChange={props.setImageWidth}
                variant="bordered"
                description="The image height is automatically set."
              />
            </div>
            <EditingTabs
              option={effects}
              selected={props.imageEffect}
              setSelected={props.setImageEffect}
            />
            <EditingTabs
              option={formatTypes}
              selected={props.imageFormatType}
              setSelected={props.setImageFormatType}
            />
          </div>
          <div className="col-start-2 col-end-3 row-start-4 row-end-5 flex items-center justify-center">
            <Button
              className="w-full max-w-md transition delay-150 duration-300 ease-in-out hover:-translate-y-1 hover:scale-110 hover:bg-indigo-500"
              color="primary"
              onPress={handleClick}
            >
              Edit the Image
            </Button>
          </div>
        </div>
      </main>
    );
  } else {
    return (
      <main className="flex grow flex-col items-center justify-center">
        <label
          className="mb-5 animate-fade-in-top text-center text-4xl font-semibold transition-colors hover:text-indigo-500"
          htmlFor="image"
        >
          Click Here to Select an Image file
        </label>
        <input
          className="hidden"
          type="file"
          accept="image/*"
          name="image"
          id="image"
          onChange={(e) => props.setUploadedImage(e.target.files[0])}
          required
        />
      </main>
    );
  }
};

export default EditingPage;
