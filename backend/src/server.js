require('dotenv').config();
const express = require('express');
const { PrismaClient } = require('@prisma/client');

const app = express();
const prisma = new PrismaClient();
const port = process.env.PORT;

app.use(express.json());

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});