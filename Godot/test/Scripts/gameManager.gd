extends Node2D

@export var slime_scene: PackedScene
@export var spawn_timer: Timer
@export var is_spawn: bool = true

# Called when the node enters the scene tree for the first time.
func _ready() -> void:
	pass # Replace with function body.


# Called every frame. 'delta' is the elapsed time since the previous frame.
func _process(delta: float) -> void:
	spawn_timer.wait_time -= 0.2 * delta
	spawn_timer.wait_time = clamp(spawn_timer.wait_time, 1, 3)


func _spawn_enemy() -> void:
	if (is_spawn):
		var slime_node = slime_scene.instantiate()
		slime_node.position = Vector2(260, randf_range(56, 120))
		get_tree().current_scene.add_child(slime_node)
