import React from "react";
import type { SVGProps } from "react";

export function MicDrop(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      {...props}
    >
      <path
        fill={props.color ?? "currentcolor"}
        d="M17.75 14.95L16.3 13.5q.35-.575.525-1.2T17 11h2q0 1.1-.325 2.088t-.925 1.862m-2.95-3L9 6.15V5q0-1.25.875-2.125T12 2t2.125.875T15 5v6q0 .275-.062.5t-.138.45M11 21v-3.1q-2.6-.35-4.3-2.312T5 11h2q0 2.075 1.463 3.538T12 16q.85 0 1.613-.262T15 15l1.425 1.425q-.725.575-1.588.963T13 17.9V21zm8.8 1.6L1.4 4.2l1.4-1.4l18.4 18.4z"
      ></path>
    </svg>
  );
}
