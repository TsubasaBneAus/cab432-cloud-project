"use client";

import { useEffect, useState } from "react";
import { Image, Button, Input, useDisclosure } from "@nextui-org/react";
import EditingTabs from "./EditingTabs";
import ErrorModal from "./ErrorModal";
import displayErrorModal from "@/lib/DisplayErrorModal";
import { effects, formatTypes, defaultValues } from "@/lib/constVariables";

const EditingPage = (props) => {
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [errorButtonTitle, setErrorButtonTitle] = useState("");
  const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();
  const [fileType, setFileType] = useState("jpeg");

  // Upload an image to Redis and RDS
  const uploadImage = async () => {
    const res = await fetch("/api/uploadImage", {
      method: "POST",
      body: JSON.stringify({ image: props.uploadedImage }),
    });
    const result = await res.json();

    // Display an Error Modal
    displayErrorModal(
      result,
      onClose,
      onOpen,
      props.uploadedImage,
      props.editedImage,
      props.setUploadedImage,
      props.setEditedImage,
      setMessage,
      setErrorMessage,
      setErrorButtonTitle,
    );
  };

  // Display an image as a preview
  const displayPreview = () => {
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
      // Delete an image from Redis and RDS
      const res = await fetch("/api/deleteImage");
      const result = await res.json();

      // Check if an image was deleted properly
      if (result.state) {
        props.setUploadedImage(defaultValues.uploadedImage);
        props.setEditedImage(defaultValues.editedImage);
        props.setImageWidth(defaultValues.imageWidth);
        props.setImageEffect(defaultValues.imageEffect);
        props.setImageFormatType(defaultValues.imageFormatType);
      } else {
        // Display an Error Modal
        displayErrorModal(
          result,
          onClose,
          onOpen,
          props.uploadedImage,
          props.editedImage,
          props.setUploadedImage,
          props.setEditedImage,
          setMessage,
          setErrorMessage,
          setErrorButtonTitle,
        );
      }
    } else if (action == "Edit the Image") {
      // Edit an image
      const res = await fetch("/api/editImage", {
        method: "POST",
        body: JSON.stringify({
          imageWidth: props.imageWidth,
          imageEffect: props.imageEffect,
          imageFormatType: props.imageFormatType,
        }),
      });
      const result = await res.json();
      setFileType(result.file);
      props.setEditedImage(result.image);
      console.log(result);

      // Display an Error Modal
      displayErrorModal(
        result,
        onClose,
        onOpen,
        props.uploadedImage,
        props.editedImage,
        props.setUploadedImage,
        props.setEditedImage,
        setMessage,
        setErrorMessage,
        setErrorButtonTitle,
      );
    } else {
      // Check if "editedImage" exists
      let downloadedImage;
      if (props.editedImage) {
        downloadedImage = props.editedImage;
      } else {
        downloadedImage = props.uploadedImage;
      }

      // Convert Node.js Buffer into Blob
      const buffer = Buffer.from(downloadedImage, "base64");
      const blob = new Blob([buffer]);
      const blobUrl = window.URL.createObjectURL(blob);

      // Download the Blob image into a user's PC
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = `downloaded-image.${fileType}`;
      a.click();
    }
  };

  // Handle the onChange event to convert the image into a base64-encoded Node.js Buffer
  const handleChange = async (e) => {
    const arrayBuffer = await e.target.files[0].arrayBuffer();
    const buffer = Buffer.from(arrayBuffer).toString("base64");
    props.setUploadedImage(buffer);
  };

  useEffect(() => {
    // Upload an image if "uploadedImage" exists
    if (props.uploadedImage) {
      uploadImage();
    }
  }, [props.uploadedImage]);

  // Change the display of the editing page depending on if an uploaded image exists
  if (props.uploadedImage) {
    return (
      <main className="flex grow">
        <ErrorModal
          isOpen={isOpen}
          onOpen={onOpen}
          onOpenChange={onOpenChange}
          setUploadedImage={props.setUploadedImage}
          setEditedImage={props.setEditedImage}
          setImageWidth={props.setImageWidth}
          setImageEffect={props.setImageEffect}
          setImageFormatType={props.setImageFormatType}
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
              onPress={() => handleClick("Download the Edited Image")}
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
