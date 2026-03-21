import { authApp, productsApp } from "./index.js";
const PORT = Number(process.env.PORT) || 8000;

const server = () => {
  authApp.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });

  productsApp.listen(PORT + 1, () => {
    console.log(`Server is running on port ${PORT + 1}`);
  });
};

export default server;
