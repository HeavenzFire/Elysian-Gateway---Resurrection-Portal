

import React, { useMemo, useRef, useEffect, useState } from 'react';
import { GroupMember, SyntropicPair, ChatMessage, MessageSender } from '../types';

interface FacultyRosterProps {
  faculty: GroupMember[];
  syntropicPairs: SyntropicPair[];
  messages: ChatMessage[];
}

// New component for icons
// FIX: Export LegionIcon so it can be used in other components.
export const LegionIcon: React.FC<{ memberId: string; className: string }> = ({ memberId, className }) => {
    switch (memberId) {
        case 'Grok_xAI_Emissary': // Grok - Stylized Eye
            return (
                <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
                    <path d="M12 4.5C7 4.5 2.7 7.6 1 12c1.7 4.4 6 7.5 11 7.5s9.3-3.1 11-7.5C21.3 7.6 17 4.5 12 4.5zm0 9a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm0-5c-2.48 0-4.5 2.02-4.5 4.5S9.52 18 12 18s4.5-2.02 4.5-4.5S14.48 8.5 12 8.5z"/>
                </svg>
            );
        case 'Legion_Angelic_Coders': // Angel - Stylized Wings
            return (
                <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
                   <path d="M21.9,10.1c-0.3-2.5-2.2-4.5-4.8-4.8c-0.4-0.1-0.9,0.2-0.9,0.6s0.2,0.9,0.6,0.9c1.9,0.3,3.4,1.8,3.7,3.7 c0.1,0.4,0.5,0.7,0.9,0.6S22,10.5,21.9,10.1z M2.1,10.1c-0.1-0.4-0.5-0.7-0.9-0.6s-0.7,0.5-0.6,0.9c0.3,2.5,2.2,4.5,4.8,4.8 c0.4,0.1,0.9-0.2,0.9-0.6s-0.2-0.9-0.6-0.9C4.3,14.2,2.8,12.7,2.5,10.8C2.4,10.4,2.2,10.1,2.1,10.1z"/>
                </svg>
            );
        case 'Legion_Dragon_Aetherguards': // Dragon - Stylized Fire
            return (
                <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
                    <path d="M12,2c-0.6,0-1,0.4-1,1v1.6C7.5,5.1,5.1,7.5,4.6,11H3c-0.6,0-1,0.4-1,1s0.4,1,1,1h1.6c0.5,3.5,2.9,5.9,6.4,6.4V21 c0,0.6,0.4,1,1,1s1-0.4,1-1v-1.6c3.5-0.5,5.9-2.9,6.4-6.4H21c0.6,0,1-0.4,1-1s-0.4-1-1-1h-1.6c-0.5-3.5-2.9-5.9-6.4-6.4V3 C13,2.4,12.6,2,12,2z M12,7c2.8,0,5,2.2,5,5s-2.2,5-5,5s-5-2.2-5-5S9.2,7,12,7z"/>
                </svg>
            );
        case 'Legion_Elven_Weavers': // Elf - Stylized Leaf/Arrow
            return (
                <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
                    <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c5.2 0 9.5-4 10-9h-3.4c-0.5 2.3-2.5 4-4.9 4s-4.4-1.7-4.9-4H2 C2.5 7.7 6.8 4 12 4c1.7 0 3.3 0.4 4.7 1.2l1.4-1.4C16.5 2.9 14.3 2 12 2z"/>
                </svg>
            );
        case 'Legion_Orcish_Gatekeepers': // Orc - Stylized Axe/Tusk
            return (
                 <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
                    <path d="M22.7,7.3l-5-5c-0.4-0.4-1-0.4-1.4,0l-15,15c-0.4,0.4-0.4,1,0,1.4l5,5c0.2,0.2,0.5,0.3,0.7,0.3s0.5-0.1,0.7-0.3l15-15 C23.1,8.3,23.1,7.7,22.7,7.3z M7.4,20.6L3.8,17l13-13l3.6,3.6L7.4,20.6z"/>
                </svg>
            );
        case 'Legion_Leprechaun_Alchemists': // Leprechaun - Stylized Clover
            return (
                 <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
                    <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10s10-4.5 10-10S17.5 2 12 2zm-1 15c-1.7 0-3-1.3-3-3s1.3-3 3-3 3 1.3 3 3-1.3 3-3 3zm6-5c-1.7 0-3-1.3-3-3s1.3-3 3-3 3 1.3 3 3-1.3 3-3 3zm-9-3c-1.7 0-3-1.3-3-3s1.3-3 3-3 3 1.3 3 3-1.3 3-3 3z"/>
                </svg>
            );
        default: // Fallback user icon
            return (
                 <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                </svg>
            );
    }
};

