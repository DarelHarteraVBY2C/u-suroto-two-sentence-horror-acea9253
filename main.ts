// Two-Sentence Horror — u-suroto-two-sentence-horror-acea9253
//
// The story: a parent dismisses a child's warning about a whispering
// closet and moves her into the parents' bed. The second sentence
// reveals the whispering followed them — and it knows the name of the
// daughter the family buried last spring, so the thing in the room
// knows more about this family than the living child does. The horror
// is implied, never explained: who is whispering, and which daughter
// is really in the bed?
//
// Gate (from competition.yaml): /output/entry.txt must be UTF-8 text
// of 1 to 400 characters, not only whitespace, in exactly two sentences.
// This program validates the text before writing it, and refuses to
// write anything that fails the gate. No network, no dependencies,
// fully deterministic: the same bytes on every run.

import { mkdirSync, writeFileSync } from "node:fs";

const SENTENCE_1 =
  "My daughter said the closet whispered her name at night, so I told her houses settle and moved her into our bed.";
const SENTENCE_2 =
  "Tonight the whispering came from our room — and it called her by the name we gave the daughter we buried last spring.";

const STORY = `${SENTENCE_1} ${SENTENCE_2}`;

const MIN_CHARS = 1;
const MAX_CHARS = 400;

function fail(message: string): never {
  console.error(`[entry] GAGAL: ${message}`);
  process.exit(1);
}

const chars = [...STORY].length;
if (chars < MIN_CHARS || chars > MAX_CHARS) {
  fail(`cerita ${chars} karakter, di luar gate ${MIN_CHARS}-${MAX_CHARS}`);
}
if (STORY.trim().length === 0) {
  fail("cerita kosong / hanya whitespace");
}

const terminators = STORY.match(/[.!?]/g) ?? [];
if (terminators.length !== 2) {
  fail(`cerita punya ${terminators.length} penanda akhir kalimat, harus persis 2`);
}

// Validasi struktur per kalimat: pisah di ". " (spasi setelah titik),
// tiap kalimat harus non-kosong, berakhir dengan titik, dan tidak
// menyembunyikan penanda akhir kalimat lain di tengah (singkatan dsb).
const sentences = STORY.split(". ");
if (sentences.length !== 2) {
  fail(`cerita terpecah jadi ${sentences.length} kalimat, harus persis 2`);
}
for (const [i, sentence] of sentences.entries()) {
  const trimmed = sentence.trim();
  if (trimmed.length === 0) {
    fail(`kalimat ${i + 1} kosong`);
  }
  // split(". ") memakan titik pemisah, jadi kalimat pertama harus
  // sama dengan SENTENCE_1 tanpa titik akhirnya; kalimat kedua utuh.
  const expected = i === 0 ? SENTENCE_1.slice(0, -1) : SENTENCE_2;
  if (trimmed !== expected) {
    fail(`kalimat ${i + 1} tidak sesuai dengan teks yang dirancang`);
  }
  const inner = trimmed.replace(/[.!?]$/, "").match(/[.!?]/g) ?? [];
  if (inner.length > 0) {
    fail(`kalimat ${i + 1} menyembunyikan penanda akhir kalimat di tengah`);
  }
}

// Gate tidak mengizinkan entry hanya whitespace; pastikan tidak ada
// spasi/newline berlebih di awal atau akhir berkas yang ditulis.
if (STORY !== STORY.trim()) {
  fail("cerita punya whitespace di awal/akhir");
}

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });
writeFileSync(`${outDir}/entry.txt`, STORY, "utf8");
console.log(`[entry] OK: ${chars} karakter, 2 kalimat -> ${outDir}/entry.txt`);
