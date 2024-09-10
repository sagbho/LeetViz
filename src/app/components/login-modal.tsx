import { SignedOut, SignInButton } from "@clerk/nextjs";
import { Cross1Icon } from "@radix-ui/react-icons";

export const LoginModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 ">
      <div className="bg-white p-8 rounded shadow-lg relative">
        <button
          className="text-black absolute top-2 right-2 font-bold"
          onClick={onClose}
        >
          <Cross1Icon />
        </button>
        <h2 className="text-black tracking-tighter font-bold text-xl mb-4">
          Please log in to use LeetViz
        </h2>
        <h3 className="text-black font-semibold tracking-tighter underline bg-amber-500 mx-20 p-4 rounded-xl">
          <SignedOut>
            <SignInButton />
          </SignedOut>
        </h3>
      </div>
    </div>
  );
};
