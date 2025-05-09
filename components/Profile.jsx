import PromptCard from './PromptCard'

const Profile = ({name, desc, data, handleEdit, handleDelete}) => {
  return (
    <section className='w-full max-w-full flex-start flex-col'>
        <h1 className='head_text text-left'>
            <span className='blue_gradient'>{name} Profile</span>
        </h1>
        <p className='desc text-left max-w-md'>{desc}</p>
        <div className='mt-10 prompt_layout'>
            {data.map((post) => (
                <PromptCard
                    key={post._id}
                    post={post}
                    handleEdit={() => handleEdit && handleEdit(post)}
                    handleDelete={() => handleDelete && handleDelete(post)}
                />
            ))}
        </div>
    </section>
  )
}

export default Profile
