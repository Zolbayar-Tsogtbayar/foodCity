"use client";

import { useState } from "react";
import { getApiBaseUrl } from "@/lib/api";

export default function OrderPage() {
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "err">("idle");
  const [msg, setMsg] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setMsg(null);
    try {
      const res = await fetch(`${getApiBaseUrl()}/api/v1/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: customerName.trim(),
          phone: phone.trim(),
          email: email.trim() || undefined,
          address: address.trim() || undefined,
          notes: notes.trim() || undefined,
          items: [],
        }),
      });
      if (!res.ok) throw new Error(await res.text());
      setStatus("ok");
      setMsg("Захиалга амжилттай бүртгэгдлээ. Баярлалаа!");
    } catch {
      setStatus("err");
      setMsg("Илгээхэд алдаа гарлаа. Дахин оролдоно уу.");
    }
  }

  return (
    <section className="pt-24 sm:pt-28 pb-16 px-4 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-brand-900 mb-2">Захиалга</h1>
      <p className="text-gray-600 mb-8">
        Мэдээллээ бөглөж илгээнэ үү. Бид тантай удахгүй холбогдоно.
      </p>
      <form onSubmit={submit} className="space-y-6 bg-white rounded-xl shadow-sm border border-gray-100 p-6 sm:p-8">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-brand-900 mb-1">Овог нэр *</label>
            <input
              required
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-brand-900 mb-1">Утас *</label>
            <input
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-brand-900 mb-1">Имэйл</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-brand-900 mb-1">Хаяг</label>
          <input
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-brand-900 mb-1">Нэмэлт тэмдэглэл</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
          />
        </div>

        {msg && (
          <p
            className={`text-sm ${status === "ok" ? "text-green-700" : "text-red-600"}`}
          >
            {msg}
          </p>
        )}

        <button
          type="submit"
          disabled={status === "loading"}
          className="w-full sm:w-auto bg-accent-500 hover:bg-accent-600 disabled:opacity-50 text-white font-medium py-3 px-8 rounded-lg transition-colors"
        >
          {status === "loading" ? "Илгээж байна…" : "Захиалга илгээх"}
        </button>
      </form>
    </section>
  );
}
