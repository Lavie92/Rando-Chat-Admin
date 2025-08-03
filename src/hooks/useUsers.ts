import { useEffect, useState, useCallback, useRef } from "react";
import { fetchUsersPaginated, User, PaginatedUsers } from "../services/userService";
import {
  USER_DEFAULT_PAGE_SIZE,
  USER_UNKNOWN_ERROR,
  USER_CACHE_KEY_PREFIX
} from "../utils/constants";

export default function useUsers(rowsPerPage: number = USER_DEFAULT_PAGE_SIZE) {
  const [users, setUsers] = useState<User[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const pageCache = useRef<Map<number, { users: User[]; lastKey?: string }>>(new Map());

  const fetchPage = useCallback(
    async (page: number, force: boolean = false) => {
      if (!force && pageCache.current.has(page)) {
        console.log(`${USER_CACHE_KEY_PREFIX} Dùng cache cho trang ${page}`);
        setUsers(pageCache.current.get(page)!.users);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        let startAfterKey: string | undefined;

        if (page > 1) {
          const prevPageData = pageCache.current.get(page - 1);
          startAfterKey = prevPageData?.lastKey;
        }

        console.log(`${USER_CACHE_KEY_PREFIX} Fetch trang ${page} | startAfterKey: ${startAfterKey}`);

        const result: PaginatedUsers = await fetchUsersPaginated(
          page,
          rowsPerPage,
          startAfterKey
        );

        setUsers(result.users);
        setTotalCount(result.totalCount);

        console.log(`${USER_CACHE_KEY_PREFIX} Lấy ${result.users.length} users:`, result.users.map((u) => ({
          id: u.uid,
          nickname: u.nickname,
          email: u.email
        })));

        console.log(`${USER_CACHE_KEY_PREFIX} lastKey của trang ${page}: ${result.lastKey}`);

        pageCache.current.set(page, {
          users: result.users,
          lastKey: result.lastKey
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : USER_UNKNOWN_ERROR);
        setUsers([]);
      } finally {
        setLoading(false);
      }
    },
    [rowsPerPage]
  );

  useEffect(() => {
    fetchPage(currentPage);
  }, [fetchPage, currentPage]);

  const goToPage = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const refreshCurrentPage = useCallback(() => {
    fetchPage(currentPage, true);
  }, [fetchPage, currentPage]);

  const clearCache = useCallback(() => {
    pageCache.current = new Map();
  }, []);

  return {
    users,
    totalCount,
    loading,
    error,
    currentPage,
    totalPages: Math.max(1, Math.ceil(totalCount / rowsPerPage)),
    goToPage,
    refreshCurrentPage,
    clearCache,
    hasNextPage: currentPage < Math.ceil(totalCount / rowsPerPage),
    hasPrevPage: currentPage > 1
  };
}
