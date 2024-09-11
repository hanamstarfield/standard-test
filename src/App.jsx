import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";

const App = () => {
  const fetchPost = async () => {
    const { data } = await axios.get("http://localhost:4000/posts");
    return data;
  };

  const addPost = async (newPost) => {
    await axios.post("http://localhost:4000/posts", newPost);
  };

  const [title, setTitle] = useState("");
  const [views, setViews] = useState("");

  const queryClient = useQueryClient();
  const { data, isPending, isError } = useQuery({
    queryKey: ["posts"],
    queryFn: fetchPost,
  });

  const { mutate } = useMutation({
    mutationFn: addPost,
    onSuccess: () => {
      queryClient.invalidateQueries(["posts"]);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutate({ title, views: views });
  };

  if (isPending) {
    return <div>로딩중...</div>;
  }

  if (isError) {
    return <div>오류 발생!</div>;
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="제목"
          required
        />
        <input
          type="number"
          value={views}
          onChange={(e) => setViews(e.target.value)}
          placeholder="조회"
          required
        />
        <button>포스트 추가하기</button>
      </form>
      <div>
        {data?.posts?.map((post) => {
          return (
            <div key={post.id}>
              <h3>{post.title}</h3>
              <p>조회:{post.views}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default App;