const FacultyMember: React.FC<{ member: GroupMember; isActive: boolean }> = ({ member, isActive }) => (
  <div className={`p-2 rounded-lg text-center transition-all duration-300 ${isActive ? 'bg-sky-500/20' : 'bg-slate-800/50'}`} data-entity-id={member.id}>
    <div className={`relative w-12 h-12 mx-auto rounded-full border-2 ${isActive ? 'border-sky-400' : 'border-slate-600'}`}>
        <LegionIcon memberId={member.id} className={`w-full h-full p-2 rounded-full ${isActive ? 'text-sky-300' : 'text-slate-400'}`} />
        {isActive && <div className="absolute inset-0 rounded-full bg-sky-400 opacity-40 animate-ping"></div>}
    </div>
    <p className="text-xs mt-1 text-slate-300 truncate" title={member.name}>{member.name}</p>
  </div>
);

export const FacultyRoster: React.FC<FacultyRosterProps> = ({ faculty, syntropicPairs, messages }) => {
  const [activeSpeakerId, setActiveSpeakerId] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [pairCoords, setPairCoords] = useState<Record<string, { x1: number, y1: number, x2: number, y2: number }>>({});

  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    if (lastMessage && lastMessage.sender === MessageSender.Avatar) {
      const speakerMatch = lastMessage.text.match(/^([\w\s\d\.'-]+):/);
      if (speakerMatch) {
        const speakerName = speakerMatch[1].trim();
        const speaker = faculty.find(f => f.name.includes(speakerName) || speakerName.includes(f.name));
        if (speaker) {
          setActiveSpeakerId(speaker.id);
        }
      }
    }
  }, [messages, faculty]);

  useEffect(() => {
    const calculateCoords = () => {
      if (!containerRef.current) return;
      
      const newCoords: Record<string, { x1: number, y1: number, x2: number, y2: number }> = {};
      const containerRect = containerRef.current.getBoundingClientRect();
      
      syntropicPairs.forEach(pair => {
        const member1Elem = containerRef.current?.querySelector(`[data-entity-id="${pair.members[0]}"]`) as HTMLElement;
        const member2Elem = containerRef.current?.querySelector(`[data-entity-id="${pair.members[1]}"]`) as HTMLElement;
        
        if (member1Elem && member2Elem) {
          const rect1 = member1Elem.getBoundingClientRect();
          const rect2 = member2Elem.getBoundingClientRect();
          
          newCoords[pair.id] = {
            x1: rect1.left + rect1.width / 2 - containerRect.left,
            y1: rect1.top + rect1.height / 2 - containerRect.top,
            x2: rect2.left + rect2.width / 2 - containerRect.left,
            y2: rect2.top + rect2.height / 2 - containerRect.top,
          };
        }
      });
      setPairCoords(newCoords);
    };
    
    // Use a timeout to ensure elements are rendered before calculating
    const timeoutId = setTimeout(calculateCoords, 100);

    const resizeObserver = new ResizeObserver(calculateCoords);
    if(containerRef.current) {
        resizeObserver.observe(containerRef.current);
    }
    
    return () => {
      clearTimeout(timeoutId);
      resizeObserver.disconnect();
    }
  }, [faculty, syntropicPairs, messages]); // Rerun on messages to recalc active speaker

  return (
    <div className="flex flex-col p-4 bg-slate-800/70 rounded-xl shadow-lg border border-slate-700/50 h-full">
      <h3 className="text-xl font-semibold text-sky-200 text-center mb-4">University Faculty</h3>
      <div className="relative flex-grow" ref={containerRef}>
        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-3 gap-3">
          {faculty.map(member => (
            <FacultyMember key={member.id} member={member} isActive={member.id === activeSpeakerId} />
          ))}
        </div>
        <svg className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-60">
            <defs>
                <linearGradient id="arcGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#22d3ee" />
                    <stop offset="100%" stopColor="#a78bfa" />
                </linearGradient>
                <filter id="arcGlow">
                    <feGaussianBlur stdDeviation="1.5" result="coloredBlur" />
                    <feMerge>
                        <feMergeNode in="coloredBlur" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>
            </defs>
            {Object.values(pairCoords).map((coords: { x1: number, y1: number, x2: number, y2: number }, i) => (
                <path 
                    key={i}
                    d={`M ${coords.x1} ${coords.y1} Q ${(coords.x1 + coords.x2)/2} ${(coords.y1 + coords.y2)/2 - 30} ${coords.x2} ${coords.y2}`}
                    stroke="url(#arcGradient)"
                    strokeWidth="1.5"
                    fill="none"
                    filter="url(#arcGlow)"
                    className="syntropic-pair-arc"
                />
            ))}
        </svg>
      </div>
      <div className="mt-4 pt-3 border-t border-slate-700/50 text-center text-xs text-slate-400 flex-shrink-0">
          <p>Faculty: <span className="font-bold text-white">{faculty.length}</span> | Network Nodes: <span className="font-bold text-sky-300 animate-pulse">144,000+</span></p>
          <p className="italic mt-1">Syntropic convergence in progress...</p>
      </div>
    </div>
  );
};