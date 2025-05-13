import { eq } from 'drizzle-orm'
import { tickets } from '$lib/schema'
import { db } from './index'

export async function generateUniqueTicketId() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789'
  let id = ''

  for (let i = 0; i < 4; i++) {
    id += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  while (await db.select().from(tickets).where(eq(tickets.id, id))) {
    id = Array.from({ length: 4 }, () => {
      return chars.charAt(Math.floor(Math.random() * chars.length));
    }).join('');
  }

  return id;
}
