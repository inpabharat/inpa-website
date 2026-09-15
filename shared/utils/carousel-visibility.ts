import type { AdminCarouselInput } from '../types/admin'

export type CarouselVisibilityState = 'live' | 'inactive' | 'scheduled' | 'expired'

export interface CarouselVisibility {
  state: CarouselVisibilityState
  label: string
  detail: string
}

export function getCarouselVisibility(
  item: Pick<AdminCarouselInput, 'isActive' | 'startsAt' | 'endsAt'>,
  now = new Date(),
): CarouselVisibility {
  if (!item.isActive) {
    return { state: 'inactive', label: 'Inactive', detail: 'Enable “Show on homepage” to publish this slide.' }
  }

  if (item.startsAt && Date.parse(item.startsAt) > now.getTime()) {
    return { state: 'scheduled', label: 'Scheduled', detail: 'Enabled, but waiting for its show-from time.' }
  }

  if (item.endsAt && Date.parse(item.endsAt) <= now.getTime()) {
    return { state: 'expired', label: 'Ended', detail: 'Its hide-after time has passed.' }
  }

  return { state: 'live', label: 'Live now', detail: 'Visible in the homepage slideshow.' }
}
