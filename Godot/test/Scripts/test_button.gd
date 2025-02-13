extends Button

@export var bird_scene: PackedScene

func _on_button_up() -> void:
	$"..".spwan_bird(bird_scene)
