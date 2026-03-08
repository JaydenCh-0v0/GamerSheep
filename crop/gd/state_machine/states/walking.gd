extends NodeState

# State for walking
@export var player: Player
@export var animated_sprite_2d: AnimatedSprite2D
@export var move_speed: float = 65.0

func _on_process(_delta : float) -> void:
	pass


func _on_physics_process(_delta : float) -> void:
	var result = GameInputEvents.movement_input(GameInputEvents.target_position, player.position)
	player.facing_direction = result[0]
	player.moving_direction = result[1]
	
	if GameInputEvents.is_reached_target(player.position):
		player.velocity = Vector2.ZERO
		transition.emit("idle")
		return
	match player.current_tool:
		DataTypes.Tools.PICKABLE_ITEM:
			animated_sprite_2d.play("walking_picked")
		_:	
			animated_sprite_2d.play("walking")
	
	match(player.facing_direction):
		Vector2.LEFT:
			animated_sprite_2d.flip_h = true
		Vector2.RIGHT:
			animated_sprite_2d.flip_h = false
		_:
			animated_sprite_2d.flip_h = false
	
	player.velocity = player.moving_direction * move_speed

	var prev_position = player.position
	player.move_and_slide()
	if GameInputEvents.is_stuck(prev_position, player.position) and not GameInputEvents.is_reached_target(player.position):
		player.velocity = Vector2.ZERO
		transition.emit("idle")

func _on_next_transitions() -> void:
	GameInputEvents.movement_input(player.get_global_mouse_position(), player.position)
	if GameInputEvents.is_reached_target(player.position):
		transition.emit("idle")


func _on_enter() -> void:
	pass


func _on_exit() -> void:
	pass
