import React from "react";
import type { SVGProps } from "react";

export function CallDrop(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={props.width ?? props.height ?? "1em"}
      height={props.height ?? props.width ?? "1em"}
      viewBox="0 0 24 24"
      {...props}
    >
      <path
        fill={props.color ?? "white"}
        d="M12 8q2.95 0 5.813 1.188T22.9 12.75q.3.3.3.7t-.3.7l-2.3 2.25q-.275.275-.638.3t-.662-.2l-2.9-2.2q-.2-.15-.3-.35t-.1-.45v-2.85q-.95-.3-1.95-.475T12 10t-2.05.175T8 10.65v2.85q0 .25-.1.45t-.3.35l-2.9 2.2q-.3.225-.663.2t-.637-.3l-2.3-2.25q-.3-.3-.3-.7t.3-.7q2.2-2.375 5.075-3.562T12 8"
      ></path>
    </svg>
  );
}
