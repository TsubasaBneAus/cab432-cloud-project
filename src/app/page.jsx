"use client";

import { useState } from "react";
import { Image, Button } from "@nextui-org/react";

const Home = () => {
  const [data, setData] = useState(null);
  const [binaryData, setBinaryData] = useState(null);

  const displayPreview1 = () => {
    if (data) {
      return (
        <Image
          src={window.URL.createObjectURL(data)}
          alt="Uploded image"
          width={300}
        />
      );
    }
  };

  const displayPreview2 = () => {
    if (binaryData) {
      const base64Image = Buffer.from(binaryData).toString("base64");
      return (
        <Image
          src={`data:image/jpeg;base64,${base64Image}`}
          alt="Downloaded image"
          width={300}
        />
      );
    }
  };

  // Handle a form submission to upload images to S3
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(data);

    const formData = new FormData();
    formData.append("image", data);
    const res = await fetch("/api/uploadImages", {
      method: "POST",
      body: formData,
    });
    const image = await res.json();
    console.log(image);
    setBinaryData(image);

    // Convert Node.js Buffer into Blob
    const buffer = Buffer.from(image);
    const blob = new Blob([buffer]);
    const blobUrl = window.URL.createObjectURL(blob);

    // Download the Blob image into a user's PC
    const a = document.createElement("a");
    a.href = blobUrl;
    a.download = "downloaded-image.png";
    a.click();
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
          onChange={(e) => setData(e.target.files[0])}
          required
        />
        <Button type="submit" color="primary" variant="solid">
          Submit
        </Button>
      </form>
      {displayPreview()}
      {displayPreview2()}
    </main>
  );
};

export default Home;
