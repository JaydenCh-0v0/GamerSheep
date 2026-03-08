extends NodeState

@export var mob: MobileObject
@export var ani: AnimatedSprite2D
@export var idle_state_time_interval: float = 5.0

@onready var idle_state_timer: Timer = Timer.new()
var idle_state_timeout: bool = false

func _ready() -> void:
	idle_state_timer.wait_time = idle_state_time_interval + randf_range(-1, 1)
	idle_state_timer.timeout.connect(on_idle_state_timeout)
	add_child(idle_state_timer)
	

func on_idle_state_timeout():
	idle_state_timeout = true
	print("timeout")
	pass

func _on_process(_delta : float) -> void:
	
	pass


func _on_physics_process(_delta : float) -> void:
	pass


func _on_next_transitions() -> void:
	if idle_state_timeout and mob.able_to_act:
		transition.emit("walking")
	pass


func _on_enter() -> void:
	idle_state_timeout = false
	idle_state_timer.start()
	ani.play("idle_" + mob.get_age())
	pass


func _on_exit() -> void:
	idle_state_timer.stop()
	pass
