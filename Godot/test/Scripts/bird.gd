extends Area2D

@export var bird_animation: AnimatedSprite2D
@export var is_setup: bool
@export var bullet_scene: PackedScene
@export var action_timer: Timer

# Obj var
const NAME: String = "sparrow"
var HP: int = 100
var group: String = "friend"

# Drag var
var is_dragable: bool = is_setup 
var is_inside_dropable: bool = false
var initialPos: Vector2
var offset: Vector2
var bodyRef

func _ready() -> void:
	add_to_group("friend")
	bird_animation.speed_scale += randf_range(-0.1, 0.1)
	action_timer.wait_time += randf_range(-0.5, 0.5)
	if randf_range(0, 1) > 0.75: bird_animation.play("dig")

func _physics_process(delta: float) -> void:
	handle_drag(delta)

	# bird_animation.play(test_animation)
	pass

func _on_action_timer_timeout() -> void:
	if (is_setup):
		var num = randf_range(0, 1)
		if(num > 0.85): 
			state_dig()
		else:
			state_attack()

func state_dig() -> void:
	bird_animation.play("dig")
	
func state_attack() -> void:
	bird_animation.play("atk")
	await get_tree().create_timer(0.3).timeout
	var bullet_node = bullet_scene.instantiate()
	bullet_node.position = position + Vector2(6,0)
	get_tree().current_scene.add_child(bullet_node)

func state_idel() -> void:
	bird_animation.play("idel")

func state_die() -> void:
	pass

func _on_bird_animation_finished() -> void:
	state_idel()

# Drag Control
func handle_drag(delta: float) -> void:
	if is_dragable:
		if Input.is_action_just_pressed("click"):
			initialPos = global_position
			offset = get_global_mouse_position() - global_position
			Global.is_dragging = true
		if Input.is_action_pressed("click"):
			global_position = get_global_mouse_position() - offset
		elif Input.is_action_just_released("click"):
			Global.is_dragging = false
			var tween = get_tree().create_tween()
			if is_inside_dropable and bodyRef.check_placeable():
				tween.tween_property(self, "position", bodyRef.position, 0.2).set_ease(Tween.EASE_OUT)
				bodyRef.set_placeable(false)
			else:
				tween.tween_property(self, "global_position", initialPos, 0.2).set_ease(Tween.EASE_OUT)
				
func _on_mouse_entered() -> void:
	if not Global.is_dragging and not is_setup:
		is_dragable = true
		scale = Vector2(1.15, 1.15)

func _on_mouse_exited() -> void:
	if not Global.is_dragging:
		is_dragable = false
		scale = Vector2(1, 1)

func _on_drop_area_body_entered(platform: Node2D) -> void:
	if platform.is_in_group("dropable_platform"):
		print("on_body_entered")
		is_inside_dropable = true
		is_setup = true
		platform.is_hover = true
		bodyRef = platform

func _on_drop_area_body_exited(platform: Node2D) -> void:
	if platform.is_in_group("dropable_platform"):
		is_inside_dropable = false
		is_setup = false
		platform.is_hover = false
		
