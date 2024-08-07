const content_dataBase = require("../../Models/Content/content_model");

const get_all_content = async (req , res) => {
    const querying = req.query
    
    console.log(querying)

    const LIMIT = querying.limit;
    const PAGE = querying.page;
    const SKIP = (PAGE - 1) * LIMIT;
    try
    {
        const content = await content_dataBase.find({},{"__v" : false}).limit(LIMIT).skip(SKIP);;
        res.json(content);
    }
    catch(err)
    {
        res.status(500).json({ error: error.message });
    }
}

const add_new_content = async (req, res) => {
    const {content_title , content , brand , content_type , views , date , approvals , movie , SEO } = req.body

    const content_exist = await content_dataBase.findOne({content_title : content_title});
    if(content_exist)
    {
        return res.status(400).send({message:"content already exist"})    
    }    

    const new_content = new content_dataBase ({
        content_title,
        content,
        brand ,
        content_type, 
        views,
        date,
        approvals,
        movie,
        SEO
    })   

    await  new_content.save()
    .then(()=>{
        res.status(201).json(new_content)
    })
    .catch((error)=> {
        console.log(`${error}`)
        res.status(400).json({ message : 'There are '+ error})
    })    
};

const update_content = async (req,res) =>{
    let content_id= req.params.id;
 
    // find the index of this content 
    const content = await content_dataBase.findById(content_id)
 
    if(!content)
    {
        return res.status(404).send({message : "The content with the given ID was not found."})
    }
    // merge the old data with the new data that the user want to change    
    const result = await content_dataBase.updateOne({ _id: content_id }, { $set: { ...req.body } });
    
    const new_content = await content_dataBase.findById(content_id)
    res.json(new_content);
}

const delete_content = async (req,res) =>{
    try {
        let content_id = req.params.id;
        const content = await content_dataBase.findByIdAndDelete(content_id);
        if (content) {
            res.json({message: 'This Content has been deleted Successfully' , content});
        } else {;
            res.status(404).send({message: "This Content does not exist"});
        }
    } catch (error) {
        console.error("Error deleting Content:", error);
        res.status(500).send({message: "Internal Server Error"});
    }
}
module.exports =
{
    get_all_content,
    add_new_content,
    update_content,
    delete_content
}