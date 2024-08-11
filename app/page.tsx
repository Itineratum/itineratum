import { Metadata } from 'next';
import * as constTexts from '@/constants/pages/text.json';
import Link from 'next/link';
 
export const metadata: Metadata = {
  title: constTexts.pageTitle,
}
 
export default function Home() {
  return (
    <div>
      <h1>Home</h1>
      <p>{process.env.DB_CONNECTION_STRING}</p>
      <p>{process.env.NODE_ENV}</p>
      <Link href="/about-us">About Us</Link>
    </div>
  );
}
