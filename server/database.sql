ALTER TABLE users
ADD COLUMN IF NOT EXISTS "bio" TEXT,
ADD COLUMN IF NOT EXISTS "avatar" TEXT,
ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP;

ALTER TABLE cards
ADD COLUMN IF NOT EXISTS "assigned_to" INTEGER NULL,
ADD CONSTRAINT fk_assigned_user
FOREIGN KEY (assigned_to)
REFERENCES users(id) ON DELETE SET NULL;

CREATE TABLE user_activity(
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    action_type TEXT 
      CHECK (action_type IN (
        'card_created', 
        'card_completed', 
        'board_created', 
        'comment_added')),
    board_id INTEGER REFERENCES boards(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
