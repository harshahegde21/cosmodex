"use client";

import Link from "next/link";
import Image from "next/image";
import { ChevronRight, Clock } from "lucide-react";

const tutorials = [
  {
    id: "tut-1",
    title: "Create a Scrollable Text Wrap Effect with...",
    tag: "TUTORIAL",
    lang: "JAVASCRIPT",
    langColor: "text-xp-gold",
    image: "/images/tutorial_text_wrap.png",
    time: "INTERMEDIATE",
    href: "#",
  },
  {
    id: "tut-2",
    title: "Create a Doodle Gallery with Supabase",
    tag: "TUTORIAL",
    lang: "JAVASCRIPT",
    langColor: "text-text-secondary",
    image: "/images/tutorial_doodle_gallery.png",
    time: "INTERMEDIATE",
    href: "#",
  },
  {
    id: "tut-3",
    title: "Build a Pixel Art Maker with HTML, CSS and...",
    tag: "TUTORIAL",
    lang: "JAVASCRIPT",
    langColor: "text-text-secondary",
    image: "/images/tutorial_pixel_art.png",
    time: "INTERMEDIATE",
    href: "#",
  },
];

export default function TutorialCards() {
  return (
    <section className="h-full flex flex-col">
      {/* Heading */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-black text-text-primary tracking-tight flex items-center gap-2">
          New Project Tutorials
        </h2>
        <Link
          href="#"
          id="tutorials-see-all"
          className="text-xs font-bold text-text-secondary hover:text-text-primary transition-colors duration-300 flex items-center gap-0.5 group/link"
        >
          See all <ChevronRight size={14} className="group-hover/link:translate-x-1 transition-transform" />
        </Link>
      </div>

      {/* Cards row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 flex-1">
        {tutorials.map((t) => (
          <Link
            key={t.id}
            id={t.id}
            href={t.href}
            className="group/card relative flex flex-col overflow-hidden h-full min-h-[340px] rounded-2xl border border-white/10 hover:border-white/20 transition-all duration-500 shadow-xl"
          >
            {/* Background Image */}
            <Image 
              src={t.image} 
              alt={t.title} 
              fill 
              className="object-cover absolute inset-0 z-0 group-hover/card:scale-110 transition-transform duration-700 ease-in-out" 
            />
            
            {/* Smooth Gradient Overlay (darkens the bottom for text readability) */}
            <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#0f1015] via-[#0f1015]/95 via-50% to-transparent opacity-100" />
            
            {/* Top Tag */}
            <div className="absolute top-4 left-4 z-20">
              <span className="bg-black/40 backdrop-blur-md border border-white/10 text-white font-bold tracking-wider text-[10px] px-3 py-1 rounded-full shadow-sm">
                {t.tag}
              </span>
            </div>
            
            {/* Content Area (anchored to bottom) */}
            <div className="relative z-20 flex flex-col gap-3 mt-auto p-5 pb-5 pt-10">
              <h3 className="font-bold text-white text-[15px] leading-snug drop-shadow-md">
                {t.title}
              </h3>
              
              {/* Badges/Tags */}
              <div className="flex flex-wrap items-center gap-2 mt-1">
                <span className="text-[10px] font-bold bg-white/10 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-full text-white/90 tracking-wide">
                  {t.lang}
                </span>
                <span className="flex items-center gap-1.5 text-[10px] font-bold bg-white/10 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-full text-white/90 tracking-wide">
                  <Clock size={12} />
                  {t.time}
                </span>
              </div>
              
              {/* Action Button */}
              <div className="mt-2 w-full bg-white text-black font-bold text-[13px] py-2.5 rounded-xl text-center group-hover/card:bg-gray-200 transition-colors shadow-lg active:scale-[0.98]">
                Start Tutorial
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
