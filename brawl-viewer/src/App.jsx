import React, { useState, useRef, useEffect } from 'react';
import defaultPlayer from './IWantCrow.json';
import './index.css';

import {
  Card,
  CardMedia,
  Typography,
  Box,
  Skeleton,
  ThemeProvider,
  createTheme,
  AppBar,
  Toolbar,
  TextField,
  Avatar,
  Tooltip,
  Select,
  MenuItem,
  FormControl,
} from '@mui/material';
import { Trophy, Zap, Star, Flame, TrendingUp, Shield, Cpu, LayoutGrid, X, Upload, CheckCircle, AlertCircle } from 'lucide-react';

const theme = createTheme({
  palette: {
    primary: { main: '#0f0a1a' },
    secondary: { main: '#150d2e' },
    background: { default: '#0d0b1a', paper: '#150d2e' },
  },
  typography: {
    fontFamily: '"Supercell", "Helvetica Neue", sans-serif',
    h4: { fontWeight: 'normal', letterSpacing: '0px' },
    body2: { color: '#d4d4d4ff' },
  },
});

const TAG_STYLES = {
  gear:      { bg: 'rgba(99, 202, 183, 0.15)', border: 'rgba(99, 202, 183, 0.4)', color: '#63cab7', Icon: Cpu },
  starPower: { bg: 'rgba(255, 215, 0, 0.12)',  border: 'rgba(255, 215, 0, 0.4)',  color: '#ffd700', Icon: Star },
  gadget:    { bg: 'rgba(231, 111, 81, 0.15)', border: 'rgba(231, 111, 81, 0.4)', color: '#e76f51', Icon: Zap },
};

const TagPill = ({ label, type }) => {
  const style = TAG_STYLES[type];
  const Icon = style.Icon;
  return (
    <Box sx={{
      display: 'inline-flex', alignItems: 'center', gap: 0.5,
      px: 1, py: 0.4, borderRadius: '20px',
      border: `1px solid ${style.border}`,
      backgroundColor: style.bg,
      fontSize: '0.75rem', color: style.color,
      fontWeight: 600, letterSpacing: '0.5px',
      textTransform: 'uppercase', whiteSpace: 'nowrap',
    }}>
      <Icon size={11} />
      {label}
    </Box>
  );
};

const StatRow = ({ icon: Icon, iconColor, label, value, valueColor }) => (
  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 0.4 }}>
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
      <Icon size={15} color={iconColor} />
      <Typography sx={{ color: 'rgba(168,218,220,0.7)', fontSize: '0.82rem', fontWeight: 500 }}>
        {label}
      </Typography>
    </Box>
    <Typography sx={{ color: valueColor || '#a8dadc', fontSize: '0.88rem', fontWeight: 700 }}>
      {value}
    </Typography>
  </Box>
);

