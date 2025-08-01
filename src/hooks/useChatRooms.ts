import { useEffect, useState, useCallback, useRef } from "react";
import {
  fetchChatRoomsPaginated,
  ChatRoom,
  PaginatedChatRooms
} from "../services/chatRoomService";

export default function useChatRooms(rowsPerPage: number = 5) {
  const [rooms, setRooms] = useState<ChatRoom[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageCache = useRef<Map<number, { rooms: ChatRoom[]; lastKey?: string }>>(new Map());

  const fetchPage = useCallback(
    async (page: number, force = false) => {
      if (!force && pageCache.current.has(page)) {
        console.log("[useChatRooms] Dùng cache cho trang", page);
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

        console.log(`[useChatRooms] Fetch trang ${page} | startAfterKey: ${startAfterKey}`);

        const result: PaginatedChatRooms = await fetchChatRoomsPaginated(
          page,
          rowsPerPage,
          startAfterKey
        );

        console.log(`[useChatRooms] Lấy ${result.rooms.length} rooms:`, result.rooms);
        console.log(`[useChatRooms] lastKey của trang ${page}:`, result.lastKey);

        setRooms(result.rooms);
        setTotalCount(result.totalCount);

        pageCache.current.set(page, {
          rooms: result.rooms,
          lastKey: result.lastKey
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
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
    totalPages: Math.ceil(totalCount / rowsPerPage),
    goToPage,
    refreshCurrentPage, 
    clearCache,
    hasNextPage: currentPage < Math.ceil(totalCount / rowsPerPage),
    hasPrevPage: currentPage > 1
  };
}
