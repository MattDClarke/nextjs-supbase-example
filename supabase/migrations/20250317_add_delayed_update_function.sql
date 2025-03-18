-- Create a stored procedure for delayed note updates
CREATE OR REPLACE FUNCTION update_note_with_delay(
  note_id BIGINT,
  new_title TEXT,
  new_content TEXT,
  user_id_param UUID
)
RETURNS VOID AS $$
BEGIN
  -- Simulate a 15-second delay
  PERFORM pg_sleep(15);
  
  -- Update the note
  UPDATE notes
  SET 
    title = new_title,
    content = new_content
  WHERE 
    id = note_id AND
    user_id = user_id_param;
END;
$$ LANGUAGE plpgsql; 