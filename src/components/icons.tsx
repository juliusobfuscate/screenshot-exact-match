import { File, Folder, Archive, FileText, FileVideo, FileAudio, FileImage, FilePdf, FileCode, FileSpreadsheet, FilePresentation, Globe, User, Mail, Lock, Eye, EyeOff, Search, Bell, Settings, LogOut, ChevronLeft, ChevronRight, ChevronUp, ChevronDown, Plus, Trash2, Edit, MoreVertical, X, Check, AlertTriangle, Info, HelpCircle, Download, Upload, Share2, Copy, Link2, Facebook, Twitter, Chrome, Loader2 } from "lucide-react";

export const MediaFireIcon = ({ className = "w-8 h-8" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2L2 7V17L12 22L22 17V7L12 2Z" fill="currentColor" />
    <path d="M12 2L12 12" stroke="white" strokeWidth="2" />
    <path d="M2 7L12 12L22 7" stroke="white" strokeWidth="2" />
    <path d="M12 22V12" stroke="white" strokeWidth="2" />
  </svg>
);

export const MediaFireIconWhite = ({ className = "w-8 h-8" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2L2 7V17L12 22L22 17V7L12 2Z" fill="white" />
    <path d="M12 2L12 12" stroke="#0A1A2F" strokeWidth="2" />
    <path d="M2 7L12 12L22 7" stroke="#0A1A2F" strokeWidth="2" />
    <path d="M12 22V12" stroke="#0A1A2F" strokeWidth="2" />
  </svg>
);

export const FileIcon = ({ type, className = "w-6 h-6" }: { type: string; className?: string }) => {
  const icons: Record<string, JSX.Element> = {
    archive: <Archive className={className} />,
    zip: <Archive className={className} />,
    rar: <Archive className={className} />,
    '7z': <Archive className={className} />,
    video: <FileVideo className={className} />,
    mp4: <FileVideo className={className} />,
    mkv: <FileVideo className={className} />,
    avi: <FileVideo className={className} />,
    audio: <FileAudio className={className} />,
    mp3: <FileAudio className={className} />,
    wav: <FileAudio className={className} />,
    image: <FileImage className={className} />,
    jpg: <FileImage className={className} />,
    jpeg: <FileImage className={className} />,
    png: <FileImage className={className} />,
    gif: <FileImage className={className} />,
    pdf: <FilePdf className={className} />,
    doc: <FileText className={className} />,
    docx: <FileText className={className} />,
    txt: <FileText className={className} />,
    xls: <FileSpreadsheet className={className} />,
    xlsx: <FileSpreadsheet className={className} />,
    ppt: <FilePresentation className={className} />,
    pptx: <FilePresentation className={className} />,
    code: <FileCode className={className} />,
    js: <FileCode className={className} />,
    html: <FileCode className={className} />,
    css: <FileCode className={className} />,
    default: <File className={className} />,
  };

  return icons[type.toLowerCase()] || icons.default;
};

export const SocialIcons = {
  Google: ({ className = "w-5 h-5" }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  ),
  Facebook: ({ className = "w-5 h-5" }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  ),
  Twitter: ({ className = "w-5 h-5" }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.223.085 4.934 4.934 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
    </svg>
  ),
};

export { File, Folder, Archive, FileText, FileVideo, FileAudio, FileImage, FilePdf, FileCode, FileSpreadsheet, FilePresentation, Globe, User, Mail, Lock, Eye, EyeOff, Search, Bell, Settings, LogOut, ChevronLeft, ChevronRight, ChevronUp, ChevronDown, Plus, Trash2, Edit, MoreVertical, X, Check, AlertTriangle, Info, HelpCircle, Download, Upload, Share2, Copy, Link2, Chrome, Loader2 };
