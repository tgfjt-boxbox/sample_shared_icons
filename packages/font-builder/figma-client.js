const fs = require('fs')
const path = require('path')
const bent = require('bent')

const { createPoint, createIconFileName } = require('./naming')

const getJSON = bent('json', { 'X-Figma-Token': process.env.X_FIGMA_TOKEN })

const FIGMA_API = 'https://api.figma.com/v1'
const FILE_ID = process.env.FIGMA_FILE_ID

/**
 * A number, or a string containing a number.
 * @typedef {Object} Icon
 * @property {string} id - Icon id from Figma Object
 * @property {string} name - Icon name from Figma Object
 * @property {string?} image - Icon filename
 * @property {string?} filename - Icon name from Figma Object
 * @property {string?} unicode - Icon unicode
 */

/**
 * getImageURL
 * @param {Icon[]} icons 
 * @returns {Promise<Icon[]>}
 */
async function getImageURL(icons) {
  return new Promise(async (resolve) => {
    const iconIds = icons.map(icon => icon.id).join(',')

    const res = await getJSON(`${FIGMA_API}/images/${FILE_ID}?ids=${iconIds}&format=svg`)

    resolve(icons.map((icon, i) => {
      const codepoint = createPoint(i, "e000");

      return {
        ...icon,
        unicode: String.fromCharCode(parseInt(codepoint.replace(/^u/, ''), 16)),
        image: res.images[icon.id],
        filename: `${createIconFileName(icon.name, codepoint)}`
      }
    }))
  })
}

/**
 * @param {Icon} icon 
 */
async function downloadImage(icon) {
  console.log(`start download: ${icon.name}`)

  const ws = fs.createWriteStream(`${path.resolve(__dirname, 'tmp')}/${icon.filename}`)
  const getStream = bent(icon.image)
  const rs = await getStream()

  rs.pipe(ws)
  console.log(`finish download: ${icon.filename}`)

  return icon.filename
}

/**
 * 
 * @returns {Promise<Icon[]>}
 */
async function downloadFiles() {
  const result = await getJSON(`${FIGMA_API}/files/${FILE_ID}`)

  // たぶん
  const page = result.document.children[0]

  const icons = await getImageURL(page.children)

  const downloaded = icons.map(downloadImage)

  const files = await Promise.all(downloaded)

  console.log('downloaded all svg files.')

  return icons
}

module.exports = {
  downloadFiles
}
