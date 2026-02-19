import React, { useState } from 'react';
import player from './IWantCrow.json';
import './index.css';

import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  Skeleton,
  ThemeProvider,
  createTheme,
  AppBar,
  Toolbar,
  TextField,
  Button,
  Avatar,
  Tooltip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import { Trophy, Zap, Star, Flame, TrendingUp, Shield, Cpu, LayoutGrid } from 'lucide-react';

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

// Color configs for different tag types
const TAG_STYLES = {
  gear: { bg: 'rgba(99, 202, 183, 0.15)', border: 'rgba(99, 202, 183, 0.4)', color: '#63cab7', Icon: Cpu },
  starPower: { bg: 'rgba(255, 215, 0, 0.12)', border: 'rgba(255, 215, 0, 0.4)', color: '#ffd700', Icon: Star },
  gadget: { bg: 'rgba(231, 111, 81, 0.15)', border: 'rgba(231, 111, 81, 0.4)', color: '#e76f51', Icon: Zap },
};

const TagPill = ({ label, type }) => {
  const style = TAG_STYLES[type];
  const Icon = style.Icon;
  return (
    <Box
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 0.5,
        px: 1,
        py: 0.3,
        borderRadius: '20px',
        border: `1px solid ${style.border}`,
        backgroundColor: style.bg,
        fontSize: '0.68rem',
        color: style.color,
        fontWeight: 600,
        letterSpacing: '0.5px',
        textTransform: 'uppercase',
        whiteSpace: 'nowrap',
      }}
    >
      <Icon size={10} />
      {label}
    </Box>
  );
};

const StatRow = ({ icon: Icon, iconColor, label, value, valueColor }) => (
  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 0.25 }}>
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.7 }}>
      <Icon size={13} color={iconColor} />
      <Typography sx={{ color: 'rgba(168, 218, 220, 0.7)', fontSize: '0.72rem', fontWeight: 500 }}>
        {label}
      </Typography>
    </Box>
    <Typography sx={{ color: valueColor || '#a8dadc', fontSize: '0.78rem', fontWeight: 700 }}>
      {value}
    </Typography>
  </Box>
);

