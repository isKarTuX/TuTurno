CREATE INDEX idx_turns_service_queue ON turns (service_id, status, queue_position);
CREATE INDEX idx_turns_citizen ON turns (citizen_id, status);
CREATE INDEX idx_push_user ON push_subscriptions (user_id);
CREATE INDEX idx_operators_service ON operators (service_id);
CREATE INDEX idx_operators_entity ON operators (entity_id);
CREATE INDEX idx_operators_user ON operators (user_id);