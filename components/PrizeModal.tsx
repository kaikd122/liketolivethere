import { XMarkIcon } from "@heroicons/react/24/solid";
import React from "react";
import uzeStore from "../lib/store/store";
import Button from "./ui/Button";
import Card from "./ui/Card";
import Modal from "./ui/Modal";

function PrizeModal() {
  const isPrizeModalOpen = uzeStore((state) => state.isPrizeModalOpen);
  const { setIsPrizeModalOpen } = uzeStore((state) => state.actions);

  if (!isPrizeModalOpen) {
    return null;
  }
  return (
    <Modal
      onClick={() => {
        setIsPrizeModalOpen(false);
      }}
    >
      <Card className="shadow-lg rounded-lg">
        <div className="flex flex-col items-center justify-center w-full pb-4">
          <div className="flex flex-row items-center justify-end w-full">
            <Button
              type="button"
              onClick={() => {
                setIsPrizeModalOpen(false);
              }}
              outlineColor="red"
              className="flex flex-row gap-1 items-center justify-center "
              border="thin"
            >
              <XMarkIcon className="h-5 w-5 " />
              <p>Close</p>
            </Button>
          </div>
          <div className="gap-4 text-center items-center justify-center flex flex-col w-full md:w-10/12 break-words">
            <div className="text-3xl w-3/4">Monthly prize draw</div>
            <p className="text-left w-full">
              Our goal with Like To Live There is to create the go-to resource
              for sharing and discovering what it&apos;s{" "}
              <span className="italic whitespace-pre">actually</span> like to
              live ... there.{" "}
            </p>
            <p className="text-left w-full">
              If you&apos;re interested in an area, more often than not googling
              &ldquo;What&apos;s it like to live there?&rdquo; will give you a
              load of generic information, or propaganda from estate agents. We
              want to change that, by providing an honest, unbiased, and
              community-driven platform for people to share their experiences of
              living in different areas.
            </p>
            <p className="text-left w-full">
              This means that we need your help! We want to encourage people to
              share their experiences, and to do that we&apos;re running a
              monthly prize draw. Each month &#40;on the 1st&#41;, we&apos;ll
              pick a random user who has contributed at least one review
              &#40;not necessarily in that month&#41;, and they&apos;ll win a
              £20 Amazon voucher. The more reviews you contribute, the greater
              the chance you have of winning. If you win, we&apos;ll send the
              voucher to the email address you used to sign up.
            </p>
            <p className="text-left w-full ">Good luck!</p>
          </div>
        </div>
      </Card>
    </Modal>
  );
}

export default PrizeModal;
