extends Node2D

@export var slime_scene: PackedScene
@export var spawn_timer: Timer
@export var is_spawn_enemy: bool = true
@export var score: int = 0
@export var score_label: Label

# Called when the node enters the scene tree for the first time.
func _ready() -> void:
	pass # Replace with function body.

# Called every frame. 'delta' is the elapsed time since the previous frame.
func _process(delta: float) -> void:
	spawn_timer.wait_time -= 0.2 * delta
	spawn_timer.wait_time = clamp(spawn_timer.wait_time, 1, 3)
	
	score_label.text = "Score:　\t" + str(score)

func _spawn_enemy() -> void:
	if (is_spawn_enemy):
		var slime_node = slime_scene.instantiate()
		slime_node.HP = slime_node.HP * randf_range(0.8, 1.5)
		slime_node.position = Vector2(260, randf_range(56, 120))
		get_tree().current_scene.add_child(slime_node)

func spwan_bird(bird_scene: PackedScene) -> void:
	$Background/ForestBranch.spwan_bird(bird_scene)
