// Small hand-picked icon set (feather-style outline icons) used across the
// app's screens. Kept as plain react-native-svg components rather than
// pulling in a full icon library — the app only needs a dozen or so icons.
import React from "react";
import Svg, { Path, Rect, Circle } from "react-native-svg";

export type IconProps = {
  size?: number;
  color?: string;
};

const base = (size: number) => ({ width: size, height: size, viewBox: "0 0 24 24" });

export function IconPlus({ size = 24, color = "#000" }: IconProps) {
  return (
    <Svg {...base(size)} fill="none">
      <Path d="M12 5v14M5 12h14" stroke={color} strokeWidth={2} strokeLinecap="round" />
    </Svg>
  );
}

export function IconTransfer({ size = 24, color = "#000" }: IconProps) {
  return (
    <Svg {...base(size)} fill="none">
      <Path
        d="M7 7h13l-3-3M17 17H4l3 3"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function IconPocket({ size = 24, color = "#000" }: IconProps) {
  return (
    <Svg {...base(size)} fill="none">
      <Rect x={3} y={7} width={18} height={13} rx={2} stroke={color} strokeWidth={2} />
      <Path d="M3 10h18M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" stroke={color} strokeWidth={2} />
    </Svg>
  );
}

export function IconMore({ size = 24, color = "#000" }: IconProps) {
  return (
    <Svg {...base(size)} fill="none">
      <Circle cx={5} cy={12} r={1.5} fill={color} />
      <Circle cx={12} cy={12} r={1.5} fill={color} />
      <Circle cx={19} cy={12} r={1.5} fill={color} />
    </Svg>
  );
}

export function IconBell({ size = 24, color = "#000" }: IconProps) {
  return (
    <Svg {...base(size)} fill="none">
      <Path
        d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"
        stroke={color}
        strokeWidth={2}
        strokeLinejoin="round"
      />
      <Path d="M13.73 21a2 2 0 0 1-3.46 0" stroke={color} strokeWidth={2} />
    </Svg>
  );
}

export function IconChevronLeft({ size = 24, color = "#000" }: IconProps) {
  return (
    <Svg {...base(size)} fill="none">
      <Path
        d="m15 18-6-6 6-6"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function IconChevronRight({ size = 24, color = "#000" }: IconProps) {
  return (
    <Svg {...base(size)} fill="none">
      <Path
        d="m9 18 6-6-6-6"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function IconEdit({ size = 24, color = "#000" }: IconProps) {
  return (
    <Svg {...base(size)} fill="none">
      <Path d="M12 20h9" stroke={color} strokeWidth={2} strokeLinecap="round" />
      <Path
        d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"
        stroke={color}
        strokeWidth={2}
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function IconBag({ size = 24, color = "#000" }: IconProps) {
  return (
    <Svg {...base(size)} fill="none">
      <Path d="M6 8h12l1 12H5L6 8z" stroke={color} strokeWidth={2} strokeLinejoin="round" />
      <Path d="M9 8a3 3 0 0 1 6 0" stroke={color} strokeWidth={2} />
    </Svg>
  );
}

export function IconArrowDownLeft({ size = 24, color = "#000" }: IconProps) {
  return (
    <Svg {...base(size)} fill="none">
      <Path
        d="M17 7 7 17M17 17H7V7"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function IconArrowUpRight({ size = 24, color = "#000" }: IconProps) {
  return (
    <Svg {...base(size)} fill="none">
      <Path
        d="M7 17 17 7M7 7h10v10"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function IconHome({ size = 24, color = "#000" }: IconProps) {
  return (
    <Svg {...base(size)} fill="none">
      <Path
        d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"
        stroke={color}
        strokeWidth={2}
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function IconGrid({ size = 24, color = "#000" }: IconProps) {
  return (
    <Svg {...base(size)} fill="none">
      <Rect x={3} y={3} width={7} height={7} rx={1.5} stroke={color} strokeWidth={2} />
      <Rect x={14} y={3} width={7} height={7} rx={1.5} stroke={color} strokeWidth={2} />
      <Rect x={14} y={14} width={7} height={7} rx={1.5} stroke={color} strokeWidth={2} />
      <Rect x={3} y={14} width={7} height={7} rx={1.5} stroke={color} strokeWidth={2} />
    </Svg>
  );
}

export function IconCard({ size = 24, color = "#000" }: IconProps) {
  return (
    <Svg {...base(size)} fill="none">
      <Rect x={1} y={4} width={22} height={16} rx={2} stroke={color} strokeWidth={2} />
      <Path d="M1 10h22" stroke={color} strokeWidth={2} />
    </Svg>
  );
}

export function IconProfile({ size = 24, color = "#000" }: IconProps) {
  return (
    <Svg {...base(size)} fill="none">
      <Path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke={color} strokeWidth={2} strokeLinecap="round" />
      <Circle cx={12} cy={7} r={4} stroke={color} strokeWidth={2} />
    </Svg>
  );
}

// Alias — SelectRow's default avatar uses the same glyph as IconProfile but
// under a name that reads correctly at call sites picking a person icon.
export const IconUser = IconProfile;

export function IconSearch({ size = 24, color = "#000" }: IconProps) {
  return (
    <Svg {...base(size)} fill="none">
      <Circle cx={11} cy={11} r={7} stroke={color} strokeWidth={2} />
      <Path d="m20 20-3.5-3.5" stroke={color} strokeWidth={2} strokeLinecap="round" />
    </Svg>
  );
}

export function IconCheck({ size = 24, color = "#000" }: IconProps) {
  return (
    <Svg {...base(size)} fill="none">
      <Path d="M20 6 9 17l-5-5" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export function IconBackspace({ size = 24, color = "#000" }: IconProps) {
  return (
    <Svg {...base(size)} fill="none">
      <Path
        d="M9 6h11a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H9l-6-6 6-6Z"
        stroke={color}
        strokeWidth={2}
        strokeLinejoin="round"
      />
      <Path d="m13 10 4 4M17 10l-4 4" stroke={color} strokeWidth={2} strokeLinecap="round" />
    </Svg>
  );
}
