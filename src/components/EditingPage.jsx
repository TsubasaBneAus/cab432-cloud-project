"use client";

import { Image, Button, Input, useDisclosure } from "@nextui-org/react";
import EditingTabs from "./EditingTabs";
import ErrorModal from "./ErrorModal";
import { useEffect, useState } from "react";

const EditingPage = (props) => {
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [errorButtonTitle, setErrorButtonTitle] = useState("");
  const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();
  const effects = {
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
  const formatTypes = {
    title: "Image Format Type",
    values: ["JPEG", "PNG", "WebP", "TIFF", "HEIF", "AVIF"],
  };

  // Display an error modal
  const displayErrorModal = (result) => {
    // Check if an error modal is displayed
    if (result.state) {
      onClose();

      // Check if the edited Node.js Buffer exists
      if (result.image) {
        console.log("TEST1");

        // Check if both uploaded and edited images exist
        if (props.uploadedImage && props.editedImage) {
          props.setUploadedImage(result.image);
          props.setEditedImage(null);
        } else {
          props.setEditedImage(result.image);
        }
      }
    } else {
      setMessage(result.message);

      // Change error messages depending on the contents of the error
      switch (result.message) {
        case "Uploading Error":
          setErrorMessage(
            "It failed to upload your image to the cache and database. Please click on the button below to go to the Image Selection page.",
          );
          setErrorButtonTitle("Back To Image Selection");
          break;
        case "Deletion Error":
          setErrorMessage(
            "It failed to delete your image from the cache and database. Please click on the button below to go to the Image Selection page.",
          );
          setErrorButtonTitle("Back To Image Selection");
      }
      onOpen();
    }
  };

  // Upload an image to Redis and RDS
  const uploadImage = async () => {
    const res = await fetch("/api/uploadImage", {
      method: "POST",
      body: JSON.stringify({ image: props.uploadedImage }),
    });
    const result = await res.json();
    displayErrorModal(result);
  };

  // Display an image as a preview
  const displayPreview = () => {
    console.log("PREVIEW");
    // Check if an uploaded image exist and the image after editing does not exist
    if (props.uploadedImage && !props.editedImage) {
      return (
        <Image
          className="max-h-[350px] max-w-[600px]"
          src={`data:image/jpeg;base64,${props.uploadedImage}`}
          alt="Uploaded image"
          shadow="lg"
        />
      );
    } else {
      return (
        <Image
          className="max-h-[350px] max-w-[600px]"
          src={`data:image/jpeg;base64,${props.editedImage}`}
          alt="Edited image"
          shadow="lg"
        />
      );
    }
  };

  // Handle the onClick event of buttons
  const handleClick = async (action) => {
    // Check the action of the button
    if (action == "Back to Image Selection") {
      // Set all values to null
      props.setUploadedImage(null);
      props.setEditedImage(null);
      props.setImageWidth(null);
      props.setImageEffect(null);
      props.setImageFormatType(null);

      // Delete an image from Redis and RDS
      const res = await fetch("/api/deleteImage");
      const result = await res.json();
      displayErrorModal(result);
    } else if (action == "Edit the Image") {
      const res = await fetch("/api/editImage", {
        method: "POST",
        body: JSON.stringify({
          imageWidth: props.imageWidth,
          imageEffect: props.imageEffect,
          imageFormatType: props.imageFormatType,
        }),
      });
      const result = await res.json();
      displayErrorModal(result);
    }
  };

  // Handle the onChange event to convert the image into a base64-encoded Node.js Buffer
  const handleChange = async (e) => {
    const arrayBuffer = await e.target.files[0].arrayBuffer();
    const buffer = Buffer.from(arrayBuffer).toString("base64");
    props.setUploadedImage(buffer);
  };

  // Change the display of the editing page depending on if an uploaded image exists
  if (props.uploadedImage) {
    uploadImage();

    return (
      <main className="flex grow">
        <ErrorModal
          isOpen={isOpen}
          onOpen={onOpen}
          onOpenChange={onOpenChange}
          setUploadedImage={props.setUploadedImage}
          message={message}
          errorMessage={errorMessage}
          errorButtonTitle={errorButtonTitle}
        />
        <div className="grid w-full animate-fade-in-top grid-cols-2 grid-rows-4 items-center justify-center">
          <div className="col-start-1 col-end-2 row-start-1 row-end-4 flex items-center justify-center">
            {displayPreview()}
          </div>
          <div className="col-start-1 col-end-2 row-start-4 row-end-5 flex items-center justify-center">
            <Button
              className="mr-5 transition delay-150 duration-300 ease-in-out hover:-translate-y-1 hover:scale-110 hover:bg-indigo-500"
              color="primary"
              onPress={() => handleClick("Back to Image Selection")}
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
              onPress={() => handleClick("Edit the Image")}
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
        <ErrorModal
          isOpen={isOpen}
          onOpen={onOpen}
          onOpenChange={onOpenChange}
          setUploadedImage={props.setUploadedImage}
          message={message}
          errorMessage={errorMessage}
          errorButtonTitle={errorButtonTitle}
        />
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
          onChange={(e) => handleChange(e)}
          required
        />
      </main>
    );
  }
};

export default EditingPage;
