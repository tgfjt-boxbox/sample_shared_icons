/**
 * createIconFileName
 * 
 * @param {string} name icon name.
 * @param {string} unicode single point
 * @returns string file name
 * @example
 * createIconFileName("check", 'uE001') => "uE001,u0063u0068u0065u0063u006b-check.svg"
 * 
 */
 function createIconFileName(name, unicode) {
  const unicodes = createIconUnicode(name)

  return `${unicode},${unicodes.join('')}-${name}.svg`
}

/**
 * 
 * @param {string} name 
 * @returns string[]
 */
function createIconUnicode(name) {
  return name.split('').map(char => `u00${char.charCodeAt(0).toString(16)}`);
}

/**
 * createPoint
 * 
 * @param {number} idex 
 * @param {string} start start code point
 * @returns string 
 * @example
 * createPoint() => "uE000"
 * createPoint(1) => "uE001"
 * createPoint(2, "F000") => "uF002"
 * 
 */
function createPoint(idx = 0, start = "e000") {
  const i = parseInt(start, 16) + idx
  return `u${i.toString(16).toUpperCase()}`
}

module.exports = {
  createIconFileName,
  createIconUnicode,
  createPoint
}
