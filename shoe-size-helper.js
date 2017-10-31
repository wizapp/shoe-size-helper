(function() {
  const root = this;
  const previous_ShoeSizeHelper = root.ShoeSizeHelper;

  class ShoeSizeHelper {
    constructor() {
      const shoeSizes = {};
      shoeSizes[ShoeSizeHelper.EU] = this.euShoeSizes();
      shoeSizes[ShoeSizeHelper.US] = this.usShoeSizes();
      shoeSizes[ShoeSizeHelper.UK] = this.ukShoeSizes();
      this.shoeSizes = shoeSizes;

      const shoeSizesPerType = {};
      shoeSizesPerType[ShoeSizeHelper.WOMAN] = this.buildShoeSizePerType(ShoeSizeHelper.WOMAN);
      shoeSizesPerType[ShoeSizeHelper.MAN] = this.buildShoeSizePerType(ShoeSizeHelper.MAN);
      shoeSizesPerType[ShoeSizeHelper.CHILD] = this.buildShoeSizePerType(ShoeSizeHelper.CHILD);
      shoeSizesPerType[ShoeSizeHelper.TEENAGER] = this.buildShoeSizePerType(
        ShoeSizeHelper.TEENAGER
      );

      this.shoeSizesPerType = shoeSizesPerType;
    }

    // https://www.labonnetaille.com/guide-des-tailles/chaussures

    buildShoeSizePerType(measurmentType) {
      // measurmentType: ShoeSizeHelper.MAN, ShoeSizeHelper.WOMAN, ShoeSizeHelper.CHILD, ShoeSizeHelper.TEENAGER
      const finalShoeSizes = {};

      let zone = ShoeSizeHelper.EU;
      if (this.shoeSizes[zone]) {
        const sizes = this.shoeSizes[zone][measurmentType];
        if (sizes) {
          sizes.forEach(size => {
            if (!finalShoeSizes[size.foot]) {
              finalShoeSizes[size.foot] = {};
            }
            finalShoeSizes[size.foot][zone] = size.shoe;
          });
        }
      }

      zone = ShoeSizeHelper.US;
      if (this.shoeSizes[zone]) {
        const sizes = this.shoeSizes[zone][measurmentType];
        if (sizes) {
          sizes.forEach(size => {
            if (!finalShoeSizes[size.foot]) {
              finalShoeSizes[size.foot] = {};
            }
            finalShoeSizes[size.foot][zone] = size.shoe;
          });
        }
      }

      zone = ShoeSizeHelper.US;
      if (this.shoeSizes[zone]) {
        const sizes = this.shoeSizes[zone][measurmentType];
        if (sizes) {
          sizes.forEach(size => {
            if (!finalShoeSizes[size.foot]) {
              finalShoeSizes[size.foot] = {};
            }
            finalShoeSizes[size.foot][zone] = size.shoe;
          });
        }
      }

      const _finalShoeSizes = [];
      Object.keys(finalShoeSizes).forEach(footSize => {
        const finalShoeSize = finalShoeSizes[footSize];
        _finalShoeSizes.push({ foot: parseFloat(footSize), sizes: finalShoeSize });
      });

      const res = _finalShoeSizes.sort((a, b) => {
        if (a.foot < b.foot) {
          return -1;
        }
        if (a.foot > b.foot) {
          return 1;
        }
        return 0;
      });
      // Store shoe size: type (sex), zone, foot size
      return JSON.parse(JSON.stringify(res));
    }
    /**
   *
   * @param {*} shoeSize Requested shoe size in given zone for given genre type
   * @param {*} zone Geographical area: ShoeSizeHelper.EU, ShoeSizeHelper.US or ShoeSizeHelper.US
   * @param {*} type gender type: ShoeSizeHelper.CHILD, ShoeSizeHelper.TEENAGER, ShoeSizeHelper.MAN or ShoeSizeHelper.WOMAN
   * @return {Object} Most accurate found foot size given parameters
   *   Example:
   *      {
   *        foot: 26.6, // centimeter
   *        shoeSize: { // Corresponding shoe size description
   *          size: 41.5,
   *          type: ShoeSizeHelper.MAN,
   *          zone: ShoeSizeHelper.EU
   *        }
   *      }
   */
    searchFootSize(shoeSize, zone, type) {
      const shoeSizes = this.shoeSizesPerType[type]; // Array of shoeSizes
      if (!shoeSizes) {
        console.error(`searchFootSize: Bad type: ${type}`);
        return;
      }
      const zoneFootSizes = shoeSizes
        .filter(_shoeSize => _shoeSize.sizes[zone])
        .map(_shoeSize => ({ foot: _shoeSize.foot, size: _shoeSize.sizes[zone] }));

      // Search more accurante shoe size
      const shoeSizeTolerance = 1.0; // 1 point
      // Filter shoe size for which they are valid for zone and size is not too far !
      const keptShoeSizes = zoneFootSizes.filter(
        _zoneFootSize => Math.abs(_zoneFootSize.size - shoeSize) < shoeSizeTolerance
      );

      // Find nearest footSize for given shoeSize
      // => Sort by difference !
      keptShoeSizes.sort(
        (a, b) => (Math.abs(shoeSize - a.size) < Math.abs(shoeSize - b.size) ? -1 : 1)
      );
      const foundShoeSize = keptShoeSizes[0];
      if (!foundShoeSize) {
        return;
      }
      return {
        foot: foundShoeSize.foot,
        shoeSize: {
          size: foundShoeSize.size,
          type,
          zone,
        },
      };
    }
    /**
   *
   * @param {*} footSize Foot size in centimeters
   * @param {*} zone Geographical area: ShoeSizeHelper.EU, ShoeSizeHelper.US or ShoeSizeHelper.US
   * @param {*} type gender type: ShoeSizeHelper.CHILD, ShoeSizeHelper.TEENAGER, ShoeSizeHelper.MAN or ShoeSizeHelper.WOMAN
   * @return {Object} Size description most accurate for given parameters:
   *  Example:
   *      {
   *        foot: 27.6,
   *        type: "man",
   *        sizes: {
   *          fr: 43,
   *          us: 10,
   *          uk: 9
   *        }
   *      }
   */
    findShoeSize(footSize, zone, type) {
      const shoeSizes = this.shoeSizesPerType[type]; // Array of shoeSizes
      if (!shoeSizes) {
        console.error(`findShoeSize: Bad type: ${type}`);
        return;
      }

      const footSizeTolerance = 1.0; // 2 cm
      // Filter shoe size for which they are valid for zone and size is not too far !
      const keptShoeSizes = shoeSizes.filter(
        shoeSize =>
          shoeSize.sizes[zone] != undefined &&
          Math.abs(footSize - shoeSize.foot) < footSizeTolerance
      );

      // Find nearest shoeSize for given footSize
      // (array is sorted from small to big sizes)
      // => Sort by difference !
      keptShoeSizes.sort(
        (a, b) => (Math.abs(footSize - a.foot) < Math.abs(footSize - b.foot) ? -1 : 1)
      );
      const foundShoeSize = keptShoeSizes[0];
      if (!foundShoeSize) {
        return;
      }
      foundShoeSize.type = type;
      return foundShoeSize;
    }
    getShoeSizes(type, zone) {
      const zoneShoeSizes = this.shoeSizes[zone];
      if (!zoneShoeSizes) {
        console.error(`getShoeSizes(${type}, ${zone}): No shoe Sizes for zone ${zone} !`);
        return;
      }
      const shoeSizes = zoneShoeSizes[type];
      if (!shoeSizes) {
        console.error(`getShoeSizes(${type}, ${zone}): No shoe Sizes for gender type ${type} !`);
        return;
      }
      return shoeSizes;
    }
    // Conversion foot size + type (sex)
    euShoeSizes() {
      const womanSizes = [
        { foot: 22.3, shoe: 35 },
        { foot: 23, shoe: 36 },
        { foot: 23.5, shoe: 36.5 },
        { foot: 23.6, shoe: 37 },
        { foot: 24.1, shoe: 37.5 },
        { foot: 24.3, shoe: 38 },
        { foot: 24.9, shoe: 38.5 },
        { foot: 25, shoe: 39 },
        { foot: 25.4, shoe: 39.5 },
        { foot: 25.6, shoe: 40 },
        { foot: 26.2, shoe: 40.5 },
        { foot: 26.3, shoe: 41 },
      ];

      const manSizes = [
        { foot: 25, shoe: 39 },
        { foot: 25.4, shoe: 39.5 },
        { foot: 25.6, shoe: 40 },
        { foot: 26.2, shoe: 40.5 },
        { foot: 26.3, shoe: 41 },
        { foot: 26.6, shoe: 41.5 },
        { foot: 27, shoe: 42 },
        { foot: 27.5, shoe: 42.5 },
        { foot: 27.6, shoe: 43 },
        { foot: 27.9, shoe: 43.5 },
        { foot: 28.3, shoe: 44 },
        { foot: 28.8, shoe: 44.5 },
        { foot: 29, shoe: 45 },
        { foot: 29.2, shoe: 45.5 },
        { foot: 29.6, shoe: 46 },
        { foot: 30.2, shoe: 47 },
        { foot: 30.9, shoe: 48 },
      ];

      const childSizes = [
        { foot: 10.3, shoe: 17 },
        { foot: 11, shoe: 18 },
        { foot: 11.6, shoe: 19 },
        { foot: 12.3, shoe: 20 },
        { foot: 13, shoe: 21 },
        { foot: 13.6, shoe: 22 },
        { foot: 14.3, shoe: 23 },
        { foot: 15, shoe: 24 },
        { foot: 15.6, shoe: 25 },
        { foot: 16.3, shoe: 26 },
        { foot: 17, shoe: 27 },
        { foot: 17.7, shoe: 28 },
        { foot: 18.3, shoe: 29 },
        { foot: 19, shoe: 30 },
        { foot: 19.6, shoe: 31 },
        { foot: 20.3, shoe: 32 },
        { foot: 21, shoe: 33 },
        { foot: 21.6, shoe: 34 },
      ];

      const teenageSizes = [
        { foot: 22.3, shoe: 35 },
        { foot: 23, shoe: 36 },
        { foot: 23.5, shoe: 36.5 },
        { foot: 23.6, shoe: 37 },
        { foot: 24.1, shoe: 37.5 },
        { foot: 24.3, shoe: 38 },
        { foot: 24.9, shoe: 38.5 },
        { foot: 25, shoe: 39 },
      ];

      return {
        woman: womanSizes,
        man: manSizes,
        child: childSizes,
        teenager: teenageSizes,
      };
    }
    usShoeSizes() {
      const womanSizes = [
        { foot: 22.3, shoe: 3.5 },
        { foot: 23, shoe: 4.5 },
        { foot: 23.5, shoe: 5 },
        { foot: 23.6, shoe: 5.5 },
        { foot: 24.1, shoe: 6 },
        { foot: 24.3, shoe: 6.5 },
        { foot: 24.9, shoe: 7 },
        { foot: 25, shoe: 7.5 },
        { foot: 25.6, shoe: 8 },
        { foot: 26.3, shoe: 8.5 },
      ];
      const manSizes = [
        { foot: 25, shoe: 7 },
        { foot: 25.6, shoe: 7.5 },
        { foot: 26.3, shoe: 8 },
        { foot: 26.6, shoe: 8.5 },
        { foot: 27, shoe: 9 },
        { foot: 27.5, shoe: 9.5 },
        { foot: 27.6, shoe: 10 },
        { foot: 28.3, shoe: 10.5 },
        { foot: 29, shoe: 11 },
        { foot: 29.6, shoe: 12 },
        { foot: 30.9, shoe: 13 },
      ];
      const childSizes = [
        { foot: 11, shoe: 3.5 },
        { foot: 11.6, shoe: 4.5 },
        { foot: 12.3, shoe: 5.5 },
        { foot: 13, shoe: 6.5 },
        { foot: 13.6, shoe: 7 },
        { foot: 14.3, shoe: 7.5 },
        { foot: 15, shoe: 8.5 },
        { foot: 15.6, shoe: 9 },
        { foot: 16.3, shoe: 9.5 },
        { foot: 17, shoe: 10.5 },
        { foot: 17.7, shoe: 11.5 },
        { foot: 18.3, shoe: 12 },
        { foot: 19, shoe: 13 },
        { foot: 19.6, shoe: 13.5 },
        { foot: 20.3, shoe: 1.5 },
        { foot: 21, shoe: 2 },
        { foot: 21.6, shoe: 3 },
      ];

      const teenageSizes = [
        { foot: 22.3, shoe: 3.5 },
        { foot: 23, shoe: 4.5 },
        { foot: 23.6, shoe: 5 },
        { foot: 24.1, shoe: 5.5 },
        { foot: 24.3, shoe: 6 },
        { foot: 24.9, shoe: 6.5 },
        { foot: 25, shoe: 7 },
      ];

      return {
        woman: womanSizes,
        man: manSizes,
        child: childSizes,
        teenager: teenageSizes,
      };
    }

    ukShoeSizes() {
      const womanSizes = [
        { foot: 22.3, shoe: 2 },
        { foot: 23, shoe: 3 },
        { foot: 23.5, shoe: 3.5 },
        { foot: 23.6, shoe: 4 },
        { foot: 24.1, shoe: 4.5 },
        { foot: 24.3, shoe: 5 },
        { foot: 24.9, shoe: 5.5 },
        { foot: 25, shoe: 6 },
        { foot: 25.6, shoe: 6.5 },
        { foot: 26.3, shoe: 7 },
      ];

      const manSizes = [
        { foot: 25, shoe: 6 },
        { foot: 25.6, shoe: 6.5 },
        { foot: 26.3, shoe: 7 },
        { foot: 26.6, shoe: 7.5 },
        { foot: 27, shoe: 8 },
        { foot: 27.5, shoe: 8.5 },
        { foot: 27.6, shoe: 9 },
        { foot: 28.3, shoe: 9.5 },
        { foot: 29, shoe: 10 },
        { foot: 29.6, shoe: 11 },
        { foot: 30.2, shoe: 12 },
      ];

      const childSizes = [
        { foot: 11, shoe: 2 },
        { foot: 11.6, shoe: 3 },
        { foot: 12.3, shoe: 4 },
        { foot: 13, shoe: 5 },
        { foot: 13.6, shoe: 5.5 },
        { foot: 14.3, shoe: 6 },
        { foot: 15, shoe: 7 },
        { foot: 15.6, shoe: 7.5 },
        { foot: 16.3, shoe: 8 },
        { foot: 17, shoe: 9 },
        { foot: 17.7, shoe: 10 },
        { foot: 18.3, shoe: 10.5 },
        { foot: 19, shoe: 11.5 },
        { foot: 19.6, shoe: 12 },
        { foot: 20.3, shoe: 13 },
        { foot: 21, shoe: 13.5 },
        { foot: 21.6, shoe: 1.5 },
      ];

      const teenageSizes = [
        { foot: 22.3, shoe: 2 },
        { foot: 23, shoe: 3 },
        { foot: 23.6, shoe: 3.5 },
        { foot: 24.1, shoe: 4 },
        { foot: 24.3, shoe: 4.5 },
        { foot: 24.9, shoe: 5 },
        { foot: 25, shoe: 5.5 },
      ];

      return {
        woman: womanSizes,
        man: manSizes,
        child: childSizes,
        teenager: teenageSizes,
      };
    }
  }

  ShoeSizeHelper.WOMAN = 'woman';
  ShoeSizeHelper.MAN = 'man';
  ShoeSizeHelper.CHILD = 'child';
  ShoeSizeHelper.TEENAGER = 'teenager';
  ShoeSizeHelper.EU = 'eu';
  ShoeSizeHelper.US = 'us';
  ShoeSizeHelper.UK = 'uk';
  ShoeSizeHelper.shared = new ShoeSizeHelper();

  const shoesizehelper = ShoeSizeHelper;
  shoesizehelper.noConflict = function() {
    root.ShoeSizeHelper = previous_ShoeSizeHelper;
    return shoesizehelper;
  };

  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = shoesizehelper;
    }
    exports.ShoeSizeHelper = shoesizehelper;
  } else {
    root.ShoeSizeHelper = shoesizehelper;
  }
}.call(this));
