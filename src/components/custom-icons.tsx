import { Facebook, Bird, Download, FileArchive } from "lucide-react";

export const BirdGlyph = ({ className = "" }: { className?: string }) => (
  <Bird className={className} />
);

export const FacebookGlyph = ({ className = "" }: { className?: string }) => (
  <Facebook className={className} />
);

export const SolidDownloadIcon = ({ className = "" }: { className?: string }) => (
  <Download className={className} fill="currentColor" />
);

export const ZipFileIcon = ({ className = "" }: { className?: string }) => (
  <FileArchive className={className} />
);
