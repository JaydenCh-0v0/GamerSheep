extends NodeState

# State for watering the ground
@export var player: Player
@export var animated_sprite_2d: AnimatedSprite2D


func _on_process(_delta : float) -> void:
	pass


func _on_physics_process(_delta : float) -> void:
	animated_sprite_2d.play("watering")
	match(player.facing_direction):
		Vector2.LEFT:
			animated_sprite_2d.flip_h = true
		Vector2.RIGHT:
			animated_sprite_2d.flip_h = false
		_:
			animated_sprite_2d.flip_h = false


func _on_next_transitions() -> void:
	await animated_sprite_2d.animation_finished
	transition.emit("idle")


func _on_enter() -> void:
	pass


func _on_exit() -> void:
	pass
