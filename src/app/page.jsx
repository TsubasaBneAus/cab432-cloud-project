"use client";

import { useState, useEffect } from "react";
import { useSession, signIn } from "next-auth/react";
import { CircularProgress } from "@nextui-org/react";
import EditingPage from "@/components/EditingPage";
import { defaultValues } from "@/lib/constVariables";

const Home = () => {
  const [uploadedImage, setUploadedImage] = useState(defaultValues.uploadedImage);
  const [editedImage, setEditedImage] = useState(defaultValues.editedImage);
  const [imageWidth, setImageWidth] = useState(defaultValues.imageWidth);
  const [imageEffect, setImageEffect] = useState(defaultValues.imageEffect);
  const [imageFormatType, setImageFormatType] = useState(defaultValues.imageFormatType);
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

  // Download an image from Redis or RDS if it exists
  const downloadImage = async () => {
    const res = await fetch("/api/downloadImage");
    const result = await res.json();

    // Check if an image exists
    if (result.image) {
      setUploadedImage(result.image);
    }
  };

  useEffect(() => {
    // Download an image if a user is authenticated
    if (status == "authenticated") {
      downloadImage();
    }
  }, [status])

  // Change the top page depending on if a user is already signed in
  if (status == "authenticated") {
    return (
      <EditingPage
        uploadedImage={uploadedImage}
        setUploadedImage={setUploadedImage}
        editedImage={editedImage}
        setEditedImage={setEditedImage}
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
        <button
          className="mb-5 animate-fade-in-top text-center text-4xl font-semibold transition-colors hover:text-indigo-500"
          onClick={() => signIn("google")}
        >
          Please Sign in to the Image Converter Account!
        </button>
      </main>
    );
  }
};

export default Home;
