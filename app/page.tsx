export default function Home() {
  return (
    <div>
      <h1>Home</h1>
      <p>{process.env.DB_CONNECTION_STRING}</p>
      <p>{process.env.NODE_ENV}</p>
    </div>
  );
}
