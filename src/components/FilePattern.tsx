import { useMemo } from "react";

export const FilePattern = ({ className = "" }: { className?: string }) => {
  const pattern = useMemo(() => {
    return (
      <svg
        className={className}
        width="100%"
        height="100%"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern
            id="filePattern"
            x="0"
            y="0"
            width="20"
            height="20"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M10 0 L20 10 L10 20 L0 10 Z"
              fill="none"
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="0.5"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#filePattern)" />
      </svg>
    );
  }, []);

  return pattern;
};

export default FilePattern;
