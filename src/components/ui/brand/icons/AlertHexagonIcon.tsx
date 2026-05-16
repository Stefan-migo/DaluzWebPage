type AlertHexagonIconProps = {
  className?: string;
  bgColor?: string;
  markColor?: string;
};

export default function AlertHexagonIcon({
  className,
  bgColor = "#faf7ef",
  markColor = "#97000d",
}: AlertHexagonIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="305 230 90 90"
      className={className}
      aria-hidden="true"
    >
      <path
        fill={bgColor}
        d="M364.2,232.6h-26.4c-2.6,0-5.1,1-6.9,2.8l-18.7,18.7c-1.8,1.8-2.8,4.3-2.8,6.9v26.4c0,2.6,1,5.1,2.8,6.9l18.7,18.7c1.8,1.8,4.3,2.8,6.9,2.8h26.4c2.6,0,5.1-1,6.9-2.8l18.7-18.7c1.8-1.8,2.8-4.3,2.8-6.9v-26.4c0-2.6-1-5.1-2.8-6.9l-18.7-18.7c-1.8-1.8-4.3-2.8-6.9-2.8Z"
      />
      <path
        fill={markColor}
        d="M350.4,244.8c1.6-.2,3.2.5,4,1.9.8,1.6.3,4.3.2,6-.3,8.6-.7,17.2-1.1,25.8,0,1.8,0,3.9-.1,5.7-.1,1.3-.7,2.7-2.3,2.7-1.7,0-2.2-1.5-2.3-2.9-.5-7.1-.5-14.6-.8-21.7-.2-4.5-.7-9.4-.7-13.8,0-1.7,1.4-3.5,3.2-3.8Z"
      />
      <path
        fill={markColor}
        d="M350.1,292.5c6.9-1.1,7.8,8.9,1.9,9.7-7,1-7.7-8.8-1.9-9.7Z"
      />
    </svg>
  );
}