const BrawlerCard = ({ brawler }) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  const imageUrl = `https://cdn.brawlify.com/brawlers/borderless/${brawler.id}.png`;

  // Rank badge color
  const rankColor = brawler.rank >= 35 ? '#ff6b6b' : brawler.rank >= 25 ? '#ffd700' : brawler.rank >= 15 ? '#c0c0c0' : '#cd7f32';

  return (
    <Card
      sx={{
        backgroundColor: '#111d2e',
        border: '1px solid rgba(231, 111, 81, 0.18)',
        borderRadius: '14px',
        overflow: 'hidden',
        transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: '100%',
        '&:hover': {
          transform: 'translateY(-6px)',
          borderColor: '#e76f51',
          boxShadow: '0 20px 40px rgba(231, 111, 81, 0.2)',
        },
      }}
    >
      {/* Header: name + power */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          px: 2,
          py: 1.2,
          background: 'linear-gradient(90deg, rgba(22,33,62,0.9) 0%, rgba(26,42,62,0.9) 100%)',
          borderBottom: '1px solid rgba(231, 111, 81, 0.1)',
        }}
      >
        <Typography sx={{ color: '#e2e8f0', fontSize: '0.85rem', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase' }}>
          {brawler.name}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {/* Rank badge */}
          <Tooltip title={`Rank ${brawler.rank}`}>
            <Box sx={{
              width: 26, height: 26, borderRadius: '50%',
              background: `radial-gradient(circle, ${rankColor}33, ${rankColor}11)`,
              border: `1.5px solid ${rankColor}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '0.65rem', fontWeight: 800, color: rankColor,
            }}>
              {brawler.rank}
            </Box>
          </Tooltip>
          {/* Power level */}
          <Avatar sx={{ width: 26, height: 26, backgroundColor: '#e76f51', fontSize: '0.72rem', fontWeight: 800, color: '#fff' }}>
            {String(brawler.power).padStart(2, '0')}
          </Avatar>
        </Box>
      </Box>

      {/* Image */}
      <Box sx={{ position: 'relative', paddingBottom: '70%', backgroundColor: '#0a1828', overflow: 'hidden' }}>
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
            transition: 'transform 0.4s ease',
            '&:hover': { transform: 'scale(1.06)' },
          }}
        />
      </Box>

      {/* Stats Section */}
      <Box sx={{ px: 2, pt: 1.5, pb: 0.5, borderBottom: '1px solid rgba(231,111,81,0.08)' }}>
        <StatRow
          icon={Trophy} iconColor="#f4a261"
          label="Trophies"
          value={brawler.trophies.toLocaleString()}
          valueColor="#f4a261"
        />
        <StatRow
          icon={TrendingUp} iconColor="#ffd700"
          label="Highest"
          value={brawler.highestTrophies.toLocaleString()}
          valueColor="#ffd700"
        />
        <StatRow
          icon={Shield} iconColor={brawler.rank >= 35 ? '#ff6b6b' : brawler.rank >= 25 ? '#ffd700' : brawler.rank >= 15 ? '#c0c0c0' : '#cd7f32'}
          label="Rank"
          value={brawler.rank}
          valueColor={brawler.rank >= 35 ? '#ff6b6b' : brawler.rank >= 25 ? '#ffd700' : brawler.rank >= 15 ? '#c0c0c0' : '#cd7f32'}
        />
        <StatRow
          icon={Flame} iconColor="#ff6b6b"
          label="Win Streak"
          value={brawler.currentWinStreak}
          valueColor={brawler.currentWinStreak > 0 ? '#ff6b6b' : '#a8dadc'}
        />
        <StatRow
          icon={Star} iconColor="#63cab7"
          label="Best Streak"
          value={brawler.maxWinStreak}
          valueColor="#63cab7"
        />
      </Box>

      {/* Unlocks Section */}
      <Box sx={{ px: 2, pt: 1, pb: 1.5, flex: 1 }}>
        {/* Gears */}
        {brawler.gears && brawler.gears.length > 0 && (
          <Box sx={{ mb: 1 }}>
            <Typography sx={{ color: 'rgba(99,202,183,0.5)', fontSize: '0.6rem', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', mb: 0.5 }}>
              Gears
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {brawler.gears.map(g => (
                <TagPill key={g.id} label={`${g.name} Lv${g.level}`} type="gear" />
              ))}
            </Box>
          </Box>
        )}

        {/* Star Powers */}
        {brawler.starPowers && brawler.starPowers.length > 0 && (
          <Box sx={{ mb: 1 }}>
            <Typography sx={{ color: 'rgba(255,215,0,0.5)', fontSize: '0.6rem', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', mb: 0.5 }}>
              Star Powers
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {brawler.starPowers.map(sp => (
                <TagPill key={sp.id} label={sp.name} type="starPower" />
              ))}
            </Box>
          </Box>
        )}

        {/* Gadgets */}
        {brawler.gadgets && brawler.gadgets.length > 0 && (
          <Box>
            <Typography sx={{ color: 'rgba(231,111,81,0.5)', fontSize: '0.6rem', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', mb: 0.5 }}>
              Gadgets
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {brawler.gadgets.map(gd => (
                <TagPill key={gd.id} label={gd.name} type="gadget" />
              ))}
            </Box>
          </Box>
        )}

        {/* Empty state if nothing unlocked */}
        {(!brawler.gears?.length && !brawler.starPowers?.length && !brawler.gadgets?.length) && (
          <Typography sx={{ color: 'rgba(168,218,220,0.3)', fontSize: '0.7rem', fontStyle: 'italic', textAlign: 'center', mt: 1 }}>
            No upgrades unlocked
          </Typography>
        )}
      </Box>
    </Card>
  );
};

const GalleryApp = () => {
  const [searchInput, setSearchInput] = useState('');
  const [debugGuy, setDebugGuy] = useState(10);
  const [columns, setColumns] = useState(3);

  const brawlers = player.brawlers;

  const filtered = brawlers.filter(b =>
    b.name.toLowerCase().includes(searchInput.toLowerCase())
  );


  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          background: 'linear-gradient(135deg, #0f3460 0%, #16213e 100%)',
          height: '100vh',
          width: '100vw',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          position: 'fixed',
          top: 0,
          left: 0,
        }}
      >
        {/* AppBar */}
        <AppBar
          position="static"
          sx={{
            backgroundColor: 'rgba(15, 52, 96, 0.95)',
            backdropFilter: 'blur(10px)',
            borderBottom: '1px solid rgba(231, 111, 81, 0.2)',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
            top: 0,
            zIndex: 1000,
          }}
        >
          <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 3, py: 1, minHeight: 'unset !important', gap: 3 }}>

            {/* LEFT: Player identity */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexShrink: 0 }}>
              {/* Avatar with exp ring */}
              <Box sx={{ position: 'relative', flexShrink: 0 }}>
                <Box sx={{
                  width: 52, height: 52, borderRadius: '50%',
                  background: 'conic-gradient(#f4a261 0%, #e76f51 60%, rgba(255,255,255,0.1) 60%)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 0 16px rgba(244,162,97,0.4)',
                }}>
                  <Box sx={{
                    width: 44, height: 44, borderRadius: '50%',
                    background: 'linear-gradient(135deg, #1a2a3e, #0f1e2e)',
                    border: '2px solid rgba(244,162,97,0.3)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '1.2rem',
                  }}>
                    🦸
                  </Box>
                </Box>
                {/* Exp level badge */}
                <Box sx={{
                  position: 'absolute', bottom: -4, right: -4,
                  backgroundColor: '#e76f51', borderRadius: '8px',
                  px: 0.6, py: 0.1, fontSize: '0.6rem', fontWeight: 800,
                  color: '#fff', border: '1.5px solid rgba(15,52,96,0.8)',
                  lineHeight: 1.4,
                }}>
                  {player.expLevel}
                </Box>
              </Box>

              {/* Name + tag + club */}
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography sx={{
                    color: `#${player.nameColor?.replace('0xff', '') || 'ff9727'}`,
                    fontWeight: 800, fontSize: '1.1rem', letterSpacing: '0.5px',
                    textShadow: `0 0 12px #${player.nameColor?.replace('0xff', '') || 'ff9727'}66`,
                  }}>
                    {player.name}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.2 }}>
                  <Typography sx={{ color: 'rgba(168,218,220,0.5)', fontSize: '0.68rem', fontFamily: 'monospace' }}>
                    {player.tag}
                  </Typography>
                  {player.club?.name && (
                    <Box sx={{
                      display: 'flex', alignItems: 'center', gap: 0.4,
                      px: 0.8, py: 0.15, borderRadius: '10px',
                      backgroundColor: 'rgba(99,202,183,0.12)',
                      border: '1px solid rgba(99,202,183,0.3)',
                    }}>
                      <Typography sx={{ fontSize: '0.6rem' }}>🛡️</Typography>
                      <Typography sx={{ color: '#63cab7', fontSize: '0.65rem', fontWeight: 700 }}>
                        {player.club.name}
                      </Typography>
                    </Box>
                  )}
                </Box>
              </Box>
            </Box>

            {/* CENTER: Stat pills */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flex: 1, justifyContent: 'center', flexWrap: 'wrap' }}>
              {/* Trophies */}
              <Tooltip title="Current Trophies">
                <Box sx={{
                  display: 'flex', alignItems: 'center', gap: 0.8,
                  px: 1.5, py: 0.6, borderRadius: '12px',
                  background: 'linear-gradient(135deg, rgba(244,162,97,0.15), rgba(231,111,81,0.08))',
                  border: '1px solid rgba(244,162,97,0.3)',
                  cursor: 'default',
                  transition: 'all 0.2s',
                  '&:hover': { borderColor: '#f4a261', boxShadow: '0 0 12px rgba(244,162,97,0.2)' },
                }}>
                  <Trophy size={14} color="#f4a261" fill="#f4a261" />
                  <Box>
                    <Typography sx={{ color: 'rgba(168,218,220,0.5)', fontSize: '0.55rem', fontWeight: 600, letterSpacing: '0.8px', textTransform: 'uppercase', lineHeight: 1 }}>Trophies</Typography>
                    <Typography sx={{ color: '#f4a261', fontSize: '0.85rem', fontWeight: 800, lineHeight: 1.2 }}>{player.trophies.toLocaleString()}</Typography>
                  </Box>
                </Box>
              </Tooltip>

              {/* Best Trophies */}
              <Tooltip title="All-Time Highest Trophies">
                <Box sx={{
                  display: 'flex', alignItems: 'center', gap: 0.8,
                  px: 1.5, py: 0.6, borderRadius: '12px',
                  background: 'linear-gradient(135deg, rgba(255,215,0,0.12), rgba(255,215,0,0.04))',
                  border: '1px solid rgba(255,215,0,0.25)',
                  cursor: 'default',
                  transition: 'all 0.2s',
                  '&:hover': { borderColor: '#ffd700', boxShadow: '0 0 12px rgba(255,215,0,0.2)' },
                }}>
                  <Star size={14} color="#ffd700" fill="#ffd700" />
                  <Box>
                    <Typography sx={{ color: 'rgba(168,218,220,0.5)', fontSize: '0.55rem', fontWeight: 600, letterSpacing: '0.8px', textTransform: 'uppercase', lineHeight: 1 }}>Best</Typography>
                    <Typography sx={{ color: '#ffd700', fontSize: '0.85rem', fontWeight: 800, lineHeight: 1.2 }}>{player.highestTrophies.toLocaleString()}</Typography>
                  </Box>
                </Box>
              </Tooltip>

              {/* Divider line */}
              <Box sx={{ width: '1px', height: 32, backgroundColor: 'rgba(255,255,255,0.08)' }} />

              {/* 3v3 Wins */}
              <Tooltip title="3vs3 Victories">
                <Box sx={{
                  display: 'flex', alignItems: 'center', gap: 0.8,
                  px: 1.5, py: 0.6, borderRadius: '12px',
                  background: 'rgba(99,202,183,0.08)',
                  border: '1px solid rgba(99,202,183,0.2)',
                  cursor: 'default',
                  transition: 'all 0.2s',
                  '&:hover': { borderColor: '#63cab7', boxShadow: '0 0 12px rgba(99,202,183,0.15)' },
                }}>
                  <Typography sx={{ fontSize: '0.85rem' }}>⚔️</Typography>
                  <Box>
                    <Typography sx={{ color: 'rgba(168,218,220,0.5)', fontSize: '0.55rem', fontWeight: 600, letterSpacing: '0.8px', textTransform: 'uppercase', lineHeight: 1 }}>3v3 Wins</Typography>
                    <Typography sx={{ color: '#63cab7', fontSize: '0.85rem', fontWeight: 800, lineHeight: 1.2 }}>{player['3vs3Victories'].toLocaleString()}</Typography>
                  </Box>
                </Box>
              </Tooltip>

              {/* Solo Wins */}
              <Tooltip title="Solo Showdown Victories">
                <Box sx={{
                  display: 'flex', alignItems: 'center', gap: 0.8,
                  px: 1.5, py: 0.6, borderRadius: '12px',
                  background: 'rgba(231,111,81,0.08)',
                  border: '1px solid rgba(231,111,81,0.2)',
                  cursor: 'default',
                  transition: 'all 0.2s',
                  '&:hover': { borderColor: '#e76f51', boxShadow: '0 0 12px rgba(231,111,81,0.15)' },
                }}>
                  <Typography sx={{ fontSize: '0.85rem' }}>👑</Typography>
                  <Box>
                    <Typography sx={{ color: 'rgba(168,218,220,0.5)', fontSize: '0.55rem', fontWeight: 600, letterSpacing: '0.8px', textTransform: 'uppercase', lineHeight: 1 }}>Solo Wins</Typography>
                    <Typography sx={{ color: '#e76f51', fontSize: '0.85rem', fontWeight: 800, lineHeight: 1.2 }}>{player.soloVictories.toLocaleString()}</Typography>
                  </Box>
                </Box>
              </Tooltip>

              {/* Duo Wins */}
              <Tooltip title="Duo Showdown Victories">
                <Box sx={{
                  display: 'flex', alignItems: 'center', gap: 0.8,
                  px: 1.5, py: 0.6, borderRadius: '12px',
                  background: 'rgba(168,99,202,0.08)',
                  border: '1px solid rgba(168,99,202,0.2)',
                  cursor: 'default',
                  transition: 'all 0.2s',
                  '&:hover': { borderColor: '#a863ca', boxShadow: '0 0 12px rgba(168,99,202,0.15)' },
                }}>
                  <Typography sx={{ fontSize: '0.85rem' }}>🤝</Typography>
                  <Box>
                    <Typography sx={{ color: 'rgba(168,218,220,0.5)', fontSize: '0.55rem', fontWeight: 600, letterSpacing: '0.8px', textTransform: 'uppercase', lineHeight: 1 }}>Duo Wins</Typography>
                    <Typography sx={{ color: '#a863ca', fontSize: '0.85rem', fontWeight: 800, lineHeight: 1.2 }}>{player.duoVictories.toLocaleString()}</Typography>
                  </Box>
                </Box>
              </Tooltip>

              {/* Exp bar */}
              <Tooltip title={`${player.expPoints.toLocaleString()} XP — Level ${player.expLevel}`}>
                <Box sx={{
                  display: 'flex', flexDirection: 'column', justifyContent: 'center',
                  px: 1.5, py: 0.6, borderRadius: '12px',
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  minWidth: 90, cursor: 'default',
                  transition: 'all 0.2s',
                  '&:hover': { borderColor: 'rgba(255,255,255,0.2)' },
                }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.4 }}>
                    <Typography sx={{ color: 'rgba(168,218,220,0.5)', fontSize: '0.55rem', fontWeight: 600, letterSpacing: '0.8px', textTransform: 'uppercase' }}>EXP</Typography>
                    <Typography sx={{ color: 'rgba(168,218,220,0.7)', fontSize: '0.55rem', fontWeight: 700 }}>Lv {player.expLevel}</Typography>
                  </Box>
                  <Box sx={{ height: 4, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.08)', overflow: 'hidden' }}>
                    <Box sx={{
                      height: '100%', borderRadius: 2,
                      width: `${Math.min(100, (player.expPoints % 10000) / 100)}%`,
                      background: 'linear-gradient(90deg, #63cab7, #a8dadc)',
                      boxShadow: '0 0 8px rgba(99,202,183,0.6)',
                    }} />
                  </Box>
                  <Typography sx={{ color: '#a8dadc', fontSize: '0.6rem', fontWeight: 700, mt: 0.3 }}>
                    {player.expPoints.toLocaleString()} XP
                  </Typography>
                </Box>
              </Tooltip>
            </Box>

            {/* RIGHT: Controls */}
            <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center', flexShrink: 0 }}>
              <TextField
                placeholder="Search brawlers..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                size="small"
                sx={{
                  width: '200px',
                  '& .MuiOutlinedInput-root': {
                    color: '#a8dadc',
                    backgroundColor: 'rgba(255, 255, 255, 0.08)',
                    borderRadius: '8px',
                    '& fieldset': { borderColor: 'rgba(231, 111, 81, 0.3)' },
                    '&:hover fieldset': { borderColor: '#e76f51' },
                    '&.Mui-focused fieldset': { borderColor: '#f4a261' },
                  },
                  '& .MuiOutlinedInput-input::placeholder': { color: 'rgba(168, 218, 220, 0.5)', opacity: 1 },
                }}
              />

              {/* Column selector */}
              <FormControl size="small" sx={{ minWidth: 130 }}>
                <Select
                  value={columns}
                  onChange={(e) => setColumns(e.target.value)}
                  displayEmpty
                  startAdornment={<LayoutGrid size={14} color="#a8dadc" style={{ marginRight: 6 }} />}
                  sx={{
                    color: '#a8dadc',
                    backgroundColor: 'rgba(255, 255, 255, 0.08)',
                    borderRadius: '8px',
                    '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(231, 111, 81, 0.3)' },
                    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#e76f51' },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#f4a261' },
                    '& .MuiSvgIcon-root': { color: '#a8dadc' },
                  }}
                  MenuProps={{
                    PaperProps: {
                      sx: {
                        backgroundColor: '#1a2a3e',
                        border: '1px solid rgba(231,111,81,0.3)',
                        borderRadius: '8px',
                        '& .MuiMenuItem-root': {
                          color: '#a8dadc',
                          fontSize: '0.85rem',
                          '&:hover': { backgroundColor: 'rgba(231,111,81,0.1)' },
                          '&.Mui-selected': { backgroundColor: 'rgba(231,111,81,0.2)', color: '#f4a261' },
                        },
                      },
                    },
                  }}
                >
                  <MenuItem value={2}>2 Columns</MenuItem>
                  <MenuItem value={3}>3 Columns</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Toolbar>
        </AppBar>

        {/* Gallery */}
        <Box
          sx={{
            flex: 1,
            overflowY: 'auto',
            display: 'flex',
            justifyContent: 'center',
            py: 4,
            px: 2,
            '&::-webkit-scrollbar': { width: '8px' },
            '&::-webkit-scrollbar-track': { background: 'rgba(255,255,255,0.05)' },
            '&::-webkit-scrollbar-thumb': { background: '#e76f51', borderRadius: '4px', '&:hover': { background: '#f4a261' } },
          }}
        >
          <Box sx={{ width: '100%', maxWidth: '1400px' }}>
            {filtered.length === 0 ? (
              <Box sx={{ width: '100%', textAlign: 'center', mt: 8 }}>
                <Typography sx={{ color: 'rgba(168,218,220,0.4)', fontSize: '1.1rem' }}>
                  No brawlers found for "{searchInput}"
                </Typography>
              </Box>
            ) : (
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: `repeat(${columns}, 1fr)`,
                  gap: '20px',
                  alignItems: 'stretch',
                }}
              >
                {filtered.map((brawler) => (
                  <Box key={brawler.id} sx={{ display: 'flex', minWidth: 0 }}>
                    <BrawlerCard brawler={brawler} />
                  </Box>
                ))}
              </Box>
            )}
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default GalleryApp;