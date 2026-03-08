class_name HitableComponent
extends Area2D

@export var accepted_tool: DataTypes.Tools = DataTypes.Tools.NONE

signal hitable_activated
signal hitable_deactivated

func _on_area_entered(area: Area2D) -> void:
	var hit_component = area as HitComponent
	
	if accepted_tool == hit_component.current_tool:
		hitable_activated.emit(hit_component.hit_damage)

func _on_area_exited(area: Area2D) -> void:
	hitable_deactivated.emit()
