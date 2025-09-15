import RecipeModel from '../models/models.js';

export const getRecipe = async (req, res) => {
    try {
        const tmp = await RecipeModel.find();
        res.status(200).json(tmp);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const createRecipe = async (req, res) => {
    try {
        const { prompt } = req.body

        const ret = await ai(prompt)
        const newrecipe = new RecipeModel({
            messages: ret,
            time: Date.now()
        });
        await newrecipe.save();
        res.status(200).json({messsage: "OK"});
    } catch (err) {
        console.log(err)
        res.status(500).json({ error: err.message });
    }
};

export const updateRecipe = async (req, res) => {
    try {
        const {id, prompt} = req.body;
        if(!id || !prompt) {
            return res.status(400).json({message: "id, message, time are required"}) 
        }
        const ret = await ai(prompt)
        await RecipeModel.findByIdAndUpdate(id,{
            messages: ret,
        });
        res.status(200).json({messsage: "OK"});
    } catch (err) {
        console.log("HE ")
        res.status(500).json({ error: err.message });
    }
};


export const deleteRecipe = async (req, res) => {
    try {
        const {id} = req.body;
        if(!id) {
            return res.status(400).json({message: "id is required"})
        }
        await RecipeModel.findByIdAndDelete(id);
        res.status(200).json({messsage: "OK"});
    } catch (err) {
        console.log("HE ")
        res.status(500).json({ error: err.message });
    }
};


const ai = async (prompt) => {
    try {

const system_prompt = ``
  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "openai/gpt-oss-120b",
      messages: [
        {
            role: "system",
            content: system_prompt
        },
        {
            role: "user",
            content: prompt
        }
      ]
    })
  });

  const data = await response.json();
    return data.choices[0].message.content
}  catch(err) {
    console.log(err)
    return "Rate limited 😭"
}
}