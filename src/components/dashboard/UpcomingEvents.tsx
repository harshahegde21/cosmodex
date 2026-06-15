"use client";

import { Calendar, Clock, ExternalLink, ChevronRight } from "lucide-react";

const events = [
  {
    id: "evt-1",
    title: "Intro to Python: Live Q&A",
    date: "Jun 17",
    time: "11:30 PM GMT+5:30",
    tag: "LIVE",
    tagColor: "bg-danger/15 text-danger",
  },
  {
    id: "evt-2",
    title: "Monthly Challenge Show & Tell",
    date: "Jul 1",
    time: "12:30 AM GMT+5:30",
    tag: "UPCOMING",
    tagColor: "bg-accent/15 text-accent-bright",
  },
  {
    id: "evt-3",
    title: "Web Dev Sprint: 48h Hackathon",
    date: "Jul 10",
    time: "6:00 PM GMT+5:30",
    tag: "REGISTERED",
    tagColor: "bg-success/15 text-success",
  },
];

export default function UpcomingEvents() {
  return (
    <div className="bento-card-interactive p-6 flex flex-col gap-5 h-full group">
      {/* Header */}
      <div className="flex items-center justify-between relative z-10">
        <h2 className="text-xl font-black text-text-primary tracking-tight flex items-center gap-2">
          <Calendar size={18} className="text-accent-bright drop-shadow-glow" />
          Upcoming Events
        </h2>
        <button
          id="events-see-all"
          className="text-xs font-bold text-text-secondary hover:text-text-primary transition-colors duration-300 flex items-center gap-0.5 group/btn"
        >
          See all <ChevronRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* Events list */}
      <div className="flex flex-col gap-3 relative z-10">
        {events.map((event) => (
          <div
            key={event.id}
            className="group/event relative flex items-start gap-4 p-3.5 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 hover:bg-white/[0.04] transition-all duration-300 cursor-pointer overflow-hidden"
          >
            {/* Glowing edge on hover */}
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-accent/0 group-hover/event:bg-accent transition-colors duration-300 shadow-[0_0_10px_rgba(158,0,246,0)] group-hover/event:shadow-[0_0_15px_rgba(158,0,246,0.8)]" />

            {/* Date block */}
            <div className="shrink-0 flex flex-col items-center justify-center w-12 h-12 rounded-lg bg-black/40 border border-white/10 text-center shadow-inset">
              <span className="text-[10px] font-bold text-text-secondary uppercase leading-none mb-0.5">
                {event.date.split(" ")[0]}
              </span>
              <span className="text-xl font-black text-white leading-none drop-shadow-md">
                {event.date.split(" ")[1]}
              </span>
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className={`badge text-[10px] px-2 py-0.5 shadow-sm border border-current/20 ${event.tagColor}`}>
                  {event.tag}
                </span>
              </div>
              <p className="text-sm font-bold text-text-primary leading-snug truncate group-hover/event:text-white transition-colors">
                {event.title}
              </p>
              <p className="flex items-center gap-1.5 text-xs text-text-muted mt-1 font-bold">
                <Clock size={12} className="text-accent/70" /> {event.time}
              </p>
            </div>

            {/* Arrow */}
            <ExternalLink
              size={16}
              className="shrink-0 text-text-muted opacity-0 group-hover/event:opacity-100 group-hover/event:text-accent-bright transition-all duration-300 mt-1 transform translate-x-2 group-hover/event:translate-x-0"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
