"use client";

import { Icon } from "@iconify/react/dist/iconify.js";
import React from "react";

export default function Loading() {
  return <div className="w-full h-full flex items-center justify-center">
    <Icon icon="eos-icons:bubble-loading" className="size-10 text-card-foreground" />
  </div>;
}
