// Predefined clock presets used on the "Preset Selection" screen.
// Each preset includes a label, category, starting time (seconds), and increment (seconds).
const PRESETS = [
  { label: "1+0", type: "Bullet", time: 60, inc: 0 },
  { label: "2+1", type: "Bullet", time: 120, inc: 1 },
  { label: "3+0", type: "Blitz", time: 180, inc: 0 },
  { label: "3+2", type: "Blitz", time: 180, inc: 2 },
  { label: "5+0", type: "Blitz", time: 300, inc: 0 },
  { label: "5+3", type: "Blitz", time: 300, inc: 3 },
  { label: "10+0", type: "Rapid", time: 600, inc: 0 },
  { label: "10+5", type: "Rapid", time: 600, inc: 5 },
  { label: "15+10", type: "Rapid", time: 900, inc: 10 },
  { label: "30+0", type: "Classic", time: 1800, inc: 0 },
  { label: "30+20", type: "Classic", time: 1800, inc: 20 },
];

export default PRESETS;
