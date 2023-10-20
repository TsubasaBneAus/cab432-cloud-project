"use client";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@nextui-org/react";
import { defaultValues } from "@/lib/constVariables";

const ErrorModal = (props) => {
  return (
    <Modal
      isOpen={props.isOpen}
      onOpenChange={props.onOpenChange}
      placement="center"
      backdrop="blur"
      classNames={{
        closeButton: "hidden",
      }}
    >
      <ModalContent className="bg-slate-800">
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              {props.message}
            </ModalHeader>
            <ModalBody>
              <p>{props.errorMessage}</p>
            </ModalBody>
            <ModalFooter>
              <Button
                className="flex items-center justify-center"
                color="primary"
                onPress={async () => {
                  onClose();
                  // Set default values to all states
                  props.setUploadedImage(defaultValues.uploadedImage);
                  props.setEditedImage(defaultValues.uploadedImage);
                  props.setImageWidth(defaultValues.imageWidth);
                  props.setImageEffect(defaultValues.imageEffect);
                  props.setImageFormatType(defaultValues.imageFormatType);
                }}
              >
                {props.errorButtonTitle}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default ErrorModal;
