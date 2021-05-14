const path = require('path')
const { fontBuilder } = require('@sample_shared_icons/font-builder')

const build = fontBuilder({
  fontName: 'SampleIcon',
  fontsDirPath: path.resolve('lib/fonts'),
  cssFilePath: path.resolve('css/icon.css'),
  dartFilePath: path.resolve('lib/sample_shared_icons.dart'),
})

build()
  .then(() => {
    console.log('all passes')
  })
