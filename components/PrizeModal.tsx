import { XMarkIcon } from "@heroicons/react/24/solid";
import React from "react";
import uzeStore from "../lib/store/store";
import Button from "./ui/Button";
import Card from "./ui/Card";
import Modal from "./ui/Modal";

function PrizeModal() {
  const isPrizeModalOpen = uzeStore((state) => state.isPrizeModalOpen);
  const isWhatToWriteModalOpen = uzeStore(
    (state) => state.isWhatToWriteModalOpen
  );

  const { setIsPrizeModalOpen, setIsWhatToWriteModalOpen } = uzeStore(
    (state) => state.actions
  );

  if (!isPrizeModalOpen && !isWhatToWriteModalOpen) {
    return null;
  }
  return (
    <Modal
      onClick={() => {
        setIsPrizeModalOpen(false);
        setIsWhatToWriteModalOpen(false);
      }}
    >
      <Card className="shadow-lg rounded-lg">
        <div className="flex flex-col items-center justify-center w-full pb-4">
          <div className="flex flex-row items-center justify-end w-full">
            <Button
              type="button"
              onClick={() => {
                setIsPrizeModalOpen(false);
                setIsWhatToWriteModalOpen(false);
              }}
              outlineColor="red"
              className="flex flex-row gap-1 items-center justify-center "
              border="thin"
            >
              <XMarkIcon className="h-5 w-5 " />
              <p>Close</p>
            </Button>
          </div>
          {isPrizeModalOpen ? (
            <div className="gap-4 text-center items-center justify-center flex flex-col w-full md:w-10/12 break-words font-light">
              <div className="text-3xl w-3/4">Monthly prize draw</div>
              <p className="text-left w-full">
                My goal with Like To Live There was to create the go-to resource
                for sharing and discovering what it&apos;s{" "}
                <span className="italic whitespace-pre">actually</span> like to
                live ... there.{" "}
              </p>
              <p className="text-left w-full">
                More often than not, googling &ldquo;What&apos;s it like to live
                there?&rdquo; when you&apos;re interested in an area will give
                you a load of generic statistics like house prices, and
                propaganda from estate agents. When I was searching for a flat
                last year, I found that the most useful insights actually came
                from threads on forums like Mumsnet or The Student Room, as
                people were more likely to be &#40;sometimes brutally&#41;
                honest, and to focus on the aspects of living in an area that
                aren&apos;t captured well in statistics - answers to questions
                like &ldquo;Is there a good community spirit?&rdquo; and
                &ldquo;Does it feel safe?&rdquo;. And so I made Like To Live
                There as a platform to make it easy to share and discover these
                more personal insights.
              </p>
              <p className="text-left w-full">
                However, the platform is only as useful as the content it
                features. And so to encourage people to contribute reviews,
                I&apos;m running a monthly prize draw. Each month &#40;on the
                1st&#41;, I&apos;ll pick a random user who has contributed at
                least one review &#40;not necessarily in that month&#41;, and
                they&apos;ll win a £20 Amazon voucher. The more reviews you
                contribute, the greater the chance you have of winning. If you
                win, I&apos;ll send the voucher to the email address you used to
                sign up.
              </p>
              <p className="text-left w-full">
                A review doesn&apos;t have to be a novel - the minimum length is
                just 200 characters, or about 40 words. The most important thing
                is that you&apos;re honest. You don&apos;t have to be currently
                living in an area to review it - out of date reviews are still
                useful in building a picture of an area, and in suggesting how
                it might develop in the future. So if you having anything to
                share, however small, that might help others, please do!
              </p>

              <p className="text-left w-full ">Good luck!</p>
            </div>
          ) : (
            <div className="gap-4 text-center items-center justify-center flex flex-col w-full md:w-10/12 break-words font-light">
              <div className="text-3xl w-3/4">What to write</div>
              <p className="text-left w-full">
                My goal with Like To Live There was to create the go-to resource
                for sharing and discovering what it&apos;s{" "}
                <span className="italic whitespace-pre">actually</span> like to
                live ... there.{" "}
              </p>
              <p className="text-left w-full">
                More often than not, googling &ldquo;What&apos;s it like to live
                there?&rdquo; when you&apos;re interested in an area will give
                you a load of generic statistics like house prices, and
                propaganda from estate agents. When I was searching for a flat
                last year, I found that the most useful insights actually came
                from threads on forums like Mumsnet or The Student Room, as
                people were more likely to be &#40;sometimes brutally&#41;
                honest, and to focus on the aspects of living in an area that
                aren&apos;t captured well in statistics - answers to questions
                like &ldquo;Is there a good community spirit?&rdquo; and
                &ldquo;Does it feel safe?&rdquo;. And so I made Like To Live
                There as a platform to make it easy to share and discover these
                more personal insights.
              </p>
              <p className="text-left w-full">
                A review doesn&apos;t have to be a novel - the minimum length is
                just 200 characters, or about 40 words. The most important thing
                is that you&apos;re honest. You don&apos;t have to be currently
                living in an area to review it - out of date reviews are still
                useful in building a picture of an area, and in suggesting how
                it might develop in the future. So if you having anything to
                share, however small, that might help others, please do!
              </p>
              <p className="text-left w-full">Thank you!</p>
            </div>
          )}
        </div>
      </Card>
    </Modal>
  );
}

export default PrizeModal;
