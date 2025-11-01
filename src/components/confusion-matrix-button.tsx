'use client'

import { Button } from './ui/button'

export const ConfusionMatrixButton = () => {
  function openImageInNewTab() {
    const imagePath = '/images/confusion_matrix.png' // Replace with the actual path to your image
    const errorImagePath = 'path/to/error/image.png' // Replace with the actual path to your error image

    if (imagePath.length === 0) {
      window.open(errorImagePath, '_blank')
    } else {
      window.open(imagePath, '_blank')
    }
  }

  return (
    <Button hierarchy="secondary-gray" size="md" onClick={openImageInNewTab}>
      Confusion Matrix
    </Button>
  )
}
