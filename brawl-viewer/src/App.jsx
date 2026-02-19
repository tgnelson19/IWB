import React, { useState, useRef, useEffect } from 'react';
import player from './IWantCrow.json';
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
import { Trophy, Zap, Star, Flame, TrendingUp, Shield, Cpu, LayoutGrid, X } from 'lucide-react';

const theme = createTheme({
  palette: {
    primary: { main: '#1a1a2e' },
    secondary: { main: '#16213e' },
    background: { default: '#0f3460', paper: '#16213e' },
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

/* ─────────────────────────────────────────────
   Player profile panel
───────────────────────────────────────────── */
const StatPill = ({ emoji, label, value, color, glowColor }) => (
  <Tooltip title={label}>
    <Box sx={{
      display: 'flex', alignItems: 'center', gap: 1,
      px: 2, py: 1, borderRadius: '14px',
      background: `rgba(${glowColor}, 0.08)`,
      border: `1px solid rgba(${glowColor}, 0.22)`,
      cursor: 'default', transition: 'all 0.2s', flex: '1 1 120px', minWidth: 0,
      '&:hover': { borderColor: `rgba(${glowColor}, 0.55)`, boxShadow: `0 0 14px rgba(${glowColor}, 0.18)` },
    }}>
      <Typography sx={{ fontSize: '1.1rem', lineHeight: 1 }}>{emoji}</Typography>
      <Box sx={{ minWidth: 0 }}>
        <Typography sx={{ color: 'rgba(168,218,220,0.5)', fontSize: '0.58rem', fontWeight: 700, letterSpacing: '0.8px', textTransform: 'uppercase', lineHeight: 1 }}>
          {label}
        </Typography>
        <Typography sx={{ color, fontSize: '0.95rem', fontWeight: 800, lineHeight: 1.3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {value}
        </Typography>
      </Box>
    </Box>
  </Tooltip>
);

const PlayerProfilePanel = () => {
  const nameColor = `#${player.nameColor?.replace('0xff', '') || 'ff9727'}`;
  const totalWins = player['3vs3Victories'] + player.soloVictories + player.duoVictories;

  return (
    <Box sx={{
      mb: 3, borderRadius: '16px', overflow: 'hidden',
      border: '1px solid rgba(244,162,97,0.2)',
      background: 'linear-gradient(135deg, rgba(17,29,46,0.98) 0%, rgba(10,24,40,0.98) 100%)',
      boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
    }}>
      <Box sx={{
        display: 'flex', alignItems: 'center', gap: 2.5,
        px: 3, py: 2,
        background: 'linear-gradient(90deg, rgba(231,111,81,0.12) 0%, rgba(244,162,97,0.06) 50%, transparent 100%)',
        borderBottom: '1px solid rgba(244,162,97,0.12)',
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
            backgroundColor: '#e76f51', borderRadius: '8px',
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
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.08)',
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
          <StatPill emoji="🤖" label="Robo Rumble" value={`${player.bestRoboRumbleTime}m`}          color="#ff9f43" glowColor="255,159,67" />
          <StatPill emoji="💪" label="Big Brawler" value={player.bestTimeAsBigBrawler > 0 ? `${player.bestTimeAsBigBrawler}m` : 'N/A'} color="#c0c0c0" glowColor="192,192,192" />
        </Box>
      </Box>
    </Box>
  );
};

/* ─────────────────────────────────────────────
   Simplified mini card (grid view)
───────────────────────────────────────────── */
const MiniCard = ({ brawler, onClick }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const imageUrl = `https://cdn.brawlify.com/brawlers/borderless/${brawler.id}.png`;

  return (
    <Box
      onClick={() => onClick(brawler)}
      sx={{
        backgroundColor: '#111d2e',
        border: '1px solid rgba(231,111,81,0.18)',
        borderRadius: '14px', overflow: 'hidden',
        cursor: 'pointer', display: 'flex', flexDirection: 'column',
        width: '100%', height: '100%',
        transition: 'all 0.25s cubic-bezier(0.34,1.56,0.64,1)',
        '&:hover': {
          transform: 'translateY(-5px) scale(1.02)',
          borderColor: '#e76f51',
          boxShadow: '0 16px 36px rgba(231,111,81,0.25)',
        },
      }}
    >
      {/* Name bar */}
      <Box sx={{
        px: 1.5, py: 1,
        background: 'linear-gradient(90deg, rgba(22,33,62,0.95), rgba(26,42,62,0.95))',
        borderBottom: '1px solid rgba(231,111,81,0.1)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <Typography sx={{
          color: '#e2e8f0', fontSize: 'clamp(0.72rem, 1.8vw, 1rem)', fontWeight: 700,
          letterSpacing: '0.8px', textTransform: 'uppercase',
          overflowWrap: 'break-word', wordBreak: 'break-word',
          lineHeight: 1.2,
        }}>
          {brawler.name}
        </Typography>
        {/* Power badge */}
        <Avatar sx={{ width: 28, height: 28, backgroundColor: '#e76f51', fontSize: '0.78rem', fontWeight: 800, color: '#fff', flexShrink: 0, ml: 0.5 }}>
          {String(brawler.power).padStart(2, '0')}
        </Avatar>
      </Box>

      {/* Image */}
      <Box sx={{ position: 'relative', paddingBottom: '80%', backgroundColor: '#0a1828', overflow: 'hidden', flex: 1 }}>
        {!imageLoaded && (
          <Skeleton variant="rectangular" sx={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(255,255,255,0.05)' }} />
        )}
        <CardMedia
          component="img"
          image={imageUrl}
          alt={brawler.name}
          onLoad={() => setImageLoaded(true)}
          sx={{
            position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
            objectFit: 'contain',
          }}
        />
      </Box>

      {/* Trophy footer */}
      <Box sx={{
        px: 1.5, py: 0.8,
        background: 'rgba(22,33,62,0.8)',
        borderTop: '1px solid rgba(231,111,81,0.08)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.6,
      }}>
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
const BrawlerModal = ({ brawler, onClose }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  if (!brawler) return null;

  const imageUrl = `https://cdn.brawlify.com/brawlers/borderless/${brawler.id}.png`;
  const rankColor = brawler.rank >= 35 ? '#ff6b6b' : brawler.rank >= 25 ? '#ffd700' : brawler.rank >= 15 ? '#c0c0c0' : '#cd7f32';

  return (
    /* Backdrop */
    <Box
      onClick={onClose}
      sx={{
        position: 'fixed', inset: 0, zIndex: 2000,
        backgroundColor: 'rgba(5,10,20,0.82)',
        backdropFilter: 'blur(6px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        p: { xs: 1.5, sm: 3 },
        animation: 'fadeIn 0.18s ease',
        '@keyframes fadeIn': { from: { opacity: 0 }, to: { opacity: 1 } },
      }}
    >
      {/* Modal card — stop propagation so clicking inside doesn't close */}
      <Box
        onClick={(e) => e.stopPropagation()}
        sx={{
          width: '100%', maxWidth: 480,
          maxHeight: '92vh', overflowY: 'auto',
          backgroundColor: '#0d1c2e',
          border: '1px solid rgba(231,111,81,0.35)',
          borderRadius: '18px',
          boxShadow: '0 32px 80px rgba(0,0,0,0.7), 0 0 60px rgba(231,111,81,0.08)',
          display: 'flex', flexDirection: 'column',
          animation: 'slideUp 0.22s cubic-bezier(0.34,1.56,0.64,1)',
          '@keyframes slideUp': { from: { opacity: 0, transform: 'translateY(30px) scale(0.96)' }, to: { opacity: 1, transform: 'translateY(0) scale(1)' } },
          '&::-webkit-scrollbar': { width: '5px' },
          '&::-webkit-scrollbar-thumb': { background: '#e76f51', borderRadius: '4px' },
        }}
      >
        {/* Modal header */}
        <Box sx={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          px: 2.5, py: 1.8,
          background: 'linear-gradient(90deg, rgba(231,111,81,0.15), rgba(244,162,97,0.06))',
          borderBottom: '1px solid rgba(231,111,81,0.15)',
          flexShrink: 0,
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Typography sx={{ color: '#e2e8f0', fontSize: '1.15rem', fontWeight: 800, letterSpacing: '1.5px', textTransform: 'uppercase' }}>
              {brawler.name}
            </Typography>
            <Tooltip title={`Rank ${brawler.rank}`}>
              <Box sx={{
                width: 30, height: 30, borderRadius: '50%',
                background: `radial-gradient(circle, ${rankColor}33, ${rankColor}11)`,
                border: `2px solid ${rankColor}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.72rem', fontWeight: 800, color: rankColor,
              }}>{brawler.rank}</Box>
            </Tooltip>
            <Avatar sx={{ width: 30, height: 30, backgroundColor: '#e76f51', fontSize: '0.78rem', fontWeight: 800 }}>
              {String(brawler.power).padStart(2, '0')}
            </Avatar>
          </Box>
          <Box
            onClick={onClose}
            sx={{
              width: 32, height: 32, borderRadius: '50%', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              backgroundColor: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.12)',
              transition: 'all 0.15s',
              '&:hover': { backgroundColor: 'rgba(231,111,81,0.2)', borderColor: '#e76f51' },
            }}
          >
            <X size={16} color="#a8dadc" />
          </Box>
        </Box>

        {/* Brawler image — larger */}
        <Box sx={{
          position: 'relative', paddingBottom: '62%',
          backgroundColor: '#071020', overflow: 'hidden', flexShrink: 0,
          background: 'radial-gradient(ellipse at center, #0f2040 0%, #050d18 100%)',
        }}>
          {!imageLoaded && (
            <Skeleton variant="rectangular" sx={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(255,255,255,0.04)' }} />
          )}
          <CardMedia
            component="img"
            image={imageUrl}
            alt={brawler.name}
            onLoad={() => setImageLoaded(true)}
            sx={{
              position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
              objectFit: 'contain',
              filter: 'drop-shadow(0 8px 24px rgba(231,111,81,0.3))',
            }}
          />
        </Box>

        {/* Stats */}
        <Box sx={{ px: 2.5, pt: 2, pb: 1.5, borderBottom: '1px solid rgba(231,111,81,0.08)' }}>
          <StatRow icon={Trophy}     iconColor="#f4a261" label="Trophies"    value={brawler.trophies.toLocaleString()}        valueColor="#f4a261" />
          <StatRow icon={TrendingUp} iconColor="#ffd700" label="Highest"     value={brawler.highestTrophies.toLocaleString()} valueColor="#ffd700" />
          <StatRow icon={Shield}     iconColor={rankColor} label="Rank"      value={brawler.rank}                              valueColor={rankColor} />
          <StatRow icon={Flame}      iconColor="#ff6b6b" label="Win Streak"  value={brawler.currentWinStreak}                  valueColor={brawler.currentWinStreak > 0 ? '#ff6b6b' : '#a8dadc'} />
          <StatRow icon={Star}       iconColor="#63cab7" label="Best Streak" value={brawler.maxWinStreak}                      valueColor="#63cab7" />
        </Box>

        {/* Upgrades */}
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
            <Typography sx={{ color: 'rgba(168,218,220,0.3)', fontSize: '0.78rem', fontStyle: 'italic', textAlign: 'center', mt: 1 }}>
              No upgrades unlocked
            </Typography>
          )}
        </Box>
      </Box>
    </Box>
  );
};

/* ─────────────────────────────────────────────
   AppBar that scales its content to always fit
───────────────────────────────────────────── */
const TOOLBAR_NATURAL_WIDTH = 580; // px — natural width at full size
const TOOLBAR_HEIGHT = 56;

const ScalingAppBar = ({ nameColor, searchInput, setSearchInput, columns, setColumns, selectSx }) => {
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
      backgroundColor: 'rgba(15,52,96,0.97)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid rgba(231,111,81,0.2)',
      boxShadow: '0 4px 20px rgba(0,0,0,0.35)',
      flexShrink: 0,
    }}>
      {/* Outer shell — full width, fixed height, clips overflow */}
      <Box
        ref={outerRef}
        sx={{
          width: '100%',
          height: TOOLBAR_HEIGHT,
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        {/* Inner content — natural width, scaled down to fit */}
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          px: 3,
          width: TOOLBAR_NATURAL_WIDTH,
          flexShrink: 0,
          transformOrigin: 'left center',
          transform: `scale(${scale})`,
        }}>
          {/* Player name + trophies */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexShrink: 0 }}>
            <Typography sx={{
              color: nameColor, fontWeight: 800, fontSize: '1rem',
              textShadow: `0 0 12px ${nameColor}55`,
              whiteSpace: 'nowrap',
            }}>
              {player.name}
            </Typography>
            <Box sx={{
              display: 'flex', alignItems: 'center', gap: 0.5,
              px: 1, py: 0.3, borderRadius: '10px',
              backgroundColor: 'rgba(244,162,97,0.12)',
              border: '1px solid rgba(244,162,97,0.3)',
              flexShrink: 0,
            }}>
              <Trophy size={12} color="#f4a261" fill="#f4a261" />
              <Typography sx={{ color: '#f4a261', fontSize: '0.78rem', fontWeight: 800, whiteSpace: 'nowrap' }}>
                {player.trophies.toLocaleString()}
              </Typography>
            </Box>
          </Box>

          {/* Spacer */}
          <Box sx={{ flex: 1 }} />

          {/* Search */}
          <TextField
            placeholder="Search…"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            size="small"
            sx={{
              width: 200, flexShrink: 0,
              '& .MuiOutlinedInput-root': {
                color: '#a8dadc', backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: '8px',
                '& fieldset': { borderColor: 'rgba(231,111,81,0.3)' },
                '&:hover fieldset': { borderColor: '#e76f51' },
                '&.Mui-focused fieldset': { borderColor: '#f4a261' },
              },
              '& .MuiOutlinedInput-input::placeholder': { color: 'rgba(168,218,220,0.5)', opacity: 1 },
            }}
          />

          {/* Column selector — shows just the number in trigger, full label in dropdown */}
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
                    backgroundColor: '#1a2a3e', border: '1px solid rgba(231,111,81,0.3)', borderRadius: '8px',
                    '& .MuiMenuItem-root': {
                      color: '#a8dadc', fontSize: '0.85rem',
                      '&:hover': { backgroundColor: 'rgba(231,111,81,0.1)' },
                      '&.Mui-selected': { backgroundColor: 'rgba(231,111,81,0.2)', color: '#f4a261' },
                    },
                  },
                },
              }}
            >
              <MenuItem value={2}>2 Columns</MenuItem>
              <MenuItem value={3}>3 Columns</MenuItem>
              <MenuItem value={4}>4 Columns</MenuItem>
              <MenuItem value={5}>5 Columns</MenuItem>
              <MenuItem value={6}>6 Columns</MenuItem>
              <MenuItem value={7}>7 Columns</MenuItem>
              <MenuItem value={8}>8 Columns</MenuItem>
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

  const nameColor = `#${player.nameColor?.replace('0xff', '') || 'ff9727'}`;

  const filtered = player.brawlers.filter(b =>
    b.name.toLowerCase().includes(searchInput.toLowerCase())
  );

  const selectSx = {
    color: '#a8dadc',
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: '8px',
    '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(231,111,81,0.3)' },
    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#e76f51' },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#f4a261' },
    '& .MuiSvgIcon-root': { color: '#a8dadc' },
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{
        background: 'linear-gradient(135deg, #0f3460 0%, #16213e 100%)',
        height: '100vh', width: '100vw',
        display: 'flex', flexDirection: 'column',
        overflow: 'hidden', position: 'fixed', top: 0, left: 0,
      }}>

        {/* ── Compact AppBar — scales inner content to always fit ── */}
        <ScalingAppBar
          nameColor={nameColor}
          searchInput={searchInput}
          setSearchInput={setSearchInput}
          columns={columns}
          setColumns={setColumns}
          selectSx={selectSx}
        />

        {/* ── Scrollable content ── */}
        <Box sx={{
          flex: 1, overflowY: 'auto',
          display: 'flex', justifyContent: 'center',
          py: 3, px: { xs: 1.5, sm: 2 },
          '&::-webkit-scrollbar': { width: '8px' },
          '&::-webkit-scrollbar-track': { background: 'rgba(255,255,255,0.05)' },
          '&::-webkit-scrollbar-thumb': { background: '#e76f51', borderRadius: '4px', '&:hover': { background: '#f4a261' } },
        }}>
          <Box sx={{ width: '100%', maxWidth: '1400px' }}>
            <PlayerProfilePanel />

            {filtered.length === 0 ? (
              <Box sx={{ width: '100%', textAlign: 'center', mt: 8 }}>
                <Typography sx={{ color: 'rgba(168,218,220,0.4)', fontSize: '1.1rem' }}>
                  No brawlers found for "{searchInput}"
                </Typography>
              </Box>
            ) : (
              <Box sx={{
                display: 'grid',
                gridTemplateColumns: `repeat(${columns}, 1fr)`,
                gap: '16px',
                alignItems: 'stretch',
              }}>
                {filtered.map((brawler) => (
                  <Box key={brawler.id} sx={{ display: 'flex', minWidth: 0 }}>
                    <MiniCard brawler={brawler} onClick={setSelectedBrawler} />
                  </Box>
                ))}
              </Box>
            )}
          </Box>
        </Box>
      </Box>

      {/* ── Brawler detail modal ── */}
      <BrawlerModal brawler={selectedBrawler} onClose={() => setSelectedBrawler(null)} />
    </ThemeProvider>
  );
};

export default GalleryApp;