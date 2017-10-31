const ShoeSizeHelper = require('../shoe-size-helper.js');

shoeSizeHelper = ShoeSizeHelper.shared;

const sizeToSearchFor = 27.56;
const foundShoeSize = shoeSizeHelper.findShoeSize(
  sizeToSearchFor,
  ShoeSizeHelper.EU,
  ShoeSizeHelper.MAN
);

console.log(`For size ${sizeToSearchFor} => FOUND : ${JSON.stringify(foundShoeSize)}`);

const shoeSizeToSearchFor = 41.3;
const footSize = shoeSizeHelper.searchFootSize(
  shoeSizeToSearchFor,
  ShoeSizeHelper.EU,
  ShoeSizeHelper.MAN
);

console.log(
  `For shoe size ${shoeSizeToSearchFor} => FOUND foot size : ${JSON.stringify(footSize)}`
);

const footSize2 = shoeSizeHelper.searchFootSize(
  foundShoeSize.sizes[ShoeSizeHelper.EU],
  ShoeSizeHelper.EU,
  ShoeSizeHelper.MAN
);
console.log(
  `For shoe size ${foundShoeSize.sizes[ShoeSizeHelper.EU]} => FOUND foot size : ${JSON.stringify(
    footSize2
  )}`
);

console.log(
  `shoeSizes for man / eu: ${JSON.stringify(
    shoeSizeHelper.getShoeSizes(ShoeSizeHelper.MAN, ShoeSizeHelper.EU)
  )}`
);
console.log(
  `shoeSizes for woman / eu: ${JSON.stringify(
    shoeSizeHelper.getShoeSizes(ShoeSizeHelper.WOMAN, ShoeSizeHelper.EU)
  )}`
);

console.log(
  `shoeSizes for man / us: ${JSON.stringify(
    shoeSizeHelper.getShoeSizes(ShoeSizeHelper.MAN, ShoeSizeHelper.US)
  )}`
);
console.log(
  `shoeSizes for woman / us: ${JSON.stringify(
    shoeSizeHelper.getShoeSizes(ShoeSizeHelper.WOMAN, ShoeSizeHelper.US)
  )}`
);

console.log(`ShoeSizeHelper.WOMAN = ${ShoeSizeHelper.WOMAN}`);
