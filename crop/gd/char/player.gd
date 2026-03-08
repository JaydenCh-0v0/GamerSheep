class_name Player
extends CharacterBody2D

@export var current_tool: DataTypes.Tools = DataTypes.Tools.NONE
@onready var hit_component: HitComponent = $HitComponent

var facing_direction: Vector2 = Vector2.LEFT
var moving_direction: Vector2 = Vector2.LEFT

func _ready() -> void:
	hit_component.hit_activated.connect(on_hit_activated)
	hit_component.hit_deactivated.connect(on_hit_deactivated)

func on_hit_activated() -> void:
	print("on_hit_activated")

func on_hit_deactivated() -> void:
	print("on_hit_deactivated")
