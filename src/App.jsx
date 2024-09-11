import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";

const App = () => {
  const fetchPost = async () => {
    const { data } = await axios.get("http://localhost:4000/posts");
    return data;
  };

  const addPost = async (newPost) => {
    return await axios.post("http://localhost:4000/posts", newPost);
  };

  const queryClient = useQueryClient();
  const [title, setTitle] = useState("");
  const [views, setViews] = useState("");

  const {
    data: posts,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["posts"],
    queryFn: fetchPost,
  });

  const { mutate } = useMutation({
    mutationFn: addPost,
    onSuccess: queryClient.invalidateQueries(["posts"]),
  });

  if (isLoading) {
    return <div>로딩중..</div>;
  }
  if (isError) {
    return <div>에러..</div>;
  }

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          mutate({
            title,
            views,
          });
        }}
      >
        <input
          type="text"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
          }}
        />
        <input
          type="text"
          value={views}
          onChange={(e) => {
            setViews(e.target.value);
          }}
        />
        <button>추가하기</button>
      </form>

      <ul>
        {posts.map((post) => {
          return (
            <li key={post.id}>
              <h3>타이틀: {post.title}</h3>
              <p>뷰: {post.views}</p>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default App;
