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
/** A brand or partner logo as published: its approved file, or an owner upload replacing it. */
export interface ManagedLogo {
  src: `/logos/${string}` | `/images/admin/${string}`
  width: number
  height: number
}
export interface Workspace {
  copy: Record<SiteImagePage, CopyRow[]>
  brands: BrandProfile[]
  social: Record<SocialPlatform, string>
  slots: Record<string, SiteImageFile | null>
  galleries: Record<SiteImagePage, ManagedGalleryImage[]>
  /** Keyed by the approved logo path (content/logos.ts), so one change reaches every place it shows. */
  logos: Record<string, ManagedLogo>
}
/** One upload in the dashboard's media library. */
export interface MediaItem {
  src: `/images/admin/${string}`
  width: number
  height: number
  bytes: number
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
