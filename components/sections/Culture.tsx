"use client";

import React from "react";
import Dome from "../Dome";
import CultureList from "../CultureList";

const Culture = () => {
  return (
    <>
      <div className="relative w-full ">
        <Dome />
      </div>
      <CultureList />
    </>
  );
};

export default Culture;