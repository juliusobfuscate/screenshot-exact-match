import { createFileRoute } from "@tanstack/react-router";
import { Pencil, Trash2 } from "lucide-react";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";

import { FilePreview } from "@/components/settings/FilePreview";
import {
  AdminButton,
  AdminCard,
  AdminInput,
  AdminSelect,
  Field,
  FormMessage,
  PageHeader,
  StatusBadge,
  Toggle,
} from "@/components/settings/ui";
import { adminMeta } from "@/lib/admin/meta";
import {
  FILE_ICONS,
  FILE_TYPES,
  validateFileDraft,
  type FileDraft,
  type FileIcon,
  type FileType,
  type RuleResult,
} from "@/lib/admin/rules";
import { adminActions, useAdmin, getAdminToken } from "@/lib/admin/store";

export const Route = createFileRoute("/settings/_panel/files")({
  head: () => adminMeta("File Display Settings", "Manage files shown on homepage"),
  component: FilesPage,
});

const emptyDraft: FileDraft = { name: "", type: "ZIP", size: "", icon: "archive", active: true };

function FilesPage() {
  const files = useAdmin((s) => s.files);
  const [draft, setDraft] = useState<FileDraft>(emptyDraft);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [result, setResult] = useState<RuleResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const patch = (p: Partial<FileDraft>) => {
    setDraft((d) => ({ ...d, ...p }));
    setResult(null);
  };

  const reset = () => {
    setDraft(emptyDraft);
    setEditingId(null);
    setResult(null);
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const r = validateFileDraft(draft);
    if (!r.ok) {
      setResult(r);
      return;
    }

    setIsLoading(true);
    
    try {
      const token = getAdminToken();
      if (!token) {
        setResult({ ok: false, message: "Not authenticated" });
        setIsLoading(false);
        return;
      }

      const fileData = {
        name: draft.name.trim(),
        type: draft.type,
        size: draft.size.trim(),
        icon: draft.icon
      };

      if (editingId) {
        // Update file via API
        const response = await fetch('/api/admin/files', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ id: editingId, ...fileData })
        });

        if (!response.ok) {
          const data = await response.json();
          setResult({ ok: false, message: data.message || "Failed to update file" });
          setIsLoading(false);
          return;
        }
        adminActions.updateFile(editingId, draft);
        toast.success("File updated");
      } else {
        // Add new file via API
        const response = await fetch('/api/admin/files', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(fileData)
        });

        if (!response.ok) {
          const data = await response.json();
          setResult({ ok: false, message: data.message || "Failed to add file" });
          setIsLoading(false);
          return;
        }
        adminActions.addFile(draft);
        toast.success("File added");
      }
      
      reset();
    } catch (error) {
      setResult({ ok: false, message: "An error occurred. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  const onDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this file?")) return;

    setIsLoading(true);
    
    try {
      const token = getAdminToken();
      if (!token) {
        toast.error("Not authenticated");
        setIsLoading(false);
        return;
      }

      const response = await fetch('/api/admin/files', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ id })
      });

      if (!response.ok) {
        const data = await response.json();
        toast.error(data.message || "Failed to delete file");
        setIsLoading(false);
        return;
      }

      adminActions.deleteFile(id);
      toast.success("File deleted");
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-[1200px]">
      <PageHeader title="File Display Settings" subtitle="Manage files shown on homepage" />

      <div className="grid gap-6 2xl:grid-cols-[minmax(0,420px)_minmax(0,1fr)]">
        <AdminCard>
          <h2 className="text-[20px] font-semibold text-adm-text">{editingId ? "Edit File" : "Add New File"}</h2>
          <form onSubmit={onSubmit} noValidate autoComplete="off" className="mt-5 flex flex-col gap-5">
            <Field label="File Name" htmlFor="file-name">
              <AdminInput
                id="file-name"
                value={draft.name}
                placeholder="Enter file name"
                onChange={(e) => patch({ name: e.target.value })}
              />
            </Field>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="File Type" htmlFor="file-type">
                <AdminSelect
                  id="file-type"
                  value={draft.type}
                  onValueChange={(v) => patch({ type: v as FileType })}
                >
                  {FILE_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </AdminSelect>
              </Field>
              <Field label="File Size" htmlFor="file-size" hint="e.g. 167.08MB">
                <AdminInput
                  id="file-size"
                  value={draft.size}
                  placeholder="167.08MB"
                  onChange={(e) => patch({ size: e.target.value })}
                />
              </Field>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Icon" htmlFor="file-icon">
                <AdminSelect
                  id="file-icon"
                  value={draft.icon}
                  onValueChange={(v) => patch({ icon: v as FileIcon })}
                >
                  {FILE_ICONS.map((i) => (
                    <option key={i} value={i}>
                      {i}
                    </option>
                  ))}
                </AdminSelect>
              </Field>
              <Field label="Active" htmlFor="file-active">
                <Toggle
                  id="file-active"
                  pressed={draft.active}
                  onPressedChange={(p) => patch({ active: p })}
                />
              </Field>
            </div>

            {result && (
              <FormMessage result={result} />
            )}

            <div className="flex gap-3">
              <AdminButton type="button" onClick={reset} variant="outline">
                Cancel
              </AdminButton>
              <AdminButton type="submit" disabled={isLoading}>
                {isLoading ? "Saving..." : editingId ? "Update File" : "Add File"}
              </AdminButton>
            </div>
          </form>
        </AdminCard>

        <div className="flex flex-col gap-4">
          <AdminCard>
            <h2 className="text-[20px] font-semibold text-adm-text">Current Files</h2>
            <p className="mt-1 text-[14px] text-adm-text-soft">
              Files displayed on the homepage. Drag to reorder (coming soon).
            </p>
            {files.length === 0 ? (
              <p className="mt-4 text-center text-adm-text-soft">No files added yet.</p>
            ) : (
              <div className="mt-4 grid gap-3">
                {files.map((f) => (
                  <FilePreview
                    key={f.id}
                    file={f}
                    onEdit={() => {
                      setEditingId(f.id);
                      setDraft({ name: f.name, type: f.type, size: f.size, icon: f.icon, active: f.active });
                    }}
                    onDelete={() => onDelete(f.id)}
                  />
                ))}
              </div>
            )}
          </AdminCard>

          <AdminCard>
            <h2 className="text-[20px] font-semibold text-adm-text">Preview</h2>
            <p className="mt-1 text-[14px] text-adm-text-soft">How files appear on the homepage.</p>
            <div className="mt-4 grid gap-3">
              {files.filter((f) => f.active).map((f) => (
                <FilePreview key={f.id} file={f} readOnly />
              ))}
            </div>
            {files.filter((f) => f.active).length === 0 && (
              <p className="mt-4 text-center text-adm-text-soft">No active files to preview.</p>
            )}
          </AdminCard>
        </div>
      </div>
    </div>
  );
}
