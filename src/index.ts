import  app from './server';
const port: string | number = process.env.PORT || 4001;

app.listen(port, () => {
  console.log(`Server running on port ${port}...`);
});
