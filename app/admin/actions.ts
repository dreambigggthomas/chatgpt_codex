'use server';

import { prisma } from '@/lib/prisma';
import { isValidSlug } from '@/lib/slug';
import { revalidatePath } from 'next/cache';

export async function createRestaurant(formData: FormData) {
  const name = formData.get('name')?.toString();
  const slug = formData.get('slug')?.toString();
  const tonePreset = (formData.get('tonePreset')?.toString() || '港式貼地') as any;
  if (!name || !slug || !isValidSlug(slug)) throw new Error('invalid data');
  await prisma.restaurant.create({
    data: {
      name,
      slug,
      tonePreset,
      address: formData.get('address')?.toString() || undefined,
      googleReviewUrl: formData.get('googleReviewUrl')?.toString() || undefined,
      instagramHandle: formData.get('instagramHandle')?.toString() || undefined,
      defaultHashtags: formData.get('defaultHashtags')?.toString() || undefined
    }
  });
  revalidatePath('/admin');
}

export async function updateRestaurant(id: number, formData: FormData) {
  const name = formData.get('name')?.toString();
  const slug = formData.get('slug')?.toString();
  const tonePreset = (formData.get('tonePreset')?.toString() || '港式貼地') as any;
  if (!name || !slug || !isValidSlug(slug)) throw new Error('invalid data');
  await prisma.restaurant.update({
    where: { id },
    data: {
      name,
      slug,
      tonePreset,
      address: formData.get('address')?.toString() || undefined,
      googleReviewUrl: formData.get('googleReviewUrl')?.toString() || undefined,
      instagramHandle: formData.get('instagramHandle')?.toString() || undefined,
      defaultHashtags: formData.get('defaultHashtags')?.toString() || undefined
    }
  });
  revalidatePath('/admin');
}
