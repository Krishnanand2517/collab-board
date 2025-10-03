import { useState, useRef } from "react";
import { createPortal } from "react-dom";

interface TooltipProps {
  text: string;
  children: React.ReactNode;
  delay?: number;
}

const Tooltip = ({ text, children, delay = 500 }: TooltipProps) => {
  const [visible, setVisible] = useState(false);
  const [showing, setShowing] = useState(false);
  const [coords, setCoords] = useState<{ top: number; left: number }>({
    top: 0,
    left: 0,
  });
  const [align, setAlign] = useState<"left" | "center" | "right">("center");
  const [position, setPosition] = useState<"top" | "bottom">("top");

  const ref = useRef<HTMLDivElement | null>(null);
  const timer = useRef<NodeJS.Timeout | null>(null);

  const show = () => {
    timer.current = setTimeout(() => {
      if (ref.current) {
        const rect = ref.current.getBoundingClientRect();

        const tooltipWidth = text.length * 7 + 16; // A rough estimate
        const tooltipHeight = 32;
        const margin = 8;

        let newPosition: "top" | "bottom" = "top";
        let top = rect.top - margin; // Anchor to the top of the element
        if (rect.top - tooltipHeight - margin < 0) {
          // Not enough space above, so flip to the bottom
          newPosition = "bottom";
          top = rect.bottom + margin;
        }

        let newAlign: "left" | "center" | "right" = "center";
        // Default to centering the tooltip over the element
        let left = rect.left + rect.width / 2;

        // Check for right edge collision
        if (left + tooltipWidth / 2 > window.innerWidth) {
          newAlign = "right";
          left = rect.right; // Anchor to the element's right edge
        }
        // Check for left edge collision
        else if (left - tooltipWidth / 2 < 0) {
          newAlign = "left";
          left = rect.left; // Anchor to the element's left edge
        }

        setPosition(newPosition);
        setAlign(newAlign);
        setCoords({ top, left });
      }
      setShowing(true);
      requestAnimationFrame(() => setVisible(true));
    }, delay);
  };

  const hide = () => {
    if (timer.current) clearTimeout(timer.current);
    setVisible(false);
    setTimeout(() => setShowing(false), 150); // unmount after animation
  };

  const getTransform = () => {
    const transformY = position === "top" ? "-100%" : "0";
    let transformX = "-50%"; // Default for 'center'
    if (align === "left") transformX = "0";
    if (align === "right") transformX = "-100%";
    return `translate(${transformX}, ${transformY})`;
  };

  return (
    <>
      <div
        ref={ref}
        onMouseEnter={show}
        onMouseLeave={hide}
        className="inline-block"
      >
        {children}
      </div>

      {showing &&
        createPortal(
          <div
            className={`fixed bg-neutral-800 text-white/80 text-sm px-2 py-1 rounded-lg shadow z-[9999] whitespace-nowrap transition-opacity duration-150 ${
              visible ? "opacity-100" : "opacity-0"
            }`}
            style={{
              top: coords.top,
              left: coords.left,
              transform: getTransform(),
              minWidth: "50px",
              maxWidth: "220px",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {text}
          </div>,
          document.body
        )}
    </>
  );
};

export default Tooltip;