const StatPill = ({ emoji, label, value, color, glowColor }) => (
  <Tooltip title={label}>
    <Box sx={{
      display: 'flex', alignItems: 'center', gap: 1,
      px: 1.5, py: 0.8, borderRadius: '14px',
      background: `rgba(${glowColor}, 0.08)`,
      border: `1px solid rgba(${glowColor}, 0.22)`,
      cursor: 'default', transition: 'all 0.2s', flex: '1 1 80px', minWidth: 0,
      '&:hover': { borderColor: `rgba(${glowColor}, 0.55)`, boxShadow: `0 0 14px rgba(${glowColor}, 0.18)` },
    }}>
      <Typography sx={{ fontSize: '1.1rem', lineHeight: 1 }}>{emoji}</Typography>
      <Box sx={{ minWidth: 0 }}>
        <Typography sx={{ color: 'rgba(168,218,220,0.5)', fontSize: '0.54rem', fontWeight: 700, letterSpacing: '0.6px', textTransform: 'uppercase', lineHeight: 1 }}>
          {label}
        </Typography>
        <Typography sx={{ color, fontSize: '0.85rem', fontWeight: 800, lineHeight: 1.3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {value}
        </Typography>
      </Box>
    </Box>
  </Tooltip>
);

const RANKS = [
  { name: 'Bronze',   subs: ['I','II','III'] },
  { name: 'Silver',   subs: ['I','II','III'] },
  { name: 'Gold',     subs: ['I','II','III'] },
  { name: 'Diamond',  subs: ['I','II','III'] },
  { name: 'Mythic',   subs: ['I','II','III'] },
  { name: 'Legendary',subs: ['I','II','III'] },
  { name: 'Masters',  subs: ['I','II','III'] },
  { name: 'Pro',      subs: [''] },
];
const RANK_COLORS = {
  Bronze: '#cd7f32', Silver: '#c0c0c0', Gold: '#ffd700',
  Diamond: '#b9f2ff', Mythic: '#e040fb', Legendary: '#ff6d00',
  Masters: '#f44336', Pro: '#aa00ff',
};

const RankPickerPill = () => {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState({ name: 'Bronze', sub: 'I' });
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0 });
  const pillRef = useRef(null);
  const color = RANK_COLORS[selected.name];
  const label = selected.sub ? `${selected.name} ${selected.sub}` : selected.name;

  useEffect(() => {
    if (open && pillRef.current) {
      const rect = pillRef.current.getBoundingClientRect();
      setDropdownPos({ top: rect.bottom + 6, left: rect.left });
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (pillRef.current && !pillRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  return (
    <Box ref={pillRef} sx={{ position: 'relative', flex: '2 1 160px', minWidth: 0 }}>
      <Tooltip title="Click to change rank">
        <Box
          onClick={() => setOpen(o => !o)}
          sx={{
            display: 'flex', alignItems: 'center', gap: 1,
            px: 2, py: 1, borderRadius: '14px', cursor: 'pointer',
            background: `rgba(${hexToRgb(color)}, 0.08)`,
            border: `1px solid rgba(${hexToRgb(color)}, 0.3)`,
            transition: 'all 0.2s',
            '&:hover': { borderColor: `rgba(${hexToRgb(color)}, 0.6)`, boxShadow: `0 0 14px rgba(${hexToRgb(color)}, 0.18)` },
          }}
        >
          <Typography sx={{ fontSize: '1.1rem', lineHeight: 1 }}>🏅</Typography>
          <Box sx={{ minWidth: 0 }}>
            <Typography sx={{ color: 'rgba(168,218,220,0.5)', fontSize: '0.54rem', fontWeight: 700, letterSpacing: '0.6px', textTransform: 'uppercase', lineHeight: 1 }}>
              Best Rank
            </Typography>
            <Typography sx={{ color, fontSize: '0.95rem', fontWeight: 800, lineHeight: 1.3, whiteSpace: 'nowrap' }}>
              {label}
            </Typography>
          </Box>
        </Box>
      </Tooltip>
      {open && (
        <Box sx={{
          position: 'fixed',
          top: dropdownPos.top,
          left: dropdownPos.left,
          zIndex: 9999,
          backgroundColor: '#110d2a',
          border: '1px solid rgba(139,92,246,0.4)',
          borderRadius: '10px', p: 1.5, minWidth: 180,
          boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
          maxHeight: 320, overflowY: 'auto',
          '&::-webkit-scrollbar': { width: '4px' },
          '&::-webkit-scrollbar-thumb': { background: '#6d28d9', borderRadius: '4px' },
        }}>
          {RANKS.map(r => (
            <Box key={r.name} sx={{ mb: 0.5 }}>
              {r.subs.map(sub => {
                const lbl = sub ? `${r.name} ${sub}` : r.name;
                const isActive = selected.name === r.name && selected.sub === sub;
                return (
                  <Box
                    key={lbl}
                    onClick={(e) => { e.stopPropagation(); setSelected({ name: r.name, sub }); setOpen(false); }}
                    sx={{
                      px: 1.5, py: 0.5, borderRadius: '6px', cursor: 'pointer',
                      color: isActive ? RANK_COLORS[r.name] : 'rgba(168,218,220,0.6)',
                      backgroundColor: isActive ? `rgba(${hexToRgb(RANK_COLORS[r.name])}, 0.15)` : 'transparent',
                      fontSize: '0.78rem', fontWeight: isActive ? 800 : 500,
                      '&:hover': { backgroundColor: `rgba(${hexToRgb(RANK_COLORS[r.name])}, 0.1)`, color: RANK_COLORS[r.name] },
                      transition: 'all 0.12s',
                    }}
                  >{lbl}</Box>
                );
              })}
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
};

function hexToRgb(hex) {
  const r = parseInt(hex.slice(1,3),16);
  const g = parseInt(hex.slice(3,5),16);
  const b = parseInt(hex.slice(5,7),16);
  return `${r},${g},${b}`;
}

const PlayerProfilePanel = ({ player }) => {
  const nameColor = `#${player.nameColor?.replace('0xff', '') || 'ff9727'}`;
  const totalWins = player['3vs3Victories'] + player.soloVictories + player.duoVictories;

  const bestStreak = player.brawlers.reduce((best, b) => {
    if (b.maxWinStreak > best.streak) return { streak: b.maxWinStreak, name: b.name };
    return best;
  }, { streak: 0, name: '' });

  return (
    <Box sx={{
      mb: 3, borderRadius: '16px', overflow: 'hidden',
      border: '1px solid rgba(139,92,246,0.25)',
      background: 'linear-gradient(135deg, rgba(18,12,36,0.98) 0%, rgba(10,8,28,0.98) 100%)',
      boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
    }}>
      <Box sx={{
        display: 'flex', alignItems: 'center', gap: 2.5,
        px: 3, py: 2,
        background: 'linear-gradient(90deg, rgba(139,92,246,0.12) 0%, rgba(99,102,241,0.06) 50%, transparent 100%)',
        borderBottom: '1px solid rgba(139,92,246,0.15)',
        flexWrap: 'wrap',
      }}>
        <Box sx={{ position: 'relative', flexShrink: 0 }}>
          <Box sx={{
            width: 64, height: 64, borderRadius: '50%',
            background: `conic-gradient(${nameColor} 0%, rgba(255,255,255,0.08) 100%)`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: `0 0 20px ${nameColor}44`,
          }}>
            <Box sx={{
              width: 54, height: 54, borderRadius: '50%',
              background: 'linear-gradient(135deg, #1a2a3e, #0f1e2e)',
              border: `2px solid ${nameColor}55`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1.6rem',
            }}>🦸</Box>
          </Box>
          <Box sx={{
            position: 'absolute', bottom: -5, right: -5,
            backgroundColor: '#6d28d9', borderRadius: '8px',
            px: 0.7, py: 0.15, fontSize: '0.62rem', fontWeight: 800,
            color: '#fff', border: '2px solid rgba(15,52,96,0.9)', lineHeight: 1.4,
          }}>{player.expLevel}</Box>
        </Box>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography sx={{
            color: nameColor, fontWeight: 800,
            fontSize: 'clamp(0.85rem, 3vw, 1.35rem)',
            letterSpacing: '0.5px', lineHeight: 1.1,
            textShadow: `0 0 16px ${nameColor}66`,
            overflowWrap: 'break-word', wordBreak: 'break-word',
          }}>{player.name}</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5, flexWrap: 'wrap' }}>
            <Typography sx={{ color: 'rgba(168,218,220,0.45)', fontSize: '0.72rem', fontFamily: 'monospace' }}>
              {player.tag}
            </Typography>
            {player.club?.name && (
              <Box sx={{
                display: 'inline-flex', alignItems: 'center', gap: 0.5,
                px: 1, py: 0.2, borderRadius: '10px',
                backgroundColor: 'rgba(99,202,183,0.12)',
                border: '1px solid rgba(99,202,183,0.3)',
              }}>
                <Typography sx={{ fontSize: '0.65rem' }}>🛡️</Typography>
                <Typography sx={{ color: '#63cab7', fontSize: '0.68rem', fontWeight: 700 }}>{player.club.name}</Typography>
              </Box>
            )}
          </Box>
        </Box>
        <Box sx={{
          flexShrink: 0, minWidth: 130,
          px: 2, py: 1, borderRadius: '12px',
          background: 'rgba(139,92,246,0.06)',
          border: '1px solid rgba(139,92,246,0.15)',
        }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
            <Typography sx={{ color: 'rgba(168,218,220,0.5)', fontSize: '0.58rem', fontWeight: 700, letterSpacing: '0.8px', textTransform: 'uppercase' }}>EXP</Typography>
            <Typography sx={{ color: 'rgba(168,218,220,0.7)', fontSize: '0.58rem', fontWeight: 700 }}>Lv {player.expLevel}</Typography>
          </Box>
          <Box sx={{ height: 5, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.08)', overflow: 'hidden', mb: 0.4 }}>
            <Box sx={{
              height: '100%', borderRadius: 3,
              width: `${Math.min(100, (player.expPoints % 10000) / 100)}%`,
              background: 'linear-gradient(90deg, #63cab7, #a8dadc)',
              boxShadow: '0 0 8px rgba(99,202,183,0.6)',
            }} />
          </Box>
          <Typography sx={{ color: '#a8dadc', fontSize: '0.62rem', fontWeight: 700 }}>
            {player.expPoints.toLocaleString()} XP
          </Typography>
        </Box>
      </Box>
      <Box sx={{ p: 2.5 }}>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
          <StatPill emoji="🏆" label="Trophies"    value={player.trophies.toLocaleString()}         color="#f4a261" glowColor="244,162,97" />
          <StatPill emoji="⭐" label="Best Ever"   value={player.highestTrophies.toLocaleString()}  color="#ffd700" glowColor="255,215,0" />
          <StatPill emoji="⚔️" label="3v3 Wins"   value={player['3vs3Victories'].toLocaleString()}  color="#63cab7" glowColor="99,202,183" />
          <StatPill emoji="👑" label="Solo Wins"   value={player.soloVictories.toLocaleString()}    color="#e76f51" glowColor="231,111,81" />
          <StatPill emoji="🤝" label="Duo Wins"    value={player.duoVictories.toLocaleString()}     color="#a863ca" glowColor="168,99,202" />
          <StatPill emoji="🎯" label="Total Wins"  value={totalWins.toLocaleString()}               color="#a8dadc" glowColor="168,218,220" />
          <RankPickerPill />
          <StatPill emoji="🔥" label="Best Streak" value={`${bestStreak.streak} (${bestStreak.name})`} color="#ff6b6b" glowColor="255,107,107" />
        </Box>
      </Box>
    </Box>
  );
};

/* ─────────────────────────────────────────────
   Brawler overview block — 15 per row, compact
───────────────────────────────────────────── */
const DotBar = ({ total, lit, color, dimColor }) => (
  <Box sx={{
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    justifyContent: 'center', gap: '3px', py: '4px',
  }}>
    {Array.from({ length: total }).map((_, i) => {
      const active = i < lit;
      return (
        <Box key={i} sx={{
          width: '5px', height: '5px', borderRadius: '50%',
          backgroundColor: active ? color : dimColor,
          boxShadow: active ? `0 0 4px ${color}` : 'none',
          transition: 'all 0.15s', flexShrink: 0,
        }} />
      );
    })}
  </Box>
);

const TinyBrawlerCard = ({ brawler, onClick, hasHypercharge, buffies }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const imageUrl = `https://cdn.brawlify.com/brawlers/borderless/${brawler.id}.png`;

  const gadgetCount  = brawler.gadgets?.length   || 0;
  const starPwrCount = brawler.starPowers?.length || 0;
  const gearCount    = brawler.gears?.length      || 0;

  return (
    <Tooltip title={brawler.name} placement="top" arrow>
      <Box
        onClick={() => onClick(brawler)}
        sx={{
          borderRadius: '7px', overflow: 'hidden',
          backgroundColor: '#08061a',
          border: hasHypercharge ? '1px solid rgba(192,132,252,0.55)' : '1px solid rgba(139,92,246,0.18)',
          cursor: 'pointer', transition: 'all 0.18s ease',
          display: 'flex', flexDirection: 'column',
          boxShadow: hasHypercharge ? '0 0 8px rgba(192,132,252,0.2)' : 'none',
          '&:hover': {
            border: '1px solid rgba(139,92,246,0.65)',
            boxShadow: '0 0 12px rgba(139,92,246,0.28)',
            transform: 'translateY(-2px) scale(1.07)',
            zIndex: 2,
          },
        }}
      >
        <Box sx={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          gap: '3px', py: '3px', px: '4px',
          background: 'linear-gradient(90deg, rgba(14,10,28,0.95), rgba(18,12,36,0.95))',
          borderBottom: '1px solid rgba(139,92,246,0.2)', flexShrink: 0,
        }}>
          <Trophy size={8} color="#f4a261" fill="#f4a261" />
          <Typography sx={{ color: '#f4a261', fontSize: '0.68rem', fontWeight: 800, lineHeight: 1, letterSpacing: '0.2px', whiteSpace: 'nowrap' }}>
            {brawler.trophies.toLocaleString()}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', flex: 1, minHeight: 0 }}>
          {/* Far-left: buffies */}
          <Box sx={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            justifyContent: 'space-between', px: '2px', py: '4px',
            background: 'rgba(192,192,192,0.03)',
            borderRight: '1px solid rgba(192,192,192,0.08)', flexShrink: 0,
          }}>
            <Box sx={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: buffies.hyper ? '#b8a0d0' : 'rgba(184,160,208,0.12)', boxShadow: buffies.hyper ? '0 0 4px #b8a0d0' : 'none', transition: 'all 0.15s', flexShrink: 0 }} />
            <Box sx={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: buffies.starPower ? '#c0b060' : 'rgba(192,176,96,0.12)', boxShadow: buffies.starPower ? '0 0 4px #c0b060' : 'none', transition: 'all 0.15s', flexShrink: 0 }} />
            <Box sx={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: buffies.gadget ? '#b0c090' : 'rgba(176,192,144,0.12)', boxShadow: buffies.gadget ? '0 0 4px #b0c090' : 'none', transition: 'all 0.15s', flexShrink: 0 }} />
          </Box>

          {/* Inner-left: hypercharge + star powers + gadgets */}
          <Box sx={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            justifyContent: 'center', px: '3px', gap: '2px',
            background: 'rgba(139,92,246,0.04)',
            borderRight: '1px solid rgba(139,92,246,0.1)', flexShrink: 0,
          }}>
            <Box sx={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: hasHypercharge ? '#c084fc' : 'rgba(192,132,252,0.12)', boxShadow: hasHypercharge ? '0 0 5px #c084fc' : 'none', transition: 'all 0.15s', flexShrink: 0, mb: '1px' }} />
            <Box sx={{ width: '3px', height: '1px', backgroundColor: 'rgba(139,92,246,0.25)', my: '1px' }} />
            <DotBar total={2} lit={starPwrCount} color="#ffd700" dimColor="rgba(255,215,0,0.12)" />
            <Box sx={{ width: '3px', height: '1px', backgroundColor: 'rgba(139,92,246,0.25)', my: '1px' }} />
            <DotBar total={2} lit={gadgetCount} color="#4ade80" dimColor="rgba(74,222,128,0.12)" />
          </Box>

          {/* Portrait */}
          <Box sx={{ position: 'relative', flex: 1, overflow: 'hidden', backgroundColor: '#08061a' }}>
            {!imageLoaded && <Skeleton variant="rectangular" sx={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(255,255,255,0.04)' }} />}
            <CardMedia component="img" image={imageUrl} alt={brawler.name} onLoad={() => setImageLoaded(true)}
              sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'contain', objectPosition: 'center center', display: 'block' }} />
          </Box>

          {/* Right: gears */}
          <Box sx={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            justifyContent: 'center', px: '3px',
            background: 'rgba(139,92,246,0.04)',
            borderLeft: '1px solid rgba(139,92,246,0.1)', flexShrink: 0,
          }}>
            <DotBar total={6} lit={gearCount} color="#7dd3fc" dimColor="rgba(125,211,252,0.1)" />
          </Box>
        </Box>

        <Box sx={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          py: '3px', px: '4px',
          background: 'linear-gradient(90deg, rgba(176,106,255,0.18), rgba(176,106,255,0.1))',
          borderTop: '1px solid rgba(176,106,255,0.25)', flexShrink: 0,
        }}>
          <Typography sx={{ color: '#b06aff', fontSize: '0.65rem', fontWeight: 800, lineHeight: 1, letterSpacing: '0.5px', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
            POWER {brawler.power}
          </Typography>
        </Box>
      </Box>
    </Tooltip>
  );
};

const BrawlerOverview = ({ brawlers, onBrawlerClick, hypercharges, setHypercharges, buffiesMap, setBuffiesMap }) => {
  const [sortBy, setSortBy] = useState('default');
  const [modalBrawler, setModalBrawler] = useState(null);

  const toggleHypercharge = (id) =>
    setHypercharges(prev => ({ ...prev, [id]: !prev[id] }));

  const toggleBuffy = (id, key) =>
    setBuffiesMap(prev => ({
      ...prev,
      [id]: { hyper: false, gadget: false, starPower: false, ...(prev[id] || {}), [key]: !(prev[id]?.[key]) },
    }));

  const sortedBrawlers = sortBy === 'trophies'
    ? [...brawlers].sort((a, b) => b.trophies - a.trophies)
    : brawlers;

  const activeBrawlerId = modalBrawler?.id;
  const liveHypercharge = activeBrawlerId ? !!hypercharges[activeBrawlerId] : false;
  const liveBuffies = activeBrawlerId
    ? (buffiesMap[activeBrawlerId] || { hyper: false, gadget: false, starPower: false })
    : { hyper: false, gadget: false, starPower: false };

  return (
    <Box sx={{
      mb: 3, borderRadius: '14px', overflow: 'hidden',
      border: '1px solid rgba(139,92,246,0.18)',
      background: 'linear-gradient(160deg, rgba(16,10,32,0.98) 0%, rgba(10,6,22,0.98) 100%)',
      boxShadow: '0 4px 24px rgba(0,0,0,0.35)',
    }}>
      <Box sx={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        px: 2.5, py: 1.2,
        background: 'linear-gradient(90deg, rgba(139,92,246,0.1) 0%, transparent 100%)',
        borderBottom: '1px solid rgba(139,92,246,0.1)',
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{ width: 3, height: 16, borderRadius: '2px', background: 'linear-gradient(180deg, #a78bfa, #6d28d9)' }} />
          <Typography sx={{ color: '#e2e8f0', fontSize: '0.78rem', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase' }}>All Brawlers</Typography>
          <Typography sx={{ color: 'rgba(168,218,220,0.35)', fontSize: '0.68rem', fontWeight: 600, letterSpacing: '0.5px', ml: 0.5 }}>{brawlers.length} total</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
          {[{ key: 'default', label: 'Default' }, { key: 'trophies', label: '🏆 Trophies' }].map(({ key, label }) => (
            <Box key={key} onClick={() => setSortBy(key)} sx={{
              px: 1.2, py: 0.35, borderRadius: '6px', fontSize: '0.65rem', fontWeight: 700,
              letterSpacing: '0.4px', cursor: 'pointer', transition: 'all 0.15s',
              ...(sortBy === key
                ? { backgroundColor: 'rgba(139,92,246,0.18)', border: '1px solid rgba(139,92,246,0.55)', color: '#a78bfa' }
                : { backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(168,218,220,0.5)', '&:hover': { backgroundColor: 'rgba(139,92,246,0.08)', borderColor: 'rgba(139,92,246,0.2)', color: 'rgba(168,218,220,0.8)' } }),
            }}>{label}</Box>
          ))}
        </Box>
      </Box>

      <Box sx={{ p: 1.5, display: 'grid', gridTemplateColumns: 'repeat(15, 1fr)', gap: '6px' }}>
        {sortedBrawlers.map((brawler) => (
          <TinyBrawlerCard
            key={brawler.id}
            brawler={brawler}
            onClick={(b) => setModalBrawler(b)}
            hasHypercharge={!!hypercharges[brawler.id]}
            buffies={buffiesMap[brawler.id] || { hyper: false, gadget: false, starPower: false }}
          />
        ))}
      </Box>

      <BrawlerModal
        brawler={modalBrawler}
        onClose={() => setModalBrawler(null)}
        hasHypercharge={liveHypercharge}
        buffies={liveBuffies}
        toggleHypercharge={() => toggleHypercharge(activeBrawlerId)}
        toggleBuffy={(key) => toggleBuffy(activeBrawlerId, key)}
        showToggles={true}
      />
    </Box>
  );
};

/* ─────────────────────────────────────────────
   Mini card (grid view)
───────────────────────────────────────────── */
const MiniCard = ({ brawler, onClick }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const imageUrl = `https://cdn.brawlify.com/brawlers/borderless/${brawler.id}.png`;

  return (
    <Box onClick={() => onClick(brawler)} sx={{
      backgroundColor: '#0e0a1e', border: '1px solid rgba(139,92,246,0.2)',
      borderRadius: '14px', overflow: 'hidden', cursor: 'pointer',
      display: 'flex', flexDirection: 'column', width: '100%', height: '100%',
      transition: 'all 0.25s cubic-bezier(0.34,1.56,0.64,1)',
      '&:hover': { transform: 'translateY(-5px) scale(1.02)', borderColor: '#8b5cf6', boxShadow: '0 16px 36px rgba(139,92,246,0.25)' },
    }}>
      <Box sx={{
        px: 1.5, py: 1,
        background: 'linear-gradient(90deg, rgba(20,14,40,0.95), rgba(26,18,52,0.95))',
        borderBottom: '1px solid rgba(139,92,246,0.12)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <Typography sx={{ color: '#e2e8f0', fontSize: 'clamp(0.72rem, 1.8vw, 1rem)', fontWeight: 700, letterSpacing: '0.8px', textTransform: 'uppercase', overflowWrap: 'break-word', wordBreak: 'break-word', lineHeight: 1.2 }}>
          {brawler.name}
        </Typography>
        <Avatar sx={{ width: 28, height: 28, backgroundColor: '#6d28d9', fontSize: '0.78rem', fontWeight: 800, color: '#fff', flexShrink: 0, ml: 0.5 }}>
          {String(brawler.power).padStart(2, '0')}
        </Avatar>
      </Box>
      <Box sx={{ position: 'relative', paddingBottom: '80%', backgroundColor: '#0a1828', overflow: 'hidden', flex: 1 }}>
        {!imageLoaded && <Skeleton variant="rectangular" sx={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(255,255,255,0.05)' }} />}
        <CardMedia component="img" image={imageUrl} alt={brawler.name} onLoad={() => setImageLoaded(true)}
          sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'contain' }} />
      </Box>
      <Box sx={{ px: 1.5, py: 0.8, background: 'rgba(14,10,30,0.88)', borderTop: '1px solid rgba(139,92,246,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.6 }}>
        <Trophy size={16} color="#f4a261" fill="#f4a261" />
        <Typography sx={{ color: '#f4a261', fontSize: 'clamp(0.82rem, 1.8vw, 1.05rem)', fontWeight: 800 }}>
          {brawler.trophies.toLocaleString()}
        </Typography>
      </Box>
    </Box>
  );
};

/* ─────────────────────────────────────────────
   Detail modal overlay
───────────────────────────────────────────── */
const BrawlerModal = ({ brawler, onClose, hasHypercharge, buffies, toggleHypercharge, toggleBuffy, showToggles }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  if (!brawler) return null;

  const imageUrl = `https://cdn.brawlify.com/brawlers/borderless/${brawler.id}.png`;
  const rankColor = brawler.rank >= 35 ? '#ff6b6b' : brawler.rank >= 25 ? '#ffd700' : brawler.rank >= 15 ? '#c0c0c0' : '#cd7f32';

  return (
    <Box onClick={onClose} sx={{
      position: 'fixed', inset: 0, zIndex: 2000,
      backgroundColor: 'rgba(5,10,20,0.82)', backdropFilter: 'blur(6px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      p: { xs: 1.5, sm: 3 },
      animation: 'fadeIn 0.18s ease',
      '@keyframes fadeIn': { from: { opacity: 0 }, to: { opacity: 1 } },
    }}>
      <Box onClick={(e) => e.stopPropagation()} sx={{
        width: '100%', maxWidth: 480, maxHeight: '92vh', overflowY: 'auto',
        backgroundColor: '#0c0820',
        border: '1px solid rgba(231,111,81,0.35)',
        borderRadius: '18px',
        boxShadow: '0 32px 80px rgba(0,0,0,0.7), 0 0 60px rgba(231,111,81,0.08)',
        display: 'flex', flexDirection: 'column',
        animation: 'slideUp 0.22s cubic-bezier(0.34,1.56,0.64,1)',
        '@keyframes slideUp': { from: { opacity: 0, transform: 'translateY(30px) scale(0.96)' }, to: { opacity: 1, transform: 'translateY(0) scale(1)' } },
        '&::-webkit-scrollbar': { width: '5px' },
        '&::-webkit-scrollbar-thumb': { background: '#e76f51', borderRadius: '4px' },
      }}>
        <Box sx={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          px: 2.5, py: 1.8,
          background: 'linear-gradient(90deg, rgba(139,92,246,0.14), rgba(99,102,241,0.05))',
          borderBottom: '1px solid rgba(139,92,246,0.18)', flexShrink: 0,
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Typography sx={{ color: '#e2e8f0', fontSize: '1.15rem', fontWeight: 800, letterSpacing: '1.5px', textTransform: 'uppercase' }}>{brawler.name}</Typography>
            <Tooltip title={`Rank ${brawler.rank}`}>
              <Box sx={{ width: 30, height: 30, borderRadius: '50%', background: `radial-gradient(circle, ${rankColor}33, ${rankColor}11)`, border: `2px solid ${rankColor}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.72rem', fontWeight: 800, color: rankColor }}>
                {brawler.rank}
              </Box>
            </Tooltip>
            <Avatar sx={{ width: 30, height: 30, backgroundColor: '#6d28d9', fontSize: '0.78rem', fontWeight: 800 }}>
              {String(brawler.power).padStart(2, '0')}
            </Avatar>
          </Box>
          <Box onClick={onClose} sx={{ width: 32, height: 32, borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', transition: 'all 0.15s', '&:hover': { backgroundColor: 'rgba(139,92,246,0.2)', borderColor: '#8b5cf6' } }}>
            <X size={16} color="#a8dadc" />
          </Box>
        </Box>

        <Box sx={{ position: 'relative', paddingBottom: '62%', backgroundColor: '#071020', overflow: 'hidden', flexShrink: 0, background: 'radial-gradient(ellipse at center, #150d30 0%, #060412 100%)' }}>
          {!imageLoaded && <Skeleton variant="rectangular" sx={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(255,255,255,0.04)' }} />}
          <CardMedia component="img" image={imageUrl} alt={brawler.name} onLoad={() => setImageLoaded(true)}
            sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'contain', filter: 'drop-shadow(0 8px 24px rgba(231,111,81,0.3))' }} />
        </Box>

        <Box sx={{ px: 2.5, pt: 2, pb: 1.5, borderBottom: '1px solid rgba(231,111,81,0.08)' }}>
          <StatRow icon={Trophy}     iconColor="#f4a261" label="Trophies"    value={brawler.trophies.toLocaleString()}        valueColor="#f4a261" />
          <StatRow icon={TrendingUp} iconColor="#ffd700" label="Highest"     value={brawler.highestTrophies.toLocaleString()} valueColor="#ffd700" />
          <StatRow icon={Shield}     iconColor={rankColor} label="Rank"      value={brawler.rank}                              valueColor={rankColor} />
          <StatRow icon={Flame}      iconColor="#ff6b6b" label="Win Streak"  value={brawler.currentWinStreak}                  valueColor={brawler.currentWinStreak > 0 ? '#ff6b6b' : '#a8dadc'} />
          <StatRow icon={Star}       iconColor="#63cab7" label="Best Streak" value={brawler.maxWinStreak}                      valueColor="#63cab7" />
        </Box>

        <Box sx={{ px: 2.5, pt: 1.5, pb: 2.5 }}>
          {brawler.gears?.length > 0 && (
            <Box sx={{ mb: 1.5 }}>
              <Typography sx={{ color: 'rgba(99,202,183,0.6)', fontSize: '0.65rem', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', mb: 0.7 }}>Gears</Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.6 }}>
                {brawler.gears.map(g => <TagPill key={g.id} label={`${g.name} Lv${g.level}`} type="gear" />)}
              </Box>
            </Box>
          )}
          {brawler.starPowers?.length > 0 && (
            <Box sx={{ mb: 1.5 }}>
              <Typography sx={{ color: 'rgba(255,215,0,0.6)', fontSize: '0.65rem', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', mb: 0.7 }}>Star Powers</Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.6 }}>
                {brawler.starPowers.map(sp => <TagPill key={sp.id} label={sp.name} type="starPower" />)}
              </Box>
            </Box>
          )}
          {brawler.gadgets?.length > 0 && (
            <Box sx={{ mb: 1.5 }}>
              <Typography sx={{ color: 'rgba(231,111,81,0.6)', fontSize: '0.65rem', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', mb: 0.7 }}>Gadgets</Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.6 }}>
                {brawler.gadgets.map(gd => <TagPill key={gd.id} label={gd.name} type="gadget" />)}
              </Box>
            </Box>
          )}
          {!brawler.gears?.length && !brawler.starPowers?.length && !brawler.gadgets?.length && (
            <Typography sx={{ color: 'rgba(168,218,220,0.3)', fontSize: '0.78rem', fontStyle: 'italic', textAlign: 'center', mt: 1 }}>No upgrades unlocked</Typography>
          )}
        </Box>

        {showToggles && (
          <Box sx={{ px: 2.5, pt: 1.5, pb: 2.5, borderTop: '1px solid rgba(139,92,246,0.12)' }}>
            <Typography sx={{ color: 'rgba(168,218,220,0.5)', fontSize: '0.65rem', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', mb: 1.2 }}>Card Indicators</Typography>
            {[
              { key: 'hypercharge', label: 'Hypercharge',       color: '#c084fc', rgb: '192,132,252', active: hasHypercharge,   action: toggleHypercharge },
              { key: 'hyper',       label: 'Hyper Buffy',       color: '#b8a0d0', rgb: '184,160,208', active: buffies.hyper,     action: () => toggleBuffy('hyper') },
              { key: 'gadget',      label: 'Gadget Buffy',      color: '#b0c090', rgb: '176,192,144', active: buffies.gadget,    action: () => toggleBuffy('gadget') },
              { key: 'starPower',   label: 'Star Power Buffy',  color: '#c0b060', rgb: '192,176,96',  active: buffies.starPower, action: () => toggleBuffy('starPower') },
            ].map(({ key, label, color, rgb, active, action }) => (
              <Box key={key} onClick={action} sx={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                px: 1.5, py: 0.9, mb: 0.6, borderRadius: '8px', cursor: 'pointer',
                backgroundColor: active ? `rgba(${rgb}, 0.1)` : 'rgba(255,255,255,0.03)',
                border: `1px solid ${active ? `rgba(${rgb}, 0.4)` : 'rgba(255,255,255,0.08)'}`,
                transition: 'all 0.15s',
                '&:hover': { backgroundColor: `rgba(${rgb}, 0.07)` },
              }}>
                <Typography sx={{ color: active ? color : 'rgba(168,218,220,0.5)', fontSize: '0.78rem', fontWeight: active ? 700 : 500, transition: 'color 0.15s' }}>{label}</Typography>
                <Box sx={{ width: 36, height: 20, borderRadius: '10px', position: 'relative', flexShrink: 0, backgroundColor: active ? `rgba(${rgb}, 0.35)` : 'rgba(255,255,255,0.08)', border: `1.5px solid ${active ? color : 'rgba(255,255,255,0.15)'}`, transition: 'background-color 0.2s, border-color 0.2s', cursor: 'pointer' }}>
                  <Box sx={{ position: 'absolute', top: '3px', left: active ? '17px' : '3px', width: 12, height: 12, borderRadius: '50%', backgroundColor: active ? color : 'rgba(255,255,255,0.35)', boxShadow: active ? `0 0 6px ${color}` : 'none', transition: 'left 0.2s ease, background-color 0.2s ease, box-shadow 0.2s ease' }} />
                </Box>
              </Box>
            ))}
          </Box>
        )}
      </Box>
    </Box>
  );
};

/* ─────────────────────────────────────────────
   AppBar stat input & total pill components
───────────────────────────────────────────── */
const AppBarStatInput = ({ emoji, label, value, onChange, rgb }) => (
  <Tooltip title={label}>
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.4, flexShrink: 0 }}>
      <Typography sx={{ fontSize: '0.85rem', lineHeight: 1, userSelect: 'none' }}>{emoji}</Typography>
      <Box
        component="input"
        type="number"
        min="0"
        placeholder="0"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        sx={{
          width: 68,
          backgroundColor: 'rgba(255,255,255,0.07)',
          border: `1px solid rgba(${rgb}, 0.25)`,
          borderRadius: '7px',
          color: `rgb(${rgb})`,
          fontSize: '0.73rem',
          fontWeight: 700,
          fontFamily: 'inherit',
          px: '6px',
          py: '5px',
          outline: 'none',
          transition: 'border-color 0.15s, box-shadow 0.15s',
          '&:focus': {
            borderColor: `rgba(${rgb}, 0.65)`,
            boxShadow: `0 0 0 2px rgba(${rgb}, 0.12)`,
          },
          '&::-webkit-inner-spin-button, &::-webkit-outer-spin-button': { appearance: 'none' },
          '&[type=number]': { MozAppearance: 'textfield' },
        }}
      />
    </Box>
  </Tooltip>
);

const TotalPill = ({ emoji, label, value, rgb }) => (
  <Tooltip title={label}>
    <Box sx={{
      display: 'flex', alignItems: 'center', gap: 0.6,
      px: 1.2, py: 0.35, borderRadius: '10px', flexShrink: 0,
      background: `rgba(${rgb}, 0.1)`,
      border: `1px solid rgba(${rgb}, 0.3)`,
      transition: 'all 0.2s',
      cursor: 'default',
      '&:hover': { borderColor: `rgba(${rgb}, 0.6)`, boxShadow: `0 0 10px rgba(${rgb}, 0.2)` },
    }}>
      <Typography sx={{ fontSize: '0.85rem', lineHeight: 1 }}>{emoji}</Typography>
      <Box>
        <Typography sx={{ color: `rgba(${rgb}, 0.6)`, fontSize: '0.48rem', fontWeight: 700, letterSpacing: '0.6px', textTransform: 'uppercase', lineHeight: 1 }}>
          {label}
        </Typography>
        <Typography sx={{ color: `rgb(${rgb})`, fontSize: '0.78rem', fontWeight: 800, lineHeight: 1.2, whiteSpace: 'nowrap' }}>
          {value.toLocaleString()}
        </Typography>
      </Box>
    </Box>
  </Tooltip>
);

/* ─────────────────────────────────────────────
   Cost calculation helpers
───────────────────────────────────────────── */
const GOLD_POWER11    = 7765;
const GOLD_GADGET     = 1000;
const GOLD_GEAR       = 1000;
const GOLD_STARPOWER  = 2000;
const GOLD_HYPERCHARGE = 5000;
const GOLD_BUFFY      = 1000;

const PP_POWER11 = 3740;
const PP_BUFFY   = 2000;

function computeTotals(brawlers, hypercharges, buffiesMap, currentGold, currentPP) {
  let gold = parseInt(currentGold) || 0;
  let pp   = parseInt(currentPP)   || 0;

  for (const b of brawlers) {
    if (b.power >= 11) {
      gold += GOLD_POWER11;
      pp   += PP_POWER11;
    }
    gold += (b.gadgets?.length    || 0) * GOLD_GADGET;
    gold += (b.starPowers?.length || 0) * GOLD_STARPOWER;
    gold += (b.gears?.length      || 0) * GOLD_GEAR;

    if (hypercharges[b.id]) gold += GOLD_HYPERCHARGE;

    const buffy = buffiesMap[b.id] || {};
    const buffyCount = (buffy.hyper ? 1 : 0) + (buffy.gadget ? 1 : 0) + (buffy.starPower ? 1 : 0);
    gold += buffyCount * GOLD_BUFFY;
    pp   += buffyCount * PP_BUFFY;
  }

  return { gold, pp };
}

/* ─────────────────────────────────────────────
   AppBar
───────────────────────────────────────────── */
const TOOLBAR_NATURAL_WIDTH = 1060;
const TOOLBAR_HEIGHT = 56;

const ScalingAppBar = ({
  nameColor, player, searchInput, setSearchInput, columns, setColumns, selectSx,
  statInputs, onStatInputChange, totalGold, totalPP,
}) => {
  const outerRef = useRef(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const update = () => {
      if (outerRef.current) {
        const available = outerRef.current.offsetWidth;
        setScale(Math.min(1, available / TOOLBAR_NATURAL_WIDTH));
      }
    };
    update();
    const ro = new ResizeObserver(update);
    if (outerRef.current) ro.observe(outerRef.current);
    return () => ro.disconnect();
  }, []);

  return (
    <AppBar position="static" sx={{
      backgroundColor: 'rgba(13,10,26,0.97)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid rgba(139,92,246,0.3)',
      boxShadow: '0 4px 20px rgba(0,0,0,0.35)',
      flexShrink: 0,
    }}>
      <Box ref={outerRef} sx={{ width: '100%', height: TOOLBAR_HEIGHT, overflow: 'hidden', display: 'flex', alignItems: 'center' }}>
        <Box sx={{
          display: 'flex', alignItems: 'center', gap: 1.2,
          px: 2, width: TOOLBAR_NATURAL_WIDTH, flexShrink: 0,
          transformOrigin: 'left center',
          transform: `scale(${scale})`,
        }}>
          {/* Player name + trophies */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexShrink: 0 }}>
            <Typography sx={{ color: nameColor, fontWeight: 800, fontSize: '1rem', textShadow: `0 0 12px ${nameColor}55`, whiteSpace: 'nowrap' }}>
              {player.name}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, px: 1, py: 0.3, borderRadius: '10px', backgroundColor: 'rgba(244,162,97,0.12)', border: '1px solid rgba(244,162,97,0.3)', flexShrink: 0 }}>
              <Trophy size={12} color="#f4a261" fill="#f4a261" />
              <Typography sx={{ color: '#f4a261', fontSize: '0.78rem', fontWeight: 800, whiteSpace: 'nowrap' }}>
                {player.trophies.toLocaleString()}
              </Typography>
            </Box>
          </Box>

          {/* Divider */}
          <Box sx={{ width: '1px', height: 28, backgroundColor: 'rgba(139,92,246,0.2)', flexShrink: 0 }} />

          {/* ── Stat inputs ── */}
          <AppBarStatInput emoji="💰" label="Current Gold"         value={statInputs.gold}  onChange={(v) => onStatInputChange('gold', v)}  rgb="244,162,97" />
          <AppBarStatInput emoji="⚡" label="Current Power Points" value={statInputs.pp}    onChange={(v) => onStatInputChange('pp', v)}    rgb="168,218,220" />
          <AppBarStatInput emoji="💎" label="Gems"                 value={statInputs.gems}  onChange={(v) => onStatInputChange('gems', v)}  rgb="99,202,183" />
          <AppBarStatInput emoji="✨" label="Bling"                value={statInputs.bling} onChange={(v) => onStatInputChange('bling', v)} rgb="192,132,252" />

          {/* Divider */}
          <Box sx={{ width: '1px', height: 28, backgroundColor: 'rgba(139,92,246,0.2)', flexShrink: 0 }} />

          {/* ── Computed total pills ── */}
          <TotalPill emoji="💰" label="Total Gold In Account"         value={totalGold} rgb="244,162,97" />
          <TotalPill emoji="⚡" label="Total Power Points In Account" value={totalPP}   rgb="168,218,220" />

          <Box sx={{ flex: 1 }} />

          {/* Search */}
          <TextField
            placeholder="Search…"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            size="small"
            sx={{
              width: 160, flexShrink: 0,
              '& .MuiOutlinedInput-root': {
                color: '#a8dadc', backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: '8px',
                '& fieldset': { borderColor: 'rgba(139,92,246,0.25)' },
                '&:hover fieldset': { borderColor: '#8b5cf6' },
                '&.Mui-focused fieldset': { borderColor: '#a78bfa' },
              },
              '& .MuiOutlinedInput-input::placeholder': { color: 'rgba(168,218,220,0.5)', opacity: 1 },
            }}
          />

          {/* Column picker */}
          <FormControl size="small" sx={{ width: 80, flexShrink: 0 }}>
            <Select
              value={columns}
              onChange={(e) => setColumns(e.target.value)}
              displayEmpty
              renderValue={(val) => (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.6 }}>
                  <LayoutGrid size={13} color="#a8dadc" />
                  <Typography sx={{ color: '#a8dadc', fontSize: '0.85rem', fontWeight: 600 }}>{val}</Typography>
                </Box>
              )}
              sx={selectSx}
              MenuProps={{
                PaperProps: {
                  sx: {
                    backgroundColor: '#110d2a', border: '1px solid rgba(139,92,246,0.3)', borderRadius: '8px',
                    '& .MuiMenuItem-root': { color: '#a8dadc', fontSize: '0.85rem', '&:hover': { backgroundColor: 'rgba(139,92,246,0.1)' }, '&.Mui-selected': { backgroundColor: 'rgba(139,92,246,0.2)', color: '#a78bfa' } },
                  },
                },
              }}
            >
              {[2,3,4,5,6,7,8].map(n => <MenuItem key={n} value={n}>{n} Columns</MenuItem>)}
            </Select>
          </FormControl>
        </Box>
      </Box>
    </AppBar>
  );
};

/* ─────────────────────────────────────────────
   Main app
───────────────────────────────────────────── */
const GalleryApp = () => {
  const [searchInput, setSearchInput] = useState('');
  const [columns, setColumns] = useState(3);
  const [selectedBrawler, setSelectedBrawler] = useState(null);
  const [playerData, setPlayerData] = useState(defaultPlayer);
  const [uploadStatus, setUploadStatus] = useState(null);
  const [uploadError, setUploadError] = useState('');
  const fileInputRef = useRef(null);

  // Lifted so cost computation can access them
  const [hypercharges, setHypercharges] = useState({});
  const [buffiesMap, setBuffiesMap] = useState({});

  // AppBar stat inputs
  const [statInputs, setStatInputs] = useState({ gold: '', pp: '', gems: '', bling: '' });
  const onStatInputChange = (key, val) => setStatInputs(prev => ({ ...prev, [key]: val }));

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.name.endsWith('.json')) {
      setUploadStatus('error');
      setUploadError('Please upload a .json file.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const parsed = JSON.parse(evt.target.result);
        if (!parsed.brawlers || !parsed.name) {
          setUploadStatus('error');
          setUploadError('Invalid format — missing name or brawlers.');
          return;
        }
        setPlayerData(parsed);
        setHypercharges({});
        setBuffiesMap({});
        setUploadStatus('success');
        setUploadError('');
        setTimeout(() => setUploadStatus(null), 3000);
      } catch {
        setUploadStatus('error');
        setUploadError('Could not parse JSON file.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const player = playerData;
  const nameColor = `#${player.nameColor?.replace('0xff', '') || 'ff9727'}`;

  const filtered = player.brawlers.filter(b =>
    b.name.toLowerCase().includes(searchInput.toLowerCase())
  );

  const { gold: totalGold, pp: totalPP } = computeTotals(
    player.brawlers, hypercharges, buffiesMap, statInputs.gold, statInputs.pp
  );

  const selectSx = {
    color: '#a8dadc', backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: '8px',
    '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(139,92,246,0.25)' },
    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#8b5cf6' },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#a78bfa' },
    '& .MuiSvgIcon-root': { color: '#a8dadc' },
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{
        background: 'linear-gradient(135deg, #0d0b1a 0%, #130d2e 50%, #0a0d24 100%)',
        height: '100vh', width: '100vw',
        display: 'flex', flexDirection: 'column',
        overflow: 'hidden', position: 'fixed', top: 0, left: 0,
      }}>
        <ScalingAppBar
          nameColor={nameColor}
          player={player}
          searchInput={searchInput}
          setSearchInput={setSearchInput}
          columns={columns}
          setColumns={setColumns}
          selectSx={selectSx}
          statInputs={statInputs}
          onStatInputChange={onStatInputChange}
          totalGold={totalGold}
          totalPP={totalPP}
        />

        <Box sx={{
          flex: 1, overflowY: 'auto',
          display: 'flex', justifyContent: 'center',
          py: 3, px: { xs: 1.5, sm: 2 },
          '&::-webkit-scrollbar': { width: '8px' },
          '&::-webkit-scrollbar-track': { background: 'rgba(255,255,255,0.05)' },
          '&::-webkit-scrollbar-thumb': { background: '#6d28d9', borderRadius: '4px', '&:hover': { background: '#8b5cf6' } },
        }}>
          <Box sx={{ width: '100%', maxWidth: '1400px' }}>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
              <input ref={fileInputRef} type="file" accept=".json" style={{ display: 'none' }} onChange={handleFileUpload} />
              <Box onClick={() => fileInputRef.current?.click()} sx={{
                display: 'flex', alignItems: 'center', gap: 1,
                px: 2, py: 1, borderRadius: '10px', cursor: 'pointer',
                background: 'linear-gradient(135deg, rgba(139,92,246,0.15), rgba(99,102,241,0.08))',
                border: '1px solid rgba(139,92,246,0.4)',
                transition: 'all 0.2s',
                '&:hover': { background: 'linear-gradient(135deg, rgba(139,92,246,0.25), rgba(99,102,241,0.15))', borderColor: '#8b5cf6', boxShadow: '0 0 16px rgba(139,92,246,0.25)', transform: 'translateY(-1px)' },
                '&:active': { transform: 'translateY(0)' },
              }}>
                <Upload size={15} color="#8b5cf6" />
                <Typography sx={{ color: '#8b5cf6', fontSize: '0.82rem', fontWeight: 700, whiteSpace: 'nowrap' }}>Load Player JSON</Typography>
              </Box>
              {uploadStatus === 'success' && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.6, px: 1.5, py: 0.6, borderRadius: '8px', backgroundColor: 'rgba(99,202,183,0.12)', border: '1px solid rgba(99,202,183,0.3)' }}>
                  <CheckCircle size={13} color="#63cab7" />
                  <Typography sx={{ color: '#63cab7', fontSize: '0.75rem', fontWeight: 600 }}>Loaded!</Typography>
                </Box>
              )}
              {uploadStatus === 'error' && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.6, px: 1.5, py: 0.6, borderRadius: '8px', backgroundColor: 'rgba(255,107,107,0.12)', border: '1px solid rgba(255,107,107,0.3)' }}>
                  <AlertCircle size={13} color="#ff6b6b" />
                  <Typography sx={{ color: '#ff6b6b', fontSize: '0.75rem', fontWeight: 600 }}>{uploadError}</Typography>
                </Box>
              )}
            </Box>

            <PlayerProfilePanel player={player} />
            <BrawlerOverview
              brawlers={player.brawlers}
              onBrawlerClick={(b) => setSelectedBrawler({ brawler: b })}
              hypercharges={hypercharges}
              setHypercharges={setHypercharges}
              buffiesMap={buffiesMap}
              setBuffiesMap={setBuffiesMap}
            />

            {filtered.length === 0 ? (
              <Box sx={{ width: '100%', textAlign: 'center', mt: 8 }}>
                <Typography sx={{ color: 'rgba(168,218,220,0.4)', fontSize: '1.1rem' }}>No brawlers found for "{searchInput}"</Typography>
              </Box>
            ) : (
              <Box sx={{ display: 'grid', gridTemplateColumns: `repeat(${columns}, 1fr)`, gap: '16px', alignItems: 'stretch' }}>
                {filtered.map((brawler) => (
                  <Box key={brawler.id} sx={{ display: 'flex', minWidth: 0 }}>
                    <MiniCard brawler={brawler} onClick={(b) => setSelectedBrawler({ brawler: b, toggleCtx: null })} />
                  </Box>
                ))}
              </Box>
            )}
          </Box>
        </Box>
      </Box>

      <BrawlerModal
        brawler={selectedBrawler?.brawler || selectedBrawler}
        onClose={() => setSelectedBrawler(null)}
        hasHypercharge={false}
        buffies={{ hyper: false, gadget: false, starPower: false }}
        toggleHypercharge={() => {}}
        toggleBuffy={() => {}}
        showToggles={false}
      />
    </ThemeProvider>
  );
};

export default GalleryApp;