"use client";

import { useState } from "react";
import { Image, Button } from "@nextui-org/react";

const Home = () => {
  const [image, setImage] = useState(null);
  const [binaryImage, setBinaryImage] = useState(null);

  // Display an image to upload
  const displayPreview1 = () => {
    if (image) {
      return (
        <Image
          src={window.URL.createObjectURL(image)}
          alt="Uploaded image"
          width={300}
        />
      );
    }
  };

  // Handle a click event to download the edited image
  const handleClick = () => {
    // Convert Node.js Buffer into Blob
    const buffer = Buffer.from(binaryImage);
    const blob = new Blob([buffer]);
    const blobUrl = window.URL.createObjectURL(blob);

    // Download the Blob image into a user's PC
    const a = document.createElement("a");
    a.href = blobUrl;
    a.download = "downloaded-image.png";
    a.click();
  }

  // Display an image after editing
  const displayPreview2 = () => {
    if (binaryImage) {
      const base64Image = Buffer.from(binaryImage).toString("base64");
      return (
        <div className="flex flex-col items-center">
          <Image
            src={`data:image/jpeg;base64,${base64Image}`}
            alt="Downloaded image"
            width={300}
          />
          <Button type="button" color="primary" variant="solid" onClick={handleClick}>
            Download the Edited Image
          </Button>
        </div>
      );
    }
  };

  // Handle a form submission to upload images to S3
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(image);

    const formData = new FormData();
    formData.append("image", image);
    const res = await fetch("/api/uploadImages", {
      method: "POST",
      body: formData,
    });
    const modifiedImage = await res.json();
    console.log(modifiedImage);
    setBinaryImage(modifiedImage);
  };

  return (
    <main className="flex flex-col items-center">
      <form className="flex flex-col items-center" onSubmit={handleSubmit}>
        <label htmlFor="image">Select an Image file</label>
        <input
          className="hidden"
          type="file"
          accept="image/*"
          name="image"
          id="image"
          onChange={(e) => setImage(e.target.files[0])}
          required
        />
        <Button type="submit" color="primary" variant="solid">
          Submit
        </Button>
      </form>
      {displayPreview1()}
      {displayPreview2()}
    </main>
  );
};

export default Home;
