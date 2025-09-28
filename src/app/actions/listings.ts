'use server';

import { redirect } from 'next/navigation';
import { z } from 'zod';
import { createListing as createListingFirebase } from '@/server/repo/repoFirebase';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

// Schema de validation Zod
const CreateListingSchema = z.object({
  title: z.string()
    .min(5, 'Titlul trebuie să aibă cel puțin 5 caractere')
    .max(100, 'Titlul nu poate depăși 100 de caractere'),
  description: z.string()
    .min(20, 'Descrierea trebuie să aibă cel puțin 20 de caractere')
    .max(2000, 'Descrierea nu poate depăși 2000 de caractere'),
  price: z.number()
    .min(0, 'Prețul nu poate fi negativ')
    .max(1000000, 'Prețul este prea mare'),
  categoryId: z.string()
    .min(1, 'Selectează o categorie'),
  locationId: z.string()
    .min(1, 'Selectează o locație'),
  userId: z.string()
    .min(1, 'Utilizatorul trebuie să fie autentificat'),
  images: z.array(z.string().min(1, 'Imagine invalidă'))
    .max(5, 'Maximum 5 imagini permise')
    .optional()
    .default([]),
});

export type CreateListingFormState = {
  errors?: {
    title?: string[];
    description?: string[];
    price?: string[];
    categoryId?: string[];
    locationId?: string[];
    userId?: string[];
    images?: string[];
    _form?: string[];
  };
  success?: boolean;
};

// Rate limiting helper
async function checkRateLimit(userId: string, maxRequests: number, windowMs: number): Promise<boolean> {
  try {
    const rateLimitDoc = doc(db, 'rateLimits', userId);
    const rateLimitSnap = await getDoc(rateLimitDoc);
    
    const now = Date.now();
    const windowStart = now - windowMs;
    
    if (!rateLimitSnap.exists()) {
      // First request
      await setDoc(rateLimitDoc, {
        requests: [now],
        updatedAt: serverTimestamp()
      });
      return true;
    }
    
    const data = rateLimitSnap.data();
    const requests = (data.requests || []).filter((timestamp: number) => timestamp > windowStart);
    
    if (requests.length >= maxRequests) {
      return false;
    }
    
    // Add current request
    requests.push(now);
    await setDoc(rateLimitDoc, {
      requests,
      updatedAt: serverTimestamp()
    });
    
    return true;
  } catch (error) {
    console.error('Rate limit check error:', error);
    return true; // Allow on error
  }
}

export async function createListing(
  prevState: CreateListingFormState,
  formData: FormData
): Promise<CreateListingFormState> {
  // Extraire les données du formulaire
  const rawData = {
    title: formData.get('title'),
    description: formData.get('description'),
    price: formData.get('price'),
    categoryId: formData.get('categoryId'),
    locationId: formData.get('locationId'),
    userId: formData.get('userId'),
    images: JSON.parse(formData.get('images') as string || '[]'),
  };

  // Conversion du prix en nombre
  const priceNumber = rawData.price ? parseFloat(rawData.price as string) : 0;

  // Validation avec Zod
  const validationResult = CreateListingSchema.safeParse({
    ...rawData,
    price: priceNumber,
  });

  if (!validationResult.success) {
    return {
      errors: validationResult.error.flatten().fieldErrors,
    };
  }

  // Données validées
  const validatedData = validationResult.data;

  // TEMPORARY: Disable rate limiting for testing
  // const rateLimitOk = await checkRateLimit(validatedData.userId, 3, 5 * 60 * 1000);
  // 
  // if (!rateLimitOk) {
  //   return {
  //     errors: {
  //       _form: ['Ai publicat prea multe anunțuri recent. Te rog să aștepți 5 minute și să încerci din nou.'],
  //     },
  //   };
  // }

  let listingId: string;
  
  try {
    // Créer l'annonce dans Firestore
    listingId = await createListingFirebase({
      title: validatedData.title,
      description: validatedData.description,
      price: validatedData.price,
      categoryId: validatedData.categoryId,
      locationId: validatedData.locationId,
      images: validatedData.images,
      userId: validatedData.userId,
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date(),
      views: 0,
      featured: false
    });

    console.log('Anunț creat cu succes:', listingId);
    
  } catch (error) {
    console.error('Erreur lors de la création de l\'annonce:', error);
    return {
      errors: {
        _form: ['Une erreur est survenue lors de la création de l\'annonce. Veuillez réessayer.'],
      },
    };
  }

  // Redirect OUTSIDE try-catch to avoid catching Next.js redirect exception
  redirect(`/listing/${listingId}`);
}
