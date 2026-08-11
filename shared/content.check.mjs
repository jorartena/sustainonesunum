import assert from 'node:assert/strict';
import { deck } from './content.js';

assert.equal(deck.slides.length, 8, 'deck must have exactly 8 slides');

const kinds = deck.slides.map((s) => s.kind);
assert.deepEqual(
  kinds,
  ['cover', 'timeline', 'steps', 'cards', 'cards', 'cards', 'costs', 'why'],
  'slide kinds must match the expected sequence'
);

for (const slide of deck.slides) {
  assert.ok(slide.id, `slide missing id: ${JSON.stringify(slide)}`);
  assert.ok(slide.title, `slide ${slide.id} missing title`);
}

const costs = deck.slides.find((s) => s.id === 'costs');
assert.equal(costs.detailRows.length, 13, 'costs detail must have 13 rows including TOPLAM');
assert.equal(costs.summary.length, 3, 'costs summary must have 3 cards');

const modules = deck.slides.find((s) => s.id === 'modules');
assert.equal(modules.cards.length, 5, 'modules slide must have five cards');
assert.match(modules.title, /^Beş modül/);

console.log('content.js OK: 8 slides, kinds match, costs table intact.');
