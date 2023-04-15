CREATE OR REPLACE FUNCTION search_messages (
  query_embedding vector(1536),
  similarity_threshold float,
  match_count int,
  owner_id uuid,
  chat_id uuid DEFAULT NULL
)
RETURNS TABLE (
  id uuid,
  content text,
  role text,
  created_at timestamp with time zone,
  token_size int
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  WITH matching_messages AS (
    SELECT
      messages.id,
      messages.chat,
      messages.content,
      messages.role AS role,
      messages.created_at,
      messages.token_size,
      1 - (messages.embedding <=> query_embedding) AS similarity
    FROM messages
    WHERE
      messages.owner = owner_id AND
      (chat_id IS NULL OR messages.chat = chat_id) AND
      1 - (messages.embedding <=> query_embedding) > similarity_threshold
    ORDER BY messages.embedding <=> query_embedding
    LIMIT match_count
  ),
  paired_messages AS (
    SELECT
      m.id,
      m.content,
      m.role,
      m.created_at,
      m.token_size,
      row_number() OVER (ORDER BY m.created_at) AS row_num
    FROM matching_messages m
    LEFT JOIN messages a ON m.pair = a.id AND a.role != 'user'
  ),
  filtered_messages AS (
    SELECT
      paired_messages.id,
      paired_messages.content,
      paired_messages.role,
      paired_messages.created_at,
      paired_messages.token_size,
      SUM(paired_messages.token_size) OVER (ORDER BY paired_messages.row_num) AS running_total
    FROM paired_messages
  )
  SELECT
    filtered_messages.id,
    filtered_messages.content,
    filtered_messages.role,
    filtered_messages.created_at::timestamp with time zone,
    filtered_messages.token_size
  FROM filtered_messages
  WHERE running_total <= 4000
  ORDER BY filtered_messages.row_num, filtered_messages.role DESC;
END;
$$;
