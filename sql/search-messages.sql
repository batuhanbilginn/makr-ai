CREATE OR REPLACE FUNCTION search_messages (
  query_embedding vector(1536),
  similarity_threshold float,
  match_count int,
  owner_id uuid,
  chat_id uuid DEFAULT NULL
)
RETURNS TABLE (
  content text,
  role text,
  created_at timestamp with time zone,
  index bigint
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    messages.content,
    messages.role,
    messages.created_at::timestamp with time zone,
    messages.index
  FROM messages
  WHERE
    messages.owner = owner_id AND
    (chat_id IS NULL OR messages.chat = chat_id) AND
    1 - (messages.embedding <=> query_embedding) > similarity_threshold
  ORDER BY
    1 - (messages.embedding <=> query_embedding) DESC,
    messages.index DESC
  LIMIT match_count;
END;
$$;