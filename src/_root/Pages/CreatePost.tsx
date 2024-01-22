import PostForm from "@/components/Forms/PostForm"

function CreatePost() {
  return (
    <div className='flex flex-1'>
      <div className='common-container'>
        <div className="max-w-5xl flex-start gap-3 justify-start">
          <img
            src='/assets/icons/add-post.svg'
            height={36}
            width={36}
            alt='add'
          />
          <h2 className='h3-bold md:h2-bold text-left w-full'>Create Post</h2>
        </div>
        <PostForm />
      </div>
    </div>
  )
}

export default CreatePost
