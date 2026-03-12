const express = require('express');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const authRoutes = require('./src/routes/authRoutes');
const userRoutes = require('./src/routes/userRoutes');
const itemRoutes = require('./src/routes/itemRoutes');
const borrowRoutes = require('./src/routes/borrowRoutes');
const storageRoutes = require('./src/routes/storageRoutes');

const app = express();
app.use(cors());
app.use(express.json());
app.use(fileUpload({
  useTempFiles: true,
  tempFileDir: '/tmp/',
}));

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/inventory', itemRoutes);
app.use('/api/inventory', storageRoutes);
app.use('/api', borrowRoutes);

app.use(express.static(path.join(__dirname, '../frontend/dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port: ${PORT}`));