"use client";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@nextui-org/react";

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
                onPress={() => {
                  onClose();
                  props.setUploadedImage(null);
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
