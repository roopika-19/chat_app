import React from "react";
import type { SVGProps } from "react";

export function VideoDrop(props: SVGProps<SVGSVGElement>) {
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
        d="M3.27 2L2 3.27L4.73 6H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h12c.2 0 .39-.08.54-.18L19.73 21L21 19.73M21 6.5l-4 4V7a1 1 0 0 0-1-1H9.82L21 17.18z"
      ></path>
    </svg>
  );
}
