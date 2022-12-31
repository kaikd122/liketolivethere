import { User } from "@prisma/client";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import {
  updateUserCommand,
  updateUserArgs,
  getUserRequest,
} from "../../lib/actions/user";
import uzeStore from "../../lib/store/store";
function ProfileId() {}

export default ProfileId;
