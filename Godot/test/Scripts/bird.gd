extends Area2D
class_name BirdTemplate

@export var NAME: String
@export var HP: int = 100

@export var bird_animation: AnimatedSprite2D
@export var bullet_scene: PackedScene
@export var action_timer: Timer
@export var is_setup: bool


enum BIRD_STATE {
	FlyIn, 	# when click the spawn button
	Idel, 	# action idel
	Dig, 	# action dig
	Atk, 	# action atk
}

# Obj var
var bird_state = BIRD_STATE.Idel
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

func _physics_process(delta: float) -> void:
	handle_drag(delta)

func flyto(target_position: Vector2, second: float) -> void:
	state_fly()
	var tween = create_tween()
	tween.tween_property(self, "position", target_position, second)
	await tween.finished
	state_idel()

func act() -> void:
	state_attack()

func state_dig() -> void:
	bird_state = BIRD_STATE.Dig
	bird_animation.play("dig")
	
func state_attack() -> void:
	bird_state = BIRD_STATE.Atk
	bird_animation.play("atk")
	await get_tree().create_timer(0.3).timeout
	var bullet_node = bullet_scene.instantiate()
	bullet_node.position = position + Vector2(6,0)
	get_tree().current_scene.add_child(bullet_node)

func state_fly() -> void:
	bird_state = BIRD_STATE.FlyIn
	bird_animation.play("side_fly")

func state_idel() -> void:
	bird_state = BIRD_STATE.Idel
	bird_animation.play("idel")

func state_die() -> void:
	pass

func _on_action_timer_timeout() -> void:
	if (is_setup): act()

func _on_bird_animation_finished() -> void:
	state_idel()

# Drag Control
func handle_drag(delta: float) -> void:
	if is_dragable and bird_state != BIRD_STATE.FlyIn:
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
				is_dragable = false
				scale = Vector2(1, 1)
			else:
				state_fly()
				tween.tween_property(self, "global_position", initialPos, 0.5+randf_range(-0.1, 0.1)).set_ease(Tween.EASE_OUT)
				await tween.finished
				state_idel()
	
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
		#print("on_body_entered")
		is_inside_dropable = true
		is_setup = true
		platform.obj_hover += 1
		bodyRef = platform

func _on_drop_area_body_exited(platform: Node2D) -> void:
	if platform.is_in_group("dropable_platform"):
		is_inside_dropable = false
		is_setup = false
		platform.obj_hover -= 1
		
