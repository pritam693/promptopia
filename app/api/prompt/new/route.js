import { connectToDB } from "@utils/database"
import Prompt from "@models/prompt"

export const POST = async (req) => {
    const { prompt, userId, tag } = await req.json()

    try {
        //connect to DB
        await connectToDB()

        //create new prompt
        const newPrompt = new Prompt({
        creator: userId,
        prompt,
        tag,
        })

        await newPrompt.save()

        return new Response(JSON.stringify(newPrompt), { status: 201 })
    } catch (error) {
        return new Response('Failed to create a new prompt', { status: 500 })
    }
}
