create index on messages 
using ivfflat (embedding vector_cosine_ops)
with (lists = 100);