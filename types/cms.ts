import type { BrandProfile } from './brands'
import type { SocialPlatform } from './content'
import type { SiteImageFile, SiteImagePage } from './images'

export interface CopyRow { path: string, en: string, ar: string }
export interface ManagedGalleryImage {
  key: string
  src: `/images/${string}`
  width: number
  height: number
  altEn: string
  altAr: string
}
export interface Workspace {
  copy: Record<SiteImagePage, CopyRow[]>
  brands: BrandProfile[]
  social: Record<SocialPlatform, string>
  slots: Record<string, SiteImageFile | null>
  galleries: Record<SiteImagePage, ManagedGalleryImage[]>
}
export interface Revision { id: number, action: string, createdAt: string }
export interface WorkspaceResponse {
  draft: Workspace
  revision: number
  publishedRevision: number
  history: Revision[]
}
export interface AdminSession { email: string, csrf: string }
export interface Enquiry {
  id: string
  name: string
  email: string
  company?: string
  message: string
  receivedAt: string
  status: 'new' | 'replied' | 'archived'
}
