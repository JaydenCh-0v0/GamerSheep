extends Button

@export var bird_scene: PackedScene

func _on_button_up() -> void:
	get_tree().current_scene.spwan_bird(bird_scene)
