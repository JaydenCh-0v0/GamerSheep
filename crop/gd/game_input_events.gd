class_name GameInputEvents

static var facing_direction: Vector2 = Vector2.ZERO
static var target_position: Vector2 = Vector2.ZERO
static var moving_direction: Vector2 = Vector2.ZERO


static func movement_input(mouse_position, player_position) -> Array[Vector2]:
	if Input.is_action_just_pressed("right_click"):
		target_position = mouse_position
		if (mouse_position.x - player_position.x) < 0:
			facing_direction = Vector2.LEFT
		else:
			facing_direction = Vector2.RIGHT
	var to_target = target_position - player_position
	if to_target.length() > 1.0:
		moving_direction = to_target.normalized()
	return [facing_direction, moving_direction]

static func is_close_enough(a: Vector2, b: Vector2, threshold := 1.0) -> bool:
	return (a - b).length() < threshold

static func is_reached_target(player_position, threshold := 2.0) -> bool:
	return is_close_enough(target_position, player_position, threshold)

static func is_stuck(prev_position: Vector2, current_position: Vector2, threshold := 0.5) -> bool:
	return is_close_enough(prev_position, current_position, threshold)

static func use_tool() -> bool:
	return Input.is_action_just_pressed("left_click")

static func pick_input() -> bool:
	return Input.is_action_just_pressed("left_click")
