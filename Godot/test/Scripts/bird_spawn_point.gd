extends Area2D

@export var wait_time: float = 0.5
@export var had_bird: bool = false
@export var bird_spawn_timer: Timer
@export var bird_scene: PackedScene

func _ready() -> void:
	if not had_bird: spawn_bird()

func _process(delta: float) -> void:
	pass

func spawn_bird() -> void:
	var second = 3 + 1 * randf_range(0, 1)
	bird_spawn_timer.start(wait_time)
	await bird_spawn_timer.timeout
	var bird_node = bird_scene.instantiate()
	bird_node.position = Vector2(-300 + 50 * randf_range(-1, 1), -200 + 50 * randf_range(-1, 1))
	get_tree().current_scene.add_child(bird_node)
	bird_node.flyto(global_position, second)
