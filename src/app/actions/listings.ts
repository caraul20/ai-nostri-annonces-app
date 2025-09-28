'use server';

import { redirect } from 'next/navigation';
import { z } from 'zod';
import { addListing, checkRateLimit } from '@/server/repo/repoMock';

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
  images: z.array(z.string().url('URL imagine invalid'))
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

  try {
    // Vérifier le rate limiting (max 3 anunțuri / 5 min)
    const rateLimitOk = checkRateLimit(validatedData.userId, 3, 5 * 60 * 1000);
    
    if (!rateLimitOk) {
      return {
        errors: {
          _form: ['Ai publicat prea multe anunțuri recent. Te rog să aștepți 5 minute și să încerci din nou.'],
        },
      };
    }

    // Créer l'annonce dans Firestore
    const listingId = await addListing({
      title: validatedData.title,
      description: validatedData.description,
      price: validatedData.price,
      categoryId: validatedData.categoryId,
      locationId: validatedData.locationId,
      images: validatedData.images,
      userId: validatedData.userId,
      status: 'active',
    });

    // Redirection vers la page de l'annonce
    redirect(`/listing/${listingId}`);
  } catch (error) {
    console.error('Erreur lors de la création de l\'annonce:', error);
    return {
      errors: {
        _form: ['Une erreur est survenue lors de la création de l\'annonce. Veuillez réessayer.'],
      },
    };
  }
}
