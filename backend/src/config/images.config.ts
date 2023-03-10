import * as path from 'node:path'
import * as process from 'node:process'

export enum ThumbnailSizes {
  SMALL = 'small',
  MEDIUM = 'medium',
  LARGE = 'large'
}

export interface ThumbnailSizePaths {
  small: string
  medium: string
  large: string
}

export interface ImageThumbnails<T> {
  trending: T
  regular: T
  avatar: T
}

export interface ImageConfiguration {
  optimizationQuality: number
  allowWebp: boolean
  tmpDir: ReturnType<typeof path.join>
  uploadsDir: ReturnType<typeof path.join>
  allowedFiles: string[]
  thumbnail: ImageThumbnails<
    Record<ThumbnailSizes, { width: number; height: number }>
  >
}

export const imagesConfiguration: ImageConfiguration = {
  optimizationQuality: Number(process.env.OPTIMIZATION_QUALITY) ?? 80,
  allowWebp: (process.env.ALLOW_WEBP ?? 'true') === 'true',
  tmpDir: path.join(process.cwd(), process.env.TMP_DIR ?? 'tmp'),
  uploadsDir: path.join(process.cwd(), process.env.UPLOADS_DIR ?? 'uploads'),
  allowedFiles: ['jpg', 'jpeg', 'png', 'webp'],
  thumbnail: {
    avatar: {
      small: { width: 128, height: 128 },
      medium: { width: 256, height: 256 },
      large: { width: 512, height: 512 }
    },
    regular: {
      small: { width: 328, height: 220 },
      medium: { width: 440, height: 280 },
      large: { width: 560, height: 348 }
    },
    trending: {
      small: { width: 480, height: 280 },
      medium: { width: 660, height: 330 },
      large: { width: 940, height: 460 }
    }
  }
}
