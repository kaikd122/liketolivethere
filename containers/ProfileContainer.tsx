import React from "react";
import uzeStore from "../lib/store/store";

function ProfileContainer() {
  const currentTab = uzeStore((state) => state.currentTab);
  if (currentTab !== "PROFILE") {
    return null;
  }

  return <div>ProfileContainer</div>;
}

export default ProfileContainer;
