import { Metadata } from 'next';
import constText from '@/constants/pages/texts.json';
import Link from 'next/link';
 
export const metadata: Metadata = {
  title: constText.pageTitle,
}
 
const Home = () => {
  return (
    <div>
      <h1>Home</h1>
      <p>{process.env.DB_CONNECTION_STRING}</p>
      <p>{process.env.NODE_ENV}</p>
      <Link href="/about-us">About Us</Link>
    </div>
  );
}

export default Home;
