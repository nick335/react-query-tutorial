import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"

const POSTS = [
  {id:1, title: "Post 1"},
  {id:2, title: "Post 2"},
]
//Query keys structure
// posts => ["posts"]
// /posts/1 => ["posts", post.id]
// /posts?authorId => ["posts", {authorId: 1}]
// /posts/2/comments => ["posts", post.id, "comments"]

function App() {
  console.log(POSTS)
  const queryClient = useQueryClient()
  const postQuery = useQuery({
    queryKey: ["posts"],
    queryFn: () => wait(500).then(() => [...POSTS])
  })

  const newPostMutation = useMutation({
    mutationFn: title => {
      return wait(1000).then(() => POSTS.push({id: crypto.randomUUID(), title}))
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["posts"])
    }
  })

  if(postQuery.isLoading) return <h1>Loading....</h1>
  if(postQuery.isError) return <pre>{JSON.stringify(postQuery.error)}</pre>

  return (
    <div className="App">
      {postQuery.data.map(post => (
        <div key={post.id}>{post.title}</div>
      ))}
      <button disabled={newPostMutation.isLoading} onClick={() => newPostMutation.mutate("New Post")}>Add New</button>
    </div>
  )
}

function wait(duration){
  return new Promise(resolve => setTimeout(resolve, duration))
}

export default App
