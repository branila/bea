import { eq } from 'drizzle-orm'
import { tickets } from '$lib/schema'
import { db } from './index'

export async function generateUniqueTicketId() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789';
  let attempts = 0;
  const maxAttempts = 100;

  while (attempts < maxAttempts) {
    const id = Array.from({ length: 4 }, () =>
      chars.charAt(Math.floor(Math.random() * chars.length))
    ).join('');

    const existing = await db.select().from(tickets).where(eq(tickets.id, id));
    if (existing.length === 0) return id;

    attempts++;
  }

  throw new Error('Impossibile generare un ID unico dopo diversi tentativi');
}
