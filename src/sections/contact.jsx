import React, { useState, useEffect } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/button";
import emailjs from "@emailjs/browser";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

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
    label: "Location",
    value: "Karachi, Pakistan",
    href: "https://www.google.com/maps/place/Karachi",
  },
];

export const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({
    type: null, // 'success' or 'error'
    message: "",
  });

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    
    const ctx = gsap.context(() => {
      gsap.from(".contact-header", {
        scrollTrigger: {
          trigger: ".contact-section",
          start: "top 85%",
        },
        y: 40,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
      });

      gsap.from(".contact-form-panel", {
        scrollTrigger: {
          trigger: ".contact-grid",
          start: "top 80%",
        },
        x: -40,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
      });

      gsap.from(".contact-info-panel", {
        scrollTrigger: {
          trigger: ".contact-grid",
          start: "top 80%",
        },
        x: 40,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
      });
    });

    return () => ctx.revert();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsLoading(true);
    setSubmitStatus({ type: null, message: "" });
    try {
      const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
      const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
      const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

      if (!serviceId || !templateId || !publicKey) {
        throw new Error(
          "EmailJS configuration is missing. Please check your environment variables."
        );
      }

      await emailjs.send(
        serviceId,
        templateId,
        {
          name: formData.name,
          email: formData.email,
          message: formData.message,
        },
        publicKey
      );

      setSubmitStatus({
        type: "success",
        message: "Message sent successfully! I'll get back to you soon.",
      });
      setFormData({ name: "", email: "", message: "" });
    } catch (err) {
      console.error("EmailJS error:", err);
      setSubmitStatus({
        type: "error",
        message:
          (err && (err.text || err.message)) ||
          "Failed to send message. Please try again later.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section id="contact" className="contact-section py-20 md:py-24 relative overflow-hidden bg-[#0a0c16]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_40%,#0a0c16_100%)] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#9d4edd]/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        
        {/* Section Header */}
        <div className="contact-header text-center max-w-3xl mx-auto mb-20">
          <span className="text-[#00d9ff] text-xs font-mono tracking-widest uppercase bg-[#00d9ff]/10 border border-[#00d9ff]/30 px-3 py-1 rounded-md">
            COMMUNICATION //
          </span>
          <h2 className="text-3xl md:text-5xl font-extrabold mt-4 mb-5 text-white">
            Let's build <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#9d4edd] to-[#00d9ff]">
              something great.
            </span>
          </h2>
          <p className="text-sm sm:text-base text-[#8f9bb3] leading-relaxed">
            Have a project in mind? Send me a packet from the interface below, and let's configure something together.
          </p>
        </div>

        <div className="contact-grid grid grid-cols-1 lg:grid-cols-2 gap-10 max-w-5xl mx-auto items-start">
          
          {/* Contact Form Panel */}
          <div className="contact-form-panel skeuo-panel p-6 sm:p-8 border border-[#2e344e] relative">
            <div className="absolute top-3 left-3"><div className="screw-head" /></div>
            <div className="absolute top-3 right-3"><div className="screw-head" /></div>
            
            <div className="mb-6 pb-4 border-b border-[#23273e] flex items-center justify-between">
              <span className="text-[10px] font-mono tracking-wider text-[#7b68be]">MESSAGE_TRANSMITTER [TX_NODE]</span>
              <div className="flex items-center gap-1.5">
                <span className="led-indicator active led-cyan" />
                <span className="text-[9px] font-mono text-white">TX_READY</span>
              </div>
            </div>

            <form className="space-y-5 sm:space-y-6" onSubmit={handleSubmit}>
              <div>
                <label
                  htmlFor="name"
                  className="block text-xs font-mono text-[#7b68be] tracking-wider mb-2 uppercase"
                >
                  // Sender name
                </label>
                <input
                  id="name"
                  type="text"
                  required
                  placeholder="e.g. John Doe"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-4 py-3 text-white skeuo-inset border border-[#1c2035] focus:border-[#9d4edd] outline-none text-sm sm:text-base transition-colors"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-xs font-mono text-[#7b68be] tracking-wider mb-2 uppercase"
                >
                  // Sender address
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  placeholder="e.g. john@example.com"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full px-4 py-3 text-white skeuo-inset border border-[#1c2035] focus:border-[#9d4edd] outline-none text-sm sm:text-base transition-colors"
                />
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-xs font-mono text-[#7b68be] tracking-wider mb-2 uppercase"
                >
                  // Message payload
                </label>
                <textarea
                  id="message"
                  rows={4}
                  required
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  placeholder="Write your transmission here..."
                  className="w-full px-4 py-3 text-white skeuo-inset border border-[#1c2035] focus:border-[#9d4edd] outline-none resize-none text-sm sm:text-base transition-colors"
                />
              </div>

              <Button
                className="w-full flex items-center justify-center gap-2 py-3"
                type="submit"
                size="lg"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>Transmitting...</>
                ) : (
                  <>
                    <span>Transmit Message</span>
                    <Send className="w-4 h-4" />
                  </>
                )}
              </Button>

              {submitStatus.type && (
                <div
                  className={`flex items-center gap-3 p-4 rounded-xl border ${
                    submitStatus.type === "success"
                      ? "bg-green-500/10 border-green-500/20 text-green-400"
                      : "bg-red-500/10 border-red-500/20 text-red-400"
                  }`}
                >
                  {submitStatus.type === "success" ? (
                    <CheckCircle className="w-5 h-5 flex-shrink-0" />
                  ) : (
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  )}
                  <p className="text-xs sm:text-sm font-mono">{submitStatus.message}</p>
                </div>
              )}
            </form>
            
            <div className="absolute bottom-2 left-3"><div className="screw-head" /></div>
            <div className="absolute bottom-2 right-3"><div className="screw-head" /></div>
          </div>

          {/* Contact Info Panel */}
          <div className="contact-info-panel space-y-6">
            
            {/* Info Cards Panel */}
            <div className="skeuo-panel p-6 sm:p-8 border border-[#2e344e] relative">
              <div className="absolute top-3 left-3"><div className="screw-head" /></div>
              <div className="absolute top-3 right-3"><div className="screw-head" /></div>
              
              <h3 className="text-lg font-bold text-white mb-6 pt-2">
                System Terminals [NODE_ADDR]
              </h3>
              
              <div className="space-y-4">
                {contactInfo.map((item, i) => (
                  <a
                    key={i}
                    href={item.href}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-4 p-3 bg-[#0d0f1a] border border-[#1b1f32] hover:border-[#9d4edd] rounded-xl shadow-inner group transition-all duration-200 active:translate-y-[1px]"
                  >
                    {/* Beveled Icon socket */}
                    <div className="w-12 h-12 rounded-xl bg-[#060810] border border-[#1c2035] flex items-center justify-center text-[#7b68be] group-hover:text-white transition-colors flex-shrink-0 shadow-[inset_0_2px_4px_rgba(0,0,0,0.8)]">
                      <item.icon className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-[10px] font-mono text-[#5e6988] tracking-widest uppercase">
                        {item.label}
                      </div>
                      <div className="text-sm sm:text-base font-bold text-white group-hover:text-[#00d9ff] transition-colors truncate">
                        {item.value}
                      </div>
                    </div>
                  </a>
                ))}
              </div>

              <div className="absolute bottom-2 left-3"><div className="screw-head" /></div>
              <div className="absolute bottom-2 right-3"><div className="screw-head" /></div>
            </div>

            {/* Availability Indicator Panel */}
            <div className="skeuo-panel p-6 sm:p-8 border border-[#2e344e] relative">
              <div className="absolute top-3 left-3"><div className="screw-head" /></div>
              <div className="absolute top-3 right-3"><div className="screw-head" /></div>
              
              <div className="flex items-center gap-3 mb-4 pt-2">
                <span className="w-2.5 h-2.5 bg-green-500 rounded-full led-indicator active" />
                <span className="font-bold text-sm tracking-wider font-mono text-white">SYS_AVAILABILITY: OPEN</span>
              </div>
              <p className="text-xs sm:text-sm text-[#8f9bb3] leading-relaxed font-sans">
                I'm currently seeking internships and junior roles where I can deploy my React, JavaScript, and programming logic skills. If you need a thorough and driven developer to optimize your system, initiate a transmission!
              </p>

              <div className="absolute bottom-2 left-3"><div className="screw-head" /></div>
              <div className="absolute bottom-2 right-3"><div className="screw-head" /></div>
            </div>

          </div>
          
        </div>
      </div>
    </section>
  );
};