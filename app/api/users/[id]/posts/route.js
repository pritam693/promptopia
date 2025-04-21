import { connectToDB } from "@utils/database";
import Prompt from "@models/prompt";

export const GET = async (req, { params }) => {
  try {
    await connectToDB();

    // Await the params object and destructure the id
    const { id } = await params; // Await the params object

    const prompts = await Prompt.find({
      creator: id, // Use the awaited id here
    }).populate('creator');

    return new Response(JSON.stringify(prompts), { status: 200 });
  } catch (error) {
    console.error("Error fetching prompts:", error); // Log error for debugging
    return new Response("Failed to fetch all prompts", { status: 500 });
  }
};
