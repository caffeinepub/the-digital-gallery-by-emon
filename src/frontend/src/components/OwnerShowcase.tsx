import { motion } from "motion/react";
import { SiFacebook, SiInstagram, SiWhatsapp } from "react-icons/si";
import { useData } from "../lib/DataContext";

export default function OwnerShowcase() {
  const { settings } = useData();
  const me = settings.aboutMe;

  // Don't render if no owner info is set at all
  const hasAnyInfo =
    me && (me.bio || me.tagline || me.profilePhoto || me.experience);
  if (!hasAnyInfo) return null;

  const profileSrc = me?.profilePhoto || settings.logoImage || "";
  const name = "Emon";
  const title = me?.tagline || "Founder & Artist";

  const socialLinks = [
    {
      icon: SiInstagram,
      href: me?.personalInstagram
        ? `https://instagram.com/${me.personalInstagram.replace("@", "")}`
        : "",
      label: "Instagram",
      color: "#E1306C",
      show: !!me?.personalInstagram,
    },
    {
      icon: SiFacebook,
      href: me?.personalFacebook || "",
      label: "Facebook",
      color: "#1877F2",
      show: !!me?.personalFacebook,
    },
    {
      icon: SiWhatsapp,
      href: me?.personalWhatsapp
        ? `https://wa.me/91${me.personalWhatsapp.replace(/\D/g, "")}`
        : "",
      label: "WhatsApp",
      color: "#25D366",
      show: !!me?.personalWhatsapp,
    },
  ].filter((l) => l.show);

  return (
    <section
      className="py-14 px-4 max-w-7xl mx-auto"
      data-ocid="home.owner.section"
    >
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-3xl border border-[var(--tdg-light)] shadow-lg overflow-hidden"
      >
        <div className="grid md:grid-cols-[280px_1fr] gap-0">
          {/* Left — photo panel */}
          <div className="bg-[var(--tdg-dark)] flex flex-col items-center justify-center p-10 gap-4">
            {profileSrc ? (
              <img
                src={profileSrc}
                alt={name}
                className="w-36 h-36 rounded-full object-cover border-4 border-[var(--tdg-amber)] shadow-xl"
              />
            ) : (
              <div className="w-36 h-36 rounded-full bg-[#333533] border-4 border-[var(--tdg-amber)] flex items-center justify-center text-[var(--tdg-amber)] font-bold text-4xl font-playfair shadow-xl">
                E
              </div>
            )}
            <div className="text-center">
              <p className="font-playfair text-xl font-bold text-white">
                {name}
              </p>
              <p className="text-[var(--tdg-amber)] text-sm font-medium mt-0.5">
                {title}
              </p>
            </div>
            {socialLinks.length > 0 && (
              <div className="flex gap-3 mt-2">
                {socialLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all"
                    aria-label={link.label}
                    data-ocid={`home.owner.${link.label.toLowerCase()}.link`}
                  >
                    <link.icon size={18} style={{ color: link.color }} />
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Right — bio */}
          <div className="p-8 md:p-10 flex flex-col justify-center">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-1 bg-[var(--tdg-amber)] rounded-full" />
              <span className="text-xs font-bold uppercase tracking-widest text-[#b38b00]">
                Meet the Artist
              </span>
            </div>
            <h2 className="font-playfair text-2xl md:text-3xl font-bold text-[var(--tdg-dark)] mb-3">
              The Craft Behind Every Frame
            </h2>
            {me?.bio && (
              <p className="text-gray-600 leading-relaxed text-base mb-4 whitespace-pre-wrap">
                {me.bio}
              </p>
            )}
            {me?.experience && (
              <p className="text-gray-500 text-sm leading-relaxed">
                {me.experience}
              </p>
            )}
            {!me?.bio && !me?.experience && (
              <p className="text-gray-500 text-base leading-relaxed">
                Passionate artist from Assam, creating beautiful custom photo
                frames that preserve your most precious memories. Every frame is
                crafted with love and attention to detail.
              </p>
            )}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
