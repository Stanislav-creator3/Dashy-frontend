"use client";

import React, { useState } from "react";
import { OptionType } from "./Option";
import { Option } from "./Option";
import { LayoutGroup } from "motion/react";

import { motion } from "motion/react";
import { cn } from "@/shared/utils/utils";

interface IRadioGroupProps {
  name: string;
  options: OptionType[];
  selected: OptionType["value"];
  onChange?: (value: string) => void;
}

function RadioGroup({ name, options, selected, onChange }: IRadioGroupProps) {
  const handleClick = (value: string) => {
    onChange?.(value);
  };
  return (
    <LayoutGroup id={name}>
      <ul className="relative flex flex-col bg-background rounded-sm">
        {options.map((item) => (
          <motion.li
            key={item.value}
            data-value={item.value}
            className={cn("relative list-none flex-1")}
            initial={false}
          >
            <Option
              key={item.value}
              groupName={name}
              value={item.value}
              content={item.content}
              selected={selected}
              onChange={handleClick}
            />
          </motion.li>
        ))}
      </ul>
    </LayoutGroup>
  );
}

export default React.memo(RadioGroup);
