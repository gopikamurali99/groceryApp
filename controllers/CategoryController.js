import Category from '../models/CategorySchema.js'

//add Item to category
export const addItemToCategory = async(req,res)=>{
    const {category,itemName,price} = req.body;

    try {
           
           let categoryData = await Category.findOne({category});
        if(!categoryData){
            categoryData = new Category({
                category,
                items: [],
            });

        }

        const existingItem = categoryData.items.find((item)=>item.itemName === itemName )
        if(existingItem){
            return res.status(400).json({message:"Item already exist in this category"})
        }
        categoryData.items.push({itemName,price})
        await categoryData.save();
        
    } catch (error) {
        
        console.error(error);
        res.status(500).json({error:"Failed to add item"});
    }
};
//get items in a specific category

export const getCategory = async(req,res)=>{

     const {category} = req.params;
     console.log(req.params);
     try {
        console.log("Requested Category:", category);
        const categoryData = await Category.findOne({category})
        if(!categoryData){
            return res.status(404).json({message:"category not found"});
        }
        res.status(200).json({items:categoryData.items});
     } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch items" });
     }
}

//get all categories
export const getAllCategory = async(req,res)=>{
    try {
        const categoryData = await Category.find()
        if(!categoryData){
            return res.status(404).json({message:"category not found"})
     
        }
        res.status(200).json(categoryData)
    } catch (error) {
        console.error(error);
        res.status(500).json({error:"failed to fetch categories"})
        
        
    }
}

//update category

export const updateCat = async(req,res) =>{
    const {category, currentItem, newItem, price } = req.body;
  
        console.log('Request received');  
   
    
    try {
        const categoryData = await Category.findOne({category})
          console.log(categoryData)
          console.log(category, currentItem, newItem, price)
        if(!categoryData){
           return  res.status(404).json({message:"Category not found"})
        }
        const item = categoryData.items.find((item)=> item.itemName === currentItem)
        if(!item){
            console.log("item not found")
            return res.status(404).json({message:"item not found"})
        }
        if(newItem && newItem !== currentItem) {
            const duplicate = categoryData.items.find((item)=>item.itemName === newItem)
            if(duplicate){
                console.log("the item already exist")
                return res.status(409).json({message:"The item already in the database"})
            }
            if(newItem){
                item.itemName=newItem
               
            }
            if(price){
                item.price = price
                   }
           await categoryData.save()
           console.log(categoryData)
           console.time('Update Item');  
        }

    } catch (error) {
        console.error(error)
        res.status(500).json({error:"Failed to update item"})
    }
}
//delete a specific category
export const deleteCategory = async(req,res)=>{
    const {category}=req.params

    try {
        console.log("Requested Category:", category);
        const categoryData = await Category.deleteOne({category})
        console.log(categoryData)
        if(!categoryData){
            return res.status(404).json({message:"category not found"});
        }
        res.status(200).json({message:"category deleted succesfully"})
        
    } catch (error) {
        console.error(error)
         res.status(500).json({message:"error deleting category"})
    }
}
//delete all categories in one request
export const deleteAllCategory = async(req,res)=>{
    
    try {
        
        const result = await Category.deleteMany({})
//deletedCount is a property of deleteMany() method in mongodb
        if(result.deletedCount===0){
             return res.status(500).json({message:"no categories to delete"})
         }
         console.log(result.deletedCount)
        res.status(200).json({message:"All categories deleted successfully!!"}) 

    } catch (error) {
        console.error(error)
        res.status(200).json({message:"All categories deleted successfully!!"}) 
    }
}
//Remainder , didnt check the delete functionality now


