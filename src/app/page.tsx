"use client";

import { callFetchUser } from "@/apis/userAPI";
import { doGetAccountAction } from "@/redux/slices/accountSlice";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import paths from "@/app/paths";

export default function Home() {
  const dispatch = useDispatch();
  const [avatar, setAvatar] = useState("");
  const user = useSelector((state) => state.account.user);
  const router = useRouter();
  const getAccount = async () => {
    const res = await callFetchUser();
    if (res?.id) {
      dispatch(doGetAccountAction(res));
    }
  };
  useEffect(() => {
    getAccount();
    router.push(`${paths.library}`);
  }, []);

  return <></>;
}
