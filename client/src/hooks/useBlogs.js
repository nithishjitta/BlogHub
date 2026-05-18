import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { blogApi } from '../api/blogApi.js';

export const blogKeys = {
  all: ['blogs'],
  lists: () => [...blogKeys.all, 'list'],
  list: (filters) => [...blogKeys.lists(), { filters }],
  details: () => [...blogKeys.all, 'detail'],
  detail: (id) => [...blogKeys.details(), id],
  user: (email) => [...blogKeys.all, 'user', email],
  saved: () => [...blogKeys.all, 'saved'],
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

// Fetch only blogs posted by a specific user
export function useMyBlogs(email) {
  return useQuery({
    queryKey: blogKeys.user(email),
    queryFn: () => blogApi.getBlogsByUser(email),
    enabled: !!email,
  });
}

export function useSavedBlogs(enabled = true) {
  return useQuery({
    queryKey: blogKeys.saved(),
    queryFn: blogApi.getSavedBlogs,
    enabled,
  });
}

export function useCreateBlog() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (blog) => blogApi.createBlog(blog),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: blogKeys.lists() });
      // Also invalidate user blogs so MyBlogs updates immediately
      if (data?.author?.email) {
        queryClient.invalidateQueries({ queryKey: blogKeys.user(data.author.email) });
      }
    },
  });
}