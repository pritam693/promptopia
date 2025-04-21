import { connectToDB } from "@/utils/database";
import Prompt from "@/models/prompt";
import mongoose from "mongoose";

//GET(Read)
export const GET = async (req, { params }) => {
  try {
    await connectToDB();

    // Await the params object
    const { id } = await params; // Await the params object

    const prompt = await Prompt.findById(id).populate("creator");
    if (!prompt) {
      return new Response("Prompt not found", { status: 404 });
    }

    return new Response(JSON.stringify(prompt), { status: 200 });
  } catch (error) {
    console.error("Error fetching prompt:", error);
    return new Response("Failed to fetch the prompt", { status: 500 });
  }
};

//PATCH(Update)
export const PATCH = async (req, { params }) => {
  const { prompt, tag } = await req.json();

  try {
    await connectToDB();

    // Await the params object
    const { id } = await params; // Await the params object

    const existingPrompt = await Prompt.findById(id);
    if (!existingPrompt) {
      return new Response("Prompt not found", { status: 404 });
    }

    existingPrompt.prompt = prompt;
    existingPrompt.tag = tag;

    await existingPrompt.save();

    return new Response(JSON.stringify(existingPrompt), { status: 200 });
  } catch (error) {
    console.error("Error updating prompt:", error);
    return new Response("Failed to update the prompt", { status: 500 });
  }
};

//DELETE(Delete)
export const DELETE = async (request, { params }) => {
  try {
    await connectToDB();

    // Await the params object
    const { id } = await params; // Await the params object

    // Validate the ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return new Response("Invalid prompt ID", { status: 400 });
    }

    // Use findByIdAndDelete instead of findByIdAndRemove
    const deletedPrompt = await Prompt.findByIdAndDelete(id);

    if (!deletedPrompt) {
      return new Response("Prompt not found", { status: 404 });
    }

    return new Response("Prompt deleted successfully", { status: 200 });
  } catch (error) {
    console.error("Error deleting prompt:", error); // Log the error for debugging
    return new Response("Error deleting prompt", { status: 500 });
  }
};
