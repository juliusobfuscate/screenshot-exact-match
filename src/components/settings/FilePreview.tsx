import { FileText, FileVideo, Image as ImageIcon, Archive as ArchiveIcon, File as FileIconBase } from "lucide-react";

import { SolidDownloadIcon, ZipFileIcon } from "@/components/custom-icons";
import type { FileIcon } from "@/lib/admin/rules";

function Glyph({ icon }: { icon: FileIcon }) {
  if (icon === "archive") return <ZipFileIcon className="h-[34px] w-[26px] shrink-0" />;
  if (icon === "video") return <FileVideo className="size-[28px] shrink-0" strokeWidth={1.6} />;
  if (icon === "image") return <ImageIcon className="size-[28px] shrink-0" strokeWidth={1.6} />;
  if (icon === "file-text") return <FileText className="size-[28px] shrink-0" strokeWidth={1.6} />;
  if (icon === "file-spreadsheet") return <FileText className="size-[28px] shrink-0" strokeWidth={1.6} />;
  return <FileIconBase className="size-[28px] shrink-0" strokeWidth={1.6} />;
}

/** Miniature of the download button exactly as the homepage would show the file. */
export function FilePreview({ 
  file, 
  onEdit,
  onDelete,
  readOnly = false 
}: { 
  file: { id: string; name: string; size: string; icon: FileIcon; active: boolean };
  onEdit?: () => void;
  onDelete?: () => void;
  readOnly?: boolean;
}) {
  return (
    <div className="flex items-center gap-3 rounded-[6px] bg-adm-bg p-3">
      <Glyph icon={file.icon} />
      <div className="min-w-0 flex-1">
        <div className="text-[14px] font-medium text-adm-text">{file.name || "File name"}</div>
        <div className="text-[12px] text-adm-text-soft">{file.size || "0MB"}</div>
      </div>
      {!readOnly && (
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onEdit}
            className="rounded-[4px] p-2 text-adm-text-soft hover:bg-adm-bg-hover hover:text-adm-text outline-none transition focus-visible:shadow-adm-focus"
            aria-label="Edit file"
          >
            <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L15.232 5.232z" />
            </svg>
          </button>
          <button
            type="button"
            onClick={onDelete}
            className="rounded-[4px] p-2 text-adm-danger/70 hover:bg-adm-danger/10 hover:text-adm-danger outline-none transition focus-visible:shadow-adm-focus"
            aria-label="Delete file"
          >
            <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
