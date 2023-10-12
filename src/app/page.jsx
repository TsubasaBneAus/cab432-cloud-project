"use client";

import { useState } from "react";
import { Image, Button } from "@nextui-org/react";

const Home = () => {
  const [image, setImage] = useState(null);
  const [binaryImage, setBinaryImage] = useState(null);

  // Handle a click event to download the edited image
  // const handleClick = () => {
  //   // Convert Node.js Buffer into Blob
  //   const buffer = Buffer.from(binaryImage);
  //   const blob = new Blob([buffer]);
  //   const blobUrl = window.URL.createObjectURL(blob);

  //   // Download the Blob image into a user's PC
  //   const a = document.createElement("a");
  //   a.href = blobUrl;
  //   a.download = "downloaded-image.png";
  //   a.click();
  // };

  // Display an image after editing
  // const displayPreview2 = () => {
  //   if (binaryImage) {
  //     const base64Image = Buffer.from(binaryImage).toString("base64");
  //     return (
  //       <div className="flex flex-col items-center">
  //         <Image
  //           src={`data:image/jpeg;base64,${base64Image}`}
  //           alt="Downloaded image"
  //           width={300}
  //         />
  //         <Button
  //           type="button"
  //           color="primary"
  //           variant="solid"
  //           onClick={handleClick}
  //         >
  //           Download the Edited Image
  //         </Button>
  //       </div>
  //     );
  //   }
  // };

  // Handle a form submission to upload images to S3
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(image);

    // const formData = new FormData();
    // formData.append("image", image);
    // const res = await fetch("/api/uploadImages", {
    //   method: "POST",
    //   body: formData,
    // });
    // const modifiedImage = await res.json();
    // console.log(modifiedImage);
    // setBinaryImage(modifiedImage);
  };

  // Change the display of the top page depending on if an image is uploaded
  if (image) {
    return (
      <main className="flex grow">
        <div className="grid w-full grid-cols-2 grid-rows-4 items-center justify-center">
          <div className="col-start-1 col-end-2 row-start-1 row-end-4 flex items-center justify-center">
            <Image
              className="max-h-[350px] max-w-[600px]"
              src={window.URL.createObjectURL(image)}
              alt="Uploaded image"
              shadow="lg"
            />
          </div>
          <div className="col-start-1 col-end-2 row-start-4 row-end-5 flex items-center justify-center">
            <Button
              className="mr-2"
              color="primary"
              variant="shadow"
              onPress={() => setImage(null)}
            >
              Back to Image Selection
            </Button>
            <Button
              color="primary"
              variant="shadow"
              onPress={() => setImage(null)}
            >
              Download
            </Button>
          </div>
          <div className="col-start-2 col-end-3 row-start-1 row-end-4"></div>
        </div>
      </main>
    );
  } else {
    return (
      <main className="flex grow flex-col items-center justify-center">
        <label
          className="mb-5 text-4xl font-semibold transition-colors hover:text-blue-500"
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
          onChange={(e) => setImage(e.target.files[0])}
          required
        />
      </main>
    );
  }
};

export default Home;
