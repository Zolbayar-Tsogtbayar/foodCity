"use client";

import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

interface FormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

interface FormState {
  isSubmitting: boolean;
  isSuccess: boolean;
  error: string | null;
}

export default function ContactForm() {
  const { lang } = useLanguage();
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [state, setState] = useState<FormState>({
    isSubmitting: false,
    isSuccess: false,
    error: null,
  });

  const labels = {
    mn: {
      name: "Таны нэр",
      email: "Имэйл хаяг",
      phone: "Утасны дугаар",
      subject: "Сэдэв",
      message: "Мессеж",
      submit: "Илгээх",
      submitting: "Илгээж байна...",
      successMessage: "Таны мессеж амжилттай илгээгдлээ. Удахгүй холбоо барих болно.",
      errorMessage: "Мессеж илгээхэд алдаа гарлаа. Дахин оролдоно уу.",
      required: "Заавал бөлөглөх ёстой",
    },
    en: {
      name: "Your Name",
      email: "Email Address",
      phone: "Phone Number",
      subject: "Subject",
      message: "Message",
      submit: "Send",
      submitting: "Sending...",
      successMessage: "Your message has been sent successfully. We will contact you soon.",
      errorMessage: "Failed to send message. Please try again.",
      required: "This field is required",
    },
  };

  const t = labels[lang as keyof typeof labels] || labels.en;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setState({ isSubmitting: true, isSuccess: false, error: null });

    try {
      const response = await fetch("/api/v1/contact/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = (await response.json()) as { error?: string };
        throw new Error(errorData.error || t.errorMessage);
      }

      setState({ isSubmitting: false, isSuccess: true, error: null });
      setFormData({ name: "", email: "", phone: "", subject: "", message: "" });

      // Reset success message after 5 seconds
      setTimeout(() => {
        setState({ isSubmitting: false, isSuccess: false, error: null });
      }, 5000);
    } catch (error) {
      setState({
        isSubmitting: false,
        isSuccess: false,
        error: error instanceof Error ? error.message : t.errorMessage,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Name */}
      <div>
        <label htmlFor="name" className="block text-sm font-semibold text-brand-900 mb-2">
          {t.name}
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          placeholder={t.name}
          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-all"
        />
      </div>

      {/* Email */}
      <div>
        <label htmlFor="email" className="block text-sm font-semibold text-brand-900 mb-2">
          {t.email}
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          placeholder={t.email}
          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-all"
        />
      </div>

      {/* Phone */}
      <div>
        <label htmlFor="phone" className="block text-sm font-semibold text-brand-900 mb-2">
          {t.phone}
        </label>
        <input
          type="tel"
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          required
          placeholder={t.phone}
          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-all"
        />
      </div>

      {/* Subject */}
      <div>
        <label htmlFor="subject" className="block text-sm font-semibold text-brand-900 mb-2">
          {t.subject}
        </label>
        <input
          type="text"
          id="subject"
          name="subject"
          value={formData.subject}
          onChange={handleChange}
          required
          placeholder={t.subject}
          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-all"
        />
      </div>

      {/* Message */}
      <div>
        <label htmlFor="message" className="block text-sm font-semibold text-brand-900 mb-2">
          {t.message}
        </label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          required
          placeholder={t.message}
          rows={5}
          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-all resize-none"
        />
      </div>

      {/* Success Message */}
      {state.isSuccess && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-800 text-sm font-medium">{t.successMessage}</p>
        </div>
      )}

      {/* Error Message */}
      {state.error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800 text-sm font-medium">{state.error}</p>
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={state.isSubmitting}
        className="w-full bg-accent-500 hover:bg-accent-600 disabled:bg-gray-400 text-white font-bold py-3.5 rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
      >
        {state.isSubmitting ? (
          <>
            <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            {t.submitting}
          </>
        ) : (
          t.submit
        )}
      </button>
    </form>
  );
}
