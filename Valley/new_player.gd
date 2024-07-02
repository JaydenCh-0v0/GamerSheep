extends CharacterBody2D

const MAX_SPEED = 100.0
enum DIR { FRONT, L_SIDE, R_SIDE, BACK }
enum ACT { IDLE, MOVE, DEAD }

var object_group : String = 'player'

var movement_input: Vector2 = Vector2.ZERO
var friction = 600
var accel = 1500

var mouse_xy : Vector2 = Vector2.ZERO
var keybd_xy : Vector2 = Vector2.ZERO

var face_dir : DIR = DIR.FRONT
var move_dir : DIR = DIR.FRONT
var char_act : ACT = ACT.IDLE

var is_bow_equiped : bool = true
var is_bow_cooldowning : bool = false
var arrow = preload("res://scene/arrow.tscn")

# function
func _physics_process(delta):
	handle_char_act(delta)

func calculate_dir(dir : DIR, norm_xy : Vector2, limit : float = .75):
	if abs(norm_xy.x) > limit: #is in limit
		if norm_xy.x > 0:
			dir = DIR.R_SIDE
		else:
			dir = DIR.L_SIDE
	if abs(norm_xy.y) > limit : # is in limit
		if norm_xy.y > 0:
			dir = DIR.FRONT
		else:
			dir = DIR.BACK
	return dir



func check_backwalk():
	return face_dir==DIR.L_SIDE && move_dir==DIR.R_SIDE \
		or face_dir==DIR.R_SIDE && move_dir==DIR.L_SIDE ;



func is_inside_range(val : float, min_val : float, max_val : float) -> bool:
	return val >= (min_val - 0.000001) and val <= (max_val + 0.000001)



func handle_char_act(delta):
	get_action_input()
	update_dir()
	
	handle_movement_animation()
	handle_movement_action(delta)
	handle_bow_animation()
	handle_bow_action(delta)



# --- --- --- the following area is PLAYER BASE FUNCTIONs --- --- --- #



func get_action_input():
	movement_input.x = int(Input.is_action_pressed("ui_right")) - int(Input.is_action_pressed("ui_left"))
	movement_input.y = int(Input.is_action_pressed("ui_down")) - int(Input.is_action_pressed("ui_up"))
	keybd_xy = movement_input.normalized()
	mouse_xy = (get_global_mouse_position() - global_position).normalized()



func update_dir():
	face_dir = calculate_dir(face_dir, mouse_xy)
	move_dir = calculate_dir(move_dir, keybd_xy)



# --- --- --- the following area is PLAYER ACTION FUNCTIONs --- --- --- #



func  handle_bow_animation():
	pass



func handle_bow_action(delta):
	if Input.is_action_just_pressed("click") \
		 and is_bow_equiped  \
		 and not is_bow_cooldowning:
		is_bow_cooldowning = true
		$Marker2D.look_at(get_global_mouse_position())
		var arrow_instance = arrow.instantiate()
		arrow_instance.rotation = $Marker2D.rotation
		arrow_instance.global_position = $Marker2D.global_position
		add_child(arrow_instance)
		await get_tree().create_timer(0.4).timeout
		is_bow_cooldowning = false
	pass



func handle_movement_action(delta):
	var speed = MAX_SPEED
	if check_backwalk():
		speed *= 0.75
	if movement_input.is_zero_approx():
		if velocity.length() > (friction * delta):
			velocity -= velocity.normalized() * (friction * delta)
		else:
			velocity = Vector2.ZERO
			char_act = ACT.IDLE
	else:
		velocity += (movement_input * accel * delta)
		velocity = velocity.limit_length(speed) 
		char_act = ACT.MOVE
	move_and_slide()

func handle_movement_animation():
	var ani: AnimatedSprite2D = $AnimatedSprite2D
	ani.set_flip_h(face_dir == DIR.L_SIDE)
	if check_backwalk():
		ani.speed_scale = -1
	else:
		ani.speed_scale = 1
	match (char_act):
		ACT.IDLE:
			match (face_dir):
				DIR.FRONT:	ani.play("front_idle")
				DIR.BACK:	ani.play("back_idle")
				_:			ani.play("side_idle")
		ACT.MOVE:
			match (face_dir):
				DIR.FRONT:	ani.play("front_walk")
				DIR.BACK:	ani.play("back_walk")
				_:			ani.play("side_walk")
		ACT.DEAD:
				ani.play("death")
