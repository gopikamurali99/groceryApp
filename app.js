import express from 'express';
import { SignUp,verifyOtp,sendOtp,login} from './controllers/CustomerRoutes.js';
import { addItemToCategory,getCategory,getAllCategory,updateCat,deleteCategory, deleteAllCategory } from './controllers/CategoryController.js';
const router = express.Router();

//registration route

router.post('/customer/signup',SignUp) 
router.post('/customer/send-otp',sendOtp)
router.post('/customer/verify',verifyOtp)
router.post('/customer/login',login)

//category handle routes

router.post('/category/addCategory',addItemToCategory) //add item and category
router.get('/category/getAllCategories',getAllCategory) //get all categories
router.get('/category/getcategory/:category',getCategory) //get a specific category by its name
router.put('/category/updatecategory',updateCat) //update category
router.delete('/category/deleteCategory/:category',deleteCategory) //delete a category by its name
router.delete('/category/deleteCategory',deleteAllCategory)  //delete All categories

//customers list handling routes


export default router  
