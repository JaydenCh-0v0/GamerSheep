extends NodeState

# State for chopping trees
@export var player: Player
@export var animated_sprite_2d: AnimatedSprite2D
@export var hit_component_collision_shape: CollisionShape2D

func _ready() -> void:
	hit_component_collision_shape.disabled = true
	hit_component_collision_shape.position = Vector2.ZERO


func _on_process(_delta : float) -> void:
	pass


func _on_physics_process(_delta : float) -> void:
	animated_sprite_2d.play("chopping")
	match(player.facing_direction):
		Vector2.LEFT:
			animated_sprite_2d.flip_h = true
			hit_component_collision_shape.position = Vector2(-12,-3)
		Vector2.RIGHT:
			animated_sprite_2d.flip_h = false
			hit_component_collision_shape.position = Vector2(+12,-1)
		_:
			animated_sprite_2d.flip_h = false
			hit_component_collision_shape.position = Vector2(+12,-1)
	if animated_sprite_2d.frame >= 1:
		hit_component_collision_shape.disabled = false


func _on_next_transitions() -> void:
	await animated_sprite_2d.animation_finished
	transition.emit("idle")


func _on_enter() -> void:
	pass


func _on_exit() -> void:
	hit_component_collision_shape.disabled = true
	hit_component_collision_shape.position = Vector2.ZERO
	pass
