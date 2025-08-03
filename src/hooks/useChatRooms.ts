import { useEffect, useState, useCallback, useRef } from "react";
import {
  fetchChatRoomsPaginated,
  ChatRoom,
  PaginatedChatRooms
} from "../services/chatRoomService";
import {
  CHAT_ROOM_DEFAULT_PAGE_SIZE,
  CHAT_ROOM_CACHE_KEY_PREFIX,
  CHAT_ROOM_UNKNOWN_ERROR
} from "../utils/constants";

export default function useChatRooms(rowsPerPage: number = CHAT_ROOM_DEFAULT_PAGE_SIZE) {
  const [rooms, setRooms] = useState<ChatRoom[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const pageCache = useRef<Map<number, { rooms: ChatRoom[]; lastKey?: string }>>(new Map());

  const fetchPage = useCallback(
    async (page: number, force = false) => {
      if (!force && pageCache.current.has(page)) {
        console.log(`${CHAT_ROOM_CACHE_KEY_PREFIX} Dùng cache cho trang`, page);
        setRooms(pageCache.current.get(page)!.rooms);
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

        console.log(`${CHAT_ROOM_CACHE_KEY_PREFIX} Fetch trang ${page} | startAfterKey: ${startAfterKey}`);

        const result: PaginatedChatRooms = await fetchChatRoomsPaginated(
          page,
          rowsPerPage,
          startAfterKey
        );

        console.log(`${CHAT_ROOM_CACHE_KEY_PREFIX} Lấy ${result.rooms.length} rooms:`, result.rooms);
        console.log(`${CHAT_ROOM_CACHE_KEY_PREFIX} lastKey của trang ${page}:`, result.lastKey);

        setRooms(result.rooms);
        setTotalCount(result.totalCount);

        pageCache.current.set(page, {
          rooms: result.rooms,
          lastKey: result.lastKey
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : CHAT_ROOM_UNKNOWN_ERROR);
        setRooms([]);
      } finally {
        setLoading(false);
      }
    },
    [rowsPerPage]
  );

  const refreshCurrentPage = useCallback(() => {
    fetchPage(currentPage, true);
  }, [fetchPage, currentPage]);

  const clearCache = useCallback(() => {
    pageCache.current = new Map();
  }, []);

  useEffect(() => {
    fetchPage(currentPage);
  }, [fetchPage, currentPage]);

  const goToPage = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  return {
    rooms,
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
