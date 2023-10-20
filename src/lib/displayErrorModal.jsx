// Check which error modal is displayed
const displayErrorModal = (
  result,
  onClose,
  onOpen,
  uploadedImage,
  editedImage,
  setUploadedImage,
  setEditedImage,
  setMessage,
  setErrorMessage,
  setErrorButtonTitle,
) => {
  // Check if an error modal is displayed
  if (result.state) {
    onClose();

    // Check if the edited Node.js Buffer exists
    if (result.image) {
      // Check if both uploaded and edited images exist
      if (uploadedImage && editedImage) {
        setUploadedImage(result.image);
        setEditedImage("");
      } else {
        setEditedImage(result.image);
      }
    }
  } else {
    setMessage(result.message);

    // Change error messages depending on the contents of the error
    switch (result.message) {
      case "Image Uploading Error":
        setErrorMessage(
          "It failed to upload your image to the cache and database. Please click on the button below to go to the Image Selection page and try again in a minute.",
        );
        setErrorButtonTitle("Back To Image Selection");
        break;
      case "Image Deletion Error":
        setErrorMessage(
          "It failed to delete your image from the cache and database. Please click on the button below to go to the Image Selection page and try again in a minute.",
        );
        setErrorButtonTitle("Back To Image Selection");
    }
    onOpen();
  }
};

export default displayErrorModal;
