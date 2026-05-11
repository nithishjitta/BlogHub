import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { blogApi } from '../api/blogApi.js';

export const blogKeys = {
  all: ['blogs'],
  lists: () => [...blogKeys.all, 'list'],
  list: (filters) => [...blogKeys.lists(), { filters }],
  details: () => [...blogKeys.all, 'detail'],
  detail: (id) => [...blogKeys.details(), id],
};

export function useBlogs() {
  return useQuery({
    queryKey: blogKeys.lists(),
    queryFn: blogApi.getAllBlogs,
  });
}

export function useBlog(id) {
  return useQuery({
    queryKey: blogKeys.detail(id),
    queryFn: () => blogApi.getBlogById(id),
    enabled: !!id,
  });
}

export function useCreateBlog() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (blog) => blogApi.createBlog(blog),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: blogKeys.lists() });
    },
  });
}