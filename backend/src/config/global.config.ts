import { ImageConfiguration, imagesConfiguration } from './images.config'

export interface GlobalConfiguration {
  images: ImageConfiguration
}

export default (): GlobalConfiguration => ({
  images: imagesConfiguration
})
