const LOWERCASE = {
  A: '-a',
  B: '-b',
  C: '-c',
  D: '-d',
  E: '-e',
  F: '-f',
  G: '-g',
  H: '-h',
  I: '-i',
  J: '-j',
  K: '-k',
  L: '-l',
  M: '-m',
  N: '-n',
  O: '-o',
  P: '-p',
  Q: '-q',
  R: '-r',
  S: '-s',
  T: '-t',
  U: '-u',
  V: '-v',
  W: '-w',
  X: '-x',
  Y: '-y',
  Z: '-z',
};

const REGS = Object.keys(LOWERCASE).map(key => ({
  reg: new RegExp(key, 'g'),
  replace: LOWERCASE[key],
}));

export function LowerCase(styles) {
  const newStyles = {};

  Object.keys(styles).forEach((key) => {
    let newKey = key;

    REGS.forEach((reg) => {
      newKey = newKey.replace(reg.reg, reg.replace);
    });

    newStyles[newKey] = styles[key];
  });

  return newStyles;
}
