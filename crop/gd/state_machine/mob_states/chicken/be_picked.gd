extends NodeState

@export var mob: MobileObject
@export var ani: AnimatedSprite2D
@export var navigation_agent: NavigationAgent2D

var speed: float = 0.0
@export var  walk_cycle: int = 0
@export var current_walk_cycle: int = 0

func _ready() -> void:
	pass

func _on_process(_delta : float) -> void:
	pass

func _on_physics_process(_delta : float) -> void:
	pass


func _on_next_transitions() -> void:

	pass


func _on_enter() -> void:

	pass


func _on_exit() -> void:
	pass
