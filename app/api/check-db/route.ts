import { NextResponse } from 'next/server';
import { connectToDatabase } from '../../../lib/db';

export async function GET() {
  try {
    const { db } = await connectToDatabase();
    const collections = await db.listCollections().toArray();
    return NextResponse.json({ collections });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to connect to database' }, { status: 500 });
  }
}
