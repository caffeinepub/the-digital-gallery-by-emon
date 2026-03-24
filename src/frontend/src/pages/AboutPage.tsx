import { useNavigate } from "@tanstack/react-router";
import { motion } from "motion/react";
import { SiFacebook, SiInstagram, SiWhatsapp, SiYoutube } from "react-icons/si";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { useData } from "../lib/DataContext";

export default function AboutPage() {
  const { settings } = useData();
  const navigate = useNavigate();
  const me = settings.aboutMe || {
    bio: "",
    tagline: "",
    experience: "",
    profilePhoto: "",
    personalInstagram: "",
    personalFacebook: "",
    personalYoutube: "",
    personalWhatsapp: "",
    businessInstagram: "",
    businessFacebook: "",
    businessYoutube: "",
    businessWhatsapp: "",
  };

  const profileSrc = me.profilePhoto || settings.logoImage || "";
  const hasContent = me.bio || me.tagline || me.experience;

  const personalLinks = [
    {
      icon: SiInstagram,
      label: "Instagram",
      value: me.personalInstagram,
      href: me.personalInstagram
        ? `https://instagram.com/${me.personalInstagram.replace("@", "")}`
        : "",
      color: "text-pink-500",
    },
    {
      icon: SiFacebook,
      label: "Facebook",
      value: me.personalFacebook,
      href: me.personalFacebook || "",
      color: "text-blue-600",
    },
    {
      icon: SiYoutube,
      label: "YouTube",
      value: me.personalYoutube,
      href: me.personalYoutube || "",
      color: "text-red-600",
    },
    {
      icon: SiWhatsapp,
      label: "WhatsApp",
      value: me.personalWhatsapp,
      href: me.personalWhatsapp
        ? `https://wa.me/91${me.personalWhatsapp.replace(/\D/g, "")}`
        : "",
      color: "text-green-500",
    },
  ].filter((l) => l.value);

  const businessLinks = [
    {
      icon: SiInstagram,
      label: "Instagram",
      value: me.businessInstagram,
      href: me.businessInstagram
        ? `https://instagram.com/${me.businessInstagram.replace("@", "")}`
        : "",
      color: "text-pink-500",
    },
    {
      icon: SiFacebook,
      label: "Facebook",
      value: me.businessFacebook,
      href: me.businessFacebook || "",
      color: "text-blue-600",
    },
    {
      icon: SiYoutube,
      label: "YouTube",
      value: me.businessYoutube,
      href: me.businessYoutube || "",
      color: "text-red-600",
    },
    {
      icon: SiWhatsapp,
      label: "WhatsApp",
      value: me.businessWhatsapp,
      href: me.businessWhatsapp
        ? `https://wa.me/91${me.businessWhatsapp.replace(/\D/g, "")}`
        : "",
      color: "text-green-500",
    },
  ].filter((l) => l.value);

  return (
    <div className="min-h-screen bg-[#f5f5f5] font-inter">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 py-12">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          {profileSrc ? (
            <img
              src={profileSrc}
              alt="Profile"
              className="w-32 h-32 rounded-full object-cover border-4 border-[#FED100] shadow-xl mx-auto mb-5"
            />
          ) : (
            <div className="w-32 h-32 rounded-full bg-[#212121] border-4 border-[#FED100] flex items-center justify-center text-[#FED100] font-bold text-3xl font-playfair mx-auto mb-5 shadow-xl">
              {settings.logoText || "TDG"}
            </div>
          )}
          <h1 className="font-playfair text-3xl md:text-4xl font-bold text-[#212121] mb-2">
            The Digital Gallery by Emon
          </h1>
          {me.tagline && (
            <p className="text-[#b38b00] font-semibold text-lg">{me.tagline}</p>
          )}
          {!me.tagline && (
            <p className="text-gray-500 text-base">
              Artist &amp; Photo Frame Creator based in Assam
            </p>
          )}
          <div className="w-16 h-1 bg-[#FED100] rounded-full mx-auto mt-4" />
        </motion.div>

        {!hasContent ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl border border-[#D6D6D6] p-16 text-center"
            data-ocid="about.empty_state"
          >
            <div className="text-5xl mb-4">🌟</div>
            <h2 className="font-playfair text-2xl font-bold text-[#212121] mb-2">
              More About Me — Coming Soon
            </h2>
            <p className="text-gray-500 max-w-sm mx-auto mb-6">
              I'm currently setting up my personal story here. Check back soon
              to know more about the artist behind The Digital Gallery.
            </p>
            <button
              type="button"
              onClick={() => navigate({ to: "/" })}
              className="bg-[#FED100] text-[#212121] font-bold px-8 py-3 rounded-xl hover:bg-[#e6bc00] transition-colors"
              data-ocid="about.shop.button"
            >
              Shop Photo Frames
            </button>
          </motion.div>
        ) : (
          <div className="space-y-8">
            {/* Bio */}
            {me.bio && (
              <motion.section
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-2xl border border-[#D6D6D6] p-6 md:p-8"
                data-ocid="about.bio.section"
              >
                <h2 className="font-playfair text-2xl font-bold text-[#212121] mb-4">
                  About Me
                </h2>
                <p className="text-gray-600 leading-relaxed whitespace-pre-wrap text-base">
                  {me.bio}
                </p>
              </motion.section>
            )}

            {/* Experience */}
            {me.experience && (
              <motion.section
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-[#212121] text-white rounded-2xl p-6 md:p-8"
                data-ocid="about.experience.section"
              >
                <h2 className="font-playfair text-2xl font-bold mb-4">
                  My Journey
                </h2>
                <p className="text-gray-300 leading-relaxed whitespace-pre-wrap text-base">
                  {me.experience}
                </p>
              </motion.section>
            )}

            {/* Social Media */}
            {(personalLinks.length > 0 || businessLinks.length > 0) && (
              <motion.section
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-2xl border border-[#D6D6D6] p-6 md:p-8"
                data-ocid="about.social.section"
              >
                <h2 className="font-playfair text-2xl font-bold text-[#212121] mb-6">
                  Connect With Me
                </h2>
                <div className="grid md:grid-cols-2 gap-8">
                  {personalLinks.length > 0 && (
                    <div>
                      <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">
                        Personal
                      </h3>
                      <div className="space-y-3">
                        {personalLinks.map((link) => (
                          <a
                            key={link.label}
                            href={link.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 p-3 rounded-xl border border-[#D6D6D6] hover:border-[#FED100] hover:bg-[#FED100]/5 transition-all group"
                            data-ocid={`about.personal_${link.label.toLowerCase()}.link`}
                          >
                            <link.icon
                              size={20}
                              className={`${link.color} flex-shrink-0`}
                            />
                            <div>
                              <div className="text-xs text-gray-400">
                                {link.label}
                              </div>
                              <div className="text-sm font-medium text-[#212121] group-hover:text-[#b38b00]">
                                {link.value}
                              </div>
                            </div>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                  {businessLinks.length > 0 && (
                    <div>
                      <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">
                        Business
                      </h3>
                      <div className="space-y-3">
                        {businessLinks.map((link) => (
                          <a
                            key={link.label}
                            href={link.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 p-3 rounded-xl border border-[#D6D6D6] hover:border-[#FED100] hover:bg-[#FED100]/5 transition-all group"
                            data-ocid={`about.business_${link.label.toLowerCase()}.link`}
                          >
                            <link.icon
                              size={20}
                              className={`${link.color} flex-shrink-0`}
                            />
                            <div>
                              <div className="text-xs text-gray-400">
                                {link.label}
                              </div>
                              <div className="text-sm font-medium text-[#212121] group-hover:text-[#b38b00]">
                                {link.value}
                              </div>
                            </div>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </motion.section>
            )}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
