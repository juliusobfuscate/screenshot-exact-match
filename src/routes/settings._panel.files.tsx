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
import { adminActions, useAdmin } from "@/lib/admin/store";

export const Route = createFileRoute("/settings/_panel/files")({
  head: () => adminMeta("File Display Settings", "Manage the sample files shown on the demo download page."),
  component: FilesPage,
});

const emptyDraft: FileDraft = { name: "", type: "ZIP", size: "", icon: "archive", active: true };

function FilesPage() {
  const files = useAdmin((s) => s.files);
  const [draft, setDraft] = useState<FileDraft>(emptyDraft);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [result, setResult] = useState<RuleResult | null>(null);

  const patch = (p: Partial<FileDraft>) => {
    setDraft((d) => ({ ...d, ...p }));
    setResult(null);
  };

  const reset = () => {
    setDraft(emptyDraft);
    setEditingId(null);
    setResult(null);
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const r = validateFileDraft(draft);
    if (!r.ok) {
      setResult(r);
      return;
    }
    if (editingId) adminActions.updateFile(editingId, draft);
    else adminActions.addFile(draft);
    toast.success(editingId ? "File updated" : "File added");
    reset();
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
            <div className="grid grid-cols-2 gap-4">
              <Field label="File Type" htmlFor="file-type">
                <AdminSelect
                  id="file-type"
                  value={draft.type}
                  onChange={(e) => patch({ type: e.target.value as FileType })}
                >
                  {FILE_TYPES.map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </AdminSelect>
              </Field>
              <Field label="Icon" htmlFor="file-icon">
                <AdminSelect
                  id="file-icon"
                  value={draft.icon}
                  onChange={(e) => patch({ icon: e.target.value as FileIcon })}
                >
                  {FILE_ICONS.map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </AdminSelect>
              </Field>
            </div>
            <Field label="File Size" htmlFor="file-size">
              <AdminInput
                id="file-size"
                value={draft.size}
                placeholder="167.08MB"
                onChange={(e) => patch({ size: e.target.value })}
              />
            </Field>
            <Field label="Status" htmlFor="file-status">
              <Toggle id="file-status" checked={draft.active} onChange={(v) => patch({ active: v })} />
            </Field>

            <div className="max-w-[420px]">
              <p className="mb-2 text-[12px] text-adm-text-faint">Preview</p>
              <FilePreview name={draft.name} size={draft.size} icon={draft.icon} />
            </div>

            <FormMessage result={result} />

            <div className="flex flex-col gap-3 sm:flex-row">
              <AdminButton type="submit">Save</AdminButton>
              <AdminButton variant="secondary" onClick={reset}>
                Cancel
              </AdminButton>
            </div>
          </form>
        </AdminCard>

        <AdminCard className="min-w-0 p-0 sm:p-0">
          <h2 className="px-6 pt-6 text-[20px] font-semibold text-adm-text">File List</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-[14px]">
              <thead className="border-y border-adm-border bg-adm-bg text-[12px] tracking-wide text-adm-text-soft uppercase">
                <tr>
                  <th className="px-6 py-3 font-medium">Name</th>
                  <th className="px-3 py-3 font-medium">Type</th>
                  <th className="px-3 py-3 font-medium">Size</th>
                  <th className="px-3 py-3 font-medium">Status</th>
                  <th className="px-6 py-3 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-adm-border">
                {files.map((f) => (
                  <tr key={f.id} className={editingId === f.id ? "bg-adm-primary/5" : undefined}>
                    <td className="px-6 py-3">
                      <div className="w-[260px]">
                        <FilePreview name={f.name} size={f.size} icon={f.icon} />
                      </div>
                    </td>
                    <td className="px-3 py-3 text-adm-text">{f.type}</td>
                    <td className="px-3 py-3 text-adm-text-soft">{f.size}</td>
                    <td className="px-3 py-3">
                      <StatusBadge active={f.active} />
                    </td>
                    <td className="px-6 py-3">
                      <div className="flex justify-end gap-1">
                        <button
                          type="button"
                          aria-label={`Edit ${f.name}`}
                          onClick={() => {
                            setEditingId(f.id);
                            setDraft({ name: f.name, type: f.type, size: f.size, icon: f.icon, active: f.active });
                            setResult(null);
                          }}
                          className="flex size-[36px] items-center justify-center rounded-[4px] text-adm-text-soft outline-none hover:bg-adm-primary/10 hover:text-adm-primary focus-visible:shadow-adm-focus"
                        >
                          <Pencil className="size-[16px]" />
                        </button>
                        <button
                          type="button"
                          aria-label={`Delete ${f.name}`}
                          onClick={() => {
                            adminActions.deleteFile(f.id);
                            if (editingId === f.id) reset();
                            toast("File removed");
                          }}
                          className="flex size-[36px] items-center justify-center rounded-[4px] text-adm-text-soft outline-none hover:bg-adm-danger/10 hover:text-adm-danger focus-visible:shadow-adm-focus"
                        >
                          <Trash2 className="size-[16px]" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {files.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-adm-text-faint">
                      No files yet. Add one with the form.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </AdminCard>
      </div>
    </div>
  );
}
