import { useNavigate } from 'react-router-dom';
import { MyBlogs } from './MyBlogs';

export const MyBlogsPage = () => {
  const navigate = useNavigate();

  const handleOpen = (id) => {
    navigate(`/blogs/${id}`);
  };

  return <MyBlogs onOpen={handleOpen} />;
};