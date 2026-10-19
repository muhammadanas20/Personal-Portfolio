import { useState } from "react";
import { Mail, Phone, MapPin, Send, CheckCircle, AlertCircle } from "lucide-react";
import emailjs from "@emailjs/browser";
import { SectionHeading } from "@/components/section-heading";
import { Reveal, MaskLines } from "@/components/reveal";
import { Seal } from "@/components/seal";
import { Magnetic } from "@/components/magnetic";

const contactInfo = [
  {
    icon: Mail,
    label: "Email",
    value: "muhammadanasashfaq2006@gmail.com",
    href: "mailto:muhammadanasashfaq2006@gmail.com",
  },
  {
    icon: Phone,
    label: "Phone",
    value: "+92 319 2658206",
    href: "tel:+923192658206",
  },
  {
    icon: MapPin,
    label: "Studio",
    value: "Karachi, Pakistan",
    href: "https://www.google.com/maps/place/Karachi",
  },
];

const socials = [
  ["GitHub", "https://github.com/muhammadanas20"],
  ["LinkedIn", "https://www.linkedin.com/in/muhammadanas20/"],
  ["Instagram", "https://www.instagram.com/_m._.anas_/"],
];

export const Contact = () => {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({ type: null, message: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setSubmitStatus({ type: null, message: "" });
    try {
      const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
      const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
      const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

      if (!serviceId || !templateId || !publicKey) {
        throw new Error("EmailJS configuration is missing. Please check your environment variables.");
      }

      await emailjs.send(
        serviceId,
        templateId,
        { name: formData.name, email: formData.email, message: formData.message },
        publicKey
      );

      setSubmitStatus({
        type: "success",
        message: "Message sent — I'll write back within a day.",
      });
      setFormData({ name: "", email: "", message: "" });
    } catch (err) {
      console.error("EmailJS error:", err);
      setSubmitStatus({
        type: "error",
        message:
          (err && (err.text || err.message)) ||
          "Something misfired. Please try again, or mail me directly.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const set = (key) => (e) => setFormData({ ...formData, [key]: e.target.value });

  return (
    <section
      id="contact"
      data-cursor-light
      className="relative bg-ink-surface text-cream py-24 sm:py-36 overflow-hidden"
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-8 left-2 font-display display-wonk text-[clamp(6rem,16vw,14rem)] leading-none text-cream/[0.05]"
      >
        hello
      </span>

      <div className="mx-auto max-w-[1200px] px-5 sm:px-8 relative">
        <SectionHeading
          dark
          index="06"
          kicker="Contact"
          className="mb-16 sm:mb-24"
          lines={
            <MaskLines
              lines={[
                "Let's make something",
                <span key="2">
                  worth <span className="display-wonk text-vermilion">reading.</span>
                </span>,
              ]}
            />
          }
          lead="Internships, collaborations, impossible side-quests — my inbox is an open door. One paragraph is enough to start."
        />

        <div className="grid lg:grid-cols-12 gap-14 lg:gap-16">
          {/* Form */}
          <Reveal className="lg:col-span-7">
            <form onSubmit={handleSubmit} className="space-y-8" noValidate={false}>
              <div className="grid sm:grid-cols-2 gap-8">
                <div>
                  <label htmlFor="name" className="meta-label text-cream-soft block mb-1">
                    Your name
                  </label>
                  <input
                    id="name"
                    type="text"
                    required
                    placeholder="Ada Lovelace"
                    value={formData.name}
                    onChange={set("name")}
                    className="field-ink"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="meta-label text-cream-soft block mb-1">
                    Your email
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    placeholder="ada@analytical.engine"
                    value={formData.email}
                    onChange={set("email")}
                    className="field-ink"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="message" className="meta-label text-cream-soft block mb-1">
                  The idea
                </label>
                <textarea
                  id="message"
                  required
                  rows={5}
                  placeholder="Tell me what we're building…"
                  value={formData.message}
                  onChange={set("message")}
                  className="field-ink resize-none"
                />
              </div>

              <div className="flex flex-wrap items-center gap-6">
                <Magnetic>
                  <button type="submit" disabled={isLoading} className="btn-ink btn-on-ink disabled:opacity-60">
                    {isLoading ? "Sending…" : "Send the letter"}
                    <Send className="w-3.5 h-3.5" aria-hidden="true" />
                  </button>
                </Magnetic>

                {submitStatus.type && (
                  <p
                    role="status"
                    className={`flex items-center gap-2 text-sm ${
                      submitStatus.type === "success" ? "text-highlight" : "text-vermilion"
                    }`}
                  >
                    {submitStatus.type === "success" ? (
                      <CheckCircle className="w-4 h-4" aria-hidden="true" />
                    ) : (
                      <AlertCircle className="w-4 h-4" aria-hidden="true" />
                    )}
                    {submitStatus.message}
                  </p>
                )}
              </div>
            </form>
          </Reveal>

          {/* Ledger */}
          <Reveal delay={0.12} className="lg:col-span-5">
            <div className="border-t border-line-dark">
              {contactInfo.map((c) => (
                <a
                  key={c.label}
                  href={c.href}
                  target={c.href.startsWith("http") ? "_blank" : undefined}
                  rel={c.href.startsWith("http") ? "noreferrer" : undefined}
                  className="group flex items-center justify-between gap-4 py-5 border-b border-line-dark"
                >
                  <span className="flex items-center gap-4">
                    <c.icon className="w-4 h-4 text-vermilion" aria-hidden="true" />
                    <span className="meta-label text-cream-soft">{c.label}</span>
                  </span>
                  <span className="text-sm sm:text-base text-cream link-draw break-all text-right">
                    {c.value}
                  </span>
                </a>
              ))}
            </div>

            <div className="mt-8 flex items-center gap-6">
              {socials.map(([label, href]) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  className="meta-label text-cream-soft hover:text-cream link-draw transition-colors"
                >
                  {label}
                </a>
              ))}
            </div>

            <div className="mt-12 flex items-end justify-between gap-6">
              <p className="text-sm text-cream-soft max-w-[220px] leading-relaxed">
                Usually replies between lectures — Karachi time, GMT+5.
              </p>
              <Seal dark size={104} className="shrink-0" />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
};
