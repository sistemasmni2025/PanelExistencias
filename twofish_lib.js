/*globals exports*/

(function twofish(exports) {
  'use strict';

  var RNG = function RNG(seed) {

      this.m = 0x80000000; // 2**31;
      this.a = 1103515245;
      this.c = 12345;

      this.state = seed ? seed : Math.floor(Math.random() * (this.m - 1));
    }
  , functionUtils = function functionUtils() {

      var isAnArray = function isAnArray(someVar) {

          if (Array.isArray(someVar) ||
              Object.prototype.toString.call( someVar ) === '[object Uint8Array]') {

            return true;
          }
          return false;
        }
        , areEqual = function areEqual(first, second) {

          var firstLength = first.length
            , secondLength = second.length
            , diffLength
            , arraysEqualLenghtIndex = 0;

          if (firstLength > secondLength) {

            diffLength = firstLength - secondLength;
            for (; diffLength >= 0; diffLength -= 1) {

              if (first[firstLength - diffLength]) {

                return false;
              }
            }
          } else if (secondLength > firstLength) {

            diffLength = secondLength - firstLength;
            for (; diffLength >= 0; diffLength -= 1) {

              if (second[secondLength - diffLength]) {

                return false;
              }
            }
          }

          for (; arraysEqualLenghtIndex < firstLength; arraysEqualLenghtIndex += 1) {

            if (first[arraysEqualLenghtIndex] !== second[arraysEqualLenghtIndex]) {

              return false;
            }
          }
          return true;
        }
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Base64_encoding_and_decoding
        , UTF8ArrToStr = function UTF8ArrToStr(aBytes) {

          var sView = ''
            , nPart
            , nLen = aBytes.length
            , nIdx = 0;
          for (; nIdx < nLen; nIdx += 1) {

            nPart = aBytes[nIdx];
            /*eslint-disable no-plusplus, no-nested-ternary, no-bitwise*/
            sView += String.fromCharCode(
              nPart > 251 && nPart < 254 && nIdx + 5 < nLen ? /* six bytes */
                /* (nPart - 252 << 32) is not possible in ECMAScript! So...: */
                (nPart - 252) * 1073741824 + (aBytes[++nIdx] - 128 << 24) + (aBytes[++nIdx] - 128 << 18) + (aBytes[++nIdx] - 128 << 12) + (aBytes[++nIdx] - 128 << 6) + aBytes[++nIdx] - 128
              : nPart > 247 && nPart < 252 && nIdx + 4 < nLen ? /* five bytes */
                (nPart - 248 << 24) + (aBytes[++nIdx] - 128 << 18) + (aBytes[++nIdx] - 128 << 12) + (aBytes[++nIdx] - 128 << 6) + aBytes[++nIdx] - 128
              : nPart > 239 && nPart < 248 && nIdx + 3 < nLen ? /* four bytes */
                (nPart - 240 << 18) + (aBytes[++nIdx] - 128 << 12) + (aBytes[++nIdx] - 128 << 6) + aBytes[++nIdx] - 128
              : nPart > 223 && nPart < 240 && nIdx + 2 < nLen ? /* three bytes */
                (nPart - 224 << 12) + (aBytes[++nIdx] - 128 << 6) + aBytes[++nIdx] - 128
              : nPart > 191 && nPart < 224 && nIdx + 1 < nLen ? /* two bytes */
                (nPart - 192 << 6) + aBytes[++nIdx] - 128
              : /* nPart < 127 ? */ /* one byte */
                nPart
            );
            /*eslint-enable no-plusplus, no-nested-ternary, no-bitwise*/
          }

          return sView;
        }
        , strToUTF8Arr = function strToUTF8Arr(sDOMStr) {

          var aBytes
            , nChr
            , nStrLen = sDOMStr.length
            , nArrLen = 0
            , nMapIdx = 0
            , nIdx = 0
            , nChrIdx = 0
            , paddingValue
            , paddingIndex;

          /* mapping... */
          for (; nMapIdx < nStrLen; nMapIdx += 1) {

            nChr = sDOMStr.charCodeAt(nMapIdx);
            /*eslint-disable no-nested-ternary*/
            nArrLen += nChr < 0x80 ? 1 : nChr < 0x800 ? 2 : nChr < 0x10000 ? 3 : nChr < 0x200000 ? 4 : nChr < 0x4000000 ? 5 : 6;
            /*eslint-enable no-nested-ternary*/
          }

          aBytes = [];

          /* transcription... */
          for (; nIdx < nArrLen; nChrIdx += 1) {

            nChr = sDOMStr.charCodeAt(nChrIdx);
            /*eslint-disable no-plusplus, no-bitwise*/
            if (nChr < 128) {

              /* one byte */
              aBytes[nIdx++] = nChr;
            } else if (nChr < 0x800) {

              /* two bytes */
              aBytes[nIdx++] = 192 + (nChr >>> 6);
              aBytes[nIdx++] = 128 + (nChr & 63);
            } else if (nChr < 0x10000) {

              /* three bytes */
              aBytes[nIdx++] = 224 + (nChr >>> 12);
              aBytes[nIdx++] = 128 + (nChr >>> 6 & 63);
              aBytes[nIdx++] = 128 + (nChr & 63);
            } else if (nChr < 0x200000) {

              /* four bytes */
              aBytes[nIdx++] = 240 + (nChr >>> 18);
              aBytes[nIdx++] = 128 + (nChr >>> 12 & 63);
              aBytes[nIdx++] = 128 + (nChr >>> 6 & 63);
              aBytes[nIdx++] = 128 + (nChr & 63);
            } else if (nChr < 0x4000000) {

              /* five bytes */
              aBytes[nIdx++] = 248 + (nChr >>> 24);
              aBytes[nIdx++] = 128 + (nChr >>> 18 & 63);
              aBytes[nIdx++] = 128 + (nChr >>> 12 & 63);
              aBytes[nIdx++] = 128 + (nChr >>> 6 & 63);
              aBytes[nIdx++] = 128 + (nChr & 63);
            } else {

              /* six bytes */
              aBytes[nIdx++] = 252 + nChr / 1073741824;
              aBytes[nIdx++] = 128 + (nChr >>> 24 & 63);
              aBytes[nIdx++] = 128 + (nChr >>> 18 & 63);
              aBytes[nIdx++] = 128 + (nChr >>> 12 & 63);
              aBytes[nIdx++] = 128 + (nChr >>> 6 & 63);
              aBytes[nIdx++] = 128 + (nChr & 63);
            }
            /*eslint-enable no-plusplus, no-bitwise*/
          }

          paddingValue = aBytes.length % 16;
          if (paddingValue !== 0) {

            for (paddingIndex = 0; paddingIndex < 16 - paddingValue; paddingIndex += 1) {

              aBytes.push(0);
            }
          }
          return aBytes;
        };

      return {
        'isAnArray': isAnArray,
        'areEqual': areEqual,
        'UTF8ArrToStr': UTF8ArrToStr,
        'strToUTF8Arr': strToUTF8Arr
      };
    };

  RNG.prototype.nextInt = function nextInt() {

    this.state = (this.a * this.state + this.c) % this.m;
    return this.state;
  };

  RNG.prototype.nextFloat = function nextFloat() {

    // returns in range [0,1]
    return this.nextInt() / (this.m - 1);
  };

  RNG.prototype.nextRange = function nextRange(start, end) {

    // returns in range [start, end): including start, excluding end
    // can't modulo nextInt because of weak randomness in lower bits
    var rangeSize = end - start
      , randomUnder1 = this.nextInt() / this.m;
    return start + Math.floor(randomUnder1 * rangeSize);
  };

  RNG.prototype.choice = function choice(array) {

    return array[this.nextRange(0, array.length)];
  };

  /* eslint-disable no-shadow */
  exports.twofish = function twofish(IV) {
  /* eslint-enable no-shadow */

    /* eslint-disable no-bitwise*/
    var utils = functionUtils()
      , rng = new RNG()
      , initializingVector = []
      // S-boxes
      , P0 = new Uint8Array([
        0xA9, 0x67, 0xB3, 0xE8,
        0x04, 0xFD, 0xA3, 0x76,
        0x9A, 0x92, 0x80, 0x78,
        0xE4, 0xDD, 0xD1, 0x38,
        0x0D, 0xC6, 0x35, 0x98,
        0x18, 0xF7, 0xEC, 0x6C,
        0x43, 0x75, 0x37, 0x26,
        0xFA, 0x13, 0x94, 0x48,
        0xF2, 0xD0, 0x8B, 0x30,
        0x84, 0x54, 0xDF, 0x23,
        0x19, 0x5B, 0x3D, 0x59,
        0xF3, 0xAE, 0xA2, 0x82,
        0x63, 0x01, 0x83, 0x2E,
        0xD9, 0x51, 0x9B, 0x7C,
        0xA6, 0xEB, 0xA5, 0xBE,
        0x16, 0x0C, 0xE3, 0x61,
        0xC0, 0x8C, 0x3A, 0xF5,
        0x73, 0x2C, 0x25, 0x0B,
        0xBB, 0x4E, 0x89, 0x6B,
        0x53, 0x6A, 0xB4, 0xF1,
        0xE1, 0xE6, 0xBD, 0x45,
        0xE2, 0xF4, 0xB6, 0x66,
        0xCC, 0x95, 0x03, 0x56,
        0xD4, 0x1C, 0x1E, 0xD7,
        0xFB, 0xC3, 0x8E, 0xB5,
        0xE9, 0xCF, 0xBF, 0xBA,
        0xEA, 0x77, 0x39, 0xAF,
        0x33, 0xC9, 0x62, 0x71,
        0x81, 0x79, 0x09, 0xAD,
        0x24, 0xCD, 0xF9, 0xD8,
        0xE5, 0xC5, 0xB9, 0x4D,
        0x44, 0x08, 0x86, 0xE7,
        0xA1, 0x1D, 0xAA, 0xED,
        0x06, 0x70, 0xB2, 0xD2,
        0x41, 0x7B, 0xA0, 0x11,
        0x31, 0xC2, 0x27, 0x90,
        0x20, 0xF6, 0x60, 0xFF,
        0x96, 0x5C, 0xB1, 0xAB,
        0x9E, 0x9C, 0x52, 0x1B,
        0x5F, 0x93, 0x0A, 0xEF,
        0x91, 0x85, 0x49, 0xEE,
        0x2D, 0x4F, 0x8F, 0x3B,
        0x47, 0x87, 0x6D, 0x46,
        0xD6, 0x3E, 0x69, 0x64,
        0x2A, 0xCE, 0xCB, 0x2F,
        0xFC, 0x97, 0x05, 0x7A,
        0xAC, 0x7F, 0xD5, 0x1A,
        0x4B, 0x0E, 0xA7, 0x5A,
        0x28, 0x14, 0x3F, 0x29,
        0x88, 0x3C, 0x4C, 0x02,
        0xB8, 0xDA, 0xB0, 0x17,
        0x55, 0x1F, 0x8A, 0x7D,
        0x57, 0xC7, 0x8D, 0x74,
        0xB7, 0xC4, 0x9F, 0x72,
        0x7E, 0x15, 0x22, 0x12,
        0x58, 0x07, 0x99, 0x34,
        0x6E, 0x50, 0xDE, 0x68,
        0x65, 0xBC, 0xDB, 0xF8,
        0xC8, 0xAE, 0xAD, 0x0F,
        0x64, 0x63, 0xF6, 0x9D,
        0x38, 0xBF, 0x0B, 0x3B,
        0x1B, 0x54, 0x27, 0x64,
        0x52, 0x0A, 0x56, 0xB6,
        0xA3, 0x29, 0xC3, 0xB1,
        0x9C, 0x21, 0x0E, 0x51,
        0xA1, 0x2F, 0x07, 0x4E,
        0x01, 0xF2, 0x21, 0x1B,
        0xC1, 0x1F, 0x09, 0x3B,
        0x06, 0x01, 0x40, 0x00,
        0x7E, 0xA1, 0x22, 0xDC,
        0x76, 0x4C, 0xD0, 0x02,
        0xF1, 0xB3, 0x10, 0x00,
        0x76, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00
      ])
      , P1 = new Uint8Array([
        0xA9, 0x67, 0xB3, 0xE8,
        0x04, 0xFD, 0xA3, 0x76,
        0x9A, 0x92, 0x80, 0x78,
        0xE4, 0xDD, 0xD1, 0x38,
        0x0D, 0xC6, 0x35, 0x98,
        0x18, 0xF7, 0xEC, 0x6C,
        0x43, 0x75, 0x37, 0x26,
        0xFA, 0x13, 0x94, 0x48,
        0xF2, 0xD0, 0x8B, 0x30,
        0x84, 0x54, 0xDF, 0x23,
        0x19, 0x5B, 0x3D, 0x59,
        0xF3, 0xAE, 0xA2, 0x82,
        0x63, 0x01, 0x83, 0x2E,
        0xD9, 0x51, 0x9B, 0x7C,
        0xA6, 0xEB, 0xA5, 0xBE,
        0x16, 0x0C, 0xE3, 0x61,
        0xC0, 0x8C, 0x3A, 0xF5,
        0x73, 0x2C, 0x25, 0x0B,
        0xBB, 0x4E, 0x89, 0x6B,
        0x53, 0x6A, 0xB4, 0xF1,
        0xE1, 0xE6, 0xBD, 0x45,
        0xE2, 0xF4, 0xB6, 0x66,
        0xCC, 0x95, 0x03, 0x56,
        0xD4, 0x1C, 0x1E, 0xD7,
        0xFB, 0xC3, 0x8E, 0xB5,
        0xE9, 0xCF, 0xBF, 0xBA,
        0xEA, 0x77, 0x39, 0xAF,
        0x33, 0xC9, 0x62, 0x71,
        0x81, 0x79, 0x09, 0xAD,
        0x24, 0xCD, 0xF9, 0xD8,
        0xE5, 0xC5, 0xB9, 0x4D,
        0x44, 0x08, 0x86, 0xE7,
        0xA1, 0x1D, 0xAA, 0xED,
        0x06, 0x70, 0xB2, 0xD2,
        0x41, 0x7B, 0xA0, 0x11,
        0x31, 0xC2, 0x27, 0x90,
        0x20, 0xF6, 0x60, 0xFF,
        0x96, 0x5C, 0xB1, 0xAB,
        0x9E, 0x9C, 0x52, 0x1B,
        0x5F, 0x93, 0x0A, 0xEF,
        0x91, 0x85, 0x49, 0xEE,
        0x2D, 0x4F, 0x8F, 0x3B,
        0x47, 0x87, 0x6D, 0x46,
        0xD6, 0x3E, 0x69, 0x64,
        0x2A, 0xCE, 0xCB, 0x2F,
        0xFC, 0x97, 0x05, 0x7A,
        0xAC, 0x7F, 0xD5, 0x1A,
        0x4B, 0x0E, 0xA7, 0x5A,
        0x28, 0x14, 0x3F, 0x29,
        0x88, 0x3C, 0x4C, 0x02,
        0xB8, 0xDA, 0xB0, 0x17,
        0x55, 0x1F, 0x8A, 0x7D,
        0x57, 0xC7, 0x8D, 0x74,
        0xB7, 0xC4, 0x9F, 0x72,
        0x7E, 0x15, 0x22, 0x12,
        0x58, 0x07, 0x99, 0x34,
        0x6E, 0x50, 0xDE, 0x68,
        0x65, 0xBC, 0xDB, 0xF8,
        0xC8, 0xAE, 0xAD, 0x0F,
        0x64, 0x63, 0xF6, 0x9D,
        0x38, 0xBF, 0x0B, 0x3B,
        0x1B, 0x54, 0x27, 0x64,
        0x52, 0x0A, 0x56, 0xB6,
        0xA3, 0x29, 0xC3, 0xB1,
        0x9C, 0x21, 0x0E, 0x51,
        0xA1, 0x2F, 0x07, 0x4E,
        0x01, 0xF2, 0x21, 0x1B,
        0xC1, 0x1F, 0x09, 0x3B,
        0x06, 0x01, 0x40, 0x00,
        0x7E, 0xA1, 0x22, 0xDC,
        0x76, 0x4C, 0xD0, 0x02,
        0xF1, 0xB3, 0x10, 0x00,
        0x76, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00
      ]);

      // Sub-keys
      var subKeys = new Uint32Array(40);

      // S-box derived keys
      var sBox0 = new Uint32Array(256)
        , sBox1 = new Uint32Array(256)
        , sBox2 = new Uint32Array(256)
        , sBox3 = new Uint32Array(256);

      var rs = function rs(x, y) {

          var i = 0
            , res = 0
            , b;

          for (; i < 8; i += 1) {

            b = (y >>> i) & 1;
            if (b === 1) {

              res ^= x;
            }
            if ((x & 0x80) !== 0) {

              x = ((x << 1) ^ 0x14D) & 0xFF;
            } else {

              x <<= 1;
            }
          }
          return res;
        }
        , mds = function mds(x) {

          var b0 = (x >>> 0) & 0xFF
            , b1 = (x >>> 8) & 0xFF
            , b2 = (x >>> 16) & 0xFF
            , b3 = (x >>> 24) & 0xFF;

          return (
            (rs(b0, 0x01) ^ rs(b1, 0xEF) ^ rs(b2, 0x5B) ^ rs(b3, 0x5B)) << 0 |
            (rs(b0, 0x5B) ^ rs(b1, 0xEF) ^ rs(b2, 0xEF) ^ rs(b3, 0x01)) << 8 |
            (rs(b0, 0xEF) ^ rs(b1, 0x5B) ^ rs(b2, 0x01) ^ rs(b3, 0xEF)) << 16 |
            (rs(b0, 0xEF) ^ rs(b1, 0x01) ^ rs(b2, 0xEF) ^ rs(b3, 0x5B)) << 24
          );
        }
        , h = function h(x, l) {

          var b0 = (x >>> 0) & 0xFF
            , b1 = (x >>> 8) & 0xFF
            , b2 = (x >>> 16) & 0xFF
            , b3 = (x >>> 24) & 0xFF
            , k0, k1, k2, k3;

          if (l.length === 4) {

            k0 = l[0]; k1 = l[1]; k2 = l[2]; k3 = l[3];
            b0 = P0[P0[b0] ^ (k3 >>> 0 & 0xFF)] ^ (k2 >>> 0 & 0xFF);
            b1 = P0[P1[b1] ^ (k3 >>> 8 & 0xFF)] ^ (k2 >>> 8 & 0xFF);
            b2 = P1[P0[b2] ^ (k3 >>> 16 & 0xFF)] ^ (k2 >>> 16 & 0xFF);
            b3 = P1[P1[b3] ^ (k3 >>> 24 & 0xFF)] ^ (k2 >>> 24 & 0xFF);
          } else if (l.length === 3) {

            k0 = l[0]; k1 = l[1]; k2 = l[2];
            b0 = P0[b0] ^ (k2 >>> 0 & 0xFF);
            b1 = P0[b1] ^ (k2 >>> 8 & 0xFF);
            b2 = P1[b2] ^ (k2 >>> 16 & 0xFF);
            b3 = P1[b3] ^ (k2 >>> 24 & 0xFF);
          } else {

            k0 = l[0]; k1 = l[1];
          }

          return (
            mds(P0[P0[b0] ^ (k1 >>> 0 & 0xFF)] ^ (k0 >>> 0 & 0xFF)) ^
            mds(P0[P1[b1] ^ (k1 >>> 8 & 0xFF)] ^ (k0 >>> 8 & 0xFF)) << 8 ^
            mds(P1[P0[b2] ^ (k1 >>> 16 & 0xFF)] ^ (k0 >>> 16 & 0xFF)) << 16 ^
            mds(P1[P1[b3] ^ (k1 >>> 24 & 0xFF)] ^ (k0 >>> 24 & 0xFF)) << 24
          );
        }
        , init = function init(key) {

          var k = []
            , m0 = []
            , m1 = []
            , s = []
            , i = 0
            , j = 0
            , b0, b1, b2, b3, res, a, b;

          for (; i < key.length; i += 4) {

            k.push(key[i] << 0 | key[i + 1] << 8 | key[i + 2] << 16 | key[i + 3] << 24);
          }

          for (i = 0; i < k.length / 2; i += 1) {

            m0.push(k[2 * i]);
            m1.push(k[2 * i + 1]);
          }

          for (i = k.length - 2; i >= 0; i -= 2) {

            b0 = k[i] >>> 0 & 0xFF;
            b1 = k[i] >>> 8 & 0xFF;
            b2 = k[i] >>> 16 & 0xFF;
            b3 = k[i] >>> 24 & 0xFF;
            res = (rs(b0, 0x01) ^ rs(b1, 0xA4) ^ rs(b2, 0x55) ^ rs(b3, 0x87) ^ rs(rs(b0, 0x01) ^ rs(b1, 0xA4) ^ rs(b2, 0x55) ^ rs(b3, 0x87), 0x01) ^ rs(b1, 0x01) ^ rs(b2, 0xA4) ^ rs(b3, 0x55)) << 0;
            res |= (rs(b0, 0x87) ^ rs(b1, 0x01) ^ rs(b2, 0xA4) ^ rs(b3, 0x55) ^ rs(rs(b0, 0x87) ^ rs(b1, 0x01) ^ rs(b2, 0xA4) ^ rs(b3, 0x55), 0x01) ^ rs(b1, 0x87) ^ rs(b2, 0x01) ^ rs(b3, 0xA4)) << 8;
            res |= (rs(b0, 0x55) ^ rs(b1, 0x87) ^ rs(b2, 0x01) ^ rs(b3, 0xA4) ^ rs(rs(b0, 0x55) ^ rs(b1, 0x87) ^ rs(b2, 0x01) ^ rs(b3, 0xA4), 0x01) ^ rs(b1, 0x55) ^ rs(b2, 0x87) ^ rs(b3, 0x01)) << 16;
            res |= (rs(b0, 0xA4) ^ rs(b1, 0x55) ^ rs(b2, 0x87) ^ rs(b3, 0x01) ^ rs(rs(b0, 0xA4) ^ rs(b1, 0x55) ^ rs(b2, 0x87) ^ rs(b3, 0x01), 0x01) ^ rs(b1, 0xA4) ^ rs(b2, 0x55) ^ rs(b3, 0x87)) << 24;
            s.push(res);
          }

          for (i = 0; i < 20; i += 1) {

            a = h(2 * i * 0x01010101, m0);
            b = h((2 * i + 1) * 0x01010101, m1);
            b = (b << 8 | b >>> 24);
            subKeys[2 * i] = (a + b) >>> 0;
            subKeys[2 * i + 1] = ((a + 2 * b) << 9 | (a + 2 * b) >>> 23) >>> 0;
          }

          for (i = 0; i < 256; i += 1) {

            sBox0[i] = h(i * 0x01010101, s) ^ subKeys[0];
            sBox1[i] = h(i * 0x01010101, s) ^ subKeys[1];
            sBox2[i] = h(i * 0x01010101, s) ^ subKeys[2];
            sBox3[i] = h(i * 0x01010101, s) ^ subKeys[3];
          }
        }
        , encryptBlock = function encryptBlock(block) {

          var r0 = (block[0] << 0 | block[1] << 8 | block[2] << 16 | block[3] << 24) ^ subKeys[4]
            , r1 = (block[4] << 0 | block[5] << 8 | block[6] << 16 | block[7] << 24) ^ subKeys[5]
            , r2 = (block[8] << 0 | block[9] << 8 | block[10] << 16 | block[11] << 24) ^ subKeys[6]
            , r3 = (block[12] << 0 | block[13] << 8 | block[14] << 16 | block[15] << 24) ^ subKeys[7]
            , i = 0
            , t0, t1, tmp;

          for (; i < 16; i += 1) {

            t0 = sBox0[r0 & 0xFF] ^ sBox1[r0 >>> 8 & 0xFF] ^ sBox2[r0 >>> 16 & 0xFF] ^ sBox3[r0 >>> 24 & 0xFF];
            t1 = sBox0[r1 >>> 24 & 0xFF] ^ sBox1[r1 & 0xFF] ^ sBox2[r1 >>> 8 & 0xFF] ^ sBox3[r1 >>> 16 & 0xFF];
            r2 ^= (t0 + t1 + subKeys[2 * i + 8]) >>> 0;
            r3 = (r3 << 1 | r3 >>> 31) ^ (t0 + 2 * t1 + subKeys[2 * i + 9]) >>> 0;
            tmp = r0; r0 = r2; r2 = tmp;
            tmp = r1; r1 = r3; r3 = tmp;
          }

          r2 ^= subKeys[36];
          r3 ^= subKeys[37];
          r0 ^= subKeys[38];
          r1 ^= subKeys[39];

          return new Uint8Array([
            r2 >>> 0 & 0xFF, r2 >>> 8 & 0xFF, r2 >>> 16 & 0xFF, r2 >>> 24 & 0xFF,
            r3 >>> 0 & 0xFF, r3 >>> 8 & 0xFF, r3 >>> 16 & 0xFF, r3 >>> 24 & 0xFF,
            r0 >>> 0 & 0xFF, r0 >>> 8 & 0xFF, r0 >>> 16 & 0xFF, r0 >>> 24 & 0xFF,
            r1 >>> 0 & 0xFF, r1 >>> 8 & 0xFF, r1 >>> 16 & 0xFF, r1 >>> 24 & 0xFF
          ]);
        }
        , decryptBlock = function decryptBlock(block) {

          var r0 = (block[0] << 0 | block[1] << 8 | block[2] << 16 | block[3] << 24) ^ subKeys[32]
            , r1 = (block[4] << 0 | block[5] << 8 | block[6] << 16 | block[7] << 24) ^ subKeys[33]
            , r2 = (block[8] << 0 | block[9] << 8 | block[10] << 16 | block[11] << 24) ^ subKeys[34]
            , r3 = (block[12] << 0 | block[13] << 8 | block[14] << 16 | block[15] << 24) ^ subKeys[35]
            , i = 15
            , t0, t1, tmp;

          for (; i >= 0; i -= 1) {

            t0 = sBox0[r0 & 0xFF] ^ sBox1[r0 >>> 8 & 0xFF] ^ sBox2[r0 >>> 16 & 0xFF] ^ sBox3[r0 >>> 24 & 0xFF];
            t1 = sBox0[r1 >>> 24 & 0xFF] ^ sBox1[r1 & 0xFF] ^ sBox2[r1 >>> 8 & 0xFF] ^ sBox3[r1 >>> 16 & 0xFF];
            r2 ^= (t0 + t1 + subKeys[2 * i + 8]) >>> 0;
            r3 = (r3 << 1 | r3 >>> 31) ^ (t0 + 2 * t1 + subKeys[2 * i + 9]) >>> 0;
            tmp = r0; r0 = r2; r2 = tmp;
            tmp = r1; r1 = r3; r3 = tmp;
          }

          r2 ^= subKeys[4];
          r3 ^= subKeys[5];
          r0 ^= subKeys[6];
          r1 ^= subKeys[7];

          return new Uint8Array([
            r2 >>> 0 & 0xFF, r2 >>> 8 & 0xFF, r2 >>> 16 & 0xFF, r2 >>> 24 & 0xFF,
            r3 >>> 0 & 0xFF, r3 >>> 8 & 0xFF, r3 >>> 16 & 0xFF, r3 >>> 24 & 0xFF,
            r0 >>> 0 & 0xFF, r0 >>> 8 & 0xFF, r0 >>> 16 & 0xFF, r0 >>> 24 & 0xFF,
            r1 >>> 0 & 0xFF, r1 >>> 8 & 0xFF, r1 >>> 16 & 0xFF, r1 >>> 24 & 0xFF
          ]);
        };

    return {
      'init': init,
      'encryptBlock': encryptBlock,
      'decryptBlock': decryptBlock,
      'encrypt': function encrypt(key, data) {

        var i = 0
          , res = []
          , block;

        init(key);

        for (; i < data.length; i += 16) {

          block = encryptBlock(data.slice(i, i + 16));
          res.push.apply(res, block);
        }

        return new Uint8Array(res);
      },
      'decrypt': function decrypt(key, data) {

        var i = 0
          , res = []
          , block;

        init(key);

        for (; i < data.length; i += 16) {

          block = decryptBlock(data.slice(i, i + 16));
          res.push.apply(res, block);
        }

        return new Uint8Array(res);
      }
    };
  };

}(typeof exports === 'undefined' ? (this.wouldgo = {}) : exports));
