"use client";

import React, { useState, useRef } from "react";
import { X, Upload, Check, Loader2, FileText, Phone, Mail, User, MessageSquare } from "lucide-react";
import { getApiBaseUrl, joinBackendRequestUrl } from "@/lib/api";

type SubmitCVModalProps = {
  jobId: string;
  jobTitle: string;
  lang: string;
  onClose: () => void;
  onSuccess: () => void;
};

export default function SubmitCVModal({ jobId, jobTitle, lang, onClose, onSuccess }: SubmitCVModalProps) {
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [cvUrl, setCvUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const t = {
    mn: {
      title: "Анкет илгээх",
      jobLabel: "Ажлын байр",
      fullName: "Овог нэр",
      phone: "Утасны дугаар",
      email: "Имэйл хаяг (сонголттой)",
      message: "Нэмэлт зурвас",
      cv: "CV / Анкет (PDF, Word)",
      upload: "Файл сонгох",
      uploading: "Уншиж байна...",
      submit: "Илгээх",
      success: "Амжилттай илгээлээ!",
      error: "Алдаа гарлаа, дахин оролдоно уу.",
      required: "Заавал бөглөх",
    },
    en: {
      title: "Submit CV",
      jobLabel: "Position",
      fullName: "Full Name",
      phone: "Phone Number",
      email: "Email Address (optional)",
      message: "Additional Message",
      cv: "CV / Resume (PDF, Word)",
      upload: "Choose File",
      uploading: "Uploading...",
      submit: "Submit",
      success: "Successfully submitted!",
      error: "An error occurred, please try again.",
      required: "Required",
    }
  }[lang as "mn" | "en"] || {
    title: "Submit CV",
    jobLabel: "Position",
    fullName: "Full Name",
    phone: "Phone Number",
    email: "Email Address (optional)",
    message: "Additional Message",
    cv: "CV / Resume (PDF, Word)",
    upload: "Choose File",
    uploading: "Uploading...",
    submit: "Submit",
    success: "Successfully submitted!",
    error: "An error occurred, please try again.",
    required: "Required",
  };

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch(joinBackendRequestUrl(getApiBaseUrl(), "/api/v1/jobs/upload-cv"), {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error("Upload failed");
      const json = await res.json();
      setCvUrl(json.data.path);
    } catch (err) {
      setError(t.error);
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!cvUrl) return;

    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch(joinBackendRequestUrl(getApiBaseUrl(), "/api/v1/jobs/apply"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobId,
          jobTitle,
          fullName,
          phone,
          email,
          cvUrl,
          message,
        }),
      });

      if (!res.ok) throw new Error("Submission failed");
      onSuccess();
    } catch (err) {
      setError(t.error);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[1200] flex items-center justify-center p-4 bg-brand-950/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl animate-in zoom-in-95 duration-200">
        <header className="flex items-center justify-between border-b border-slate-100 bg-slate-50/50 px-6 py-4">
          <h2 className="text-lg font-bold text-brand-900">{t.title}</h2>
          <button onClick={onClose} className="rounded-full p-2 text-slate-400 transition hover:bg-white hover:text-brand-600">
            <X className="h-5 w-5" />
          </button>
        </header>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="rounded-xl bg-accent-50/50 p-3 border border-accent-100">
            <p className="text-[10px] font-bold uppercase tracking-wider text-accent-600">{t.jobLabel}</p>
            <p className="text-sm font-bold text-brand-900">{jobTitle}</p>
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
                <User className="h-3.5 w-3.5" />
                {t.fullName} <span className="text-rose-500">*</span>
              </label>
              <input
                required
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-hidden transition focus:border-accent-500 focus:ring-4 focus:ring-accent-500/10"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
                  <Phone className="h-3.5 w-3.5" />
                  {t.phone} <span className="text-rose-500">*</span>
                </label>
                <input
                  required
                  type="tel"
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-hidden transition focus:border-accent-500 focus:ring-4 focus:ring-accent-500/10"
                  value={phone}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, "").slice(0, 8);
                    setPhone(val);
                  }}
                  placeholder="88888888"
                />
              </div>
              <div className="space-y-1.5">
                <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
                  <Mail className="h-3.5 w-3.5" />
                  {t.email}
                </label>
                <input
                  type="email"
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-hidden transition focus:border-accent-500 focus:ring-4 focus:ring-accent-500/10"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
                <MessageSquare className="h-3.5 w-3.5" />
                {t.message}
              </label>
              <textarea
                rows={3}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-hidden transition focus:border-accent-500 focus:ring-4 focus:ring-accent-500/10"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
                <FileText className="h-3.5 w-3.5" />
                {t.cv} <span className="text-rose-500">*</span>
              </label>
              <div 
                onClick={() => !uploading && fileInputRef.current?.click()}
                className={`relative flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-4 py-6 transition-all ${cvUrl ? "border-emerald-500 bg-emerald-50/30" : "border-slate-200 bg-slate-50/50 hover:border-accent-300 hover:bg-accent-50/30"}`}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileUpload}
                />
                
                {uploading ? (
                  <div className="flex flex-col items-center gap-2">
                    <Loader2 className="h-6 w-6 animate-spin text-accent-500" />
                    <span className="text-xs font-medium text-slate-500">{t.uploading}</span>
                  </div>
                ) : cvUrl ? (
                  <div className="flex flex-col items-center gap-1">
                    <div className="rounded-full bg-emerald-500 p-1 text-white">
                      <Check className="h-4 w-4" />
                    </div>
                    <span className="text-xs font-bold text-emerald-600">File Selected</span>
                    <span className="text-[10px] text-slate-400">Click to change</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <Upload className="h-6 w-6 text-slate-400" />
                    <span className="text-xs font-medium text-slate-500">{t.upload}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {error && (
            <p className="text-center text-xs font-medium text-rose-500">{error}</p>
          )}

          <button
            type="submit"
            disabled={submitting || uploading || !cvUrl}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3.5 text-sm font-bold text-white shadow-xl shadow-emerald-600/20 transition hover:bg-emerald-700 disabled:opacity-50 disabled:shadow-none"
          >
            {submitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              t.submit
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
