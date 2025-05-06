"use client"
import {useState, useEffect} from 'react'
import PromptCard from './PromptCard'

const PromptCardList = ({data, handleTagClick}) => {
    return (
        <div className='mt-16 prompt_layout'>
            {data.map((post) => (
                <PromptCard
                    key={post._id}
                    post={post}
                    handleTagClick={handleTagClick}
                />
            ))}
        </div>
    )
}


const Feed = () => {
    const [searchText, setSearchText] = useState('')
    const [posts, setPosts] = useState([])
    const [filteredPosts, setFilteredPosts] = useState([])
    const [searchTimeout, setSearchTimeout] = useState(null)
    const handleSearchChange = (e) => {
        clearTimeout(searchTimeout)
        const value = e.target.value
        setSearchText(value)

        setSearchTimeout(setTimeout(() => {
            const search = value.toLowerCase()
            setFilteredPosts(
                posts.filter((post) => {
                    const prompt = post.prompt?.toLowerCase() || ''
                    const tag = post.tag?.toLowerCase() || ''
                    const username = post.creator?.username?.toLowerCase() || ''
                    return (
                        prompt.includes(search) ||
                        tag.includes(search) ||
                        username.includes(search)
                    )
                })
            )
        }, 500)) // 500ms debounce
    }

    // Handle tag click: filter posts by tag
    const handleTagClick = (tag) => {
        setSearchText(tag)
        setFilteredPosts(
            posts.filter((post) => post.tag?.toLowerCase() === tag.toLowerCase())
        )
    }

    useEffect(() => {
        const fetchPosts = async () => {
            const response = await fetch('/api/prompt')
            const data = await response.json()
            setPosts(data)
            setFilteredPosts(data)
        }
        fetchPosts()
    }, [])

  return (
    <section className='feed'>
        <form className='relative w-full flex-center gap-3 mb-16'>
            <input
            type='text'
            placeholder='Search for a tag or a username'
            value={searchText}
            onChange={handleSearchChange}
            className='search_input peer' />
            {searchText && (
                <button
                    type="button"
                    onClick={() => {
                        setSearchText('');
                        setFilteredPosts(posts);
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    aria-label="Clear search"
                >
                    &#10005;
                </button>
            )}
        </form>
        <PromptCardList
            data={filteredPosts}
            handleTagClick={handleTagClick}
         />
    </section>
  )
}

export default Feed
