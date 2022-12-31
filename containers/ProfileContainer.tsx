import { TrashIcon } from "@heroicons/react/24/solid";
import { Review, User } from "@prisma/client";
import { signOut, useSession } from "next-auth/react";
import router from "next/router";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import ReviewStub from "../components/ReviewStub";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import Modal from "../components/ui/Modal";
import { getReviewsForUserRequest } from "../lib/actions/review";
import {
  deleteUserAndReviewsCommand,
  getUserRequest,
  updateUserArgs,
  updateUserCommand,
} from "../lib/actions/user";
import uzeStore from "../lib/store/store";

function ProfileContainer() {
  async function handleDeleteAccount() {
    try {
      const res = await deleteUserAndReviewsCommand({
        userId: user?.id,
      });
      if (res.ok) {
        toast.success("Account deleted");
        router.push("/");
        signOut();
        setUser(null);
      }
    } catch (e) {
      console.log(e);
    }
  }

  const currentTab = uzeStore((state) => state.currentTab);
  const { data: session } = useSession();
  const { setUser, setIsMapLoaded } = uzeStore((state) => state.actions);
  const user = uzeStore((state) => state.user);
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [userReviews, setUserReviews] = useState<Review[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);
  const [confirmDeleteVal, setConfirmDeleteVal] = useState("");

  const [value, setValue] = useState(user?.name || "");

  useEffect(() => {
    const main = async () => {
      setUserReviews([]);
      try {
        const res = await getReviewsForUserRequest({
          userId: user?.id,
        });
        if (res.ok) {
          const data = await res.json();
          setUserReviews(data);
          console.log(data);
        }
      } catch (e) {
        console.log(e);
      }
    };
    if (user?.id) {
      main();
    }
  }, [user]);

  async function handleSubmit(e: React.MouseEvent) {
    e.preventDefault();
    if (!value) {
      toast.error("Username cannot be empty");
      return;
    }
    const getRes = await getUserRequest({ name: value });
    if (getRes.ok) {
      const data: User[] = await getRes.json();
      if (data.length) {
        toast.error("Username already taken");
        return;
      }
    } else {
      return;
    }

    const args: updateUserArgs = {
      userId: user?.id,
      data: { name: value },
    };
    const updateRes = await updateUserCommand(args);
    if (updateRes.ok) {
      setUser({ ...user, name: value });
      setIsEditingUsername(false);
      toast.success("Username updated!");
    }
  }

  useEffect(() => {
    if (user?.name) {
      setValue(user.name);
    }
  }, [user]);

  if (currentTab !== "PROFILE") {
    return null;
  }

  return (
    <div className="w-full flex flex-col gap-4">
      <form className="flex flex-col gap-4">
        {isEditingUsername ? (
          <div className="flex flex-row items-center justify-start">
            <input
              onChange={(e) => setValue(e.target.value)}
              value={value}
              className="text-5xl border-stone-400 border rounded p-2 shadow-sm  outline-violet-300 "
            />
          </div>
        ) : (
          <h1 className="text-5xl">{user?.name}</h1>
        )}
        <div className="flex flex-row w-full justify-start items-center gap-3 ">
          {isEditingUsername && (
            <Button
              type="submit"
              outlineColor="stone"
              border="thin"
              onClick={(e) => handleSubmit(e!)}
            >
              Save
            </Button>
          )}
          <Button
            outlineColor="stone"
            border="thin"
            type="button"
            onClick={() => setIsEditingUsername(!isEditingUsername)}
          >
            {isEditingUsername ? "Cancel" : "Edit username"}
          </Button>
        </div>
      </form>

      {userReviews.map((r) => {
        return <ReviewStub review={{ ...r, distance: undefined }} key={r.id} />;
      })}

      <div className="flex flex-row w-full items-center justify-between ">
        <div />
        {isDeleting ? (
          <div className="flex flex-row gap-3">
            {confirmDeleteVal === user?.name ? (
              <Button
                outlineColor="red"
                border="thin"
                onClick={handleDeleteAccount}
              >
                <div className="flex flex-row gap-1 justify-center items-center">
                  <TrashIcon className="w-5 h-5 items-center justify-center" />
                  <p>Confirm</p>
                </div>
              </Button>
            ) : (
              <input
                onChange={(e) => {
                  setConfirmDeleteVal(e.target.value);
                }}
                value={confirmDeleteVal}
                placeholder="Type your username"
                className=" border-stone-400 border rounded p-2 shadow-sm  outline-violet-300"
              />
            )}

            <Button
              outlineColor="stone"
              border="thin"
              onClick={() => {
                setIsDeleting(false);
                setConfirmDeleteVal("");
              }}
            >
              <p>Cancel</p>
            </Button>
          </div>
        ) : (
          <Button
            outlineColor="red"
            border="thin"
            onClick={() => setIsDeleting(true)}
          >
            <div className="flex flex-row gap-1 justify-center items-center">
              <TrashIcon className="w-5 h-5 items-center justify-center" />
              <p>Delete account</p>
            </div>
          </Button>
        )}
      </div>
    </div>
  );
}

export default ProfileContainer;
