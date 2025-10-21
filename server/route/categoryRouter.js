import express from "express";
import checkToken from "../middleware/checkToken.js";
import {
  addCategory,
  showCategory,
  showAllCategory,
  delCategory,
  delAllCategory,
  updateCategory,
} from "../controller/catrgoryController.js";

const categoryRoute = express.Router();

categoryRoute.post("/add-catigory", checkToken, addCategory);
categoryRoute.get("/show-catigory/:id", checkToken, showCategory);
categoryRoute.get("/showall-catigory", checkToken, showAllCategory);
categoryRoute.delete("/del-catigory/:id", checkToken, delCategory);
categoryRoute.delete("/delall-catigory", checkToken, delAllCategory);
categoryRoute.put("/update-catigory/:id", checkToken, updateCategory);
export default categoryRoute;
