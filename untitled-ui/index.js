const blurs = require('./blurs')
const boxShadows = require('./boxShadows')
const colors = require('./colors')
const fontSizes = require('./fontSizes')

const textVariables = require('./variables/text')
const borderVariables = require('./variables/border')
const foregroundVariables = require('./variables/foreground')
const backgroundVariables = require('./variables/background')

const buttonPrimaryVariables = require('./variables/buttons/primary')
const buttonSecondaryVariables = require('./variables/buttons/secondary')
const buttonSecondaryColorVariables = require('./variables/buttons/secondaryColor')
const buttonTertiary = require('./variables/buttons/tertiary')
const buttonTertiaryColor = require('./variables/buttons/tertiaryColor')
const buttonPrimaryErrorVariables = require('./variables/buttons/primaryError')
const buttonSecondaryErrorVariables = require('./variables/buttons/secondaryError')
const buttonTertiaryErrorVariables = require('./variables/buttons/tertiaryError')

module.exports = {
  blurs,
  boxShadows,
  colors,
  fontSizes,

  textVariables,
  borderVariables,
  foregroundVariables,
  backgroundVariables,

  buttonPrimaryVariables,
  buttonSecondaryVariables,
  buttonSecondaryColorVariables,
  buttonTertiary,
  buttonTertiaryColor,
  buttonPrimaryErrorVariables,
  buttonSecondaryErrorVariables,
  buttonTertiaryErrorVariables,
}
