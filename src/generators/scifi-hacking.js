/* Sci-fi / cyberpunk / netrunner – hacking skill names */
(function (root) {
  'use strict';

  // ───────────── EDIT ME: the building blocks ─────────────
  const DATA = {
    verb: [
      'Spoof', 'Sniff', 'Crack', 'Ghost', 'Splice', 'Burn', 'Fork', 'Leech', 'Mask', 'Hollow',
      'Rewire', 'Siphon', 'Hijack', 'Scrub', 'Tunnel', 'Poison', 'Flood', 'Sever', 'Graft', 'Mirror',
    ],
    noun: [
      'Handshake', 'Packet', 'Firewall', 'Kernel', 'Cipher', 'Proxy', 'Subnet', 'Backdoor', 'Root', 'Token',
      'Exploit', 'Payload', 'Trace', 'ICE', 'Buffer', 'Sector', 'Signal', 'Port', 'Daemon', 'Socket',
      'Checksum', 'Cache', 'Uplink', 'Protocol', 'Sandbox', 'Router',
    ],
    adjective: [
      'Silent', 'Black', 'Ghost', 'Cold', 'Dead', 'Phantom', 'Null', 'Zero', 'Hollow', 'Static',
      'Recursive', 'Blind', 'Ablative', 'Shadow', 'Feral', 'Quiet', 'Hot', 'Rogue',
    ],
    // "Cipher Storm", "Daemon Bloom" …
    effect: [
      'Storm', 'Bloom', 'Breach', 'Crawl', 'Loop', 'Wipe', 'Cascade', 'Surge', 'Bleed', 'Spike',
      'Drift', 'Lock', 'Fall', 'Rot', 'Pulse',
    ],
    // Fake file endings for ".exe"-style skill names
    ext: ['exe', 'sys', 'bat', 'dll', 'bin', 'cfg', 'ko', 'sh'],
    // Lower-case words used in file-style names: "ghost_proxy.sys"
    fileword: [
      'ghost', 'proxy', 'root', 'null', 'mirror', 'spoof', 'leech', 'cipher', 'daemon', 'trace',
      'burn', 'splice', 'crack', 'uplink', 'phantom', 'wipe',
    ],
  };

  const PATTERNS = [
    ['{verb} {noun}', 25],
    ['{adjective} {noun}', 22],
    ['{noun} {effect}', 18],
    ['{adjective}-{noun}', 6],
    ['{verb}.{ext}', 5],
    ['{fileword}_{fileword}.{ext}', 6],
    ['Protocol: {adjective}', 4],
    ['{adjective} {noun} {effect}', 8],
    ['{verb} & {verb}', 3],
    ['{noun} {noun}', 3],
  ];
  // ─────────────────────────────────────────────────────────

  root.NameGen.register({
    id: 'scifi-hacking',
    category: 'scifi',
    label: 'Hacking skill names',
    description: 'Programs, exploits and netrunner techniques.',
    generate(ctx) {
      const name = ctx.fill(ctx.weighted(PATTERNS), DATA);
      // Avoid doubles like "Spoof & Spoof" / "Port Port"
      const words = name.split(/[ &._-]+/);
      if (new Set(words.map((w) => w.toLowerCase())).size < words.filter(Boolean).length) {
        return this.generate(ctx);
      }
      return name;
    },
  });
})(typeof globalThis !== 'undefined' ? globalThis : window);
