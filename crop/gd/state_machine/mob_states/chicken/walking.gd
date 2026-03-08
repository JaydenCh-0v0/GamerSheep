extends NodeState

@export var mob: MobileObject
@export var ani: AnimatedSprite2D
@export var navigation_agent: NavigationAgent2D

var speed: float = 0.0
@export var  walk_cycle: int = 0
@export var current_walk_cycle: int = 0

func _ready() -> void:
	navigation_agent.velocity_computed.connect(on_safe_velocity_computed)
	call_deferred("character_setup")

func character_setup() -> void:
	await get_tree().physics_frame
	set_movement_target()

func set_movement_target() -> void:
	var target_position: Vector2 = NavigationServer2D.map_get_random_point(
			navigation_agent.get_navigation_map(), navigation_agent.navigation_layers, false)
	navigation_agent.target_position = target_position
	print("Navigation agent located at: ", navigation_agent.target_position)

func _on_process(_delta : float) -> void:
	pass

func _on_physics_process(_delta : float) -> void:
	if navigation_agent.is_navigation_finished():
		current_walk_cycle += 1
		set_movement_target()
		return

	var target_position: Vector2 = navigation_agent.get_next_path_position()
	var target_direction: Vector2 = mob.global_position.direction_to(target_position)
	
	var velocity: Vector2 = target_direction * speed
	if navigation_agent.avoidance_enabled:
		navigation_agent.velocity = velocity
	else:
		mob.velocity = velocity
		mob.move_and_slide()
	ani.flip_h = mob.velocity.x > 0

func on_safe_velocity_computed(safe_velocity: Vector2) -> void:
	mob.velocity = safe_velocity
	mob.move_and_slide()

func _on_next_transitions() -> void:
	if current_walk_cycle == walk_cycle and mob.able_to_act:
		mob.velocity = Vector2.ZERO
		transition.emit("idle")
	pass


func _on_enter() -> void:
	
	ani.play("walk_" + mob.get_age())
	speed = mob.get_speed()
	walk_cycle = mob.get_walk_cycle()
	current_walk_cycle = 0
	set_movement_target()
	pass


func _on_exit() -> void:
	pass
