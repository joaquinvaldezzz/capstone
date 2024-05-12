const fs = require('fs')
const path = require('path')

const directoriesToIgnore = ['node_modules', '.git', '.next']
const acceptedFileExtensions = ['.js', '.jsx', '.ts', '.tsx']
const defaultRootDirectory = 'src'

function removeWhiteSpaceFromJSX(jsxString) {
  const regex = /\s+/g
  return jsxString.replace(regex, ' ').trim()
}

function shouldIgnoreDirectory(directoryName) {
  return directoriesToIgnore.includes(directoryName)
}

function processDirectory(directoryPath) {
  fs.readdir(directoryPath, (readdirError, files) => {
    if (readdirError) {
      console.error('Error reading directory:', readdirError)
      return
    }

    files.forEach((file) => {
      const filePath = path.join(directoryPath, file)

      fs.stat(filePath, (statError, stats) => {
        if (statError) {
          console.error('Error getting file stats:', statError)
          return
        }

        if (stats.isDirectory()) {
          if (!shouldIgnoreDirectory(file)) {
            processDirectory(filePath)
          }
        } else if (acceptedFileExtensions.includes(path.extname(file))) {
          fs.readFile(filePath, 'utf8', (readFileError, data) => {
            if (readFileError) {
              console.error('Error reading file:', readFileError)
              return
            }

            const modifiedContent = data.replace(/className="(.*?)"/g, (_, className) => {
              const compactedClassName = removeWhiteSpaceFromJSX(className)
              return `className="${compactedClassName}"`
            })

            fs.writeFile(filePath, modifiedContent, 'utf8', (writeFileError) => {
              if (writeFileError) {
                console.error('Error writing file:', writeFileError)
              } else {
                console.log(`Modified and saved: ${file}`)
              }
            })
          })
        }
      })
    })
  })
}

const rootDirectory = process.argv[2] || defaultRootDirectory

processDirectory(rootDirectory)
