"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { CircularProgress } from "@nextui-org/react";
import EditingPage from "@/components/EditingPage";

const Home = () => {
  const [uploadedImage, setUploadedImage] = useState(null);
  const [editedImage, setEditedImage] = useState(null);
  const [imageWidth, setImageWidth] = useState(null);
  const [imageEffect, setImageEffect] = useState(null);
  const [imageFormatType, setImageFormatType] = useState(null);
  const { status } = useSession();
  // Handle a click event to download the edited image
  // const handleClick = () => {
  //   // Convert Node.js Buffer into Blob
  //   const buffer = Buffer.from(editedImage);
  //   const blob = new Blob([buffer]);
  //   const blobUrl = window.URL.createObjectURL(blob);

  //   // Download the Blob image into a user's PC
  //   const a = document.createElement("a");
  //   a.href = blobUrl;
  //   a.download = "downloaded-image.png";
  //   a.click();
  // };

  // Handle a form submission to upload images to S3
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(uploadedImage);

    // const formData = new FormData();
    // formData.append("image", image);
    // const res = await fetch("/api/uploadImages", {
    //   method: "POST",
    //   body: formData,
    // });
    // const modifiedImage = await res.json();
    // console.log(modifiedImage);
    // setEditedImage(modifiedImage);
  };

  // Change the top page depending on if a user is already signed in
  if (status == "authenticated") {
    return (
      <EditingPage
        uploadedImage={uploadedImage}
        setUploadedImage={setUploadedImage}
        editedImage={editedImage}
        imageWidth={imageWidth}
        setImageWidth={setImageWidth}
        imageEffect={imageEffect}
        setImageEffect={setImageEffect}
        imageFormatType={imageFormatType}
        setImageFormatType={setImageFormatType}
      />
    );
  } else if (status == "loading") {
    return (
      <main className="flex grow flex-col items-center justify-center">
        <CircularProgress
          classNames={{
            svg: "w-28 h-28",
            label: "text-xl",
          }}
          color="primary"
          label="Loading..."
        />
      </main>
    );
  } else {
    return (
      <main className="flex grow flex-col items-center justify-center">
        <h1 className="animate-fade-in-top mb-5 text-center text-4xl font-semibold">
          Please Sign in to the Image Converter Account!
        </h1>
      </main>
    );
  }
};

export default Home;
