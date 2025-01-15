extends Area2D

@export var wait_time: float = 0.5
@export var had_bird: bool = false
@export var bird_spawn_timer: Timer
@export var bird_scene: PackedScene

# Called when the node enters the scene tree for the first time.
func _ready() -> void:
	if not had_bird: spawn_bird()


# Called every frame. 'delta' is the elapsed time since the previous frame.
func _process(delta: float) -> void:
	pass

func spawn_bird() -> void:
	var second = 3
	bird_spawn_timer.start(wait_time)
	await bird_spawn_timer.timeout
	var bird_node = bird_scene.instantiate()
	bird_node.position = Vector2(-250, -200)
	get_tree().current_scene.add_child(bird_node)
	bird_node.flyto(global_position, second)
