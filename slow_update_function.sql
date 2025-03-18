-- Create a stored procedure for slow updates
CREATE OR REPLACE FUNCTION slow_update_note(
  p_id BIGINT,
  p_title TEXT,
  p_content TEXT,
  p_user_id UUID
) RETURNS VOID AS $$
BEGIN
  -- First update the note
  UPDATE notes
  SET 
    title = p_title,
    content = p_content
  WHERE 
    id = p_id AND
    user_id = p_user_id;
    
  -- Then sleep for 15 seconds
  PERFORM pg_sleep(15);
END;
$$ LANGUAGE plpgsql; 