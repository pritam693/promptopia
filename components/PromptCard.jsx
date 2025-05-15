// components/PromptCard.jsx
"use client"

import React, { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { useSession } from "next-auth/react"
import { useRouter, usePathname } from "next/navigation"

/** Floating emoji picker */
const ReactionPicker = ({ onSelect }) => {
  const reactions = ["👍","❤️","😂","😮","😢","😡"]
  return (
    <span className="absolute bottom-10  flex space-x-1 bg-white p-1 rounded-lg shadow-lg z-20 ">
      {reactions.map((r) => (
        <button
          key={r}
          onClick={() => onSelect(r)}
          className="text-sm p-1 leading-none"
          aria-label={`React with ${r}`}
        >
          {r}
        </button>
      ))}
    </span>
  )
}

const PromptCard = ({ post, handleTagClick, handleEdit, handleDelete }) => {
  const { data: session, status } = useSession()
  const router   = useRouter()
  const pathname = usePathname()
  const pickerRef = useRef()

  const [copied, setCopied] = useState("")
  const [counts, setCounts] = useState({})
  const [yourReaction, setYourReaction] = useState(null)
  const [showPicker, setShowPicker] = useState(false)

  // close picker on outside tap/click
  useEffect(() => {
    const onClickOutside = (e) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target)) {
        setShowPicker(false)
      }
    }
    document.addEventListener("mousedown", onClickOutside)
    document.addEventListener("touchstart", onClickOutside)
    return () => {
      document.removeEventListener("mousedown", onClickOutside)
      document.removeEventListener("touchstart", onClickOutside)
    }
  }, [])

  // fetch existing reactions
  useEffect(() => {
    if (status === "loading") return
    ;(async () => {
      try {
        const res = await fetch(`/api/prompt/${post._id}/reaction`)
        if (!res.ok) return
        const { counts, yourReaction } = await res.json()
        setCounts(counts || {})
        setYourReaction(yourReaction)
      } catch (err) {
        console.error(err)
      }
    })()
  }, [post._id, status])

  // handle react
  const handleReact = async (reaction) => {
    if (!session) return router.push("/api/auth/signin")
    try {
      const res = await fetch(`/api/prompt/${post._id}/reaction`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reaction }),
      })
      if (!res.ok) return
      const { counts, yourReaction } = await res.json()
      setCounts(counts)
      setYourReaction(yourReaction)
      setShowPicker(false)
    } catch (err) {
      console.error(err)
    }
  }

  // copy prompt text
  const handleCopy = () => {
    navigator.clipboard.writeText(post.prompt)
    setCopied(post.prompt)
    setTimeout(() => setCopied(""), 3000)
  }

  // navigate to profile
  const handleProfileClick = () => {
    if (post.creator._id === session?.user.id) {
      router.push("/profile")
    } else {
      router.push(`/profile/${post.creator._id}?name=${post.creator.username}`)
    }
  }

  return (
    <div className="prompt_card relative">
      {/* Header */}
      <div className="flex justify-between items-start gap-5">
        <div
          className="flex-1 flex items-center gap-3 cursor-pointer"
          onClick={handleProfileClick}
        >
          <Image
            src={post.creator.image}
            alt="avatar"
            width={40}
            height={40}
            className="rounded-full object-contain"
          />
          <div>
            <h3 className="font-satoshi font-semibold text-gray-900">
              {post.creator.username}
            </h3>
            <p className="font-inter text-sm text-gray-500">
              {post.creator.email}
            </p>
          </div>
        </div>
        <button onClick={handleCopy} className="copy_btn" aria-label="Copy">
          <Image
            src={
              copied === post.prompt
                ? "/assets/icons/tick.svg"
                : "/assets/icons/copy.svg"
            }
            alt="copy icon"
            width={12}
            height={12}
          />
        </button>
      </div>

      {/* Prompt & Tag */}
      <p className="my-4 font-satoshi text-sm text-gray-700">{post.prompt}</p>
      <p
        className="font-inter text-sm blue_gradient cursor-pointer"
        onClick={() => handleTagClick?.(post.tag)}
      >
        #{post.tag}
      </p>
      {/* Reaction UI */}
      {pathname === "/" && (
        <p
          ref={pickerRef}
          onMouseEnter={() => setShowPicker(true)}   // desktop hover
          onMouseLeave={() => setShowPicker(false)}
        >

          {/* counts */}
          <span className="flex items-center space-x-1">
          {/* tap or click to toggle picker (mobile & desktop) */}
          <button
            onClick={() => setShowPicker((v) => !v)}
            aria-label="Open reactions"
            className="p-1 bg-white rounded-full shadow hover:scale-110 transition-transform"
          >
            <span className="text-sm">{yourReaction || "👍"}</span>
          </button>
            {Object.entries(counts).map(([emoji, count]) => (
              <span key={emoji} className="flex items-center space-x-0.5">
                <span className="text-sm">{emoji}</span>
                <span className="text-xs text-gray-500">{count}</span>
              </span>
            ))}
          </span>

          {/* floating picker */}
          {showPicker && <ReactionPicker onSelect={handleReact} />}
        </p>
      )}

      {/* Edit/Delete (own profile) */}
      {session?.user.id === post.creator._id && pathname === "/profile" && (
        <div className="mt-5 flex-center gap-4 border-t border-gray-100 pt-3">
          <button
            onClick={handleEdit}
            className="font-inter text-sm green_gradient bg-transparent p-0"
          >
            Update
          </button>
          <button
            onClick={handleDelete}
            className="font-inter text-sm orange_gradient bg-transparent p-0"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  )
}

export default PromptCard
