

const url = 'http://localhost:8000/auth/v1/signup';
const anonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlzcyI6InN1cGFiYXNlLWRlbW8iLCJpYXQiOjE2NDE3NjkyMDAsImV4cCI6MTg5MzQ1NjAwMH0.vh1-dwqULmDALnkn7fUv96Bl3iNGItPua0efQ5vGdoU';

async function run() {
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'apikey': anonKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: 'test' + Date.now() + '@example.com',
      password: 'password123',
      data: {
        username: 'testuser123'
      }
    })
  });
  const data = await res.json();
  console.log('Status:', res.status);
  console.log('Response:', data);
}

run().catch(console.error);
