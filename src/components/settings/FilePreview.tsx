import { FileText, FileVideo, Image as ImageIcon } from "lucide-react";

import { SolidDownloadIcon, ZipFileIcon } from "@/components/demo/icons";
import type { FileIcon } from "@/lib/admin/rules";

function Glyph({ icon }: { icon: FileIcon }) {
  if (icon === "archive") return <ZipFileIcon className="h-[34px] w-[26px] shrink-0" />;
  const Icon = icon === "video" ? FileVideo : icon === "image" ? ImageIcon : FileText;
  return <Icon className="size-[28px] shrink-0" strokeWidth={1.6} />;
}

/** Miniature of the download button exactly as the homepage would show the file. */
export function FilePreview({ name, size, icon }: { name: string; size: string; icon: FileIcon }) {
  return (
    <div className="flex h-[48px] w-full min-w-[220px] items-center rounded-[4px] bg-mf-blue pr-3 pl-[6px] font-sans text-primary-foreground">
      <Glyph icon={icon} />
      <span className="ml-3 min-w-0 flex-1">
        <span className="block truncate text-[13px] leading-tight font-medium">{name || "File name"}</span>
        <span className="mt-[2px] block truncate text-[11px] font-light">
          Download in a new tab ({size || "0MB"})
        </span>
      </span>
      <SolidDownloadIcon className="ml-2 size-[14px] shrink-0" />
    </div>
  );
}
