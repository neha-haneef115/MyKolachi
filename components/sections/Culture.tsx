"use client";

import React from "react";
import Dome from "../Dome";
import CultureList from "../CultureList";

const Culture = () => {
  return (
    <section id="culture">
      <div className="relative w-full ">
        <Dome />
      </div>
      <CultureList />
    </section>
  );
};

export default Culture;