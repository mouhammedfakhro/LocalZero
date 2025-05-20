"use client";
import auth from "@/service/auth";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function Inbox() {
  const router = useRouter();

  useEffect(() => {
    auth.logout();
    router.push("/")
  }, []);

  <div>
    <></>
  </div>;
}
