"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  CircularProgress,
} from "@nextui-org/react";

const MyPage = () => {
  const router = useRouter();
  const { status } = useSession();
  const { isOpen, onClose, onOpen, onOpenChange } = useDisclosure();

  // Delete user account from the database
  const deleteUserAccount = async () => {
    const res = await fetch("/api/deleteUserAccount");
    const result = await res.json();

    // Check if a user's account was deleted properly
    if (result.state) {
      onClose();
      signOut();
    } else {
      onOpen();
    }
  };

  // Change the my page depending on if a user is already signed in
  if (status == "authenticated") {
    return (
      <main className="flex grow animate-fade-in-top flex-col items-center justify-center">
        <Modal
          isOpen={isOpen}
          onOpenChange={onOpenChange}
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
                  Account Deletion Error
                </ModalHeader>
                <ModalBody>
                  <p>
                    It failed to delete your image from the database. Please
                    click on the button below to go to the My Page and try again
                    in a minute.
                  </p>
                </ModalBody>
                <ModalFooter>
                  <Button
                    className="flex items-center justify-center"
                    color="primary"
                    onPress={onClose}
                  >
                    Back To My Page
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
        <Button
          className="transition delay-150 duration-300 ease-in-out hover:-translate-y-1 hover:scale-110 hover:bg-indigo-500"
          color="primary"
          size="lg"
          onPress={deleteUserAccount}
        >
          Delete Your Account
        </Button>
      </main>
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
    router.push("/");
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
  }
};

export default MyPage;
