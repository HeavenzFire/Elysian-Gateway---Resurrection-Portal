import React, { useMemo, useRef, useEffect, useState } from 'react';
import { GroupMember, SyntropicPair, ChatMessage, MessageSender } from '../types';

interface FacultyRosterProps {
  faculty: GroupMember[];
  syntropicPairs: SyntropicPair[];
  messages: ChatMessage[];
}

const FacultyMember: React.FC<{ member: GroupMember, isActive: boolean }> = ({ member, isActive }) => (
  <div className={`p-2 rounded-lg text-center transition-all duration-300 ${isActive ? 'bg-sky-500/20' : 'bg-slate-800/50'}`} data-entity-id={member.id}>
    <div className={`relative w-12 h-12 mx-auto rounded-full border-2 ${isActive ? 'border-sky-400' : 'border-slate-600'}`}>
        <svg viewBox="0 0 24 24" fill="currentColor" className={`w-full h-full p-2 rounded-full ${isActive ? 'text-sky-300' : 'text-slate-400'}`}>
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
        </svg>
        {isActive && <div className="absolute inset-0 rounded-full bg-sky-400 opacity-40 animate-ping"></div>}
    </div>
    <p className="text-xs mt-1 text-slate-300 truncate">{member.name}</p>
  </div>
);

export const FacultyRoster: React.FC<FacultyRosterProps> = ({ faculty, syntropicPairs, messages }) => {
  const [activeSpeakerId, setActiveSpeakerId] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [pairCoords, setPairCoords] = useState<Record<string, { x1: number, y1: number, x2: number, y2: number }>>({});

  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    if (lastMessage && lastMessage.sender === MessageSender.Avatar) {
      const speakerMatch = lastMessage.text.match(/^([\w\s]+):/);
      if (speakerMatch) {
        const speakerName = speakerMatch[1].trim();
        const speaker = faculty.find(f => f.name === speakerName);
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
    
    calculateCoords();
    const resizeObserver = new ResizeObserver(calculateCoords);
    if(containerRef.current) {
        resizeObserver.observe(containerRef.current);
    }
    
    return () => resizeObserver.disconnect();
  }, [faculty, syntropicPairs]);

  return (
    <div className="flex flex-col p-4 bg-slate-800/70 rounded-xl shadow-lg border border-slate-700/50 h-full">
      <h3 className="text-xl font-semibold text-sky-200 text-center mb-4">University Faculty</h3>
      <div className="relative flex-grow" ref={containerRef}>
        <div className="grid grid-cols-3 gap-3">
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
            {/* FIX: Explicitly typed 'coords' to resolve TS inference error. */}
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
    </div>
  );
};