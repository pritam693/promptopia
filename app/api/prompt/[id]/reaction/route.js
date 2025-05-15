// app/api/prompt/[id]/reaction/route.js
import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { connectToDB } from "@/utils/database"
import Prompt from "@/models/prompt"
import mongoose from "mongoose"

export async function GET(request, { params }) {
  try {
    const { id } = await params                          // ← await here
    const session = await getServerSession(authOptions)
    if (!session)
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })

    await connectToDB()
    const prompt = await Prompt.findById(id)              // ← use id
    if (!prompt)
      return NextResponse.json({ message: "Prompt not found" }, { status: 404 })

    const counts = (prompt.reactions || []).reduce((acc, { type }) => {
      acc[type] = (acc[type] || 0) + 1
      return acc
    }, {})

    const yourReaction =
      (prompt.reactions || [])
        .find(r => r.user.toString() === session.user.id)
        ?.type || null

    return NextResponse.json({ counts, yourReaction })
  } catch (error) {
    console.error("GET /reaction error:", error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function POST(request, { params }) {
  try {
    const { id } = await params                          // ← await here
    const session = await getServerSession(authOptions)
    if (!session)
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })

    const { reaction } = await request.json()

    await connectToDB()

    const sessionUserId = session.user.id
    const userObjId    = new mongoose.Types.ObjectId(sessionUserId)

    const updatedPrompt = await Prompt.findByIdAndUpdate(
      id,                                                // ← use id
      [
        {
          $set: {
            reactions: {
              $concatArrays: [
                {
                  $filter: {
                    input: { $ifNull: ["$reactions", []] },
                    as: "r",
                    cond: {
                      $ne: [
                        { $toString: "$$r.user" },
                        sessionUserId
                      ]
                    }
                  }
                },
                [{ user: userObjId, type: reaction }]
              ]
            }
          }
        }
      ],
      { new: true }
    )

    if (!updatedPrompt)
      return NextResponse.json({ message: "Prompt not found" }, { status: 404 })

    const reactionsArray = Array.isArray(updatedPrompt.reactions)
      ? updatedPrompt.reactions
      : []

    const counts = reactionsArray.reduce((acc, { type }) => {
      acc[type] = (acc[type] || 0) + 1
      return acc
    }, {})

    return NextResponse.json({ counts, yourReaction: reaction })
  } catch (error) {
    console.error("POST /reaction error:", error)
    return NextResponse.json(
      { message: error.message || "Internal server error" },
      { status: 500 }
    )
  }
}
