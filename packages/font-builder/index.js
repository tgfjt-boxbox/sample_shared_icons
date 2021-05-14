const fs = require('fs')
const path = require('path')
const SVGIcons2SVGFontStream = require('svgicons2svgfont')
const svg2ttf = require('svg2ttf')
const ttf2woff2 = require('ttf2woff2')
const Mustache = require('mustache')
const { downloadFiles } = require('./figma-client')

/**
 * A number, or a string containing a number.
 * @typedef {Object} FontBuilderProps
 * @property {string} fontName
 * @property {string} fontsDirPath
 * @property {string} cssFilePath
 * @property {string} dartFilePath
*/

/**
 * 
 * @param {FontBuilderProps} options 
 * @returns {() => Promise<void>}
 */
function fontBuilder(options) {
  const FONT_NAME = options.fontName

  const fontStream = new SVGIcons2SVGFontStream({
    fontName: FONT_NAME,
    fixedWidth: true,
    fontHeight: 24
  })

  return async function () {
    const icons = await downloadFiles()

    return new Promise((resolve, reject) => {
      fontStream
        .pipe(fs.createWriteStream(`${options.fontsDirPath}/${FONT_NAME}.svg`))
        .on('finish', () => {
          console.log('Saved SVG successfully!')
          const ttf = svg2ttf(fs.readFileSync(`${options.fontsDirPath}/${FONT_NAME}.svg`, 'utf8'), {});
          let content = Buffer.from(ttf.buffer)

          fs.writeFileSync(`${options.fontsDirPath}/${FONT_NAME}.ttf`, content)
          console.log('Saved TTF:', content.length, 'bytes')

          let woff2 = ttf2woff2(ttf.buffer);
          content = Buffer.from(woff2.buffer);
          fs.writeFileSync(`${options.fontsDirPath}/${FONT_NAME}.wof2`, content)
          console.log('Saved WOFF2:', content.length, 'bytes');

          const props = {
            fontName: FONT_NAME,
            icons: icons.map(icon => ({
              ...icon, unicode: icon.unicode.charCodeAt(0).toString(16)
            })),
            uppercase() {
              return function (text, render) {
                return render(text).toUpperCase();
              }
            }
          };

          fs.promises.readFile(`${path.resolve(__dirname, 'templates')}/style.css.mustache`, 'utf8')
            .then(async (t) => {
              await fs.promises.writeFile(`${options.cssFilePath}`, Mustache.render(t, props))
            })

          fs.promises.readFile(`${path.resolve(__dirname, 'templates')}/icon.dart.mustache`, 'utf8')
            .then(async (t) => {
              await fs.promises.writeFile(`${options.dartFilePath}`, Mustache.render(t, props))
            })

          resolve()
        })
        .on('error', (err) => {
          reject(err)
        })

      icons.forEach((icon) => {
        const rs = fs.createReadStream(`${path.resolve(__dirname, 'tmp')}/${icon.filename}`);
        rs.metadata = {
          unicode: [icon.unicode, icon.name],
          name: icon.name
        };
        console.log(icon.unicode)

        fontStream.write(rs);
      })
      fontStream.end();

    })
  }
}

module.exports = {
  fontBuilder
}
