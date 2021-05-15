import { port } from './config/environment';
import app from './app';
import connectDB from './db'
import path from 'path';
import express from 'express';


app.get('/',(req, res) => {
  res.sendFile(path.join(__dirname, '/client/public/index.html'))
})
app.use(express.static(path.join(__dirname, 'client/public')));

const start = async () => {
  try {
    console.log('Connecting to database');
    await connectDB();
    console.log('Connected to database');

    await app.listen(port);
    console.log(`🚀  GraphQL server running at port: ${port}/graphql 🚀 `);
  } catch {
    console.log(' 😓 Not able to run GraphQL server 😓 ');
  }
};

start();