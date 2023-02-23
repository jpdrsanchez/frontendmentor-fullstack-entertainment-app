import {
  defineImageMetadataThumbnailsData,
  imageFactory
} from '@test/factories/image.factory'
import { Image } from './image.entity'

describe('Image Domain Entity', () => {
  it('should be able to create a new viewer', () => {
    const image = imageFactory()

    expect(image).toBeTruthy()
    expect(image).toBeInstanceOf(Image)
  })

  it('should be able to define the corrects thumbnails sizes by the provided sizes types', () => {
    const imageOne = imageFactory({
      metadata: {
        regular: {
          ...defineImageMetadataThumbnailsData('regular')
        }
      }
    })

    const imageTwo = imageFactory({
      metadata: {
        regular: {
          ...defineImageMetadataThumbnailsData('regular')
        },
        trending: {
          ...defineImageMetadataThumbnailsData('trending')
        }
      }
    })

    expect(imageOne).toBeTruthy()
    expect(imageOne.metadata.regular).toBeTruthy()
    expect(imageOne.metadata.avatar).not.toBeDefined()
    expect(imageOne.metadata.trending).not.toBeDefined()

    expect(imageTwo).toBeTruthy()
    expect(imageTwo.metadata.regular).toBeTruthy()
    expect(imageTwo.metadata.avatar).not.toBeDefined()
    expect(imageTwo.metadata.trending).toBeTruthy()
  })
})
