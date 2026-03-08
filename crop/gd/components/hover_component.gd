class_name HoverComponent
extends Area2D

@export var sprite: Node2D
@export var hover_color: Color = Color(1, 1, 1, 1)

#func _ready() -> void:
	#sprite.material.set("shader_parameter/glow_color", hover_color) # 高亮
	

func _on_mouse_entered() -> void:
	print("mouse entered")
	sprite.modulate = hover_color
	sprite.material.set("shader_parameter/outline_width", 1.0) # 高亮


func _on_mouse_exited() -> void:
	print("mouse exited")
	sprite.modulate = Color(1, 1, 1)
	sprite.material.set("shader_parameter/outline_width", 0.0) # 恢复
