/** Convert TON raw (`0:hex`) or bounceable addresses to EQ/UQ user-friendly form. */

const CRC_TABLE = (() => {
  const table = new Uint16Array(256);
  for (let i = 0; i < 256; i++) {
    let crc = i << 8;
    for (let j = 0; j < 8; j++) crc = crc & 0x8000 ? ((crc << 1) ^ 0x1021) & 0xffff : (crc << 1) & 0xffff;
    table[i] = crc;
  }
  return table;
})();

function crc16(data: Uint8Array) {
  let crc = 0;
  for (const b of data) crc = ((crc << 8) ^ CRC_TABLE[((crc >> 8) ^ b) & 0xff]) & 0xffff;
  return crc;
}

function b64url(bytes: Uint8Array) {
  let bin = "";
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

export const FRIENDLY_TON_RE = /^(EQ|UQ)[A-Za-z0-9_-]{46}$/;
const RAW_TON_RE = /^(-?\d+):([0-9a-fA-F]{64})$/;

export function toFriendlyTonAddress(input: string, bounceable = false): string {
  const trimmed = input.trim();
  if (FRIENDLY_TON_RE.test(trimmed)) return trimmed;
  const m = trimmed.match(RAW_TON_RE);
  if (!m) return trimmed;
  const wc = Number(m[1]);
  const hash = new Uint8Array(32);
  for (let i = 0; i < 32; i++) hash[i] = parseInt(m[2].slice(i * 2, i * 2 + 2), 16);
  const buf = new Uint8Array(34);
  buf[0] = bounceable ? 0x11 : 0x51;
  buf[1] = wc < 0 ? (256 + (wc % 256)) & 0xff : wc & 0xff;
  buf.set(hash, 2);
  const crc = crc16(buf);
  const full = new Uint8Array(36);
  full.set(buf);
  full[34] = (crc >> 8) & 0xff;
  full[35] = crc & 0xff;
  return b64url(full);
}
