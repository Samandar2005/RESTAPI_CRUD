import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import multer from "multer";


const app = express();
const port = 3001;
const upload = multer({ dest: 'public/' });


let data = {
  products: [],
};

const findProductById = (productId) => {
  const product = data.products.find((e) => e.id === Number(productId));
  return product;
};

const deleteProduct = (id) => {
  data.products = data.products.filter((p) => p.id !== Number(id));
};

const updateProductHandler = (newproduct) => {
  for(let product in data.products) {
    if(data['products'][product].id === Number(newproduct.id)) {
      data['products'][product] = newproduct;
      return;
    }  
  }
  return "Product not found"
}

app.use(express.static("public"));
app.use(cors());
app.use(bodyParser.json());

app.get("/getallproducts", (req, res) => {
  res.send(data);
});

app.get("/getproductbyid/:id", (req, res) => {
  const id = req.params.id;
  console.log(`Requested product ID: ${id}`);
  const product = findProductById(id);

  if (!product) {
    return res.status(404).send({ error: "Product not found" });
  }

  res.send(product);
});

app.delete("/deleteproductbyid/:id", (req, res) => {
  const id = req.params.id;
  console.log(`Requested product ID: ${id} thats being deleted`);
  deleteProduct(id);
  res.json({ message: "successfully deleted" });
});

app.patch("/updateproduct", (req, res) => {
    const product = req.body;
    const a = updateProductHandler(product)
    if (!a) {
      return res.status(200).send({ message: 'Data updated' });
    }else{
      return res.status(404).send({ error: a });
    }
    
});

app.post("/createproduct", (req, res) => {
  const newProduct = req.body;
  newProduct.id = data.products.length + 1;
  data.products.push(newProduct);
  res.send(data);
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
