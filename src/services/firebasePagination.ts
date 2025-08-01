import { db } from "../firebaseConfig";
import { get, query, ref, orderByKey, startAt, limitToFirst } from "firebase/database";

export interface PaginatedResult<T> {
  items: T[];
  totalCount: number;
  hasMore: boolean;
  lastKey?: string;
}

export async function fetchPaginatedData<T>(
  nodePath: string,
  limit: number,
  startAfterKey?: string,
  mapFn?: (id: string, raw: any) => T
): Promise<PaginatedResult<T>> {
  const nodeRef = ref(db, nodePath);
  let q;

  if (startAfterKey) {
    q = query(nodeRef, orderByKey(), startAt(startAfterKey), limitToFirst(limit + 1));
  } else {
    q = query(nodeRef, orderByKey(), limitToFirst(limit + 1));
  }

  const snapshot = await get(q);
  const data = snapshot.val();

  if (!data) {
    return { items: [], totalCount: 0, hasMore: false };
  }

  const entries = Object.entries<any>(data);

  if (startAfterKey && entries.length > 0) {
    entries.shift(); 
  }

  const hasMore = entries.length > limit;
  const actualEntries = hasMore ? entries.slice(0, limit) : entries;

  const items = actualEntries.map(([id, raw]) =>
    mapFn ? mapFn(id, raw) : ({ id, ...raw } as T)
  );

  const countSnapshot = await get(nodeRef);
  const totalCount = countSnapshot.exists()
    ? Object.keys(countSnapshot.val()).length
    : 0;

  return {
    items,
    totalCount,
    hasMore,
    lastKey: actualEntries.length > 0 ? actualEntries[actualEntries.length - 1][0] : undefined,
  };
}
