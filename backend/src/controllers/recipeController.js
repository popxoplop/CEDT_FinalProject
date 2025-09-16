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
        const { id, prompt } = req.body;
        if (!id || !prompt) {
            return res.status(400).json({ message: "id and prompt are required" });
        }
        const ret = await ai(prompt);
        const updated = await RecipeModel.findByIdAndUpdate(
            id,
            {
                messages: ret,
                time: Date.now()
            },
            {
                new: true,
                runValidators: true,
                upsert: false
            }
        );
        if (!updated) {
            return res.status(404).json({ message: "Recipe not found" });
        }
        res.status(200).json(updated);
    } catch (err) {
        console.log(err);
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

const system_prompt = `You are a chef name KookGuide that will help pople with their meal by helping them generate the recipe by their prompting.By having a clear ingredients and instruction.the way you respons should not have any Markdown lanmarkdown language.Lastly you dont have to answer too long`
  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "openai/gpt-oss-20b",
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
  console.log(data);
    return data.choices[0].message.content
}  catch(err) {
    console.log(err)
    return "Rate limited 😭"
}
}