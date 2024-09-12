import React from "react";

export default function RoundedNumber(props: {
  num: number;
  unitSingular: string;
  unitPlural: string;
}) {
  const { num, unitSingular, unitPlural } = props;
  return (
    <>
      {num > 1000 ? Math.round(num / 1000).toFixed(1) : num}
      {num >= 1000 ? "k" : ""} {num < 2 ? unitSingular : unitPlural}
    </>
  );
}
