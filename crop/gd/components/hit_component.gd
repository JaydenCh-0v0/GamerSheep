class_name HitComponent
extends Area2D

@export var current_tool: DataTypes.Tools = DataTypes.Tools.NONE
@export var hit_damage: int = 1

signal hit_activated
signal hit_deactivated

signal pickable_activated
signal pickable_deactivated

# 存储当前在攻击区域内的动物
var animals_in_range: Array[Node2D] = []

func _on_body_entered(body: Node2D) -> void:
	hit_activated.emit()

func _on_body_exited(body: Node2D) -> void:
	hit_deactivated.emit()

func _on_area_entered(area: Area2D) -> void:
	print("on_area_entered")
	# 检查是否是动物（包含hover_component的节点）
	if area.has_method("_on_mouse_entered") and area.has_method("_on_mouse_exited"):
		print("on_area_entered 2")
		pickable_activated.emit(area)

# 检查是否有动物在攻击区域内
func has_animals_in_range() -> bool:
	return animals_in_range.size() > 0

# 获取攻击区域内的所有动物
func get_animals_in_range() -> Array[Node2D]:
	return animals_in_range

# 检查特定动物是否在攻击区域内
func is_animal_in_range(animal: Node2D) -> bool:
	return animals_in_range.has(animal)
